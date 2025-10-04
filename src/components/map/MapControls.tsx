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
        className="bg-white shadow-md h-11 w-11 rounded-lg"
        onClick={onZoomIn}
      >
        <Plus className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="bg-white shadow-md h-11 w-11 rounded-lg"
        onClick={onZoomOut}
      >
        <Minus className="h-5 w-5" />
      </Button>
    </div>
  );
}
