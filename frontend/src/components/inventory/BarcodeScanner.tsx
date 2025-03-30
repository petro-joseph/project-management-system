
import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, ZoomIn, ZoomOut, ScanLine } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BarcodeScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ open, onClose, onScan }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [zoom, setZoom] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Start the camera when the dialog opens
  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [open]);
  
  // Start the camera
  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          zoom: zoom
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error("Could not access device camera");
    }
  };
  
  // Stop the camera
  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsScanning(false);
  };
  
  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
    restartCamera();
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 1));
    restartCamera();
  };
  
  // Restart camera with new zoom level
  const restartCamera = () => {
    stopCamera();
    startCamera();
  };
  
  // Simulate barcode scanning
  const simulateScan = () => {
    // Generate a random barcode
    const randomBarcode = `ITM${Math.floor(1000000 + Math.random() * 9000000)}`;
    
    // Simulated scanning sound (beep)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.frequency.value = 1500;
    oscillator.type = 'square';
    gainNode.gain.value = 0.1;
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      
      // Show success animation
      toast.success("Barcode detected");
      
      // Close after a short delay
      setTimeout(() => {
        onScan(randomBarcode);
        onClose();
      }, 500);
    }, 200);
  };
  
  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
          <DialogDescription>
            Point your camera at a barcode to scan it
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative bg-black rounded-md overflow-hidden h-64">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Scanning animation overlay */}
          {isScanning && (
            <div className="absolute inset-0 flex flex-col items-center">
              <div className="flex-1 w-full border-2 border-primary/50 relative">
                <div className="absolute w-full left-0 h-0.5 bg-primary animate-scan" />
              </div>
            </div>
          )}
          
          {/* Scanning guide */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary rounded-md pointer-events-none" />
          
          {/* Zoom controls */}
          <div className="absolute top-2 right-2 bg-black/50 rounded-md p-1 flex flex-col gap-1">
            <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8">
              <ZoomIn className="h-4 w-4 text-white" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8">
              <ZoomOut className="h-4 w-4 text-white" />
            </Button>
          </div>
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 bg-black/50 h-8 w-8 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4 text-white" />
          </Button>
          
          {/* Scan line */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full flex items-center gap-2">
            <ScanLine className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-white text-xs">Scanning for barcodes</span>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-center">
          <Button type="button" onClick={simulateScan} className="w-full">
            <Camera className="mr-2 h-4 w-4" />
            Simulate Scan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScanner;
