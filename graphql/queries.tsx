import { gql } from "@apollo/client"

export const GET_QUICK_CMA_REPORT = gql`
  query GetQuickCMAReport($reportId: ID!) {
    quickCmaReport(id: $reportId) {
      id
      subjectProperty {
        address
        city
        state
        zipCode
      }
      averagePrice
      lowPrice
      highPrice
      medianPrice
      averagePricePerSquareFoot
      bedrooms
      bathrooms
      squareFootage
      yearBuilt
      propertyType
      createdAt
      updatedAt
    }
    userBranding {
      name
      title
      company
      phone
      email
      photo
      brand
    }
  }
`

export const GET_USER_BRANDING = gql`
  query GetUserBranding($userId: ID!) {
    userBranding(userId: $userId) {
      name
      title
      company
      phone
      email
      photo
      brand
      customLogo
      colors {
        primary
        secondary
      }
    }
  }
`
