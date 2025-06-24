import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function MapControls({ onZoomIn, onZoomOut }: MapControlsProps) {
  return (
    <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
      <Button 
        variant="outline" 
        size="icon" 
        className="bg-white shadow-md h-8 w-8"
        onClick={onZoomIn}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="bg-white shadow-md h-8 w-8"
        onClick={onZoomOut}
      >
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  );
}
