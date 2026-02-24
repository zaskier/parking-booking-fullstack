import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking as TypeOrmBooking } from '../../../database/entities/booking.entity';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { Booking } from 'src/offers/domain/entities/booking';

@Injectable()
export class TypeOrmBookingRepository implements BookingRepository {
  constructor(
    @InjectRepository(TypeOrmBooking)
    private readonly bookingRepository: Repository<TypeOrmBooking>
  ) {}

  async create(booking: Booking): Promise<Booking> {
    const typeOrmBooking = this.bookingRepository.create({
      offerId: booking.offerId,
      dateFrom: booking.dateFrom,
      dateTo: booking.dateTo
      // ID will be generated, offer, createdAt, updatedAt handled by TypeORM
    });
    const savedBooking = await this.bookingRepository.save(typeOrmBooking);
    return this.toDomainBooking(savedBooking);
  }

  async findByOfferIdAndDateRange(
    offerId: number,
    dateFrom: Date,
    dateTo: Date
  ): Promise<Booking[]> {
    const typeOrmBookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.offerId = :offerId', { offerId })
      .andWhere('(:dateFrom <= booking.dateTo AND :dateTo >= booking.dateFrom)', {
        dateFrom,
        dateTo
      })
      .getMany();

    return typeOrmBookings.map(this.toDomainBooking);
  }

  private toDomainBooking(typeOrmBooking: TypeOrmBooking): Booking {
    const booking = new Booking();
    booking.id = typeOrmBooking.id;
    booking.offerId = typeOrmBooking.offerId;
    booking.dateFrom = typeOrmBooking.dateFrom;
    booking.dateTo = typeOrmBooking.dateTo;
    return booking;
  }
}
