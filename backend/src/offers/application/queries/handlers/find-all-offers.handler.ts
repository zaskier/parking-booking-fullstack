import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { FindAllOffersQuery } from '../impl/find-all-offers.query';
import { OfferRepository } from '../../../domain/repositories/offer.repository';
import { Offer } from '../../../domain/entities/offer';

@QueryHandler(FindAllOffersQuery)
export class FindAllOffersHandler implements IQueryHandler<FindAllOffersQuery> {
  constructor(
    @Inject(OfferRepository)
    private readonly offerRepository: OfferRepository,
  ) {}

  async execute(query: FindAllOffersQuery): Promise<Offer[]> {
    const { type, email } = query;
    return this.offerRepository.findAll(type, email);
  }
}
