import { UpdateOfferDto } from '../../dtos/update-offer.dto';

export class UpdateOfferCommand {
  constructor(
    public readonly id: number,
    public readonly updateOfferDto: UpdateOfferDto,
  ) {}
}
