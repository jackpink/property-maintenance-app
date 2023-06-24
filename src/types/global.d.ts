export {}

declare global {
  interface IRoom {
    label: string
    order: number
  }
  interface ILevel {
    label: string
    order: number
    rooms: IRoom[]
  }
  interface IProperty {
    apartment: string | null
    streetNumber: string
    street: string
    suburb: string
    postcode: string
    state: string
    country: string
  }
  interface IJob {
    id: string
    title: string
    photos: IPhoto[]
    date: Date
    Property: IProperty
  }
  interface IDocument {
    name: string
  }
  interface IPhoto {
    filename: string
    url: string
  }
}