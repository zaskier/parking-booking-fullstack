import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BookOfferCommand } from '../book-offer.command';
import { OfferRepository } from '../../../domain/repositories/offer.repository';
import { BookingRepository } from '../../../domain/repositories/booking.repository';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Booking } from '../../../domain/entities/booking';

@CommandHandler(BookOfferCommand)
export class BookOfferHandler implements ICommandHandler<BookOfferCommand> {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly bookingRepository: BookingRepository
  ) {}

  async execute(command: BookOfferCommand): Promise<Booking> {
    const { offerId, dateFrom, dateTo } = command;

    // 1. Check if the offer exists
    const offer = await this.offerRepository.findById(offerId); // Changed findOneById to findById
    if (!offer) {
      throw new NotFoundException(`Offer with ID ${offerId} not found.`);
    }

    // 2. Check for overlapping bookings
    const existingBookings = await this.bookingRepository.findByOfferIdAndDateRange(
      offerId,
      dateFrom,
      dateTo
    );

    if (existingBookings.length > 0) {
      throw new ConflictException(
        `Offer with ID ${offerId} is already booked for a part or whole of the period from ${dateFrom.toISOString().split('T')[0]} to ${dateTo.toISOString().split('T')[0]}.`
      );
    }

    // 3. Create a new booking
    const newBooking = new Booking();
    newBooking.offerId = offerId;
    newBooking.dateFrom = dateFrom;
    newBooking.dateTo = dateTo;

    return this.bookingRepository.create(newBooking);
  }
}
