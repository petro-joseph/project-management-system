import { IsString, IsInt, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateInventoryItemDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  quantity!: number;

  @IsString()
  unitOfMeasure!: string;

  @IsOptional()
  @IsInt()
  locationId?: number;

  @IsOptional()
  @IsInt()
  projectId?: number;

  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @IsOptional()
  @IsInt()
  supplierId?: number;

  @IsOptional()
  @IsNumber()
  costPerUnit?: number;

  @IsOptional()
  @IsNumber()
  totalValue?: number;

  @IsOptional()
  @IsInt()
  lowStockThreshold?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateInventoryItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsString()
  unitOfMeasure?: string;

  @IsOptional()
  @IsInt()
  locationId?: number;

  @IsOptional()
  @IsInt()
  projectId?: number;

  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @IsOptional()
  @IsInt()
  supplierId?: number;

  @IsOptional()
  @IsNumber()
  costPerUnit?: number;

  @IsOptional()
  @IsNumber()
  totalValue?: number;

  @IsOptional()
  @IsInt()
  lowStockThreshold?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  status?: string;
}