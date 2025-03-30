
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Building, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Star, 
  Clock, 
  BarChart, 
  Package, 
  ArrowLeft, 
  Calendar,
  Truck,
  ShoppingCart
} from 'lucide-react';
import { toast } from 'sonner';
import { getSupplierById, getSupplierItems } from '@/lib/mockData';
import { Supplier, InventoryItem } from '@/lib/types';

const SupplierDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [supplierItems, setSupplierItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupplierData = async () => {
      setLoading(true);
      try {
        // Simulate API request
        await new Promise(resolve => setTimeout(resolve, 600));
        
        if (id) {
          const supplierId = parseInt(id);
          const supplierData = getSupplierById(supplierId);
          if (supplierData) {
            setSupplier(supplierData);
            setSupplierItems(getSupplierItems(supplierId));
          } else {
            toast.error("Supplier not found");
            navigate('/inventory');
          }
        }
      } catch (error) {
        console.error('Error fetching supplier data:', error);
        toast.error("Failed to load supplier data");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierData();
  }, [id, navigate]);

  // Function to render star rating
  const renderRating = (rating: number = 0) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <Star 
            key={index} 
            className={`h-4 w-4 ${index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin-slow h-12 w-12 rounded-full border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium">Supplier not found</h3>
            <p className="text-muted-foreground">The requested supplier could not be found.</p>
            <Button onClick={() => navigate('/inventory')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Inventory
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/inventory')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Supplier Details</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/suppliers/${id}/edit`)}>
            Edit Supplier
          </Button>
          <Button onClick={() => navigate('/inventory/purchase-order/new')}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Create Purchase Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supplier Information Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{supplier.name}</CardTitle>
                <CardDescription>Supplier #{id}</CardDescription>
              </div>
              <Badge variant={supplier.performanceMetrics?.onTimeDeliveryRate > 80 ? "default" : "destructive"} 
                className={supplier.performanceMetrics?.onTimeDeliveryRate > 80 ? "bg-green-500 hover:bg-green-600" : ""}>
                {supplier.performanceMetrics?.onTimeDeliveryRate > 80 ? "Reliable" : "Review Needed"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{supplier.contactPerson}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{supplier.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{supplier.email}</span>
                    </div>
                    {supplier.website && (
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a href={`https://${supplier.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {supplier.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Address</h3>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{supplier.address}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Performance Rating</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Overall Rating</span>
                        {renderRating(supplier.rating)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">On-time Delivery</span>
                        <span className="font-medium">{supplier.performanceMetrics?.onTimeDeliveryRate}%</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full mt-1">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${supplier.performanceMetrics?.onTimeDeliveryRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Quality Rating</span>
                        {renderRating(supplier.performanceMetrics?.qualityRating)}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Response & Lead Time</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <div className="flex items-center mb-1">
                        <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm">Response Time</span>
                      </div>
                      <span className="font-medium">{supplier.performanceMetrics?.responseTime} hours</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center mb-1">
                        <Truck className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm">Lead Time</span>
                      </div>
                      <span className="font-medium">{supplier.performanceMetrics?.averageLeadTime} days</span>
                    </div>
                  </div>
                </div>

                {supplier.performanceMetrics?.lastEvaluation && (
                  <div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Last Evaluated: {new Date(supplier.performanceMetrics.lastEvaluation).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {supplier.notes && (
              <>
                <Separator className="my-4" />
                <div>
                  <h3 className="text-sm font-medium mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground">{supplier.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Supplier Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Supply Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/40 rounded-lg p-3 text-center">
                <Package className="h-5 w-5 mx-auto mb-1 text-primary" />
                <span className="block text-2xl font-bold">{supplierItems.length}</span>
                <span className="text-xs text-muted-foreground">Total Items</span>
              </div>
              <div className="bg-secondary/40 rounded-lg p-3 text-center">
                <BarChart className="h-5 w-5 mx-auto mb-1 text-primary" />
                <span className="block text-2xl font-bold">
                  ${supplierItems.reduce((sum, item) => sum + item.totalValue, 0).toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">Total Value</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-3">Recent Orders</h3>
              <div className="text-center py-6 text-muted-foreground text-sm">
                <p>No recent orders to display</p>
                <Button variant="outline" size="sm" className="mt-2">
                  View Order History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supplier Items */}
      <Card>
        <CardHeader>
          <CardTitle>Supplied Items</CardTitle>
          <CardDescription>{supplierItems.length} items from this supplier</CardDescription>
        </CardHeader>
        <CardContent>
          {supplierItems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplierItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>${item.costPerUnit.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span className={item.quantity <= (item.lowStockThreshold || 5) ? "text-destructive font-medium" : ""}>
                        {item.quantity} {item.unitOfMeasure}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <Package className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p>No items from this supplier yet</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button variant="outline">
            View All Items
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SupplierDetailView;
