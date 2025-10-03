interface SmartyCityState {
  city: string
  state_abbreviation: string
  state: string
  mailable_city: boolean
}

interface SmartyZipCode {
  zipcode: string
  zipcode_type: string
  default_city: string
  county_fips: string
  county_name: string
  state_abbreviation: string
  state: string
  latitude: number
  longitude: number
  precision: string
}

interface SmartyResponse {
  input_index: number
  city_states: SmartyCityState[]
  zipcodes: SmartyZipCode[]
  status?: string
  reason?: string
}

export async function getCitiesForZipCode(zipCode: string): Promise<string[]> {
  try {
    console.log("=== Smarty Address Verification API: Getting cities for zip code ===")
    console.log("Zip Code:", zipCode)

    if (!process.env.SMARTY_AUTH_ID || !process.env.SMARTY_AUTH_TOKEN) {
      throw new Error("Smarty API credentials not configured")
    }

    // Use Address Verification API with just zip code
    const apiUrl = `https://us-street.api.smarty.com/street-address?auth-id=${process.env.SMARTY_AUTH_ID}&auth-token=${process.env.SMARTY_AUTH_TOKEN}&zipcode=${zipCode}`

    console.log("Smarty API URL:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Host": "us-street.api.smarty.com"
      }
    })

    console.log("Smarty API Response Status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("Smarty API Error Response:", errorText)
      throw new Error(`Smarty API failed: ${response.status} - ${response.statusText}`)
    }

    const data: any[] = await response.json()
    console.log("Smarty API Response:", JSON.stringify(data, null, 2))

    if (!data || data.length === 0) {
      console.log("No data returned from Smarty API")
      return []
    }

    // Extract unique city names from the address verification results
    const cities = [...new Set(data.map(result => result.components?.city_name).filter(Boolean))]
    console.log("Cities found for zip code", zipCode, ":", cities)
    console.log("Number of cities:", cities.length)

    return cities

  } catch (error) {
    console.error("Smarty API Error:", error)
    return []
  }
}

export function extractZipCodeFromAddress(address: string): string | null {
  // Extract zip code from address using regex
  // Look for 5-digit zip code pattern
  const zipMatch = address.match(/\b(\d{5})\b/)
  return zipMatch ? zipMatch[1] : null
}

export function buildAddressWithCity(street: string, city: string, state: string, zip: string): string {
  return `${street} ${city} ${state} ${zip}`.trim()
}
