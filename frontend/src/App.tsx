
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import MainLayout from "./components/layout/MainLayout";
import LoginPage from "./components/auth/LoginPage";
import UnauthorizedPage from "./components/auth/UnauthorizedPage";
import DashboardPage from "./components/dashboard/DashboardPage";
import ProjectsPage from "./components/projects/ProjectsPage";
import ProjectDetailsPage from "./components/projects/ProjectDetailsPage";
import TasksPage from "./components/tasks/TasksPage";
import TaskDetailsPage from "./components/tasks/TaskDetailsPage";
import UsersPage from "./components/users/UsersPage";
import UserDetailsPage from "./components/users/UserDetailsPage";
import ProfilePage from "./components/profile/ProfilePage";
import SettingsPage from "./components/settings/SettingsPage";
import ReportsPage from "./components/reports/ReportsPage";
import InventoryPage from "./components/inventory/InventoryPage";
import FixedAssetsPage from "./components/fixed-assets/FixedAssetsPage";

// Import the marketing pages
import LandingPage from "./pages/LandingPage";
import NovaLandingPage from "./pages/NovaLandingPage";
import AboutPage from "./pages/AboutPage";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public marketing pages */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/nova" element={<NovaLandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Protected routes */}
              <Route path="/dashboard" element={
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              } />
              
              <Route path="/projects" element={
                <MainLayout>
                  <ProjectsPage />
                </MainLayout>
              } />
              
              {/* Project details route */}
              <Route path="/projects/:projectId" element={
                <MainLayout>
                  <ProjectDetailsPage />
                </MainLayout>
              } />
              
              <Route path="/tasks" element={
                <MainLayout>
                  <TasksPage />
                </MainLayout>
              } />
              
              {/* Task details route */}
              <Route path="/tasks/:taskId" element={
                <MainLayout>
                  <TaskDetailsPage />
                </MainLayout>
              } />
              
              <Route path="/users" element={
                <MainLayout allowedRoles={['admin']}>
                  <UsersPage />
                </MainLayout>
              } />
              
              {/* User details route */}
              <Route path="/users/:userId" element={
                <MainLayout allowedRoles={['admin']}>
                  <UserDetailsPage />
                </MainLayout>
              } />
              
              {/* Reports route */}
              <Route path="/reports" element={
                <MainLayout allowedRoles={['admin', 'manager']}>
                  <ReportsPage />
                </MainLayout>
              } />
              
              {/* Inventory route */}
              <Route path="/inventory" element={
                <MainLayout allowedRoles={['admin', 'manager']}>
                  <InventoryPage />
                </MainLayout>
              } />
              
              {/* Fixed Assets route */}
              <Route path="/fixed-assets" element={
                <MainLayout allowedRoles={['admin', 'manager']}>
                  <FixedAssetsPage />
                </MainLayout>
              } />
              
              {/* Profile route */}
              <Route path="/profile" element={
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              } />
              
              {/* Settings route */}
              <Route path="/settings" element={
                <MainLayout>
                  <SettingsPage />
                </MainLayout>
              } />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
