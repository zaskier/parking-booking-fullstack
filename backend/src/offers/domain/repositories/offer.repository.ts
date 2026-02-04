import { Offer } from '../entities/offer'

export abstract class OfferRepository {
  abstract findById(id: number): Promise<Offer | null>
  abstract findAll(type?: string, email?: string): Promise<Offer[]>;
  abstract save(offer: Offer): Promise<Offer>
}
