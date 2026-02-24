import { IsDateString, IsNotEmpty } from 'class-validator';

export class BookOfferDto {
  @IsDateString()
  @IsNotEmpty()
  dateFrom: string;

  @IsDateString()
  @IsNotEmpty()
  dateTo: string;
}
