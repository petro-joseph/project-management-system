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

  @Column({ nullable: true })
  location!: string;

  @Column({ nullable: true })
  projectId!: number;

  @ManyToOne(() => Project, { nullable: true })
  project!: Project;

  @Column({ type: 'timestamp', nullable: true })
  purchaseDate!: Date;

  @Column({ nullable: true })
  supplier!: string;

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
}