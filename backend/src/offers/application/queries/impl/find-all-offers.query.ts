import { OfferType } from 'src/offers/domain/enums/type.enum'

export class FindAllOffersQuery {
  constructor(
    public readonly type?: OfferType,
    public readonly lat?: number,
    public readonly lng?: number,
  ) {}
}
