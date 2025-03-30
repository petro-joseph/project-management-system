// src/dtos/task.dto.ts
import { IsString, IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsUUID()
  assigneeId!: string;
}

export class UpdateTaskDto {
  @IsString()
  name?: string;

  @IsString()
  description?: string;

  @IsUUID()
  assigneeId?: string;

  @IsEnum(TaskStatus)
  status?: TaskStatus;
}