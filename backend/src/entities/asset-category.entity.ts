import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('asset_categories')
export class AssetCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column('int')
  defaultUsefulLifeMin!: number;

  @Column('int')
  defaultUsefulLifeMax!: number;

  @Column()
  defaultDepreciationMethod!: string;

  @Column('int')
  defaultSalvageValuePercent!: number;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @Column('int', { nullable: true })
  createdBy!: number;
}