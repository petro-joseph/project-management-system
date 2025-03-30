import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Eye,
  Pencil,
  Plus,
  Search,
  Filter,
  Trash,
  Trash2
} from 'lucide-react';
import { InventoryItem } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import {
  getInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
} from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddEditInventoryItemDialog from './AddEditInventoryItemDialog';
import InventoryLocationsPage from './InventoryLocationsPage';
import SuppliersPage from './SuppliersPage';
import InventoryReportsPage from './InventoryReportsPage';
import InventorySummary from './InventorySummary';
import ConfirmationDialog from '@/components/shared/ConfirmationDialog';

const InventoryPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addItemOpen, setAddItemOpen] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const canManageInventory = user && ['admin', 'manager'].includes(user.role);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [confirmArchive, setConfirmArchive] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setInventoryItems(getInventoryItems());
      } catch (error) {
        console.error('Error fetching inventory:', error);
        toast.error("Failed to load inventory. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [user]);

  const handleCreateInventoryItem = async (data: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const newItem: Omit<InventoryItem, 'id'> = {
        name: data.name,
        description: data.description,
        quantity: parseInt(data.quantity, 10),
        unitOfMeasure: data.unitOfMeasure,
        location: data.location,
        costPerUnit: parseFloat(data.costPerUnit),
        totalValue: parseFloat(data.costPerUnit) * parseInt(data.quantity, 10),
        projectId: data.projectId ? parseInt(data.projectId) : null,
        supplierId: data.supplierId ? parseInt(data.supplierId) : undefined,
        purchaseDate: new Date().toISOString(),
        supplier: "Unknown", // Default value
        lowStockThreshold: parseInt(data.lowStockThreshold, 10),
      };

      const createdItem = createInventoryItem(newItem);
      setInventoryItems([createdItem, ...inventoryItems]);
      
      toast.success(`${createdItem.name} has been added`, {
        description: "The inventory item has been successfully created."
      });
      
      // Close the dialog
      setAddItemOpen(false);
      setEditItem(null);
    } catch (error) {
      console.error('Error creating inventory item:', error);
      toast.error("Failed to create inventory item. Please try again.");
    }
  };

  const handleUpdateInventoryItem = async (data: any) => {
    if (!editItem) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedItem: InventoryItem = {
        ...editItem,
        name: data.name,
        description: data.description,
        quantity: parseInt(data.quantity, 10),
        unitOfMeasure: data.unitOfMeasure,
        location: data.location,
        costPerUnit: parseFloat(data.costPerUnit),
        totalValue: parseFloat(data.costPerUnit) * parseInt(data.quantity, 10),
        projectId: data.projectId ? parseInt(data.projectId) : null,
        supplierId: data.supplierId ? parseInt(data.supplierId) : undefined,
        lowStockThreshold: parseInt(data.lowStockThreshold, 10),
      };

      setInventoryItems(inventoryItems.map(item => item.id === editItem.id ? updatedItem : item));
      toast.success(`${updatedItem.name} has been updated`, {
        description: "The inventory item has been successfully modified."
      });
      
      // Close the dialog after successful update
      setEditItem(null);
      setAddItemOpen(false);
    } catch (error) {
      console.error('Error updating inventory item:', error);
      toast.error("Failed to update inventory item. Please try again.");
    }
  };

  const handleDeleteInventoryItem = async (itemId: number) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find the item to get its name
      const itemName = inventoryItems.find(i => i.id === itemId)?.name || 'Item';
      
      // Filter out the deleted item
      setInventoryItems(inventoryItems.filter(item => item.id !== itemId));
      
      toast.success(`${itemName} has been deleted`, {
        description: "The inventory item has been removed from the database."
      });
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      toast.error("Failed to delete inventory item. Please try again.");
    }
  };

  const handleViewItemDetails = (itemId: number) => {
    navigate(`/inventory/${itemId}`);
  };

  const handleViewSupplierDetails = (supplierId: number) => {
    navigate(`/suppliers/${supplierId}`);
  };

  const filteredItems = searchQuery
    ? inventoryItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : inventoryItems;

  // Handler for dialog open state changes
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setAddItemOpen(false);
      setEditItem(null);
    } else {
      setAddItemOpen(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        <p className="text-muted-foreground">
          Manage and track your inventory items
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row justify-between w-full gap-4">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full md:w-auto">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          {activeTab === "items" && canManageInventory && (
            <div className="flex items-center gap-2">
              <Button onClick={() => {
                setEditItem(null);
                setAddItemOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                New Item
              </Button>
            </div>
          )}
        </div>
        
        <TabsContent value="summary" className="space-y-4 mt-4">
          <InventorySummary />
        </TabsContent>
        
        <TabsContent value="items" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <CardDescription>
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
            </CardDescription>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search items..."
                  className="pl-8 w-full sm:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Card className="glass-card">
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin-slow h-12 w-12 rounded-full border-t-2 border-primary"></div>
                </div>
              ) : filteredItems.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Unit Value</TableHead>
                        <TableHead>Total Value</TableHead>
                        <TableHead className="w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>
                            <span className={item.quantity <= (item.lowStockThreshold || 5) ? "text-destructive font-medium" : ""}>
                              {item.quantity} {item.unitOfMeasure}
                            </span>
                          </TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>${item.costPerUnit.toFixed(2)}</TableCell>
                          <TableCell>${item.totalValue.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleViewItemDetails(item.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setEditItem(item)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setConfirmDelete(item.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Trash className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No inventory items found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? `No items matching "${searchQuery}"`
                      : "You don't have any inventory items yet"}
                  </p>
                  {canManageInventory && (
                    <Button onClick={() => {
                      setEditItem(null);
                      setAddItemOpen(true);
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first item
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="locations" className="mt-4">
          <InventoryLocationsPage />
        </TabsContent>
        
        <TabsContent value="suppliers" className="mt-4">
          <SuppliersPage />
        </TabsContent>
        
        <TabsContent value="reports" className="mt-4">
          <InventoryReportsPage />
        </TabsContent>
      </Tabs>
      
      <AddEditInventoryItemDialog
        open={addItemOpen || !!editItem}
        onOpenChange={handleDialogOpenChange}
        item={editItem || undefined}
        onSave={editItem ? handleUpdateInventoryItem : handleCreateInventoryItem}
      />
      
      <ConfirmationDialog
        open={confirmDelete !== null}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        onConfirm={() => confirmDelete !== null && handleDeleteInventoryItem(confirmDelete)}
        title="Delete Inventory Item"
        description="Are you sure you want to delete this inventory item? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
        icon={<Trash2 className="h-5 w-5 text-destructive" />}
      />
    </div>
  );
};

export default InventoryPage;
