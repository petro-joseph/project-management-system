
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { runRBACTests } from '@/lib/rbacTests';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Settings2, Monitor, Bell, Accessibility } from 'lucide-react';
import AccessMessage from '../shared/AccessMessage';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { user, role, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = React.useState("appearance");
  
  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme} mode`);
  };
  
  const handleRunRBACTests = () => {
    const results = runRBACTests();
    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;
    
    if (passedTests === totalTests) {
      toast.success(`RBAC Tests: ${passedTests}/${totalTests} passed`, {
        description: "All role-based access control tests passed successfully."
      });
    } else {
      toast.warning(`RBAC Tests: ${passedTests}/${totalTests} passed`, {
        description: "Some role-based access control tests failed. Check console for details."
      });
    }
  };

  const isAdmin = role === 'admin';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Customize your application preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
          <TabsList className="grid h-9 grid-cols-3 lg:grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <span className="hidden md:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2">
              <Accessibility className="h-4 w-4" />
              <span className="hidden md:inline">Accessibility</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="security" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden md:inline">Security</span>
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Customize the appearance of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                  <span>Dark Mode</span>
                  <span className="text-sm text-muted-foreground">Switch between light and dark themes</span>
                </Label>
                <Switch
                  id="dark-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={handleThemeChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage your notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                  <span>Email Notifications</span>
                  <span className="text-sm text-muted-foreground">Receive updates via email</span>
                </Label>
                <Switch
                  id="email-notifications"
                  defaultChecked={true}
                  onCheckedChange={() => toast.success("Email notification setting saved")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="task-notifications" className="flex flex-col space-y-1">
                  <span>Task Notifications</span>
                  <span className="text-sm text-muted-foreground">Get notified about task assignments and updates</span>
                </Label>
                <Switch
                  id="task-notifications"
                  defaultChecked={true}
                  onCheckedChange={() => toast.success("Task notification setting saved")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Settings</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="reduced-animations" className="flex flex-col space-y-1">
                  <span>Reduced Animations</span>
                  <span className="text-sm text-muted-foreground">Minimize motion for a more comfortable experience</span>
                </Label>
                <Switch
                  id="reduced-animations"
                  defaultChecked={false}
                  onCheckedChange={() => toast.success("Accessibility setting saved")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="security" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage role-based access control and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <span>Role-Based Access Control Tests</span>
                    <span className="text-sm text-muted-foreground">
                      Run tests to ensure RBAC is functioning correctly
                    </span>
                  </div>
                  <Button onClick={handleRunRBACTests}>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Run RBAC Tests
                  </Button>
                </div>
                
                <AccessMessage
                  type="info"
                  title="Admin Access"
                  description="As an administrator, you have full access to all system features and can manage role-based permissions."
                  showRole={true}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default SettingsPage;
