import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AssetCategory } from './asset-category.entity';

@Entity('fixed_assets')
export class FixedAsset {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  assetTag!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column()
  categoryId!: number;

  @ManyToOne(() => AssetCategory)
  category!: AssetCategory;

  @Column({ type: 'timestamp' })
  acquisitionDate!: Date;

  @Column('decimal', { precision: 12, scale: 2 })
  originalCost!: number;

  @Column('int')
  usefulLife!: number;

  @Column()
  depreciationMethod!: string;

  @Column('decimal', { precision: 12, scale: 2 })
  salvageValue!: number;

  @Column('decimal', { precision: 12, scale: 2 })
  currentValue!: number;

  @Column('decimal', { precision: 12, scale: 2 })
  accumulatedDepreciation!: number;

  @Column({ default: 'active' })
  status!: string;

  @Column({ nullable: true })
  location!: string;

  @Column('int', { nullable: true })
  custodian!: number;

  @Column({ nullable: true })
  serialNumber!: string;

  @Column({ type: 'timestamp', nullable: true })
  lastDepreciationDate!: Date;

  @Column({ type: 'timestamp', nullable: true })
  disposalDate!: Date;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  disposalProceeds!: number;

  @Column({ nullable: true })
  disposalReason!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @Column('int', { nullable: true })
  createdBy!: number;
}