import { useEffect, useState } from 'react';
import { Job } from '@/types';
import { TravelMap } from './TravelMap';
import { TravelInfoBar } from './TravelInfoBar';
import { TravelActionBar } from './TravelActionBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { useTravelController } from '@/hooks/useTravelController';
import { useGeofence } from '@/hooks/useGeofence';
import { useRoute } from '@/hooks/useRoute';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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
  const { position, getCurrentPosition } = useGeolocation({ enableWatch: true, enableHighAccuracy: true });
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [useFallbackLocation, setUseFallbackLocation] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');

  const fallbackLocation = { lat: 28.5383, lng: -81.3792 };

  const currentLocation = useFallbackLocation
    ? fallbackLocation
    : position
    ? { lat: position.lat, lng: position.lng }
    : null;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!position) {
        console.log('Location timeout - using fallback location');
        setUseFallbackLocation(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [position]);

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
    destinationLocation,
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

  const calculateDistanceToJob = () => {
    if (!currentLocation) return 0;
    const R = 6371000;
    const dLat = (destinationLocation.lat - currentLocation.lat) * Math.PI / 180;
    const dLon = (destinationLocation.lng - currentLocation.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(currentLocation.lat * Math.PI / 180) *
      Math.cos(destinationLocation.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const distanceToJob = calculateDistanceToJob();
  const isOutsideRadius = distanceToJob > 75;

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

  if (!currentLocation && travelState === 'ACCEPTED' && !useFallbackLocation) {
    return (
      <div className="relative h-screen w-full bg-slate-50 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Getting your location...</h3>
            <p className="text-sm text-slate-600 mb-4">Please allow location access to start travel</p>
            <button
              onClick={() => setUseFallbackLocation(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Use default location instead
            </button>
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

      {/* Cancel/Back Button */}
      <div className="absolute top-4 left-4 z-[1001]">
        <Button
          variant="outline"
          size="icon"
          className="bg-white/98 backdrop-blur-sm shadow-lg hover:shadow-xl h-11 w-11 rounded-xl border-gray-200 hover:bg-white transition-all"
          onClick={onBack}
          title="Cancel Navigation"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </Button>
      </div>

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
        <AlertDialogContent className="rounded-2xl bg-white/95 backdrop-blur-xl border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Confirm Arrival</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-2">
              <p className="text-slate-700">
                You appear to be <span className="font-semibold text-slate-900">~{distanceToJob}m</span> from the job site.
                Confirm you've arrived on site?
              </p>
              {isOutsideRadius && (
                <p className="text-orange-600 text-sm bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                  You're currently outside the typical arrival radius (75m).
                </p>
              )}
              <div className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                <p className="font-medium mb-1">This will:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Stop GPS tracking</li>
                  <li>Freeze travel timer at {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s</li>
                  <li>Record arrival metrics</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-slate-300">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg"
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

      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'jobs') {
            onBack();
          }
        }}
      />
    </div>
  );
}
