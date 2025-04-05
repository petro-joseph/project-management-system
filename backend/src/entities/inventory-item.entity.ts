import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column('int')
  quantity!: number;

  @Column()
  unitOfMeasure!: string;

  @ManyToOne(() => require('./location.entity').Location, { nullable: true })
  location?: import('./location.entity').Location | null;

  @Column({ nullable: true })
  projectId!: number;

  @ManyToOne(() => Project, { nullable: true })
  project!: Project;

  @Column({ type: 'timestamp', nullable: true })
  purchaseDate!: Date;

  @ManyToOne(() => require('./supplier.entity').Supplier, { nullable: true })
  supplier?: import('./supplier.entity').Supplier | null;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  costPerUnit!: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  totalValue!: number;

  @Column('int', { default: 0 })
  lowStockThreshold!: number;

  @Column({ nullable: true })
  category!: string;

  @Column({ default: 'available' })
  status!: string;

  @Column({ nullable: true })
  sku!: string;

  @Column({ nullable: true })
  barcode!: string;

  @Column({ nullable: true })
  serialNumber!: string;

  @Column({ nullable: true })
  imageUrl!: string;
}