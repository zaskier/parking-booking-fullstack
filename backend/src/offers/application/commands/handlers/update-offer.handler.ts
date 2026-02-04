import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { UpdateOfferCommand } from '../impl/update-offer.command';
import { OfferRepository } from '../../../domain/repositories/offer.repository';

@CommandHandler(UpdateOfferCommand)
export class UpdateOfferHandler implements ICommandHandler<UpdateOfferCommand> {
  constructor(
    @Inject(OfferRepository)
    private readonly offerRepository: OfferRepository
  ) {}

  async execute(command: UpdateOfferCommand): Promise<any> {
    const { id, updateOfferDto } = command;
    const offer = await this.offerRepository.findById(id);

    if (!offer) {
      throw new NotFoundException(`Offer with ID ${id} not found`);
    }

    // Apply updates
    Object.assign(offer, updateOfferDto);

    return this.offerRepository.save(offer);
  }
}
