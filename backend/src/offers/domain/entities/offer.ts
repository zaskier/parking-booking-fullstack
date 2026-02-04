import { OfferType } from '../enums/type.enum'

export class Offer {
  id: number
  title: string
  content: string
  image: string
  price: number
  city: string
  address: string
  latitude: number
  longitude: number
  type: OfferType
  email: string

  constructor(
    id: number,
    title: string,
    content: string,
    image: string,
    price: number,
    city: string,
    address: string,
    latitude: number,
    longitude: number,
    type: OfferType,
    email: string,
  ) {
    this.id = id
    this.title = title
    this.content = content
    this.image = image
    this.price = price
    this.city = city
    this.address = address
    this.latitude = latitude
    this.longitude = longitude
    this.type = type
    this.email = email
  }
}
