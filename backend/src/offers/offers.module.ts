import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from '../database/entities/offer.entity';
import { CreateOfferHandler } from './application/commands/handlers/create-offer.handler';
import { UpdateOfferHandler } from './application/commands/handlers/update-offer.handler';
import { FindAllOffersHandler } from './application/queries/handlers/find-all-offers.handler';
import { FindOneOfferHandler } from './application/queries/handlers/find-one-offer.handler';
import { OffersController } from './presentation/offers.controller';
import { UploadsModule } from '../uploads/uploads.module';
import { OfferRepository } from './domain/repositories/offer.repository';
import { OfferTypeOrmRepository } from './infrastructure/repositories/offer.typeorm.repository';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Offer]), UploadsModule],
  controllers: [OffersController],
  providers: [
    FindAllOffersHandler,
    CreateOfferHandler,
    FindOneOfferHandler,
    UpdateOfferHandler,
    {
      provide: OfferRepository,
      useClass: OfferTypeOrmRepository,
    },
  ],
})
export class OffersModule {}
