import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Offer as OfferEntity } from '../../../database/entities/offer.entity'
import { Offer } from '../../domain/entities/offer'
import { OfferRepository } from '../../domain/repositories/offer.repository'
import { OfferMapper } from '../mappers/offer.mapper'

@Injectable()
export class OfferTypeOrmRepository extends OfferRepository {
  constructor(
    @InjectRepository(OfferEntity)
    private readonly offerEntityRepository: Repository<OfferEntity>,
  ) {
    super()
  }

  async findById(id: number): Promise<Offer | null> {
    const offerEntity = await this.offerEntityRepository.findOneBy({ id })
    return offerEntity ? OfferMapper.toDomain(offerEntity) : null
  }

  async findAll(type?: string, email?: string): Promise<Offer[]> {
    const queryBuilder = this.offerEntityRepository.createQueryBuilder('offer');

    if (type) {
      queryBuilder.andWhere('LOWER(offer.type::text) = LOWER(:type)', { type });
    }
    if (email) {
      queryBuilder.andWhere('LOWER(offer.email) = LOWER(:email)', { email });
    }
    
    const offerEntities = await queryBuilder.getMany();
    return offerEntities.map(OfferMapper.toDomain);
  }

  async save(offer: Offer): Promise<Offer> {
    const offerEntity = OfferMapper.toPersistence(offer)
    const savedEntity = await this.offerEntityRepository.save(offerEntity)
    return OfferMapper.toDomain(savedEntity)
  }
}
