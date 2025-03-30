
import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center">
          <div className="relative mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-75 duration-1000"></div>
            <div className="relative bg-gradient-to-br from-primary/20 to-primary/30 p-6 rounded-full inline-flex">
              <AlertTriangle className="h-16 w-16 text-primary" />
            </div>
          </div>
          
          <h1 className="text-7xl font-extrabold text-primary mb-2">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            We couldn't find the page you were looking for. It might have been removed or relocated.
          </p>
          
          <div className="relative mb-8 max-w-sm mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search our site..." 
              className="w-full rounded-full border border-input bg-background/50 pl-10 pr-4 py-2 backdrop-blur-sm" 
              defaultValue={location.pathname.slice(1)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              className="bg-background/80 backdrop-blur-sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            
            <Button onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
