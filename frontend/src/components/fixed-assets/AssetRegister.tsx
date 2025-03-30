
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, FileDown, FileText, Edit, Trash, AlertCircle } from 'lucide-react';
import { FixedAsset, AssetStatus } from '@/lib/types';
import { 
  getFixedAssets, 
  getActiveAssets, 
  getDisposedAssets, 
  getFullyDepreciatedAssets, 
  getCategoryById, 
  getUserById, 
  formatCurrency 
} from '@/lib/mockFixedAssets';
import AssetDetailsDialog from './AssetDetailsDialog';
import AddEditAssetDialog from './AddEditAssetDialog';
import DisposalDialog from './DisposalDialog';
import ConfirmationDialog from '@/components/shared/ConfirmationDialog';

const AssetRegister = () => {
  const [assets, setAssets] = useState<FixedAsset[]>(getFixedAssets());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<FixedAsset | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDisposalDialog, setShowDisposalDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const filterAssets = () => {
    let filteredAssets: FixedAsset[] = [];
    
    switch (statusFilter) {
      case "active":
        filteredAssets = getActiveAssets();
        break;
      case "fully-depreciated":
        filteredAssets = getFullyDepreciatedAssets();
        break;
      case "disposed":
        filteredAssets = getDisposedAssets();
        break;
      default:
        filteredAssets = getFixedAssets();
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredAssets = filteredAssets.filter(asset => 
        asset.name.toLowerCase().includes(query) || 
        asset.assetTag.toLowerCase().includes(query) ||
        asset.description.toLowerCase().includes(query)
      );
    }
    
    return filteredAssets;
  };

  const handleViewDetails = (asset: FixedAsset) => {
    setSelectedAsset(asset);
    setShowDetailsDialog(true);
  };

  const handleEdit = (asset: FixedAsset) => {
    setSelectedAsset(asset);
    setShowEditDialog(true);
  };

  const handleDisposal = (asset: FixedAsset) => {
    setSelectedAsset(asset);
    setShowDisposalDialog(true);
  };

  const handleDelete = (asset: FixedAsset) => {
    setSelectedAsset(asset);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (selectedAsset) {
      const updatedAssets = assets.filter(a => a.id !== selectedAsset.id);
      setAssets(updatedAssets);
      setShowDeleteDialog(false);
    }
  };

  const getStatusBadgeClass = (status: AssetStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'fully-depreciated':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400';
      case 'disposed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'impaired':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  const displayedAssets = filterAssets();

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search assets by name, tag, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select
              defaultValue="all"
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assets</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="fully-depreciated">Fully Depreciated</SelectItem>
                <SelectItem value="disposed">Disposed</SelectItem>
                <SelectItem value="impaired">Impaired</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-background rounded-md border border-border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Tag</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Acquisition Date</TableHead>
              <TableHead>Original Cost</TableHead>
              <TableHead>NBV</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedAssets.length > 0 ? (
              displayedAssets.map((asset) => {
                const category = getCategoryById(asset.categoryId);
                return (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.assetTag}</TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{category?.name || 'Unknown'}</TableCell>
                    <TableCell>{new Date(asset.acquisitionDate).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(asset.originalCost)}</TableCell>
                    <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(asset.status)}`}>
                        {asset.status.replace('-', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(asset)}>
                            <FileText className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(asset)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          {asset.status === 'active' && (
                            <DropdownMenuItem onClick={() => handleDisposal(asset)}>
                              <AlertCircle className="mr-2 h-4 w-4" /> Record Disposal
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDelete(asset)}
                            className="text-destructive dark:text-red-400"
                          >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No assets found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedAsset && (
        <>
          <AssetDetailsDialog 
            asset={selectedAsset}
            open={showDetailsDialog}
            onOpenChange={setShowDetailsDialog}
          />
          
          <AddEditAssetDialog 
            asset={selectedAsset}
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
          />
          
          <DisposalDialog 
            asset={selectedAsset}
            open={showDisposalDialog}
            onOpenChange={setShowDisposalDialog}
          />
          
          <ConfirmationDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            title="Delete Asset"
            description={`Are you sure you want to delete ${selectedAsset.name}? This action cannot be undone.`}
            confirmLabel="Delete"
            confirmVariant="destructive"
            onConfirm={confirmDelete}
            icon={<Trash className="h-5 w-5 text-red-500" />}
          />
        </>
      )}
    </div>
  );
};

export default AssetRegister;
