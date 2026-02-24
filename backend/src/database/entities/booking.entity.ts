import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm'
import { Offer } from './offer.entity'

@Entity('bookings')
@Index(['offer', 'dateFrom', 'dateTo'], { unique: true })
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'date' })
  dateFrom: Date

  @Column({ type: 'date' })
  dateTo: Date

  @ManyToOne(() => Offer, { onDelete: 'CASCADE' })
  offer: Offer

  @Column()
  offerId: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
