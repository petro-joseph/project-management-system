import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { FixedAsset } from './fixed-asset.entity';

@Entity('asset_revaluations')
export class AssetRevaluation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  assetId!: number;

  @ManyToOne(() => FixedAsset)
  asset!: FixedAsset;

  @Column({ type: 'timestamp' })
  revaluationDate!: Date;

  @Column('decimal', { precision: 12, scale: 2 })
  previousValue!: number;

  @Column('decimal', { precision: 12, scale: 2 })
  newValue!: number;

  @Column({ nullable: true })
  reason!: string;

  @Column()
  type!: string; // e.g., 'revaluation' or 'impairment'

  @Column({ nullable: true })
  notes!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column('int', { nullable: true })
  createdBy!: number;
}