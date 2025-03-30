import { 
  AssetCategory, 
  FixedAsset, 
  AssetRevaluation, 
  DepreciationEntry, 
  DisposalEntry, 
  DepreciationMethod,
  User
} from './types';

// Mock users for the asset management module
export const users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'manager',
    createdAt: '2023-01-02T00:00:00Z'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'user',
    createdAt: '2023-01-03T00:00:00Z'
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    role: 'user',
    createdAt: '2023-01-04T00:00:00Z'
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    role: 'user',
    createdAt: '2023-01-05T00:00:00Z'
  }
];

// Mock Asset Categories
export const assetCategories: AssetCategory[] = [
  {
    id: 1,
    name: 'IT Equipment',
    description: 'Computers, servers, and other IT hardware',
    defaultUsefulLifeMin: 3,
    defaultUsefulLifeMax: 5,
    defaultDepreciationMethod: 'straight-line',
    defaultSalvageValuePercent: 10,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    createdBy: 1
  },
  {
    id: 2,
    name: 'Vehicles',
    description: 'Company cars, trucks, and other vehicles',
    defaultUsefulLifeMin: 5,
    defaultUsefulLifeMax: 10,
    defaultDepreciationMethod: 'reducing-balance',
    defaultSalvageValuePercent: 15,
    isActive: true,
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
    createdBy: 1
  },
  {
    id: 3,
    name: 'Office Furniture',
    description: 'Desks, chairs, and other office furnishings',
    defaultUsefulLifeMin: 7,
    defaultUsefulLifeMax: 10,
    defaultDepreciationMethod: 'straight-line',
    defaultSalvageValuePercent: 5,
    isActive: true,
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z',
    createdBy: 1
  },
  {
    id: 4,
    name: 'Buildings',
    description: 'Office buildings and structures',
    defaultUsefulLifeMin: 20,
    defaultUsefulLifeMax: 40,
    defaultDepreciationMethod: 'straight-line',
    defaultSalvageValuePercent: 20,
    isActive: true,
    createdAt: '2023-01-04T00:00:00Z',
    updatedAt: '2023-01-04T00:00:00Z',
    createdBy: 1
  },
  {
    id: 5,
    name: 'Machinery',
    description: 'Production and manufacturing equipment',
    defaultUsefulLifeMin: 5,
    defaultUsefulLifeMax: 15,
    defaultDepreciationMethod: 'units-of-production',
    defaultSalvageValuePercent: 10,
    isActive: true,
    createdAt: '2023-01-05T00:00:00Z',
    updatedAt: '2023-01-05T00:00:00Z',
    createdBy: 1
  }
];

// Mock Fixed Assets
export const fixedAssets: FixedAsset[] = [
  {
    id: 1,
    assetTag: 'IT-2023-001',
    name: 'Dell XPS 15 Laptop',
    description: 'High-performance laptop for development team',
    categoryId: 1,
    acquisitionDate: '2023-02-15T00:00:00Z',
    originalCost: 2500,
    usefulLife: 4,
    depreciationMethod: 'straight-line',
    salvageValue: 250,
    currentValue: 2187.5,
    accumulatedDepreciation: 312.5,
    status: 'active',
    location: 'Main Office',
    custodian: 3, // User ID
    serialNumber: 'DXPS159876543',
    lastDepreciationDate: '2023-05-31T00:00:00Z',
    createdAt: '2023-02-15T00:00:00Z',
    updatedAt: '2023-05-31T00:00:00Z',
    createdBy: 1
  },
  {
    id: 2,
    assetTag: 'VH-2023-001',
    name: 'Toyota Camry',
    description: 'Company car for sales team',
    categoryId: 2,
    acquisitionDate: '2023-01-10T00:00:00Z',
    originalCost: 35000,
    usefulLife: 8,
    depreciationMethod: 'reducing-balance',
    salvageValue: 5250,
    currentValue: 29750,
    accumulatedDepreciation: 5250,
    status: 'active',
    location: 'Company Garage',
    custodian: 2, // User ID
    serialNumber: 'TC20230012345',
    lastDepreciationDate: '2023-05-31T00:00:00Z',
    createdAt: '2023-01-10T00:00:00Z',
    updatedAt: '2023-05-31T00:00:00Z',
    createdBy: 1
  },
  {
    id: 3,
    assetTag: 'OF-2023-001',
    name: 'Executive Desk Set',
    description: 'High-end desk and chair for CEO office',
    categoryId: 3,
    acquisitionDate: '2023-03-05T00:00:00Z',
    originalCost: 3500,
    usefulLife: 10,
    depreciationMethod: 'straight-line',
    salvageValue: 175,
    currentValue: 3383.75,
    accumulatedDepreciation: 116.25,
    status: 'active',
    location: 'Executive Office',
    custodian: 1, // User ID
    lastDepreciationDate: '2023-05-31T00:00:00Z',
    createdAt: '2023-03-05T00:00:00Z',
    updatedAt: '2023-05-31T00:00:00Z',
    createdBy: 2
  },
  {
    id: 4,
    assetTag: 'IT-2023-002',
    name: 'Server Infrastructure',
    description: 'Development server racks and networking equipment',
    categoryId: 1,
    acquisitionDate: '2022-11-20T00:00:00Z',
    originalCost: 45000,
    usefulLife: 5,
    depreciationMethod: 'straight-line',
    salvageValue: 4500,
    currentValue: 40950,
    accumulatedDepreciation: 4050,
    status: 'active',
    location: 'Server Room',
    custodian: 3, // User ID
    serialNumber: 'SR20221120',
    lastDepreciationDate: '2023-05-31T00:00:00Z',
    createdAt: '2022-11-20T00:00:00Z',
    updatedAt: '2023-05-31T00:00:00Z',
    createdBy: 1
  },
  {
    id: 5,
    assetTag: 'MA-2023-001',
    name: 'CNC Machine',
    description: 'Computer Numerical Control machine for manufacturing',
    categoryId: 5,
    acquisitionDate: '2023-04-15T00:00:00Z',
    originalCost: 75000,
    usefulLife: 12,
    depreciationMethod: 'units-of-production',
    salvageValue: 7500,
    currentValue: 74375,
    accumulatedDepreciation: 625,
    status: 'active',
    location: 'Manufacturing Plant',
    custodian: 5, // User ID
    serialNumber: 'CNC20230415',
    lastDepreciationDate: '2023-05-31T00:00:00Z',
    createdAt: '2023-04-15T00:00:00Z',
    updatedAt: '2023-05-31T00:00:00Z',
    createdBy: 2
  },
  {
    id: 6,
    assetTag: 'IT-2022-001',
    name: 'Old Desktop Computer',
    description: 'Desktop computer fully depreciated',
    categoryId: 1,
    acquisitionDate: '2020-01-10T00:00:00Z',
    originalCost: 1200,
    usefulLife: 3,
    depreciationMethod: 'straight-line',
    salvageValue: 0,
    currentValue: 0,
    accumulatedDepreciation: 1200,
    status: 'fully-depreciated',
    location: 'Storage',
    custodian: 4, // User ID
    serialNumber: 'DC20200110',
    lastDepreciationDate: '2023-01-10T00:00:00Z',
    createdAt: '2020-01-10T00:00:00Z',
    updatedAt: '2023-01-10T00:00:00Z',
    createdBy: 1
  },
  {
    id: 7,
    assetTag: 'VH-2021-001',
    name: 'Disposed Vehicle',
    description: 'Old company car that was sold',
    categoryId: 2,
    acquisitionDate: '2019-05-20T00:00:00Z',
    originalCost: 28000,
    usefulLife: 7,
    depreciationMethod: 'reducing-balance',
    salvageValue: 4200,
    currentValue: 0,
    accumulatedDepreciation: 15000,
    status: 'disposed',
    location: 'N/A',
    custodian: 2, // User ID
    serialNumber: 'TC20190520',
    lastDepreciationDate: '2022-12-31T00:00:00Z',
    disposalDate: '2023-01-15T00:00:00Z',
    disposalProceeds: 12000,
    disposalReason: 'Sold - Upgraded to newer model',
    createdAt: '2019-05-20T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z',
    createdBy: 1
  }
];

// Mock Depreciation Entries
export const depreciationEntries: DepreciationEntry[] = [
  {
    id: 1,
    assetId: 1,
    period: '2023-03',
    amount: 46.88,
    bookValueBefore: 2500,
    bookValueAfter: 2453.12,
    postingDate: '2023-03-31T00:00:00Z',
    createdAt: '2023-03-31T00:00:00Z',
    createdBy: 1
  },
  {
    id: 2,
    assetId: 1,
    period: '2023-04',
    amount: 46.88,
    bookValueBefore: 2453.12,
    bookValueAfter: 2406.24,
    postingDate: '2023-04-30T00:00:00Z',
    createdAt: '2023-04-30T00:00:00Z',
    createdBy: 1
  },
  {
    id: 3,
    assetId: 1,
    period: '2023-05',
    amount: 46.88,
    bookValueBefore: 2406.24,
    bookValueAfter: 2359.36,
    postingDate: '2023-05-31T00:00:00Z',
    createdAt: '2023-05-31T00:00:00Z',
    createdBy: 1
  },
  {
    id: 4,
    assetId: 2,
    period: '2023-02',
    amount: 1250,
    bookValueBefore: 35000,
    bookValueAfter: 33750,
    postingDate: '2023-02-28T00:00:00Z',
    createdAt: '2023-02-28T00:00:00Z',
    createdBy: 1
  },
  {
    id: 5,
    assetId: 2,
    period: '2023-03',
    amount: 1250,
    bookValueBefore: 33750,
    bookValueAfter: 32500,
    postingDate: '2023-03-31T00:00:00Z',
    createdAt: '2023-03-31T00:00:00Z',
    createdBy: 1
  }
];

// Mock Disposal Entries
export const disposalEntries: DisposalEntry[] = [
  {
    id: 1,
    assetId: 7,
    disposalDate: '2023-01-15T00:00:00Z',
    disposalProceeds: 12000,
    disposalCosts: 500,
    netBookValue: 13000,
    gainLoss: -1500, // Loss on disposal
    reason: 'Sold - Upgraded to newer model',
    notes: 'Sold to a used car dealer',
    createdAt: '2023-01-15T00:00:00Z',
    createdBy: 1
  }
];

// Mock Asset Revaluations
export const assetRevaluations: AssetRevaluation[] = [
  {
    id: 1,
    assetId: 4,
    revaluationDate: '2023-04-15T00:00:00Z',
    previousValue: 41500,
    newValue: 40950,
    reason: 'Market value reassessment',
    type: 'impairment',
    notes: 'Server equipment value decreased due to new technology release',
    createdAt: '2023-04-15T00:00:00Z',
    createdBy: 1
  }
];

// Helper Functions for Asset Management
export const getAssetCategories = (): AssetCategory[] => {
  return assetCategories;
};

export const getFixedAssets = (): FixedAsset[] => {
  return fixedAssets;
};

export const getAssetById = (id: number): FixedAsset | undefined => {
  return fixedAssets.find(asset => asset.id === id);
};

export const getAssetsByCategory = (categoryId: number): FixedAsset[] => {
  return fixedAssets.filter(asset => asset.categoryId === categoryId);
};

export const getActiveAssets = (): FixedAsset[] => {
  return fixedAssets.filter(asset => asset.status === 'active');
};

export const getDisposedAssets = (): FixedAsset[] => {
  return fixedAssets.filter(asset => asset.status === 'disposed');
};

export const getFullyDepreciatedAssets = (): FixedAsset[] => {
  return fixedAssets.filter(asset => asset.status === 'fully-depreciated');
};

export const getAssetsByUser = (userId: number): FixedAsset[] => {
  return fixedAssets.filter(asset => asset.custodian === userId);
};

export const getCategoryById = (id: number): AssetCategory | undefined => {
  return assetCategories.find(category => category.id === id);
};

export const getDepreciationEntriesByAsset = (assetId: number): DepreciationEntry[] => {
  return depreciationEntries.filter(entry => entry.assetId === assetId);
};

export const getAssetRevaluationsByAsset = (assetId: number): AssetRevaluation[] => {
  return assetRevaluations.filter(revaluation => revaluation.assetId === assetId);
};

export const getDisposalEntryByAsset = (assetId: number): DisposalEntry | undefined => {
  return disposalEntries.find(entry => entry.assetId === assetId);
};

// Depreciation Calculation Functions
export const calculateStraightLineDepreciation = (
  cost: number,
  salvageValue: number,
  usefulLife: number,
  periodInMonths: number = 1
): number => {
  const yearlyDepreciation = (cost - salvageValue) / usefulLife;
  const monthlyDepreciation = yearlyDepreciation / 12;
  return parseFloat((monthlyDepreciation * periodInMonths).toFixed(2));
};

export const calculateReducingBalanceDepreciation = (
  currentBookValue: number,
  salvageValue: number,
  remainingLifeInYears: number,
  periodInMonths: number = 1
): number => {
  // Only depreciate down to salvage value
  if (currentBookValue <= salvageValue) {
    return 0;
  }
  
  // Calculate depreciation rate using declining-balance method
  const rate = 1 - Math.pow(salvageValue / currentBookValue, 1 / remainingLifeInYears);
  const yearlyDepreciation = currentBookValue * rate;
  const monthlyDepreciation = yearlyDepreciation / 12;
  
  // Make sure we don't depreciate below salvage value
  const calculatedDepreciation = monthlyDepreciation * periodInMonths;
  const maxPossibleDepreciation = currentBookValue - salvageValue;
  
  return parseFloat(Math.min(calculatedDepreciation, maxPossibleDepreciation).toFixed(2));
};

export const calculateUnitsOfProductionDepreciation = (
  cost: number,
  salvageValue: number,
  totalEstimatedUnits: number,
  unitsProducedThisPeriod: number
): number => {
  const depreciableAmount = cost - salvageValue;
  const depreciationPerUnit = depreciableAmount / totalEstimatedUnits;
  return parseFloat((depreciationPerUnit * unitsProducedThisPeriod).toFixed(2));
};

export const calculateSumOfYearsDigitsDepreciation = (
  cost: number,
  salvageValue: number,
  usefulLife: number,
  currentYear: number
): number => {
  if (currentYear > usefulLife) {
    return 0;
  }
  
  const sumOfYears = (usefulLife * (usefulLife + 1)) / 2;
  const remainingYears = usefulLife - currentYear + 1;
  const depreciationFactor = remainingYears / sumOfYears;
  const depreciationAmount = (cost - salvageValue) * depreciationFactor;
  
  return parseFloat(depreciationAmount.toFixed(2));
};

// Utility Functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const calculateNetBookValue = (asset: FixedAsset): number => {
  return asset.originalCost - asset.accumulatedDepreciation;
};

export const calculateDepreciationRatePercentage = (
  depreciationMethod: DepreciationMethod,
  usefulLife: number
): string => {
  switch (depreciationMethod) {
    case 'straight-line':
      return `${(100 / usefulLife).toFixed(2)}%`;
    case 'reducing-balance':
      // Common approximation for declining balance method
      return `${(200 / usefulLife).toFixed(2)}%`;
    case 'units-of-production':
      return 'Variable';
    case 'sum-of-years-digits':
      return 'Variable';
    default:
      return 'Unknown';
  }
};

// Mock creation functions for adding new records
export const createAssetCategory = (category: Omit<AssetCategory, 'id' | 'createdAt' | 'updatedAt'>): AssetCategory => {
  const newCategory: AssetCategory = {
    id: Math.max(...assetCategories.map(c => c.id)) + 1,
    ...category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  assetCategories.push(newCategory);
  return newCategory;
};

export const createFixedAsset = (asset: Omit<FixedAsset, 'id' | 'createdAt' | 'updatedAt' | 'assetTag' | 'currentValue' | 'accumulatedDepreciation'>): FixedAsset => {
  const categoryId = asset.categoryId;
  const category = getCategoryById(categoryId);
  
  if (!category) {
    throw new Error(`Asset category with ID ${categoryId} not found`);
  }
  
  const assetCount = fixedAssets.filter(a => a.categoryId === categoryId).length;
  const categoryPrefix = category.name.substring(0, 2).toUpperCase();
  const year = new Date().getFullYear();
  const assetTag = `${categoryPrefix}-${year}-${(assetCount + 1).toString().padStart(3, '0')}`;
  
  const newAsset: FixedAsset = {
    id: Math.max(...fixedAssets.map(a => a.id)) + 1,
    assetTag,
    currentValue: asset.originalCost,
    accumulatedDepreciation: 0,
    ...asset,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  fixedAssets.push(newAsset);
  return newAsset;
};

export const createDepreciationEntry = (entry: Omit<DepreciationEntry, 'id' | 'createdAt'>): DepreciationEntry => {
  const newEntry: DepreciationEntry = {
    id: Math.max(...depreciationEntries.map(e => e.id)) + 1,
    ...entry,
    createdAt: new Date().toISOString()
  };
  
  depreciationEntries.push(newEntry);
  
  // Update the related asset
  const asset = getAssetById(entry.assetId);
  if (asset) {
    asset.accumulatedDepreciation += entry.amount;
    asset.currentValue = entry.bookValueAfter;
    asset.lastDepreciationDate = entry.postingDate;
    asset.updatedAt = new Date().toISOString();
    
    // Check if asset is fully depreciated
    if (asset.currentValue <= asset.salvageValue) {
      asset.status = 'fully-depreciated';
    }
  }
  
  return newEntry;
};

export const createDisposalEntry = (entry: Omit<DisposalEntry, 'id' | 'createdAt'>): DisposalEntry => {
  const newEntry: DisposalEntry = {
    id: Math.max(...disposalEntries.map(e => e.id)) + 1,
    ...entry,
    createdAt: new Date().toISOString()
  };
  
  disposalEntries.push(newEntry);
  
  // Update the related asset
  const asset = getAssetById(entry.assetId);
  if (asset) {
    asset.status = 'disposed';
    asset.disposalDate = entry.disposalDate;
    asset.disposalProceeds = entry.disposalProceeds;
    asset.disposalReason = entry.reason;
    asset.updatedAt = new Date().toISOString();
  }
  
  return newEntry;
};

export const createAssetRevaluation = (revaluation: Omit<AssetRevaluation, 'id' | 'createdAt'>): AssetRevaluation => {
  const newRevaluation: AssetRevaluation = {
    id: Math.max(...assetRevaluations.map(r => r.id)) + 1,
    ...revaluation,
    createdAt: new Date().toISOString()
  };
  
  assetRevaluations.push(newRevaluation);
  
  // Update the related asset
  const asset = getAssetById(revaluation.assetId);
  if (asset) {
    asset.currentValue = revaluation.newValue;
    
    // If impairment, adjust status
    if (revaluation.type === 'impairment') {
      asset.status = 'impaired';
    }
    
    asset.updatedAt = new Date().toISOString();
  }
  
  return newRevaluation;
};

// Add a function to get user by ID
export const getUserById = (id: number): User | undefined => {
  return users.find(user => user.id === id);
};
