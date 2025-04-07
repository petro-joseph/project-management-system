import { QueryFailedError } from 'typeorm';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { FixedAssetService } from '../services/fixed-asset.service';

export class FixedAssetController {
  private service = new FixedAssetService();

  // Asset Categories
  createCategory: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.service.createCategory(req.body);
      res.status(201).json(result);
    } catch (err) { next(err); }
  };

  getAllCategories: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.service.getAllCategories();
      res.json(result);
    } catch (err) { next(err); }
  };

  updateCategory: RequestHandler = async (req, res, next) => {
    try {
      const updated = await this.service.updateCategory(+req.params.id, req.body);
      if (!updated) { res.status(404).json({ message: 'Category not found' }); return; }
      res.json(updated);
    } catch (err) { next(err); }
  };

  deleteCategory: RequestHandler = async (req, res, next) => {
    try {
      const deleted = await this.service.deleteCategory(+req.params.id);
      if (!deleted) { res.status(404).json({ message: 'Category not found' }); return; }
      res.status(204).send();
    } catch (err) { next(err); }
  };

  // Fixed Assets
  createAsset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.createAsset(req.body);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError?.code === '23503') {
        return res.status(400).json({ message: 'Invalid foreign key: referenced category or related entity does not exist.' });
      }
      next(err);
    }
  };

  getAllAssets: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.service.getAllAssets();
      res.json(result);
    } catch (err) { next(err); }
  };

  getAssetById: RequestHandler = async (req, res, next) => {
    try {
      const asset = await this.service.getAssetById(+req.params.id);
      if (!asset) { res.status(404).json({ message: 'Asset not found' }); return; }
      res.json(asset);
    } catch (err) { next(err); }
  };

  updateAsset: RequestHandler = async (req, res, next) => {
    try {
      const updated = await this.service.updateAsset(+req.params.id, req.body);
      if (!updated) { res.status(404).json({ message: 'Asset not found' }); return; }
      res.json(updated);
    } catch (err) { next(err); }
  };

  deleteAsset: RequestHandler = async (req, res, next) => {
    try {
      const deleted = await this.service.deleteAsset(+req.params.id);
      if (!deleted) { res.status(404).json({ message: 'Asset not found' }); return; }
      res.status(204).send();
    } catch (err) { next(err); }
  };

  // Depreciation Entries
  createDepreciationEntry: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.service.createDepreciationEntry(req.body);
      res.status(201).json(result);
    } catch (err) { next(err); }
  };

  getDepreciationEntriesByAsset: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.service.getDepreciationEntriesByAsset(+req.params.assetId);
      res.json(result);
    } catch (err) { next(err); }
  };

  updateDepreciationEntry: RequestHandler = async (req, res, next) => {
    try {
      const updated = await this.service.updateDepreciationEntry(+req.params.id, req.body);
      if (!updated) { res.status(404).json({ message: 'Entry not found' }); return; }
      res.json(updated);
    } catch (err) { next(err); }
  };

  deleteDepreciationEntry: RequestHandler = async (req, res, next) => {
    try {
      const deleted = await this.service.deleteDepreciationEntry(+req.params.id);
      if (!deleted) { res.status(404).json({ message: 'Entry not found' }); return; }
      res.status(204).send();
    } catch (err) { next(err); }
  };

  // Disposal Entries
  createDisposalEntry: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.service.createDisposalEntry(req.body);
      res.status(201).json(result);
    } catch (err) { next(err); }
  };

  getDisposalEntriesByAsset: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.service.getDisposalEntriesByAsset(+req.params.assetId);
      res.json(result);
    } catch (err) { next(err); }
  };

  updateDisposalEntry: RequestHandler = async (req, res, next) => {
    try {
      const updated = await this.service.updateDisposalEntry(+req.params.id, req.body);
      if (!updated) { res.status(404).json({ message: 'Entry not found' }); return; }
      res.json(updated);
    } catch (err) { next(err); }
  };

  deleteDisposalEntry: RequestHandler = async (req, res, next) => {
    try {
      const deleted = await this.service.deleteDisposalEntry(+req.params.id);
      if (!deleted) { res.status(404).json({ message: 'Entry not found' }); return; }
      res.status(204).send();
    } catch (err) { next(err); }
  };

  // Asset Revaluations
  createAssetRevaluation: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.service.createAssetRevaluation(req.body);
      res.status(201).json(result);
    } catch (err) { next(err); }
  };

  getAssetRevaluationsByAsset: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.service.getAssetRevaluationsByAsset(+req.params.assetId);
      res.json(result);
    } catch (err) { next(err); }
  };

  updateAssetRevaluation: RequestHandler = async (req, res, next) => {
    try {
      const updated = await this.service.updateAssetRevaluation(+req.params.id, req.body);
      if (!updated) { res.status(404).json({ message: 'Entry not found' }); return; }
      res.json(updated);
    } catch (err) { next(err); }
  };

  deleteAssetRevaluation: RequestHandler = async (req, res, next) => {
    try {
      const deleted = await this.service.deleteAssetRevaluation(+req.params.id);
      if (!deleted) { res.status(404).json({ message: 'Entry not found' }); return; }
      res.status(204).send();
    } catch (err) { next(err); }
  };
}