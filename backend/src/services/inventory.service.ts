import { AppDataSource } from '../config/data-source';
import { InventoryItem } from '../entities/inventory-item.entity';
import { Repository } from 'typeorm';
import { CreateInventoryItemDto, UpdateInventoryItemDto } from '../dtos/inventory-item.dto';

export class InventoryService {
  private inventoryRepo: Repository<InventoryItem>;

  constructor() {
    this.inventoryRepo = AppDataSource.getRepository(InventoryItem);
  }

  async createInventoryItem(data: CreateInventoryItemDto): Promise<InventoryItem> {
    const item = this.inventoryRepo.create(data);
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
    Object.assign(item, data);
    return this.inventoryRepo.save(item);
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    const result = await this.inventoryRepo.delete(id);
    return result.affected !== 0;
  }
}