import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Offer } from '../../../database/entities/offer.entity'
import { FindOneOfferQuery } from '../impl/find-one-offer.query'
import { NotFoundException } from '@nestjs/common'

@QueryHandler(FindOneOfferQuery)
export class FindOneOfferHandler implements IQueryHandler<FindOneOfferQuery> {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  async execute(query: FindOneOfferQuery): Promise<Offer> {
    const { id } = query
    const offer = await this.offerRepository.findOneBy({ id })

    if (!offer) {
      throw new NotFoundException(`Offer with ID ${id} not found`)
    }

    return offer
  }
}
