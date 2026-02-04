import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsUrl,
  IsOptional,
  IsLatitude,
  IsLongitude,
  IsEmail,
} from 'class-validator'
import { OfferType } from 'src/offers/domain/enums/type.enum'

export class CreateOfferDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  content: string

  @IsUrl()
  image: string

  @IsNumber()
  price: number

  @IsString()
  @IsNotEmpty()
  city: string

  @IsString()
  @IsNotEmpty()
  address: string

  @IsLatitude()
  @IsOptional()
  latitude: number

  @IsLongitude()
  @IsOptional()
  longitude: number

  @IsEmail()
  email: string

  @IsEnum(OfferType)
  type: OfferType
}
