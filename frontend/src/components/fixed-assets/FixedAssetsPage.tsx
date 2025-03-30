
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AssetRegister from './AssetRegister';
import AssetCategories from './AssetCategories';
import DepreciationSchedule from './DepreciationSchedule';
import DisposalReports from './DisposalReports';
import AssetsSummary from './AssetsSummary';
import { Plus, ShieldAlert } from 'lucide-react';
import AddEditAssetDialog from './AddEditAssetDialog';
import AddEditCategoryDialog from './AddEditCategoryDialog';
import { useAuth } from '@/context/AuthContext';
import RBACErrorBoundary from '../shared/RBACErrorBoundary';
import AccessMessage from '../shared/AccessMessage';

const FixedAssetsPage = () => {
  const [showAddAssetDialog, setShowAddAssetDialog] = useState(false);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const { role, hasPermission } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only admins and managers should have access to this page
  const canManageAssets = hasPermission(['admin', 'manager']);
  
  // Additional fine-grained permissions
  const canAddAssets = hasPermission(['admin', 'manager']);
  const canAddCategories = hasPermission(['admin']);
  const canViewDisposals = hasPermission(['admin', 'manager']);

  // Handler to close the dialog properly
  const handleAddAssetDialogClose = (open: boolean) => {
    setShowAddAssetDialog(open);
  };

  // Handler to close the category dialog properly
  const handleAddCategoryDialogClose = (open: boolean) => {
    setShowAddCategoryDialog(open);
  };

  return (
    <RBACErrorBoundary 
      requiredPermission="view"
      resourceType="project"
      fallback={
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
          <AccessMessage
            type="error"
            title="You don't have permission to view Fixed Assets"
            description="Please contact your administrator if you need access to this feature."
            showRole={true}
          />
        </div>
      }
    >
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Fixed Asset Management</h1>
          <p className="text-muted-foreground">
            Manage and track your organization's fixed assets
          </p>
          
          {mounted && role === 'manager' && (
            <AccessMessage
              type="info"
              title="Manager Access"
              description="As a manager, you can view and manage assets, but only administrators can add categories or dispose of fully-depreciated assets."
              showRole={true}
            />
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
            <TabsList className="grid h-9 grid-cols-3 sm:grid-cols-5 w-full sm:w-auto">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="register">Asset Register</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="depreciation">Depreciation</TabsTrigger>
              <TabsTrigger value="disposals">Disposals</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              {activeTab === "register" && canAddAssets && (
                <Button onClick={() => setShowAddAssetDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Asset
                </Button>
              )}
              {activeTab === "categories" && canAddCategories && (
                <Button onClick={() => setShowAddCategoryDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Category
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="summary" className="space-y-4 mt-4">
            <AssetsSummary />
          </TabsContent>

          <TabsContent value="register" className="space-y-4 mt-4">
            <AssetRegister />
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-4 mt-4">
            <RBACErrorBoundary 
              requiredPermission="view" 
              resourceType="project"
              fallback={
                <AccessMessage
                  type="warning"
                  title="Limited Access"
                  description="You don't have permission to view asset categories."
                  showRole={true}
                />
              }
            >
              <AssetCategories />
            </RBACErrorBoundary>
          </TabsContent>
          
          <TabsContent value="depreciation" className="space-y-4 mt-4">
            <DepreciationSchedule />
          </TabsContent>
          
          <TabsContent value="disposals" className="space-y-4 mt-4">
            {canViewDisposals ? (
              <DisposalReports />
            ) : (
              <AccessMessage
                type="warning"
                title="Limited Access"
                description="You don't have permission to view asset disposals."
                showRole={true}
              />
            )}
          </TabsContent>
        </Tabs>

        <AddEditAssetDialog 
          open={showAddAssetDialog} 
          onOpenChange={handleAddAssetDialogClose} 
        />

        <AddEditCategoryDialog 
          open={showAddCategoryDialog} 
          onOpenChange={handleAddCategoryDialogClose}
        />
      </div>
    </RBACErrorBoundary>
  );
};

export default FixedAssetsPage;
