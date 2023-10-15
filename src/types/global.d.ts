export {}

declare global {
  interface ITradeInfo {
    name: string | null
    email: string | null
    phone: string | null
  }

  interface IAddress {
    apartment: string | null
    streetNumber: string
    street: string
    suburb: string
    postcode: string
    state: string
    country: string
  }
}