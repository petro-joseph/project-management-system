
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, BarChart2, Users, Calendar, Package, Layers, Shield, Clock, Settings, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center">
            <span className="font-medium text-lg text-primary">Nova ERP</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
            <Link to="/features" className="text-sm font-medium text-primary transition-colors">Features</Link>
            <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" size="sm">Log in</Button>
            </Link>
            <Link to="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Powerful Features for Modern Businesses</h1>
          <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
            Everything you need to streamline operations and boost productivity in one integrated platform.
          </p>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:max-w-3xl mx-auto mb-12">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="p-0">
              <div className="grid gap-8 md:grid-cols-2 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Project Management</h2>
                  <ul className="space-y-4">
                    {[
                      "Create and manage multiple projects simultaneously",
                      "Set project milestones and deadlines with visual timelines",
                      "Assign team members to specific projects",
                      "Track project progress with real-time status updates",
                      "Generate detailed project reports",
                      "Budget tracking and cost management"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link to="/login">
                      <Button className="gap-2">
                        Try Project Management
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-border shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=1600" 
                    alt="Project Management" 
                    className="w-full h-full object-cover aspect-video" 
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tasks" className="p-0">
              <div className="grid gap-8 md:grid-cols-2 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Task Management</h2>
                  <ul className="space-y-4">
                    {[
                      "Create tasks with detailed descriptions and requirements",
                      "Assign tasks to team members with due dates",
                      "Prioritize tasks by urgency and importance",
                      "Set dependencies between related tasks",
                      "Track time spent on each task",
                      "Automated notifications for upcoming deadlines"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link to="/login">
                      <Button className="gap-2">
                        Try Task Management
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-border shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1600" 
                    alt="Task Management" 
                    className="w-full h-full object-cover aspect-video" 
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="inventory" className="p-0">
              <div className="grid gap-8 md:grid-cols-2 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Inventory Management</h2>
                  <ul className="space-y-4">
                    {[
                      "Track stock levels in real-time across multiple locations",
                      "Set up automatic reorder points for essential items",
                      "Barcode scanning for quick inventory updates",
                      "Detailed inventory reports and analytics",
                      "Supplier management and purchase ordering",
                      "Inventory valuation and cost tracking"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link to="/login">
                      <Button className="gap-2">
                        Try Inventory Management
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-border shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=1600" 
                    alt="Inventory Management" 
                    className="w-full h-full object-cover aspect-video" 
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="users" className="p-0">
              <div className="grid gap-8 md:grid-cols-2 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">User Management</h2>
                  <ul className="space-y-4">
                    {[
                      "Role-based access control for secure user management",
                      "Create custom user roles with specific permissions",
                      "Track user activity and performance metrics",
                      "Set user availability and manage workloads",
                      "Team collaboration features and messaging",
                      "User onboarding and training resources"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link to="/login">
                      <Button className="gap-2">
                        Try User Management
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-border shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600" 
                    alt="User Management" 
                    className="w-full h-full object-cover aspect-video" 
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* All Features Grid */}
      <section className="py-20 bg-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">All Features</h2>
            <p className="text-lg text-muted-foreground max-w-[700px] mx-auto">
              Nova ERP is packed with features to help you run your business more efficiently
            </p>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Project Management",
                description: "Create, organize, and track projects from start to finish",
                icon: BarChart2,
              },
              {
                title: "Task Tracking",
                description: "Assign and monitor task progress with deadlines and priorities",
                icon: Clock,
              },
              {
                title: "User Management",
                description: "Manage team members with role-based access controls",
                icon: Users,
              },
              {
                title: "Calendar & Scheduling",
                description: "Plan your work with integrated calendars and scheduling",
                icon: Calendar,
              },
              {
                title: "Inventory Control",
                description: "Track stock levels and manage inventory across locations",
                icon: Package,
              },
              {
                title: "Reporting & Analytics",
                description: "Generate insights with customizable reports and dashboards",
                icon: FileText,
              },
              {
                title: "Workflow Automation",
                description: "Automate repetitive tasks and streamline processes",
                icon: Layers,
              },
              {
                title: "Security & Permissions",
                description: "Keep your data secure with advanced security features",
                icon: Shield,
              },
              {
                title: "Customization Options",
                description: "Configure Nova ERP to match your business needs",
                icon: Settings,
              },
            ].map((feature, index) => (
              <Card key={index} className="border border-border">
                <CardContent className="p-6">
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-[800px] mx-auto text-primary-foreground">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Experience All Features?</h2>
            <p className="text-lg mb-8 opacity-90">
              Start your free trial today and discover how Nova ERP can transform your business operations.
            </p>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="gap-2">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Documentation</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Help Center</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Tutorials</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-sm">
            <p className="text-muted-foreground">© 2023 Nova ERP. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link to="#" className="text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;
