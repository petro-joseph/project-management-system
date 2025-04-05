import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: string;

  @Column()
  userName!: string;

  @Column()
  action!: string;

  @Column()
  entityType!: string;

  @Column()
  entityId!: string;

  @Column()
  entityName!: string;

  @CreateDateColumn()
  timestamp!: Date;

  @Column({ type: 'text', nullable: true })
  details?: string;
}