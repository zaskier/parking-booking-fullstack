export class BookOfferCommand {
  constructor(
    public readonly offerId: number,
    public readonly dateFrom: Date,
    public readonly dateTo: Date,
  ) {}
}
