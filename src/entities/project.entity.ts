import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
  } from 'typeorm';
  import { User } from './user.entity';
  import { Task } from './task.entity';
  
  @Entity('projects')
  export class Project {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column()
    name!: string;
  
    @Column('text')
    description!: string;
  
    @Column({ name: 'manager_id' })
    managerId!: string;
  
    @Column()
    start_date!: Date;
  
    @Column()
    end_date!: Date;
  
    // Relationships
    @ManyToOne(() => User, (user) => user.managedProjects)
    @JoinColumn({ name: 'manager_id' })
    manager!: User;
  
    @OneToMany(() => Task, (task) => task.project)
    tasks!: Task[];
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  }