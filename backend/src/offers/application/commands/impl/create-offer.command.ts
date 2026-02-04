import { CreateOfferDto } from '../../../application/dtos/create-offer.dto';

export class CreateOfferCommand {
  constructor(public readonly createOfferDto: CreateOfferDto) {}
}
