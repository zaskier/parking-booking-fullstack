import { Booking } from '../entities/booking';

export abstract class BookingRepository {
  abstract create(booking: Booking): Promise<Booking>;
  abstract findByOfferIdAndDateRange(
    offerId: number,
    dateFrom: Date,
    dateTo: Date
  ): Promise<Booking[]>;
}
