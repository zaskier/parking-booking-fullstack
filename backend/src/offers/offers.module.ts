import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from '../database/entities/offer.entity';
import { Booking as TypeOrmBooking } from '../database/entities/booking.entity';
import { CreateOfferHandler } from './application/commands/handlers/create-offer.handler';
import { UpdateOfferHandler } from './application/commands/handlers/update-offer.handler';
import { FindAllOffersHandler } from './application/queries/handlers/find-all-offers.handler';
import { FindOneOfferHandler } from './application/queries/handlers/find-one-offer.handler';
import { OffersController } from './presentation/offers.controller';
import { UploadsModule } from '../uploads/uploads.module';
import { OfferRepository } from './domain/repositories/offer.repository';
import { OfferTypeOrmRepository } from './infrastructure/repositories/offer.typeorm.repository';
import { TypeOrmBookingRepository } from './infrastructure/repositories/typeorm-booking.repository';
import { BookingRepository } from './domain/repositories/booking.repository';
import { BookOfferHandler } from './application/commands/handlers/book-offer.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Offer, TypeOrmBooking]), UploadsModule],
  controllers: [OffersController],
  providers: [
    FindAllOffersHandler,
    CreateOfferHandler,
    FindOneOfferHandler,
    UpdateOfferHandler,
    BookOfferHandler,
    {
      provide: OfferRepository,
      useClass: OfferTypeOrmRepository,
    },
    {
      provide: BookingRepository,
      useClass: TypeOrmBookingRepository,
    },
  ],
})
export class OffersModule {}
