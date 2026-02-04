import { OfferType } from 'src/offers/domain/enums/type.enum'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  content: string

  @Column()
  image: string

  @Column({ type: 'decimal' })
  price: number

  @Column()
  city: string

  @Column()
  address: string

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number

  @Column({
    type: 'enum',
    enum: OfferType,
    default: OfferType.Any,
  })
  type: OfferType

  @Column({ nullable: true })
  email: string
}
