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
  assetTag!: string;
  name!: string;
  description?: string;
  categoryId!: number;
  acquisitionDate!: Date;
  originalCost!: number;
  usefulLife!: number;
  depreciationMethod!: string;
  salvageValue!: number;
  currentValue!: number;
  accumulatedDepreciation!: number;
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