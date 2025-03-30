
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
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileDown, Edit, Trash, Clock, CheckCircle2 } from 'lucide-react';
import { AssetCategory } from '@/lib/types';
import { getAssetCategories, getAssetsByCategory } from '@/lib/mockFixedAssets';
import AddEditCategoryDialog from './AddEditCategoryDialog';
import ConfirmationDialog from '@/components/shared/ConfirmationDialog';

const AssetCategories = () => {
  const [categories] = useState<AssetCategory[]>(getAssetCategories());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const filterCategories = () => {
    if (!searchQuery) return categories;
    
    const query = searchQuery.toLowerCase();
    return categories.filter(category => 
      category.name.toLowerCase().includes(query) || 
      category.description.toLowerCase().includes(query)
    );
  };

  const handleEdit = (category: AssetCategory) => {
    setSelectedCategory(category);
    setShowEditDialog(true);
  };

  const handleDelete = (category: AssetCategory) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async (): Promise<void> => {
    setShowDeleteDialog(false);
  };

  const getAssetCountInCategory = (categoryId: number) => {
    return getAssetsByCategory(categoryId).length;
  };

  const displayedCategories = filterCategories();

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
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
              <TableHead>Category Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Default Useful Life</TableHead>
              <TableHead>Depreciation Method</TableHead>
              <TableHead>Salvage Value %</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assets</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedCategories.length > 0 ? (
              displayedCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category.defaultUsefulLifeMin}-{category.defaultUsefulLifeMax} years</TableCell>
                  <TableCell>
                    {category.defaultDepreciationMethod.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </TableCell>
                  <TableCell>{category.defaultSalvageValuePercent}%</TableCell>
                  <TableCell>
                    {category.isActive ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                        <Clock className="mr-1 h-3 w-3" /> Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{getAssetCountInCategory(category.id)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(category)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(category)}
                          className="text-destructive dark:text-red-400"
                          disabled={getAssetCountInCategory(category.id) > 0}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedCategory && (
        <>
          <AddEditCategoryDialog 
            category={selectedCategory}
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
          />
          
          <ConfirmationDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            title="Delete Category"
            description={`Are you sure you want to delete ${selectedCategory.name}? This action cannot be undone.`}
            confirmLabel="Delete"
            onConfirm={confirmDelete}
            icon={<Trash className="h-5 w-5 text-red-500" />}
          />
        </>
      )}
    </div>
  );
};

export default AssetCategories;
