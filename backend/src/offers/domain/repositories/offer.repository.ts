import { Offer } from '../entities/offer'

export abstract class OfferRepository {
  abstract findById(id: number): Promise<Offer | null>
  abstract findAll(type?: string, lat?: number, lng?: number): Promise<Offer[]>
  abstract save(offer: Offer): Promise<Offer>
}
