import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from '../entities/offer.entity';
import { SeedService } from './seed.service';
import { OffersModule } from '../../offers/offers.module';
import { Booking } from '../entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Booking]), OffersModule],
  providers: [SeedService],
  exports: [SeedService]
})
export class SeedModule {}
