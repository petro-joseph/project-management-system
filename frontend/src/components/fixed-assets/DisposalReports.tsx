
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { FileDown, Eye } from 'lucide-react';
import { FixedAsset } from '@/lib/types';
import { 
  getDisposedAssets, 
  getDisposalEntryByAsset,
  getCategoryById, 
  formatCurrency,
  getUserById
} from '@/lib/mockFixedAssets';
import DisposalDetailsDialog from './DisposalDetailsDialog';

const DisposalReports = () => {
  const [disposedAssets] = useState<FixedAsset[]>(getDisposedAssets());
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState<FixedAsset | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const filterAssets = () => {
    if (selectedYear === 'all') return disposedAssets;
    
    return disposedAssets.filter(asset => {
      if (!asset.disposalDate) return false;
      const disposalYear = new Date(asset.disposalDate).getFullYear().toString();
      return disposalYear === selectedYear;
    });
  };

  const handleViewDetails = (asset: FixedAsset) => {
    setSelectedAsset(asset);
    setShowDetailsDialog(true);
  };

  const calculateTotalGainLoss = () => {
    let total = 0;
    
    filterAssets().forEach(asset => {
      const disposalEntry = getDisposalEntryByAsset(asset.id);
      if (disposalEntry) {
        total += disposalEntry.gainLoss;
      }
    });
    
    return total;
  };

  const displayedAssets = filterAssets();
  const totalGainLoss = calculateTotalGainLoss();
  const hasGain = totalGainLoss > 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-4">
              <Select
                defaultValue="all"
                onValueChange={setSelectedYear}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {Array.from({ length: 5 }).map((_, index) => {
                    const year = new Date().getFullYear() - 4 + index;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Disposed Assets</CardTitle>
            <CardDescription>Total number of disposed assets</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{displayedAssets.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Proceeds</CardTitle>
            <CardDescription>Total proceeds from disposals</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {formatCurrency(displayedAssets.reduce((sum, asset) => sum + (asset.disposalProceeds || 0), 0))}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              Net {hasGain ? 'Gain' : 'Loss'}
            </CardTitle>
            <CardDescription>
              Total {hasGain ? 'gain' : 'loss'} on disposals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${hasGain ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(Math.abs(totalGainLoss))}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Asset Disposal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Disposal Date</TableHead>
                <TableHead>Original Cost</TableHead>
                <TableHead>NBV at Disposal</TableHead>
                <TableHead>Proceeds</TableHead>
                <TableHead>Gain/(Loss)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedAssets.length > 0 ? (
                displayedAssets.map((asset) => {
                  const category = getCategoryById(asset.categoryId);
                  const disposalEntry = getDisposalEntryByAsset(asset.id);
                  const gainLoss = disposalEntry ? disposalEntry.gainLoss : 0;
                  const isGain = gainLoss > 0;
                  
                  return (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>{category?.name || 'Unknown'}</TableCell>
                      <TableCell>
                        {asset.disposalDate ? new Date(asset.disposalDate).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>{formatCurrency(asset.originalCost)}</TableCell>
                      <TableCell>
                        {disposalEntry ? formatCurrency(disposalEntry.netBookValue) : formatCurrency(0)}
                      </TableCell>
                      <TableCell>{formatCurrency(asset.disposalProceeds || 0)}</TableCell>
                      <TableCell className={isGain ? 'text-green-600' : 'text-red-600'}>
                        {isGain ? '+' : ''}{formatCurrency(gainLoss)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(asset)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No disposed assets found for the selected filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedAsset && (
        <DisposalDetailsDialog 
          asset={selectedAsset}
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
        />
      )}
    </div>
  );
};

export default DisposalReports;
