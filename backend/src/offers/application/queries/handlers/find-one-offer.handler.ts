import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { FindOneOfferQuery } from '../impl/find-one-offer.query'
import { OfferRepository } from '../../../domain/repositories/offer.repository'
import { Offer } from '../../../domain/entities/offer'
import { NotFoundException } from '@nestjs/common'

@QueryHandler(FindOneOfferQuery)
export class FindOneOfferHandler implements IQueryHandler<FindOneOfferQuery> {
  constructor(
    @Inject(OfferRepository)
    private readonly offerRepository: OfferRepository,
  ) {}

  async execute(query: FindOneOfferQuery): Promise<Offer> {
    const { id } = query
    const offer = await this.offerRepository.findById(id)

    if (!offer) {
      throw new NotFoundException(`Offer with ID ${id} not found`)
    }

    return offer
  }
}
