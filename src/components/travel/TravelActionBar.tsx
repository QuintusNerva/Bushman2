import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Phone, FileText, MapPin, MoreVertical } from 'lucide-react';

interface TravelActionBarProps {
  onCallCustomer: () => void;
  onViewDetails: () => void;
  onOpenInMaps: () => void;
  onArrived: () => void;
  arrivedDisabled: boolean;
  customerPhone: string;
  destinationLocation: { lat: number; lng: number };
}

export function TravelActionBar({
  onCallCustomer,
  onViewDetails,
  onOpenInMaps,
  onArrived,
  arrivedDisabled,
  customerPhone,
  destinationLocation,
}: TravelActionBarProps) {
  const handleOpenInAppleMaps = () => {
    window.open(
      `maps://maps.apple.com/?daddr=${destinationLocation.lat},${destinationLocation.lng}`,
      '_blank'
    );
  };

  const handleOpenInGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destinationLocation.lat},${destinationLocation.lng}`,
      '_blank'
    );
  };

  return (
    <div className="absolute bottom-20 left-4 right-4 z-[1000]">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-4 max-w-2xl mx-auto">
        <div className="flex gap-3 mb-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 rounded-xl bg-white hover:bg-slate-50 border-slate-200"
            onClick={onCallCustomer}
          >
            <Phone className="w-5 h-5 mr-2" />
            <span className="font-medium">Call Customer</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="flex-1 rounded-xl bg-white hover:bg-slate-50 border-slate-200"
            onClick={onViewDetails}
          >
            <FileText className="w-5 h-5 mr-2" />
            <span className="font-medium">View Details</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl bg-white hover:bg-slate-50 border-slate-200"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleOpenInAppleMaps}>
                <MapPin className="w-4 h-4 mr-2" />
                Open in Apple Maps
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenInGoogleMaps}>
                <MapPin className="w-4 h-4 mr-2" />
                Open in Google Maps
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          size="lg"
          className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onArrived}
          disabled={arrivedDisabled}
        >
          Arrived
        </Button>
      </div>
    </div>
  );
}
