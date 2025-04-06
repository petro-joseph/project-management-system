import { Router, RequestHandler } from 'express';
import { FixedAssetController } from '../controllers/fixed-asset.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../entities/user.entity';

const router = Router();
const controller = new FixedAssetController();

// Apply authentication to all fixed asset routes
router.use(authenticate);

// Asset Categories
router.post(
  '/asset-categories',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  controller.createCategory as RequestHandler
);
router.get(
  '/asset-categories',
  authorize([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]),
  controller.getAllCategories as RequestHandler
);
router.put(
  '/asset-categories/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  controller.updateCategory as RequestHandler
);
router.delete(
  '/asset-categories/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  controller.deleteCategory as RequestHandler
);

// Fixed Assets
router.post(
  '/fixed-assets',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  controller.createAsset as RequestHandler
);
router.get(
  '/fixed-assets',
  authorize([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]),
  controller.getAllAssets as RequestHandler
);
router.get(
  '/fixed-assets/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]),
  controller.getAssetById as RequestHandler
);
router.put(
  '/fixed-assets/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  controller.updateAsset as RequestHandler
);
router.delete(
  '/fixed-assets/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  controller.deleteAsset as RequestHandler
);

// Depreciation Entries
router.post(
  '/depreciation-entries',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  controller.createDepreciationEntry as RequestHandler
);
router.get(
  '/fixed-assets/:assetId/depreciation-entries',
  authorize([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]),
  controller.getDepreciationEntriesByAsset as RequestHandler
);
router.put(
  '/depreciation-entries/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  controller.updateDepreciationEntry as RequestHandler
);
router.delete(
  '/depreciation-entries/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  controller.deleteDepreciationEntry as RequestHandler
);

// Disposal Entries
router.post(
  '/disposal-entries',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  controller.createDisposalEntry as RequestHandler
);
router.get(
  '/fixed-assets/:assetId/disposal-entries',
  authorize([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]),
  controller.getDisposalEntriesByAsset as RequestHandler
);
router.put(
  '/disposal-entries/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  controller.updateDisposalEntry as RequestHandler
);
router.delete(
  '/disposal-entries/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  controller.deleteDisposalEntry as RequestHandler
);

// Asset Revaluations
router.post(
  '/asset-revaluations',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  controller.createAssetRevaluation as RequestHandler
);
router.get(
  '/fixed-assets/:assetId/asset-revaluations',
  authorize([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]),
  controller.getAssetRevaluationsByAsset as RequestHandler
);
router.put(
  '/asset-revaluations/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  controller.updateAssetRevaluation as RequestHandler
);
router.delete(
  '/asset-revaluations/:id',
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  controller.deleteAssetRevaluation as RequestHandler
);

export default router;