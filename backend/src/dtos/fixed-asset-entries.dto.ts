export class CreateDepreciationEntryDto {
  assetId!: number;
  period!: string;
  amount!: number;
  bookValueBefore!: number;
  bookValueAfter!: number;
  postingDate!: Date;
  createdBy?: number;
}

export class UpdateDepreciationEntryDto {
  assetId?: number;
  period?: string;
  amount?: number;
  bookValueBefore?: number;
  bookValueAfter?: number;
  postingDate?: Date;
  createdBy?: number;
}

export class CreateDisposalEntryDto {
  assetId!: number;
  disposalDate!: Date;
  disposalProceeds!: number;
  disposalCosts!: number;
  netBookValue!: number;
  gainLoss!: number;
  reason?: string;
  notes?: string;
  createdBy?: number;
}

export class UpdateDisposalEntryDto {
  assetId?: number;
  disposalDate?: Date;
  disposalProceeds?: number;
  disposalCosts?: number;
  netBookValue?: number;
  gainLoss?: number;
  reason?: string;
  notes?: string;
  createdBy?: number;
}

export class CreateAssetRevaluationDto {
  assetId!: number;
  revaluationDate!: Date;
  previousValue!: number;
  newValue!: number;
  reason?: string;
  type!: string;
  notes?: string;
  createdBy?: number;
}

export class UpdateAssetRevaluationDto {
  assetId?: number;
  revaluationDate?: Date;
  previousValue?: number;
  newValue?: number;
  reason?: string;
  type?: string;
  notes?: string;
  createdBy?: number;
}