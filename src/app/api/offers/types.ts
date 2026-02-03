export interface Offer {
  id: number
  title: string
  content: string
  image: string
  price: number
  city: string
  address: string
  latitude: number
  longitude: number
  type?: 'Guarded' | 'Monitored'
}
