import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Settings,
  Package,
  LogOut,
  Calculator,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  open: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const { user, logout, hasPermission, isProjectManager } = useAuth();

  const navItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      allowedRoles: ['admin', 'manager', 'user']
    },
    {
      name: 'Projects',
      icon: FolderKanban,
      href: '/projects',
      allowedRoles: ['admin', 'manager', 'user']
    },
    {
      name: 'Tasks',
      icon: CheckSquare,
      href: '/tasks',
      allowedRoles: ['admin', 'manager', 'user']
    },
    {
      name: 'Fixed Assets',
      icon: Calculator,
      href: '/fixed-assets',
      allowedRoles: ['admin', 'manager']
    },
    {
      name: 'Users',
      icon: Users,
      href: '/users',
      allowedRoles: ['admin']
    },
    {
      name: 'Inventory',
      icon: Package,
      href: '/inventory',
      allowedRoles: ['admin', 'manager']
    },
    {
      name: 'Reports',
      icon: BarChart3,
      href: '/reports',
      allowedRoles: ['admin', 'manager']
    },
    {
      name: 'Settings',
      icon: Settings,
      href: '/settings',
      allowedRoles: ['admin', 'manager', 'user']
    }
  ];

  const filteredNavItems = navItems.filter(item => 
    hasPermission(item.allowedRoles as ['admin' | 'manager' | 'user'])
  );

  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 bottom-0 z-10 transition-all duration-300 ease-in-out bg-background border-r border-border/40",
        open ? "w-64" : "w-0 -translate-x-full"
      )}
    >
      {open && (
        <div className="flex flex-col h-full py-6 overflow-auto">
          <nav className="px-4 flex-1">
            <ul className="space-y-1">
              {filteredNavItems.map((item) => (
                <li key={item.name}>
                  <NavLink 
                    to={item.href}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground hover:bg-secondary"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {user && (
            <div className="px-4 mt-6">
              <div className="p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="font-medium truncate">{user.name}</p>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                      {isProjectManager() && (
                        <Badge variant="outline" className="text-xs">Project Manager</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={logout}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
