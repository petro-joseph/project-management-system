import { Router } from 'express';
import { FixedAssetController } from '../controllers/fixed-asset.controller';

const router = Router();
const controller = new FixedAssetController();

// Asset Categories
router.post('/asset-categories', controller.createCategory);
router.get('/asset-categories', controller.getAllCategories);
router.put('/asset-categories/:id', controller.updateCategory);
router.delete('/asset-categories/:id', controller.deleteCategory);

// Fixed Assets
router.post('/fixed-assets', controller.createAsset);
router.get('/fixed-assets', controller.getAllAssets);
router.get('/fixed-assets/:id', controller.getAssetById);
router.put('/fixed-assets/:id', controller.updateAsset);
router.delete('/fixed-assets/:id', controller.deleteAsset);

// Depreciation Entries
router.post('/depreciation-entries', controller.createDepreciationEntry);
router.get('/fixed-assets/:assetId/depreciation-entries', controller.getDepreciationEntriesByAsset);
router.put('/depreciation-entries/:id', controller.updateDepreciationEntry);
router.delete('/depreciation-entries/:id', controller.deleteDepreciationEntry);

// Disposal Entries
router.post('/disposal-entries', controller.createDisposalEntry);
router.get('/fixed-assets/:assetId/disposal-entries', controller.getDisposalEntriesByAsset);
router.put('/disposal-entries/:id', controller.updateDisposalEntry);
router.delete('/disposal-entries/:id', controller.deleteDisposalEntry);

// Asset Revaluations
router.post('/asset-revaluations', controller.createAssetRevaluation);
router.get('/fixed-assets/:assetId/asset-revaluations', controller.getAssetRevaluationsByAsset);
router.put('/asset-revaluations/:id', controller.updateAssetRevaluation);
router.delete('/asset-revaluations/:id', controller.deleteAssetRevaluation);

export default router;