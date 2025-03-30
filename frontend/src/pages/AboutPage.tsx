
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building, Target, Heart, Globe, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center">
            <span className="font-medium text-lg text-primary">Nova ERP</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-sm font-medium text-primary transition-colors">About</Link>
            <Link to="/features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Nova ERP</h1>
          <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
            We're on a mission to simplify business operations through intuitive, powerful software solutions.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-lg">
                <p>
                  Nova ERP was founded in 2018 by a team of business operations experts and software engineers who were frustrated with the complexity of existing enterprise solutions.
                </p>
                <p>
                  We set out to create a comprehensive yet intuitive platform that would empower businesses of all sizes to streamline their operations without requiring extensive training or IT support.
                </p>
                <p>
                  What started as a simple project management tool has grown into a full-featured ERP solution used by thousands of businesses worldwide. Our team has grown to over 50 passionate individuals committed to constant innovation and customer success.
                </p>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden border border-border shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1600" 
                alt="Nova ERP team" 
                className="w-full h-full object-cover aspect-video" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Values */}
      <section className="py-20 bg-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
            <p className="text-lg text-muted-foreground max-w-[700px] mx-auto">
              The principles that drive everything we do at Nova ERP
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Simplify Complexity",
                description: "We believe powerful software doesn't need to be complicated. We focus on intuitive design that makes complex operations simple.",
                icon: Target,
              },
              {
                title: "Customer Success",
                description: "Our customers' success is our success. We're committed to providing solutions that drive real business results.",
                icon: Heart,
              },
              {
                title: "Continuous Innovation",
                description: "We're always evolving, improving our platform based on customer feedback and emerging business needs.",
                icon: Building,
              },
              {
                title: "Global Accessibility",
                description: "We design our solutions to be accessible to businesses around the world, regardless of size or industry.",
                icon: Globe,
              },
              {
                title: "Excellence",
                description: "We hold ourselves to the highest standards in everything from code quality to customer support.",
                icon: Award,
              },
              {
                title: "Transparency",
                description: "We believe in honest communication with our customers, partners, and team members.",
                icon: Building,
              }
            ].map((value, index) => (
              <div 
                key={index}
                className="flex flex-col p-6 bg-background rounded-lg border border-border shadow-sm"
              >
                <div className="p-3 rounded-full bg-primary/10 mb-4 self-start">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet Our Leadership</h2>
            <p className="text-lg text-muted-foreground max-w-[700px] mx-auto">
              The team behind Nova ERP's vision and execution
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Alex Morgan",
                title: "Chief Executive Officer",
                bio: "Former operations consultant with 15+ years of experience helping businesses optimize their workflows.",
                image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=800"
              },
              {
                name: "Jamie Chen",
                title: "Chief Technology Officer",
                bio: "Software architect with a background in developing scalable enterprise solutions for Fortune 500 companies.",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"
              },
              {
                name: "Sam Washington",
                title: "Chief Product Officer",
                bio: "Product visionary focused on creating intuitive user experiences that solve real business problems.",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800"
              },
            ].map((person, index) => (
              <div 
                key={index}
                className="flex flex-col text-center p-6 bg-background rounded-lg border border-border shadow-sm"
              >
                <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full">
                  <img 
                    src={person.image} 
                    alt={person.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">{person.name}</h3>
                <p className="text-sm text-primary mb-4">{person.title}</p>
                <p className="text-muted-foreground">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-[800px] mx-auto text-primary-foreground">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Join Our Journey</h2>
            <p className="text-lg mb-8 opacity-90">
              Become part of the Nova ERP story and transform how your business operates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button variant="secondary" size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="#" className="inline-block">
                <Button variant="outline" size="lg" className="border-primary-foreground hover:bg-primary-foreground/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
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

export default AboutPage;
