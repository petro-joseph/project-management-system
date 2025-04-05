import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { FixedAsset } from './fixed-asset.entity';

@Entity('disposal_entries')
export class DisposalEntry {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  assetId!: number;

  @ManyToOne(() => FixedAsset)
  asset!: FixedAsset;

  @Column({ type: 'timestamp' })
  disposalDate!: Date;

  @Column('decimal', { precision: 12, scale: 2 })
  disposalProceeds!: number;

  @Column('decimal', { precision: 12, scale: 2 })
  disposalCosts!: number;

  @Column('decimal', { precision: 12, scale: 2 })
  netBookValue!: number;

  @Column('decimal', { precision: 12, scale: 2 })
  gainLoss!: number;

  @Column({ nullable: true })
  reason!: string;

  @Column({ nullable: true })
  notes!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column('int', { nullable: true })
  createdBy!: number;
}