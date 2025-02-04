// src/dtos/project.dto.ts
import { IsString, IsDateString, IsUUID, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsDateString()
  start_date: Date;

  @IsDateString()
  end_date: Date;
}

export class UpdateProjectDto extends CreateProjectDto {}