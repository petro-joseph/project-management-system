import { AppDataSource } from '../config/data-source';
import { InventoryItem } from '../entities/inventory-item.entity';
import { Supplier } from '../entities/supplier.entity';
import { Location } from '../entities/location.entity';
import { Repository } from 'typeorm';
import { CreateInventoryItemDto, UpdateInventoryItemDto } from '../dtos/inventory-item.dto';

export class InventoryService {
  private inventoryRepo: Repository<InventoryItem>;

  constructor() {
    this.inventoryRepo = AppDataSource.getRepository(InventoryItem);
  }

  async createInventoryItem(data: CreateInventoryItemDto): Promise<InventoryItem> {
    const { supplierId, locationId, ...rest } = data as any;

    const item = Object.assign(new InventoryItem(), rest);

    if (supplierId) {
      const supplierRepo = AppDataSource.getRepository(Supplier);
      item.supplier = await supplierRepo.findOne({ where: { id: supplierId } });
    }

    if (locationId) {
      const locationRepo = AppDataSource.getRepository(Location);
      item.location = await locationRepo.findOne({ where: { id: locationId } });
    }

    return this.inventoryRepo.save(item);
  }

  async getAllInventoryItems(): Promise<InventoryItem[]> {
    return this.inventoryRepo.find();
  }

  async getInventoryItemById(id: number): Promise<InventoryItem | null> {
    return this.inventoryRepo.findOneBy({ id });
  }

  async updateInventoryItem(id: number, data: UpdateInventoryItemDto): Promise<InventoryItem | null> {
    const item = await this.inventoryRepo.findOneBy({ id });
    if (!item) return null;

    const { supplierId, locationId, ...rest } = data as any;
    Object.assign(item, rest);

    if (supplierId !== undefined) {
      const supplierRepo = AppDataSource.getRepository(Supplier);
      item.supplier = supplierId ? await supplierRepo.findOne({ where: { id: supplierId } }) : null;
    }

    if (locationId !== undefined) {
      const locationRepo = AppDataSource.getRepository(Location);
      item.location = locationId ? await locationRepo.findOne({ where: { id: locationId } }) : null;
    }

    return this.inventoryRepo.save(item);
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    const result = await this.inventoryRepo.delete(id);
    return result.affected !== 0;
  }
}