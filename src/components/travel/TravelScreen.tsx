import { useEffect, useState } from 'react';
import { Job } from '@/types';
import { TravelMap } from './TravelMap';
import { TravelInfoBar } from './TravelInfoBar';
import { TravelActionBar } from './TravelActionBar';
import { useTravelController } from '@/hooks/useTravelController';
import { useGeofence } from '@/hooks/useGeofence';
import { useRoute } from '@/hooks/useRoute';
import { useGeolocation } from '@/hooks/useGeolocation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TravelScreenProps {
  job: Job;
  onBack: () => void;
  onTravelComplete?: () => void;
}

export function TravelScreen({ job, onBack, onTravelComplete }: TravelScreenProps) {
  const { position } = useGeolocation({ enableWatch: true, enableHighAccuracy: true });
  const [currentSpeed, setCurrentSpeed] = useState(0);

  const currentLocation = position
    ? { lat: position.lat, lng: position.lng }
    : null;

  const destinationLocation = {
    lat: job.location.lat,
    lng: job.location.lng,
  };

  const {
    travelState,
    elapsedSeconds,
    showArrivalConfirm,
    handleStartTravel,
    handleAutoArrival,
    handleManualArrival,
    confirmManualArrival,
    cancelManualArrival,
  } = useTravelController({
    jobId: job.id,
    currentLocation,
    onTravelComplete,
  });

  const { route } = useRoute(currentLocation, destinationLocation, travelState === 'TRAVELING');

  const { isInGeofence } = useGeofence({
    currentLocation,
    destinationLocation,
    currentSpeed,
    enabled: travelState === 'TRAVELING',
    onAutoArrival: handleAutoArrival,
  });

  useEffect(() => {
    if (travelState === 'ACCEPTED' && currentLocation) {
      handleStartTravel();
    }
  }, [travelState, currentLocation, handleStartTravel]);

  useEffect(() => {
    setCurrentSpeed(0);
  }, [position]);

  const distance = route?.distance || 0;
  const eta = route?.duration ? new Date(Date.now() + route.duration * 1000) : null;

  const handleCallCustomer = () => {
    if (job.customer?.phone) {
      window.location.href = `tel:${job.customer.phone}`;
    }
  };

  const handleViewDetails = () => {
    console.log('View job details:', job);
  };

  const handleOpenInMaps = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destinationLocation.lat},${destinationLocation.lng}`,
      '_blank'
    );
  };

  if (!currentLocation && travelState === 'ACCEPTED') {
    return (
      <div className="relative h-screen w-full bg-slate-50 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Getting your location...</h3>
            <p className="text-sm text-slate-600">Please allow location access to start travel</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-slate-50">
      <TravelMap
        currentLocation={currentLocation}
        destinationLocation={destinationLocation}
        routePolyline={route?.polyline}
        className="absolute inset-0"
      />

      <TravelInfoBar distance={distance} eta={eta} elapsedSeconds={elapsedSeconds} />

      <TravelActionBar
        onCallCustomer={handleCallCustomer}
        onViewDetails={handleViewDetails}
        onOpenInMaps={handleOpenInMaps}
        onArrived={handleManualArrival}
        arrivedDisabled={travelState !== 'TRAVELING'}
        customerPhone={job.customer?.phone || ''}
        destinationLocation={destinationLocation}
      />

      <AlertDialog open={showArrivalConfirm} onOpenChange={cancelManualArrival}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Arrival</AlertDialogTitle>
            <AlertDialogDescription>
              Have you arrived at the job site? This will mark your travel as complete.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-blue-500 hover:bg-blue-600"
              onClick={confirmManualArrival}
            >
              Confirm Arrival
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isInGeofence && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[1000]">
          <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium">
            Auto-arrival in progress...
          </div>
        </div>
      )}
    </div>
  );
}
