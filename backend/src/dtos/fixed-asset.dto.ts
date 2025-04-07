import { IsInt, Min, IsString, IsOptional, IsDate, IsNumber } from 'class-validator';
export class CreateAssetCategoryDto {
  name!: string;
  description?: string;
  defaultUsefulLifeMin!: number;
  defaultUsefulLifeMax!: number;
  defaultDepreciationMethod!: string;
  defaultSalvageValuePercent!: number;
  isActive?: boolean;
  createdBy?: number;
}

export class UpdateAssetCategoryDto {
  name?: string;
  description?: string;
  defaultUsefulLifeMin?: number;
  defaultUsefulLifeMax?: number;
  defaultDepreciationMethod?: string;
  defaultSalvageValuePercent?: number;
  isActive?: boolean;
  createdBy?: number;
}

export class CreateFixedAssetDto {
  @IsString()
  assetTag!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1, { message: 'categoryId must be a positive integer referencing an existing category' })
  categoryId!: number;

  @IsDate()
  acquisitionDate!: Date;

  @IsNumber()
  originalCost!: number;

  @IsNumber()
  usefulLife!: number;

  @IsString()
  depreciationMethod!: string;

  @IsNumber()
  salvageValue!: number;

  @IsNumber()
  currentValue!: number;

  @IsNumber()
  accumulatedDepreciation!: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsInt()
  custodian?: number;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  @IsDate()
  lastDepreciationDate?: Date;

  @IsOptional()
  @IsDate()
  disposalDate?: Date;

  @IsOptional()
  @IsNumber()
  disposalProceeds?: number;

  @IsOptional()
  @IsString()
  disposalReason?: string;

  @IsOptional()
  @IsInt()
  createdBy?: number;
}

export class UpdateFixedAssetDto {
  assetTag?: string;
  name?: string;
  description?: string;
  categoryId?: number;
  acquisitionDate?: Date;
  originalCost?: number;
  usefulLife?: number;
  depreciationMethod?: string;
  salvageValue?: number;
  currentValue?: number;
  accumulatedDepreciation?: number;
  status?: string;
  location?: string;
  custodian?: number;
  serialNumber?: string;
  lastDepreciationDate?: Date;
  disposalDate?: Date;
  disposalProceeds?: number;
  disposalReason?: string;
  createdBy?: number;
}