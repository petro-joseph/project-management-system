
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import {
  Sun,
  Moon,
  Check,
  ArrowRight,
  BarChart3,
  Briefcase,
  FileText,
  DollarSign,
  Clock,
  Globe
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const LandingPage = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">Project Managment System</div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-foreground"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/login">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <Badge className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 border-none">
                Business Management Solution
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Streamline Your <span className="text-primary">Business Operations</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                All-in-one ERP solution that helps modern businesses manage projects, track inventory, handle accounting, and more in one integrated platform.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/login">
                  <Button size="lg" className="h-12 px-6">
                    Start For Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button variant="outline" size="lg" className="h-12 px-6">
                    Explore Features
                  </Button>
                </Link>
              </div>
              <div className="pt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Check className="text-green-500 mr-2 h-5 w-5" /> Free trial
                </div>
                <div className="flex items-center">
                  <Check className="text-green-500 mr-2 h-5 w-5" /> No credit card
                </div>
                <div className="flex items-center">
                  <Check className="text-green-500 mr-2 h-5 w-5" /> Cancel anytime
                </div>
              </div>
            </div>
            <div className="flex-1 rounded-xl overflow-hidden shadow-2xl border border-border">
              <img
                src="https://images.unsplash.com/photo-1531297484001-80022131f5a1"
                alt="Dashboard Screenshot"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 border-none">
              Core Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need in One Place</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed to help your business grow and operate efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="Project Management"
              description="Track projects from start to finish with intuitive dashboards and reporting tools."
            />

            <FeatureCard
              icon={<Briefcase className="h-10 w-10 text-primary" />}
              title="Asset Management"
              description="Keep track of your fixed assets throughout their entire lifecycle."
            />

            <FeatureCard
              icon={<FileText className="h-10 w-10 text-primary" />}
              title="Inventory Control"
              description="Manage stock levels, track items, and optimize your inventory processes."
            />

            <FeatureCard
              icon={<DollarSign className="h-10 w-10 text-primary" />}
              title="Financial Management"
              description="Comprehensive tools for budgeting, expense tracking, and financial reporting."
            />

            <FeatureCard
              icon={<Clock className="h-10 w-10 text-primary" />}
              title="Time Tracking"
              description="Monitor productivity and billable hours with detailed time tracking features."
            />

            <FeatureCard
              icon={<Globe className="h-10 w-10 text-primary" />}
              title="Multi-location Support"
              description="Manage operations across multiple locations with centralized control."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 border-none">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Businesses Worldwide</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what our customers have to say about their experience with Project Managment System
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Project Managment System revolutionized how we manage our inventory and assets. It's been a game-changer for our operations."
              author="Sarah Johnson"
              company="Tech Solutions Inc."
            />

            <TestimonialCard
              quote="The project management tools have helped us deliver projects on time and within budget consistently."
              author="Michael Chen"
              company="Global Innovations"
            />

            <TestimonialCard
              quote="Easy to use, comprehensive, and the support team is incredible. Couldn't ask for a better ERP solution."
              author="Emily Williams"
              company="Retail Ventures"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of businesses that trust Project Managment System to streamline their operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" variant="secondary" className="h-12 px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent border-white hover:bg-white/10">
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Project Managment System</h3>
              <p className="text-muted-foreground">
                Comprehensive business management solution for modern enterprises.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground">contact@novaerp.com</li>
                <li className="text-muted-foreground">+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground">
              © 2023 Project Managment System. All rights reserved.
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <Card className="border border-border hover:shadow-md transition-all duration-300 h-full">
      <CardContent className="p-6 flex flex-col">
        <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ quote, author, company }: {
  quote: string;
  author: string;
  company: string;
}) => {
  return (
    <Card className="border border-border hover:shadow-md transition-all duration-300 h-full">
      <CardContent className="p-6 flex flex-col">
        <div className="mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="text-yellow-500">★</span>
          ))}
        </div>
        <p className="italic mb-6 text-foreground">{quote}</p>
        <div className="mt-auto">
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{company}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LandingPage;
