export class CreateInventoryItemDto {
  name!: string;
  description?: string;
  quantity!: number;
  unitOfMeasure!: string;
  locationId?: number;
  projectId?: number;
  purchaseDate?: Date;
  supplierId?: number;
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
  locationId?: number;
  projectId?: number;
  purchaseDate?: Date;
  supplierId?: number;
  costPerUnit?: number;
  totalValue?: number;
  lowStockThreshold?: number;
  category?: string;
  status?: string;
}