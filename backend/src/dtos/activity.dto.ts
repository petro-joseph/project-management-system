import { IsString, IsUUID, IsOptional, IsDateString } from 'class-validator';

export class CreateActivityDto {
  @IsUUID()
  userId!: string;

  @IsString()
  userName!: string;

  @IsString()
  action!: string;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsString()
  entityName?: string;

  @IsOptional()
  @IsDateString()
  timestamp?: string;

  @IsOptional()
  @IsString()
  details?: string;
}