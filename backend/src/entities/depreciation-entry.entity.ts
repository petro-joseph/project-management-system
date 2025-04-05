import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { FixedAsset } from './fixed-asset.entity';

@Entity('depreciation_entries')
export class DepreciationEntry {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  assetId!: number;

  @ManyToOne(() => FixedAsset)
  asset!: FixedAsset;

  @Column()
  period!: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount!: number;

  @Column('decimal', { precision: 12, scale: 2 })
  bookValueBefore!: number;

  @Column('decimal', { precision: 12, scale: 2 })
  bookValueAfter!: number;

  @Column({ type: 'timestamp' })
  postingDate!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column('int', { nullable: true })
  createdBy!: number;
}