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
    apartment: string
    streetnumber: string
    street: string
    suburb: string
    postcode: string
    state: string
    country: string
    lastjob: string
    levels: ILevel[]
  }
  interface IJob {
    id: string
    title: string
    property: IProperty
    documents: string[]
    photos: string[]
    notes: string[]
    date: Date
  }
}