import { Offer as OfferEntity } from '../../../database/entities/offer.entity';
import { Offer } from '../../domain/entities/offer';

export class OfferMapper {
  static toDomain(offerEntity: OfferEntity): Offer {
    return new Offer(
      offerEntity.id,
      offerEntity.title,
      offerEntity.content,
      offerEntity.image,
      offerEntity.price,
      offerEntity.city,
      offerEntity.address,
      offerEntity.latitude,
      offerEntity.longitude,
      offerEntity.type,
      offerEntity.email,
    );
  }

  static toPersistence(offer: Offer): OfferEntity {
    const offerEntity = new OfferEntity();
    offerEntity.id = offer.id;
    offerEntity.title = offer.title;
    offerEntity.content = offer.content;
    offerEntity.image = offer.image;
    offerEntity.price = offer.price;
    offerEntity.city = offer.city;
    offerEntity.address = offer.address;
    offerEntity.latitude = offer.latitude;
    offerEntity.longitude = offer.longitude;
    offerEntity.type = offer.type;
    offerEntity.email = offer.email;
    return offerEntity;
  }
}
