// src/dtos/task.dto.ts
import { IsString, IsEnum, IsUUID, MinLength } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsUUID()
  assigneeId: string;
}

export class UpdateTaskDto {
  @IsString()
  @MinLength(3)
  name?: string;

  @IsString()
  @MinLength(10)
  description?: string;

  @IsUUID()
  assigneeId?: string;

  @IsEnum(TaskStatus)
  status?: TaskStatus;
}