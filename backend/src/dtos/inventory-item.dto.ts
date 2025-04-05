export class CreateInventoryItemDto {
  name!: string;
  description?: string;
  quantity!: number;
  unitOfMeasure!: string;
  location?: string;
  projectId?: number;
  purchaseDate?: Date;
  supplier?: string;
  costPerUnit?: number;
  totalValue?: number;
  lowStockThreshold?: number;
  category?: string;
  status?: string;
}

export class UpdateInventoryItemDto {
  name?: string;
  description?: string;
  quantity?: number;
  unitOfMeasure?: string;
  location?: string;
  projectId?: number;
  purchaseDate?: Date;
  supplier?: string;
  costPerUnit?: number;
  totalValue?: number;
  lowStockThreshold?: number;
  category?: string;
  status?: string;
}