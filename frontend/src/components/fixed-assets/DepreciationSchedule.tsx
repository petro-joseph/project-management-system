
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { FileDown, Calculator } from 'lucide-react';
import { FixedAsset } from '@/lib/types';
import { 
  getFixedAssets, 
  getActiveAssets, 
  getCategoryById, 
  getDepreciationEntriesByAsset,
  formatCurrency,
  calculateStraightLineDepreciation,
  calculateReducingBalanceDepreciation
} from '@/lib/mockFixedAssets';

const DepreciationSchedule = () => {
  const [assets] = useState<FixedAsset[]>(getActiveAssets());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Generate a 12-month depreciation projection for an asset
  const generateDepreciationProjection = (asset: FixedAsset) => {
    const projections = [];
    let currentValue = asset.currentValue;
    const salvageValue = asset.salvageValue;
    
    // Calculate remaining useful life in years
    const acquisitionDate = new Date(asset.acquisitionDate);
    const currentDate = new Date();
    const yearsElapsed = (currentDate.getTime() - acquisitionDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    const remainingLife = Math.max(0, asset.usefulLife - yearsElapsed);
    
    for (let i = 0; i < 12; i++) {
      let depreciationAmount = 0;
      
      // Skip calculation if asset is already at or below salvage value
      if (currentValue <= salvageValue) {
        projections.push({
          month: new Date(parseInt(selectedYear), parseInt(selectedMonth) + i, 1).toLocaleString('default', { month: 'long', year: 'numeric' }),
          amount: 0,
          bookValueBefore: currentValue,
          bookValueAfter: currentValue
        });
        continue;
      }
      
      // Calculate depreciation based on method
      switch (asset.depreciationMethod) {
        case 'straight-line':
          depreciationAmount = calculateStraightLineDepreciation(
            asset.originalCost,
            salvageValue,
            asset.usefulLife,
            1 // 1 month
          );
          break;
        case 'reducing-balance':
          depreciationAmount = calculateReducingBalanceDepreciation(
            currentValue,
            salvageValue,
            remainingLife,
            1 // 1 month
          );
          break;
        case 'units-of-production':
          // For simplicity in the mock, we'll use a fixed amount
          depreciationAmount = (asset.originalCost - salvageValue) / (asset.usefulLife * 12);
          break;
        case 'sum-of-years-digits':
          // For simplicity in the mock, we'll use a fixed amount
          depreciationAmount = (asset.originalCost - salvageValue) / (asset.usefulLife * 12);
          break;
      }
      
      // Ensure we don't depreciate below salvage value
      if (currentValue - depreciationAmount < salvageValue) {
        depreciationAmount = currentValue - salvageValue;
      }
      
      const bookValueBefore = currentValue;
      const bookValueAfter = currentValue - depreciationAmount;
      
      projections.push({
        month: new Date(parseInt(selectedYear), parseInt(selectedMonth) + i, 1).toLocaleString('default', { month: 'long', year: 'numeric' }),
        amount: depreciationAmount,
        bookValueBefore,
        bookValueAfter
      });
      
      currentValue = bookValueAfter;
    }
    
    return projections;
  };

  // Get previous depreciation entries for the selected period
  const getPreviousEntries = (assetId: number) => {
    return getDepreciationEntriesByAsset(assetId).filter(entry => {
      const entryDate = new Date(entry.postingDate);
      return entryDate.getFullYear().toString() === selectedYear && 
             entryDate.getMonth().toString() === selectedMonth;
    });
  };

  const calculateTotalDepreciation = () => {
    let total = 0;
    assets.forEach(asset => {
      const projection = generateDepreciationProjection(asset);
      total += projection[0]?.amount || 0;
    });
    return total;
  };

  const handleRunDepreciation = () => {
    // In a real app, this would post depreciation entries to the database
    console.log('Running depreciation for', selectedMonth, selectedYear);
  };

  const currentMonthProjections = assets.map(asset => ({
    asset,
    category: getCategoryById(asset.categoryId),
    projection: generateDepreciationProjection(asset)[0],
    hasExistingEntry: getPreviousEntries(asset.id).length > 0
  }));

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-4">
              <Select
                defaultValue={selectedMonth}
                onValueChange={setSelectedMonth}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }).map((_, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {new Date(0, index).toLocaleString('default', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                defaultValue={selectedYear}
                onValueChange={setSelectedYear}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }).map((_, index) => {
                    const year = new Date().getFullYear() - 2 + index;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={handleRunDepreciation}
                className="flex items-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                Run Depreciation
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <FileDown className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Monthly Depreciation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Monthly Depreciation</TableHead>
                <TableHead>New Book Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentMonthProjections.length > 0 ? (
                currentMonthProjections.map(({ asset, category, projection, hasExistingEntry }) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>{category?.name || 'Unknown'}</TableCell>
                    <TableCell>{formatCurrency(projection.bookValueBefore)}</TableCell>
                    <TableCell>
                      {asset.depreciationMethod.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </TableCell>
                    <TableCell>{formatCurrency(projection.amount)}</TableCell>
                    <TableCell>{formatCurrency(projection.bookValueAfter)}</TableCell>
                    <TableCell>
                      {hasExistingEntry ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Posted
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No active assets to depreciate
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900">Total Assets</h3>
              <p className="text-3xl font-bold text-blue-700">{assets.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-900">Monthly Depreciation</h3>
              <p className="text-3xl font-bold text-green-700">{formatCurrency(calculateTotalDepreciation())}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-900">Annual Depreciation</h3>
              <p className="text-3xl font-bold text-purple-700">{formatCurrency(calculateTotalDepreciation() * 12)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepreciationSchedule;
