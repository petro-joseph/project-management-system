
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Layers, 
  MessageSquare, 
  BarChart3, 
  ChevronRight, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { useIsMobile } from '@/hooks/use-mobile';

const NovaLandingPage = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Set dark mode for this page
    document.documentElement.classList.add('dark');
    
    return () => {
      // Cleanup when component unmounts
      document.documentElement.classList.remove('dark');
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-gradient">Nova</div>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="text-white/80 hover:text-white">Login</Button>
          </Link>
          <Link to="/login">
            <Button className="glass-btn transition-all duration-300 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 hover:bg-purple-500/30">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-16 pb-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge className="px-3 py-1 bg-[#7B68EE]/20 text-[#7B68EE] border-none">
            Project Management Reimagined
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-[#00D4C4] to-[#7B68EE] bg-clip-text text-transparent">
            Simplify Project Success with Nova
          </h1>
          
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Plan, track, and collaborate effortlessly in one sleek platform
          </p>
          
          <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="h-12 px-8 glass-btn-primary bg-[#00D4C4]/20 text-[#00D4C4] border border-[#00D4C4]/30 backdrop-blur-md hover:bg-[#00D4C4]/30 hover:scale-105 transition-all duration-300">
                Start for Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" size="lg" className="h-12 px-8 glass-btn bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
                See Features
              </Button>
            </Link>
          </div>
          
          <div className="pt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
            <div className="flex items-center">
              <CheckCircle className="text-[#00D4C4] mr-2 h-5 w-5" /> Free 14-day trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="text-[#00D4C4] mr-2 h-5 w-5" /> No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="text-[#00D4C4] mr-2 h-5 w-5" /> Cancel anytime
            </div>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="mt-16 max-w-5xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00D4C4]/30 to-[#7B68EE]/30 rounded-xl blur-3xl opacity-30"></div>
          <div className="glass-card relative overflow-hidden rounded-xl border border-white/10 shadow-glow">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
              alt="Nova Dashboard" 
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#1A1A2E] via-[#1A1A2E] to-[#1A1A2E]"></div>
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <Badge className="mb-4 px-3 py-1 bg-[#00D4C4]/20 text-[#00D4C4] border-none">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Everything You Need For Project Excellence
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Powerful tools designed to help your team collaborate, track progress, and deliver outstanding results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard 
              icon={<Layers className="h-8 w-8 text-[#00D4C4]" />}
              title="Smart Task Management"
              description="Assign tasks and track progress with ease. Prioritize work and never miss deadlines."
            />
            
            <FeatureCard 
              icon={<MessageSquare className="h-8 w-8 text-[#7B68EE]" />}
              title="Real-Time Team Sync"
              description="Stay connected with live updates and chat. Collaborate seamlessly regardless of location."
            />
            
            <FeatureCard 
              icon={<BarChart3 className="h-8 w-8 text-[#FF6B6B]" />}
              title="Visual Project Insights"
              description="See timelines and milestones at a glance. Make data-driven decisions with powerful analytics."
            />
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7B68EE]/20 rounded-full blur-[100px] opacity-40"></div>
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-testimonial p-8 md:p-12 rounded-2xl border border-white/10 backdrop-blur-lg bg-white/5 shadow-xl text-center">
              <div className="mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-[#FFD700] text-2xl">★</span>
                ))}
              </div>
              <p className="text-xl md:text-2xl font-light italic mb-8">
                "Nova turned our chaotic projects into a smooth workflow! The intuitive interface and real-time updates have transformed how our team collaborates."
              </p>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-[#00D4C4]">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                    alt="Sarah K." 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Sarah K.</p>
                  <p className="text-white/60 text-sm">Team Lead, Acme Inc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Footer */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="container relative mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto glass-card p-10 rounded-2xl border border-white/10 backdrop-blur-lg bg-[#7B68EE]/10">
            <h2 className="text-3xl font-bold mb-6">Ready to manage projects like a pro?</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Join thousands of teams that use Nova to deliver successful projects on time, every time.
            </p>
            <Link to="/login">
              <Button size="lg" className="h-12 px-10 glass-btn-neon bg-transparent border-2 border-[#00D4C4] text-[#00D4C4] hover:bg-[#00D4C4]/20 hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(0,212,196,0.5)]">
                Try Nova Now <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-xl font-bold text-gradient">Nova</div>
              <p className="text-white/50 mt-2">© 2023 Nova. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center">
              <a href="#" className="text-white/70 hover:text-white transition-colors duration-200">Features</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors duration-200">Pricing</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors duration-200">About</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors duration-200">Contact</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors duration-200">Blog</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for glassmorphism effects */}
      <style>
        {`
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.36);
        }
        
        .glass-btn {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        
        .glass-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        
        .glass-btn-primary {
          background: rgba(0, 212, 196, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 212, 196, 0.3);
          transition: all 0.3s ease;
        }
        
        .glass-btn-primary:hover {
          background: rgba(0, 212, 196, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        
        .glass-btn-neon {
          box-shadow: 0 0 10px rgba(0, 212, 196, 0.3);
          transition: all 0.3s ease;
        }
        
        .glass-btn-neon:hover {
          box-shadow: 0 0 20px rgba(0, 212, 196, 0.5);
        }
        
        .shadow-glow {
          box-shadow: 0 0 30px rgba(123, 104, 238, 0.3);
        }
        
        .text-gradient {
          background: linear-gradient(to right, #00D4C4, #7B68EE);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
        }
        
        .glass-testimonial {
          transition: transform 0.3s ease;
        }
        
        .glass-testimonial:hover {
          transform: translateY(-5px);
        }
        `}
      </style>
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
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="glass-card p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-glow cursor-pointer h-full">
          <div className="mb-4 p-3 bg-white/5 rounded-lg w-fit">
            {icon}
          </div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-white/70">{description}</p>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-[#1A1A2E]/80 backdrop-blur-lg border border-white/10 text-white">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="text-sm text-white/70">{description}</p>
            <div className="flex items-center pt-2">
              <Link to="/features" className="text-[#00D4C4] hover:underline text-sm flex items-center">
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default NovaLandingPage;
