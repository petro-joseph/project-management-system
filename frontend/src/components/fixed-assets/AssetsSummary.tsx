
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  getFixedAssets, 
  getAssetCategories, 
  getDisposedAssets, 
  formatCurrency 
} from '@/lib/mockFixedAssets';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Calculator, BadgeDollarSign, AlertTriangle, BarChart3 } from 'lucide-react';

const AssetsSummary = () => {
  const assets = getFixedAssets();
  const categories = getAssetCategories();
  
  // Calculate summary values
  const totalAssets = assets.length;
  const activeAssets = assets.filter(asset => asset.status === 'active').length;
  const disposedAssets = getDisposedAssets().length;
  const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);

  // Data for Asset Status Distribution chart
  const statusDistribution = [
    { name: 'Active', value: assets.filter(asset => asset.status === 'active').length },
    { name: 'Fully Depreciated', value: assets.filter(asset => asset.status === 'fully-depreciated').length },
    { name: 'Disposed', value: assets.filter(asset => asset.status === 'disposed').length },
    { name: 'Impaired', value: assets.filter(asset => asset.status === 'impaired').length }
  ];

  // Data for Asset by Category chart
  const assetsByCategory = categories.map(category => {
    const assetsInCategory = assets.filter(asset => asset.categoryId === category.id);
    return {
      name: category.name,
      count: assetsInCategory.length,
      value: assetsInCategory.reduce((sum, asset) => sum + asset.currentValue, 0)
    };
  }).sort((a, b) => b.value - a.value);

  // Calculate depreciation over time
  const currentYear = new Date().getFullYear();
  const depreciationForecast = Array.from({ length: 5 }).map((_, index) => {
    const year = currentYear + index;
    // Simple calculation - could be refined with actual depreciation formulas
    const yearlyDepreciation = assets
      .filter(asset => asset.status === 'active')
      .reduce((sum, asset) => {
        // Rough estimate - reduce by depreciation rate until fully depreciated
        const remainingYears = asset.usefulLife - (year - new Date(asset.acquisitionDate).getFullYear());
        if (remainingYears > 0) {
          return sum + (asset.currentValue / remainingYears);
        }
        return sum;
      }, 0);
    
    return {
      name: year.toString(),
      value: yearlyDepreciation
    };
  });

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Calculator className="h-4 w-4" />
              <span>Total Assets</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAssets}</div>
            <p className="text-muted-foreground text-sm mt-1">
              {activeAssets} active ({Math.round((activeAssets / totalAssets) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center space-x-2">
              <BadgeDollarSign className="h-4 w-4" />
              <span>Total Value</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-muted-foreground text-sm mt-1">
              Net book value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Disposed Assets</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{disposedAssets}</div>
            <p className="text-muted-foreground text-sm mt-1">
              Last 12 months
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{categories.length}</div>
            <p className="text-muted-foreground text-sm mt-1">
              Asset categories
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Asset Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} assets`, 'Count']}
                  contentStyle={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Assets by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={assetsByCategory.slice(0, 5)}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'var(--foreground)' }}
                  tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                />
                <YAxis tick={{ fill: 'var(--foreground)' }} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Value']}
                  contentStyle={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                />
                <Bar dataKey="value" fill="#0088FE" name="Asset Value" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Depreciation Forecast (5 Years)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={depreciationForecast}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" tick={{ fill: 'var(--foreground)' }} />
                <YAxis tick={{ fill: 'var(--foreground)' }} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Depreciation']}
                  contentStyle={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                />
                <Bar dataKey="value" fill="#00C49F" name="Yearly Depreciation" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssetsSummary;
