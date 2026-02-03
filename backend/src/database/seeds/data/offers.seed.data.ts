import { OfferType } from '../../../offers/enums/type.enum'

export const OFFERS_SEED_DATA = [
  {
    title: 'Main Street Car Park - Kraków',
    content:
      'Secure and affordable parking available 24/7. Close to public transport.',
    image:
      'https://parking-booking-offer-images.s3.eu-north-1.amazonaws.com/7a53857f-fd2d-4cf6-994b-7b0fe87025fd-e90c7e7d5b086c34d1e0236cfd110df7.png',
    price: 23,
    city: 'Kraków',
    address: 'Szewska 20, 31-001 Kraków',
    latitude: 50.083138,
    longitude: 19.937989,
    type: OfferType.Guarded,
    email: 'user1@example.com',
  },
  {
    title: 'Central Station Parking - Kraków',
    content:
      'Spacious multi-level parking garage in the heart of the city. Electric vehicle charging available.',
    image:
      'https://parking-booking-offer-images.s3.eu-north-1.amazonaws.com/c3c3f49f-42d4-4322-b9d8-b1460723ed2d-8d5f462def892dbc73b6119501a3fa17.png',
    price: 18,
    city: 'Kraków',
    address: 'Pawia 5, 31-154 Kraków',
    latitude: 50.0682,
    longitude: 19.9472,
    type: OfferType.Monitored,
    email: 'user2@example.com',
  },
  {
    title: 'Zabłocie Secure Garage - Kraków',
    content:
      'Long-term and short-term parking solutions. Guarded and monitored for your peace of mind.',
    image:
      'https://parking-booking-offer-images.s3.eu-north-1.amazonaws.com/7536b921-a51e-4734-95e6-a23c7566e3e6-Leonardo_Diffusion_XL_parking_stock_photo_2.jpg',
    price: 21,
    city: 'Łódź',
    address: 'Bolesława Limanowskiego 2, 31 550',
    latitude: 50.044873,
    longitude: 19.950151,
    type: OfferType.Guarded,
    email: 'user3@example.com',
  },
  {
    title: 'Market Square Lot - Kraków',
    content:
      'An economy choice for daily commuters. Easy access and automated payment systems.',
    image:
      'https://parking-booking-offer-images.s3.eu-north-1.amazonaws.com/4d48aac5-b238-4777-954c-7fceb77b4af6-403411754_1005494207417089_5248490091290869790_n.jpg',
    price: 28,
    city: 'Kraków',
    address: 'Rynek Główny 1, 31-042 Kraków',
    latitude: 50.0617,
    longitude: 19.9366,
    type: OfferType.Guarded,
    email: 'user4@example.com',
  },
  {
    title: 'Riverbank Parking - Poznań',
    content:
      'Perfect for tourists and shoppers. Located near major attractions and retail centers.',
    image:
      'https://parking-booking-offer-images.s3.eu-north-1.amazonaws.com/cb3d926a-01db-4937-9e1b-7a23ecca1d7c-403411754_1005494207417089_5248490091290869790_n.jpg',
    price: 12,
    city: 'Poznań',
    address: 'Stary Rynek 1, 61-772 Poznań',
    latitude: 52.408333,
    longitude: 16.933611,
    type: OfferType.Monitored,
    email: 'user5@example.com',
  },
  {
    title: 'Galleria Mall Parkade - Kraków',
    content:
      'Secure and affordable parking available 24/7. Close to public transport.',
    image:
      'https://parking-booking-offer-images.s3.eu-north-1.amazonaws.com/cabef240-5da6-47d2-8407-240c87cbca88-403411754_1005494207417089_5248490091290869790_n.jpg',
    price: 15,
    city: 'Kraków',
    address: 'Wielopole 2, 31-072 Kraków',
    latitude: 50.0596,
    longitude: 19.9463,
    type: OfferType.Any,
    email: 'wojciech.iskierka@protonmail.com',
  },
  {
    title: 'Airport Economy Lot - Kraków',
    content:
      'Spacious multi-level parking garage in the heart of the city. Electric vehicle charging available.',
    image:
      'https://parking-booking-offer-images.s3.eu-north-1.amazonaws.com/3acc0107-4f31-49f2-b26c-5c458c18036f-403411754_1005494207417089_5248490091290869790_n.jpg',
    price: 10,
    city: 'Kraków',
    address: 'Medweckiego 1, 32-083 Balice',
    latitude: 50.0768,
    longitude: 19.8048,
    type: OfferType.Guarded,
    email: 'user7@example.com',
  },
  {
    title: 'Uptown Parking Garage - Kraków',
    content:
      'Long-term and short-term parking solutions. Guarded and monitored for your peace of mind.',
    image:
      'https://parking-booking-offer-images.s3.eu-north-1.amazonaws.com/7a53857f-fd2d-4cf6-994b-7b0fe87025fd-e90c7e7d5b086c34d1e0236cfd110df7.png',
    price: 14,
    city: 'Kraków',
    address: 'Długa 88, 31-147 Kraków',
    latitude: 50.0694,
    longitude: 19.9329,
    type: OfferType.Monitored,
    email: 'zaskier@gmail.com',
  },
]
