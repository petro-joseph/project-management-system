import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';
import { CreateInventoryItemDto, UpdateInventoryItemDto } from '../dtos/inventory-item.dto';
import { RequestHandler } from 'express';

import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export class InventoryController {
  private inventoryService = new InventoryService();

  createInventoryItem: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const dto = plainToInstance(CreateInventoryItemDto, req.body);
      const errors: ValidationError[] = await validate(dto);
      if (errors.length > 0) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.map(e => ({
            property: e.property,
            constraints: e.constraints
          }))
        });
      }
      const item = await this.inventoryService.createInventoryItem(dto);
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

  updateInventoryItem: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const dto = plainToInstance(UpdateInventoryItemDto, req.body);
      const errors: ValidationError[] = await validate(dto);
      if (errors.length > 0) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.map(e => ({
            property: e.property,
            constraints: e.constraints
          }))
        });
      }
      const updated = await this.inventoryService.updateInventoryItem(id, dto);
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