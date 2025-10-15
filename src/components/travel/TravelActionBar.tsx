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
      <div className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-2xl mx-auto">
        <div className="flex gap-3 mb-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 rounded-xl bg-white hover:bg-gray-50 border-gray-300 text-gray-900 shadow-sm"
            onClick={onCallCustomer}
          >
            <Phone className="w-5 h-5 mr-2 text-gray-700" />
            <span className="font-semibold text-gray-900">Call Customer</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="flex-1 rounded-xl bg-white hover:bg-gray-50 border-gray-300 text-gray-900 shadow-sm"
            onClick={onViewDetails}
          >
            <FileText className="w-5 h-5 mr-2 text-gray-700" />
            <span className="font-semibold text-gray-900">View Details</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl bg-white hover:bg-gray-50 border-gray-300 shadow-sm"
              >
                <MoreVertical className="w-5 h-5 text-gray-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200">
              <DropdownMenuItem onClick={handleOpenInAppleMaps} className="text-gray-900">
                <MapPin className="w-4 h-4 mr-2 text-gray-700" />
                Open in Apple Maps
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenInGoogleMaps} className="text-gray-900">
                <MapPin className="w-4 h-4 mr-2 text-gray-700" />
                Open in Google Maps
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          size="lg"
          className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          onClick={onArrived}
          disabled={arrivedDisabled}
        >
          <span className="text-lg">Arrived</span>
        </Button>
      </div>
    </div>
  );
}
