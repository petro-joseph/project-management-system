// src/dtos/project.dto.ts
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDateString()
  start_date!: Date;

  @IsDateString()
  end_date!: Date;
}

export class UpdateProjectDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  description?: string;

  @IsDateString()
  start_date?: Date;

  @IsDateString()
  end_date?: Date;
}