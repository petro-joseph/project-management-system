
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { 
  Map, MapPin, Building, Warehouse, Package, PlusCircle, Edit, 
  Trash2, MoreHorizontal, ArrowUpDown, Search
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { InventoryLocation, User } from '@/lib/types';
import { AddEditLocationDialog } from './AddEditLocationDialog';
import { DeleteConfirmationDialog } from '../shared/DeleteConfirmationDialog';

// Mock locations data
const mockLocations: InventoryLocation[] = [
  {
    id: 1,
    name: 'Main Warehouse',
    address: '123 Storage Blvd, Warehouse District, CA 90210',
    type: 'warehouse',
    manager: 2,
    capacity: 10000,
    currentUtilization: 68
  },
  {
    id: 2,
    name: 'Project Site A',
    address: '456 Construction Ave, Downtown, CA 90211',
    type: 'site',
    manager: 3,
    capacity: 2000,
    currentUtilization: 45
  },
  {
    id: 3,
    name: 'Secondary Storage',
    address: '789 Backup St, Industrial Zone, CA 90212',
    type: 'warehouse',
    manager: 4,
    capacity: 5000,
    currentUtilization: 32
  },
  {
    id: 4,
    name: 'Mobile Unit 1',
    type: 'vehicle',
    manager: 5,
    capacity: 500,
    currentUtilization: 85
  }
];

// Mock users for manager selection
const mockUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', createdAt: '2023-01-01' },
  { id: 2, name: 'John Manager', email: 'john@example.com', role: 'manager', createdAt: '2023-01-02' },
  { id: 3, name: 'Alice Manager', email: 'alice@example.com', role: 'manager', createdAt: '2023-01-03' },
  { id: 4, name: 'Bob Manager', email: 'bob@example.com', role: 'manager', createdAt: '2023-01-04' },
  { id: 5, name: 'Carol User', email: 'carol@example.com', role: 'user', createdAt: '2023-01-05' }
];

const InventoryLocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<InventoryLocation[]>(mockLocations);
  const [filteredLocations, setFilteredLocations] = useState<InventoryLocation[]>(mockLocations);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [locationForEdit, setLocationForEdit] = useState<InventoryLocation | null>(null);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  
  const { toast: shadcnToast } = useToast();

  // Function to get manager name by ID
  const getManagerName = (managerId?: number): string => {
    if (!managerId) return 'Unassigned';
    const manager = mockUsers.find(u => u.id === managerId);
    return manager ? manager.name : 'Unknown Manager';
  };

  // Apply filters and sorting
  useEffect(() => {
    let result = [...locations];
    
    // Search filter
    if (searchTerm) {
      result = result.filter(location => 
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Type filter
    if (typeFilter) {
      result = result.filter(location => location.type === typeFilter);
    }
    
    // Sorting
    if (sortBy) {
      result.sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'type':
            comparison = a.type.localeCompare(b.type);
            break;
          case 'utilization':
            comparison = (a.currentUtilization || 0) - (b.currentUtilization || 0);
            break;
          case 'capacity':
            comparison = (a.capacity || 0) - (b.capacity || 0);
            break;
          default:
            break;
        }
        
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    
    setFilteredLocations(result);
  }, [locations, searchTerm, typeFilter, sortBy, sortDirection]);

  // Handler for adding a new location
  const handleAddLocation = () => {
    setLocationForEdit(null);
    setIsAddEditDialogOpen(true);
  };

  // Handler for editing a location
  const handleEditLocation = (location: InventoryLocation) => {
    setLocationForEdit(location);
    setIsAddEditDialogOpen(true);
  };

  // Handler for deleting a location
  const handleDeleteClick = (id: number) => {
    setSelectedLocationId(id);
    setIsDeleteDialogOpen(true);
  };

  // Handler for confirming deletion
  const handleConfirmDelete = () => {
    if (selectedLocationId) {
      setLocations(prev => prev.filter(location => location.id !== selectedLocationId));
      toast.success("Location deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedLocationId(null);
    }
  };

  // Handler for saving location (add/edit)
  const handleSaveLocation = (location: InventoryLocation) => {
    if (location.id) {
      // Edit existing location
      setLocations(prev =>
        prev.map(l => (l.id === location.id ? location : l))
      );
      toast.success("Location updated successfully");
    } else {
      // Add new location
      const newLocation = {
        ...location,
        id: Math.max(0, ...locations.map(l => l.id)) + 1
      };
      setLocations(prev => [...prev, newLocation]);
      toast.success("Location added successfully");
    }
    setIsAddEditDialogOpen(false);
  };

  // Handler for refreshing locations data
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Locations data refreshed");
    }, 800);
  };

  // Handler for toggling sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Get location icon based on type
  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'warehouse':
        return <Warehouse className="h-5 w-5 text-primary" />;
      case 'site':
        return <Building className="h-5 w-5 text-primary" />;
      case 'store':
        return <Package className="h-5 w-5 text-primary" />;
      case 'vehicle':
        return <Map className="h-5 w-5 text-primary" />;
      default:
        return <MapPin className="h-5 w-5 text-primary" />;
    }
  };

  // Format location type for display
  const formatLocationType = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Locations</h1>
        <p className="text-muted-foreground">
          Manage storage locations for your inventory items
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search locations..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={typeFilter === null ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setTypeFilter(null)}
            >
              All
            </Button>
            <Button 
              variant={typeFilter === 'warehouse' ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setTypeFilter('warehouse')}
            >
              <Warehouse className="mr-1 h-4 w-4" /> Warehouses
            </Button>
            <Button 
              variant={typeFilter === 'site' ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setTypeFilter('site')}
            >
              <Building className="mr-1 h-4 w-4" /> Sites
            </Button>
            <Button 
              variant={typeFilter === 'vehicle' ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setTypeFilter('vehicle')}
            >
              <Map className="mr-1 h-4 w-4" /> Vehicles
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <ArrowUpDown className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button onClick={handleAddLocation}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Location
          </Button>
        </div>
      </div>

      {/* Locations Table */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-lg">Storage Locations</CardTitle>
          <CardDescription>
            Manage where your inventory items are stored
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" className="p-0 hover:bg-transparent hover:underline" onClick={() => handleSort('name')}>
                      Location
                      {sortBy === 'name' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 hover:bg-transparent hover:underline" onClick={() => handleSort('type')}>
                      Type
                      {sortBy === 'type' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Manager</TableHead>
                  <TableHead className="hidden lg:table-cell">Address</TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 hover:bg-transparent hover:underline" onClick={() => handleSort('utilization')}>
                      Capacity
                      {sortBy === 'utilization' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                            {getLocationIcon(location.type)}
                          </div>
                          <div>
                            <p className="font-medium">{location.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatLocationType(location.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{getManagerName(location.manager)}</TableCell>
                      <TableCell className="hidden lg:table-cell">{location.address || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-xs">
                            <span>{location.currentUtilization}%</span>
                            <span>{location.capacity?.toLocaleString() || 'Unspecified'}</span>
                          </div>
                          <Progress 
                            value={location.currentUtilization || 0} 
                            className="h-2"
                            indicatorClassName={
                              location.currentUtilization && location.currentUtilization > 90 
                                ? 'bg-destructive' 
                                : location.currentUtilization && location.currentUtilization > 75 
                                ? 'bg-warning' 
                                : ''
                            }
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditLocation(location)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(location.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <MapPin className="h-8 w-8 mb-2" />
                        <p>No locations found</p>
                        <p className="text-sm">Try changing your filters or add a new location</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="py-3">
          <p className="text-sm text-muted-foreground">
            Showing {filteredLocations.length} of {locations.length} locations
          </p>
        </CardFooter>
      </Card>

      {/* Add/Edit Location Dialog */}
      <AddEditLocationDialog
        open={isAddEditDialogOpen}
        onOpenChange={setIsAddEditDialogOpen}
        initialData={locationForEdit}
        onSave={handleSaveLocation}
        users={mockUsers}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Location"
        description="Are you sure you want to delete this location? This will not delete any inventory items stored at this location, but they will need to be reassigned."
      />
    </div>
  );
};

export default InventoryLocationsPage;
