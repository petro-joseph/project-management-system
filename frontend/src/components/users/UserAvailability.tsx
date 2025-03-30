
import React, { useState } from 'react';
import { AvailabilityStatus, User } from '@/lib/types';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MinusCircle,
  Calendar,
  PauseCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface UserAvailabilityProps {
  user: User;
  onStatusChange?: (status: AvailabilityStatus) => void;
}

const UserAvailability: React.FC<UserAvailabilityProps> = ({ 
  user, 
  onStatusChange 
}) => {
  const [status, setStatus] = useState<AvailabilityStatus>(user.availability || 'available');
  const [statusNote, setStatusNote] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [temporaryStatus, setTemporaryStatus] = useState<AvailabilityStatus>(status);

  const getStatusIcon = (status: AvailabilityStatus) => {
    switch (status) {
      case 'available':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'busy':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'away':
        return <PauseCircle className="h-4 w-4 text-blue-500" />;
      case 'offline':
        return <MinusCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusLabel = (status: AvailabilityStatus) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      case 'away':
        return 'Away';
      case 'offline':
        return 'Offline';
      default:
        return 'Available';
    }
  };

  const handleStatusChange = (newStatus: AvailabilityStatus) => {
    if (newStatus === 'away' || newStatus === 'busy') {
      setTemporaryStatus(newStatus);
      setOpenDialog(true);
    } else {
      updateStatus(newStatus);
    }
  };

  const updateStatus = (newStatus: AvailabilityStatus, note?: string) => {
    setStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
    
    toast.success(`Status updated to ${getStatusLabel(newStatus)}`, {
      description: note ? `Note: ${note}` : undefined,
    });
  };

  const handleDialogConfirm = () => {
    updateStatus(temporaryStatus, statusNote);
    setOpenDialog(false);
    setStatusNote('');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 w-full md:w-auto">
            {getStatusIcon(status)}
            <span>{getStatusLabel(status)}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            className="gap-2" 
            onClick={() => handleStatusChange('available')}
          >
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Available</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="gap-2" 
            onClick={() => handleStatusChange('busy')}
          >
            <Clock className="h-4 w-4 text-amber-500" />
            <span>Busy</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="gap-2" 
            onClick={() => handleStatusChange('away')}
          >
            <PauseCircle className="h-4 w-4 text-blue-500" />
            <span>Away</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="gap-2" 
            onClick={() => handleStatusChange('offline')}
          >
            <MinusCircle className="h-4 w-4 text-gray-500" />
            <span>Offline</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Availability Status</DialogTitle>
            <DialogDescription>
              Update your status and add an optional note.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <RadioGroup defaultValue={temporaryStatus} className="flex flex-col space-y-3 mb-4">
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
                <RadioGroupItem id="available" value="available" onChange={() => setTemporaryStatus('available')} />
                <CheckCircle2 className="h-4 w-4 text-green-500 ml-1" />
                <Label htmlFor="available" className="font-medium">Available</Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
                <RadioGroupItem id="busy" value="busy" onChange={() => setTemporaryStatus('busy')} />
                <Clock className="h-4 w-4 text-amber-500 ml-1" />
                <Label htmlFor="busy" className="font-medium">Busy</Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
                <RadioGroupItem id="away" value="away" onChange={() => setTemporaryStatus('away')} />
                <PauseCircle className="h-4 w-4 text-blue-500 ml-1" />
                <Label htmlFor="away" className="font-medium">Away</Label>
              </div>
            </RadioGroup>
            
            <div className="mt-4">
              <Label htmlFor="note">Status Note (optional)</Label>
              <Textarea
                id="note"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="E.g., In a meeting until 3pm, Available after lunch, etc."
                className="mt-1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleDialogConfirm}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserAvailability;
