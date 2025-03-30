import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from './user.entity';
  import { Project } from './project.entity';
  
  export enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
  }
  
  @Entity('tasks')
  export class Task {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column()
    name!: string;
  
    @Column('text')
    description!: string;
  
    @Column({ name: 'project_id' })
    projectId!: string;
  
    @Column({ name: 'assignee_id' })
    assigneeId!: string;
  
    @Column({
      type: 'enum',
      enum: TaskStatus,
      default: TaskStatus.PENDING,
    })
    status!: TaskStatus;
  
    // Relationships
    @ManyToOne(() => Project, (project) => project.tasks)
    @JoinColumn({ name: 'project_id' })
    project!: Project;
  
    @ManyToOne(() => User, (user) => user.assignedTasks)
    @JoinColumn({ name: 'assignee_id' })
    assignee!: User;
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  }