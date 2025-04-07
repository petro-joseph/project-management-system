import { AppDataSource } from '../config/data-source';
import { Repository } from 'typeorm';
import { FixedAsset } from '../entities/fixed-asset.entity';
import { AssetCategory } from '../entities/asset-category.entity';
import { DepreciationEntry } from '../entities/depreciation-entry.entity';
import { DisposalEntry } from '../entities/disposal-entry.entity';
import { AssetRevaluation } from '../entities/asset-revaluation.entity';
import { CreateFixedAssetDto, UpdateFixedAssetDto, CreateAssetCategoryDto, UpdateAssetCategoryDto } from '../dtos/fixed-asset.dto';
import { CreateDepreciationEntryDto, UpdateDepreciationEntryDto, CreateDisposalEntryDto, UpdateDisposalEntryDto, CreateAssetRevaluationDto, UpdateAssetRevaluationDto } from '../dtos/fixed-asset-entries.dto';

export class FixedAssetService {
  private assetRepo = AppDataSource.getRepository(FixedAsset);
  private categoryRepo = AppDataSource.getRepository(AssetCategory);
  private depreciationRepo = AppDataSource.getRepository(DepreciationEntry);
  private disposalRepo = AppDataSource.getRepository(DisposalEntry);
  private revaluationRepo = AppDataSource.getRepository(AssetRevaluation);

  // AssetCategory CRUD
  async createCategory(data: CreateAssetCategoryDto) {
    const category = this.categoryRepo.create(data);
    return this.categoryRepo.save(category);
  }

  async getAllCategories() {
    return this.categoryRepo.find();
  }

  async getCategoryById(id: number) {
    return this.categoryRepo.findOneBy({ id });
  }

  async updateCategory(id: number, data: UpdateAssetCategoryDto) {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) return null;
    Object.assign(category, data);
    return this.categoryRepo.save(category);
  }

  async deleteCategory(id: number) {
    const result = await this.categoryRepo.delete(id);
    return result.affected !== 0;
  }

  // FixedAsset CRUD
  async createAsset(data: CreateFixedAssetDto) {
    const category = await this.categoryRepo.findOneBy({ id: data.categoryId });
    if (!category) {
      const { BadRequestError } = await import('../errors/bad-request-error');
      throw new BadRequestError(`Category with id ${data.categoryId} does not exist`);
    }

    const asset = this.assetRepo.create(data);
    return this.assetRepo.save(asset);
  }

  async getAllAssets() {
    return this.assetRepo.find({ relations: ['category'] });
  }

  async getAssetById(id: number) {
    return this.assetRepo.findOne({ where: { id }, relations: ['category'] });
  }

  async updateAsset(id: number, data: UpdateFixedAssetDto) {
    const asset = await this.assetRepo.findOneBy({ id });
    if (!asset) return null;
    Object.assign(asset, data);
    return this.assetRepo.save(asset);
  }

  async deleteAsset(id: number) {
    const result = await this.assetRepo.delete(id);
    return result.affected !== 0;
  }

  // DepreciationEntry CRUD
  async createDepreciationEntry(data: CreateDepreciationEntryDto) {
    const entry = this.depreciationRepo.create(data);
    return this.depreciationRepo.save(entry);
  }

  async getDepreciationEntriesByAsset(assetId: number) {
    return this.depreciationRepo.find({ where: { assetId } });
  }

  async updateDepreciationEntry(id: number, data: UpdateDepreciationEntryDto) {
    const entry = await this.depreciationRepo.findOneBy({ id });
    if (!entry) return null;
    Object.assign(entry, data);
    return this.depreciationRepo.save(entry);
  }

  async deleteDepreciationEntry(id: number) {
    const result = await this.depreciationRepo.delete(id);
    return result.affected !== 0;
  }

  // DisposalEntry CRUD
  async createDisposalEntry(data: CreateDisposalEntryDto) {
    const entry = this.disposalRepo.create(data);
    return this.disposalRepo.save(entry);
  }

  async getDisposalEntriesByAsset(assetId: number) {
    return this.disposalRepo.find({ where: { assetId } });
  }

  async updateDisposalEntry(id: number, data: UpdateDisposalEntryDto) {
    const entry = await this.disposalRepo.findOneBy({ id });
    if (!entry) return null;
    Object.assign(entry, data);
    return this.disposalRepo.save(entry);
  }

  async deleteDisposalEntry(id: number) {
    const result = await this.disposalRepo.delete(id);
    return result.affected !== 0;
  }

  // AssetRevaluation CRUD
  async createAssetRevaluation(data: CreateAssetRevaluationDto) {
    const entry = this.revaluationRepo.create(data);
    return this.revaluationRepo.save(entry);
  }

  async getAssetRevaluationsByAsset(assetId: number) {
    return this.revaluationRepo.find({ where: { assetId } });
  }

  async updateAssetRevaluation(id: number, data: UpdateAssetRevaluationDto) {
    const entry = await this.revaluationRepo.findOneBy({ id });
    if (!entry) return null;
    Object.assign(entry, data);
    return this.revaluationRepo.save(entry);
  }

  async deleteAssetRevaluation(id: number) {
    const result = await this.revaluationRepo.delete(id);
    return result.affected !== 0;
  }
}