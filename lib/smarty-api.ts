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

export async function validateAndCorrectAddress(address: string): Promise<{correctedAddress: string, cities: string[]} | null> {
  try {
    console.log("=== Smarty Address Verification: Validating and correcting address ===")
    console.log("Original address:", address)

    if (!process.env.SMARTY_AUTH_ID || !process.env.SMARTY_AUTH_TOKEN) {
      console.log("❌ Smarty API credentials not configured")
      return null
    }

    // Use Address Verification API to validate the address
    const encodedAddress = encodeURIComponent(address)
    const apiUrl = `https://us-street.api.smarty.com/street-address?auth-id=${process.env.SMARTY_AUTH_ID}&auth-token=${process.env.SMARTY_AUTH_TOKEN}&street=${encodedAddress}`

    console.log("Smarty API URL:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    })

    console.log("Smarty API Response Status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("Smarty API Error Response:", errorText)
      return null
    }

    const data: any[] = await response.json()
    console.log("Smarty API Response:", JSON.stringify(data, null, 2))

    if (!data || data.length === 0) {
      console.log("No data returned from Smarty API")
      return null
    }

    const result = data[0]
    
    if (result.status) {
      console.log("Smarty API Error Status:", result.status, result.reason)
      return null
    }

    // Get the corrected address components
    const components = result.components
    if (!components) {
      console.log("No components found in response")
      return null
    }

    // Build corrected address
    const correctedAddress = `${components.primary_number} ${components.street_name} ${components.street_suffix} ${components.city_name} ${components.state_abbreviation} ${components.zipcode}`
    console.log("Corrected address:", correctedAddress)

    // Get all cities for this zip code
    const zipCode = components.zipcode
    const cities = await getCitiesForZipCode(zipCode)
    
    return {
      correctedAddress,
      cities
    }

  } catch (error) {
    console.error("Smarty Address Verification Error:", error)
    return null
  }
}

export async function getCitiesForZipCode(zipCode: string): Promise<string[]> {
  try {
    console.log("=== Smarty ZIP Code API: Getting cities for zip code ===")
    console.log("Zip Code:", zipCode)

    if (!process.env.SMARTY_AUTH_ID || !process.env.SMARTY_AUTH_TOKEN) {
      throw new Error("Smarty API credentials not configured")
    }

    // Use ZIP Code API to get all cities for this zip code
    const apiUrl = `https://us-zipcode.api.smarty.com/lookup?auth-id=${process.env.SMARTY_AUTH_ID}&auth-token=${process.env.SMARTY_AUTH_TOKEN}&zipcode=${zipCode}`

    console.log("Smarty API URL:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    })

    console.log("Smarty API Response Status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("Smarty API Error Response:", errorText)
      throw new Error(`Smarty API failed: ${response.status} - ${response.statusText}`)
    }

    const data: SmartyResponse[] = await response.json()
    console.log("Smarty API Response:", JSON.stringify(data, null, 2))

    if (!data || data.length === 0) {
      console.log("No data returned from Smarty API")
      return []
    }

    const result = data[0]
    
    if (result.status) {
      console.log("Smarty API Error Status:", result.status, result.reason)
      return []
    }

    if (!result.city_states || result.city_states.length === 0) {
      console.log("No city_states found in response")
      return []
    }

    // Extract all city names from the response
    const cities = result.city_states.map(cityState => cityState.city)
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
  // Look for 5-digit zip code pattern at the END of the address
  const zipMatch = address.match(/\b(\d{5})\b\s*$/)
  return zipMatch ? zipMatch[1] : null
}

export function buildAddressWithCity(street: string, city: string, state: string, zip: string): string {
  return `${street} ${city} ${state} ${zip}`.trim()
}
