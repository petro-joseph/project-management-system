
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FixedAsset } from '@/lib/types';
import { 
  getCategoryById, 
  getUserById, 
  getDisposalEntryByAsset,
  formatCurrency
} from '@/lib/mockFixedAssets';
import { Printer, AlertCircle } from 'lucide-react';

interface DisposalDetailsDialogProps {
  asset: FixedAsset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DisposalDetailsDialog: React.FC<DisposalDetailsDialogProps> = ({ 
  asset, 
  open, 
  onOpenChange 
}) => {
  const disposalEntry = getDisposalEntryByAsset(asset.id);
  const category = getCategoryById(asset.categoryId);
  const disposedBy = disposalEntry ? getUserById(disposalEntry.createdBy) : null;
  
  const handlePrint = () => {
    window.print();
  };
  
  if (!disposalEntry) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disposal Details</DialogTitle>
          </DialogHeader>
          <p>No disposal details found for this asset.</p>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  const isGain = disposalEntry.gainLoss > 0;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
            Asset Disposal Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-lg mb-2">Asset Information</h3>
                  <dl className="space-y-1">
                    <div className="grid grid-cols-2">
                      <dt className="font-medium text-muted-foreground">Asset:</dt>
                      <dd>{asset.name}</dd>
                    </div>
                    <div className="grid grid-cols-2">
                      <dt className="font-medium text-muted-foreground">Asset Tag:</dt>
                      <dd>{asset.assetTag}</dd>
                    </div>
                    <div className="grid grid-cols-2">
                      <dt className="font-medium text-muted-foreground">Category:</dt>
                      <dd>{category?.name || 'Unknown'}</dd>
                    </div>
                    <div className="grid grid-cols-2">
                      <dt className="font-medium text-muted-foreground">Acquisition Date:</dt>
                      <dd>{new Date(asset.acquisitionDate).toLocaleDateString()}</dd>
                    </div>
                    <div className="grid grid-cols-2">
                      <dt className="font-medium text-muted-foreground">Original Cost:</dt>
                      <dd>{formatCurrency(asset.originalCost)}</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Disposal Information</h3>
                  <dl className="space-y-1">
                    <div className="grid grid-cols-2">
                      <dt className="font-medium text-muted-foreground">Disposal Date:</dt>
                      <dd>{new Date(disposalEntry.disposalDate).toLocaleDateString()}</dd>
                    </div>
                    <div className="grid grid-cols-2">
                      <dt className="font-medium text-muted-foreground">Reason:</dt>
                      <dd>{disposalEntry.reason}</dd>
                    </div>
                    <div className="grid grid-cols-2">
                      <dt className="font-medium text-muted-foreground">Disposed By:</dt>
                      <dd>{disposedBy?.name || 'Unknown'}</dd>
                    </div>
                    <div className="grid grid-cols-2">
                      <dt className="font-medium text-muted-foreground">Disposal Entry Date:</dt>
                      <dd>{new Date(disposalEntry.createdAt).toLocaleDateString()}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg mb-2">Financial Details</h3>
              <div className="bg-secondary/50 p-4 rounded-md border">
                <dl className="space-y-2">
                  <div className="grid grid-cols-2">
                    <dt className="font-medium">Net Book Value at Disposal:</dt>
                    <dd>{formatCurrency(disposalEntry.netBookValue)}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="font-medium">Disposal Proceeds:</dt>
                    <dd>{formatCurrency(disposalEntry.disposalProceeds)}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="font-medium">Disposal Costs:</dt>
                    <dd>{formatCurrency(disposalEntry.disposalCosts)}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="font-medium">Net Proceeds:</dt>
                    <dd>{formatCurrency(disposalEntry.disposalProceeds - disposalEntry.disposalCosts)}</dd>
                  </div>
                  <div className="grid grid-cols-2 pt-2 border-t">
                    <dt className="font-medium text-lg">Gain/(Loss) on Disposal:</dt>
                    <dd className={`text-lg font-bold ${isGain ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {isGain ? '+' : ''}{formatCurrency(disposalEntry.gainLoss)}
                    </dd>
                  </div>
                </dl>
              </div>
              
              {disposalEntry.notes && (
                <div className="mt-4">
                  <h4 className="font-medium mb-1">Notes:</h4>
                  <p className="text-foreground bg-secondary/50 p-2 rounded border">{disposalEntry.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg mb-2">Accounting Impact</h3>
              <div className="bg-secondary/50 p-4 rounded-md border">
                <h4 className="font-medium mb-2">Journal Entries:</h4>
                <div className="space-y-2">
                  <div>
                    <p className="font-medium">1. Remove asset from books:</p>
                    <ul className="list-disc list-inside pl-4 space-y-1">
                      <li>Dr. Accumulated Depreciation: {formatCurrency(asset.accumulatedDepreciation)}</li>
                      <li>Dr. Loss on Disposal: {!isGain ? formatCurrency(Math.abs(disposalEntry.gainLoss)) : '0.00'}</li>
                      <li>Cr. Asset Cost: {formatCurrency(asset.originalCost)}</li>
                      <li>Cr. Gain on Disposal: {isGain ? formatCurrency(disposalEntry.gainLoss) : '0.00'}</li>
                    </ul>
                  </div>
                  {disposalEntry.disposalProceeds > 0 && (
                    <div>
                      <p className="font-medium">2. Record cash received:</p>
                      <ul className="list-disc list-inside pl-4">
                        <li>Dr. Cash/Bank: {formatCurrency(disposalEntry.disposalProceeds)}</li>
                        <li>Cr. Disposal Proceeds: {formatCurrency(disposalEntry.disposalProceeds)}</li>
                      </ul>
                    </div>
                  )}
                  {disposalEntry.disposalCosts > 0 && (
                    <div>
                      <p className="font-medium">3. Record disposal costs:</p>
                      <ul className="list-disc list-inside pl-4">
                        <li>Dr. Disposal Costs: {formatCurrency(disposalEntry.disposalCosts)}</li>
                        <li>Cr. Cash/Bank: {formatCurrency(disposalEntry.disposalCosts)}</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handlePrint}
            className="flex items-center"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisposalDetailsDialog;
