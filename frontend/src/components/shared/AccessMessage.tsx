
import React from 'react';
import { AlertCircle, Info, Check, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

interface AccessMessageProps {
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  description: string;
  showRole?: boolean;
}

const AccessMessage: React.FC<AccessMessageProps> = ({
  type,
  title,
  description,
  showRole = false
}) => {
  const { role } = useAuth();
  
  const getIcon = () => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'success':
        return <Check className="h-4 w-4" />;
      case 'error':
        return <ShieldAlert className="h-4 w-4" />;
    }
  };
  
  return (
    <Alert variant={type === 'error' ? 'destructive' : 'default'} className="my-4">
      {getIcon()}
      <AlertTitle className="flex items-center gap-2">
        {title}
        {showRole && role && (
          <Badge variant="outline" className="ml-2 capitalize">
            {role}
          </Badge>
        )}
      </AlertTitle>
      <AlertDescription>
        {description}
      </AlertDescription>
    </Alert>
  );
};

export default AccessMessage;
