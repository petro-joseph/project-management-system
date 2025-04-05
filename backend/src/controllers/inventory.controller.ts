import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';
import { CreateInventoryItemDto, UpdateInventoryItemDto } from '../dtos/inventory-item.dto';
import { RequestHandler } from 'express';

export class InventoryController {
  private inventoryService = new InventoryService();

  createInventoryItem: RequestHandler = async (req, res, next) => {
    try {
      const data: CreateInventoryItemDto = req.body;
      const item = await this.inventoryService.createInventoryItem(data);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  };

  getAllInventoryItems: RequestHandler = async (req, res, next) => {
    try {
      const items = await this.inventoryService.getAllInventoryItems();
      res.json(items);
    } catch (error) {
      next(error);
    }
  };

  getInventoryItemById: RequestHandler = async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const item = await this.inventoryService.getInventoryItemById(id);
      if (!item) {
        res.status(404).json({ message: 'Inventory item not found' });
        return;
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  };

  updateInventoryItem: RequestHandler = async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const data: UpdateInventoryItemDto = req.body;
      const updated = await this.inventoryService.updateInventoryItem(id, data);
      if (!updated) {
        res.status(404).json({ message: 'Inventory item not found' });
        return;
      }
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };

  deleteInventoryItem: RequestHandler = async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await this.inventoryService.deleteInventoryItem(id);
      if (!deleted) {
        res.status(404).json({ message: 'Inventory item not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}