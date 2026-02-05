import { OfferType } from "src/offers/domain/enums/type.enum";

export class FindAllOffersQuery {
  constructor(
    public readonly type?: OfferType,
    public readonly email?: string,
    public readonly city?: string,
  ) {}
}
