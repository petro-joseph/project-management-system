
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FixedAsset } from '@/lib/types';
import { 
  getCategoryById, 
  getUserById, 
  getDepreciationEntriesByAsset,
  getAssetRevaluationsByAsset,
  formatCurrency
} from '@/lib/mockFixedAssets';
import { CalendarDays, Info, History, Calculator, User, Package, Printer } from 'lucide-react';

interface AssetDetailsDialogProps {
  asset: FixedAsset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AssetDetailsDialog: React.FC<AssetDetailsDialogProps> = ({ 
  asset, 
  open, 
  onOpenChange 
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const category = getCategoryById(asset.categoryId);
  const custodian = getUserById(asset.custodian);
  const depreciationEntries = getDepreciationEntriesByAsset(asset.id);
  const revaluations = getAssetRevaluationsByAsset(asset.id);
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Package className="mr-2 h-5 w-5" />
            {asset.name} ({asset.assetTag})
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="overview" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">
              <Info className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="depreciation">
              <Calculator className="mr-2 h-4 w-4" />
              Depreciation
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Info className="mr-2 h-4 w-4" /> Asset Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="divide-y divide-gray-200">
                    <div className="py-2 grid grid-cols-3">
                      <dt className="font-medium text-gray-500">Asset Tag</dt>
                      <dd className="col-span-2">{asset.assetTag}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="font-medium text-gray-500">Description</dt>
                      <dd className="col-span-2">{asset.description}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="font-medium text-gray-500">Category</dt>
                      <dd className="col-span-2">{category?.name || 'Unknown'}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="font-medium text-gray-500">Serial Number</dt>
                      <dd className="col-span-2">{asset.serialNumber || 'N/A'}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="font-medium text-gray-500">Status</dt>
                      <dd className="col-span-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {asset.status.replace('-', ' ')}
                        </span>
                      </dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="font-medium text-gray-500">Location</dt>
                      <dd className="col-span-2">{asset.location}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4" /> Dates & Financial Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="divide-y divide-gray-200">
                    <div className="py-2 grid grid-cols-3">
                      <dt className="font-medium text-gray-500">Acquisition Date</dt>
                      <dd className="col-span-2">{new Date(asset.acquisitionDate).toLocaleDateString()}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="font-medium text-gray-500">Original Cost</dt>
                      <dd className="col-span-2">{formatCurrency(asset.originalCost)}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="font-medium text-gray-500">Current Value</dt>
                      <dd className="col-span-2">{formatCurrency(asset.currentValue)}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="font-medium text-gray-500">Salvage Value</dt>
                      <dd className="col-span-2">{formatCurrency(asset.salvageValue)}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="font-medium text-gray-500">Useful Life</dt>
                      <dd className="col-span-2">{asset.usefulLife} years</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="font-medium text-gray-500">Depreciation Method</dt>
                      <dd className="col-span-2">
                        {asset.depreciationMethod.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="font-medium text-gray-500">Last Depreciation</dt>
                      <dd className="col-span-2">
                        {asset.lastDepreciationDate 
                          ? new Date(asset.lastDepreciationDate).toLocaleDateString() 
                          : 'Never'}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <User className="mr-2 h-4 w-4" /> Custodian & Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="divide-y divide-gray-200">
                    <div className="py-2 grid grid-cols-3">
                      <dt className="font-medium text-gray-500">Custodian</dt>
                      <dd className="col-span-2">{custodian?.name || 'Unknown'}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="font-medium text-gray-500">Created On</dt>
                      <dd className="col-span-2">{new Date(asset.createdAt).toLocaleDateString()}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="font-medium text-gray-500">Notes</dt>
                      <dd className="col-span-2">{asset.notes || 'No notes'}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="depreciation">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Depreciation History</CardTitle>
              </CardHeader>
              <CardContent>
                {depreciationEntries.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Book Value Before</TableHead>
                        <TableHead>Book Value After</TableHead>
                        <TableHead>Posting Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {depreciationEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{entry.period}</TableCell>
                          <TableCell>{formatCurrency(entry.amount)}</TableCell>
                          <TableCell>{formatCurrency(entry.bookValueBefore)}</TableCell>
                          <TableCell>{formatCurrency(entry.bookValueAfter)}</TableCell>
                          <TableCell>{new Date(entry.postingDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-4">No depreciation entries found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revaluation & Impairment History</CardTitle>
              </CardHeader>
              <CardContent>
                {revaluations.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Previous Value</TableHead>
                        <TableHead>New Value</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead>Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {revaluations.map((revaluation) => {
                        const change = revaluation.newValue - revaluation.previousValue;
                        const isIncrease = change > 0;
                        
                        return (
                          <TableRow key={revaluation.id}>
                            <TableCell>{new Date(revaluation.revaluationDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                revaluation.type === 'revaluation' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {revaluation.type}
                              </span>
                            </TableCell>
                            <TableCell>{formatCurrency(revaluation.previousValue)}</TableCell>
                            <TableCell>{formatCurrency(revaluation.newValue)}</TableCell>
                            <TableCell className={isIncrease ? 'text-green-600' : 'text-red-600'}>
                              {isIncrease ? '+' : ''}{formatCurrency(change)}
                            </TableCell>
                            <TableCell>{revaluation.reason}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-4">No revaluation or impairment history found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
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

export default AssetDetailsDialog;
