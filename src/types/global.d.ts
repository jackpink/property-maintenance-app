export {}

declare global {
  interface IProperty {
    apartment: string
    streetnumber: string
    street: string
    suburb: string
    postcode: string
    state: string
    country: string
    lastjob: string
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