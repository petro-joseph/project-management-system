import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { Project } from './project.entity';
  import { Task } from './task.entity';
  
  // Define user roles as an enum for type safety
  export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    USER = 'user',
  }
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column()
    name!: string;
  
    @Column({ unique: true })
    email!: string;
  
    @Column()
    password!: string;
  
    @Column({
      type: 'enum',
      enum: UserRole,
      default: UserRole.USER,
    })
    role!: UserRole;
  
    // Relationships
    @OneToMany(() => Project, (project) => project.manager)
    managedProjects!: Project[];
  
    @OneToMany(() => Task, (task) => task.assignee)
    assignedTasks!: Task[];
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;

    @Column({ nullable: true })
    status?: string;

    @Column({ type: 'timestamp', nullable: true })
    lastLogin?: Date;

    @Column({ nullable: true })
    phoneNumber?: string;

    @Column({ nullable: true })
    department?: string;

    @Column({ nullable: true })
    jobTitle?: string;

    @Column({ nullable: true })
    profilePictureUrl?: string;

    @Column({ type: 'simple-json', nullable: true })
    permissions?: string[];
  }