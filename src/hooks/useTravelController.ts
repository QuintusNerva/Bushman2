import { useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAppStore } from '@/store/useAppStore';
import { startTravel as apiStartTravel, endTravel as apiEndTravel } from '@/api/jobs';
import { useOffline } from './useOffline';
import { toast } from 'sonner';
import type { ArrivalMethod } from '@/store/useAppStore';

interface UseTravelControllerOptions {
  jobId: string;
  currentLocation: { lat: number; lng: number } | null;
  destinationLocation: { lat: number; lng: number };
  onTravelComplete?: () => void;
}

export const useTravelController = ({
  jobId,
  currentLocation,
  destinationLocation,
  onTravelComplete,
}: UseTravelControllerOptions) => {
  const {
    travelUI,
    startTravel,
    incrementElapsed,
    setTravelState,
    setShowArrivalConfirm,
    resetTravel,
  } = useAppStore();

  const { isOnline, queueAction } = useOffline();

  const startTravelMutation = useMutation({
    mutationFn: apiStartTravel,
    onSuccess: () => {
      startTravel();
    },
  });

  const endTravelMutation = useMutation({
    mutationFn: apiEndTravel,
    onSuccess: () => {
      setTravelState('ARRIVED');
      toast.success('Arrival recorded!', {
        description: 'Travel metrics have been saved.',
        duration: 3000,
      });

      setTimeout(() => {
        if (onTravelComplete) {
          onTravelComplete();
        }
      }, 500);
    },
    onError: (error) => {
      console.error('Failed to end travel:', error);
      toast.error('Failed to record arrival', {
        description: 'Will retry automatically when online.',
      });
    },
  });

  useEffect(() => {
    if (travelUI.travelState !== 'TRAVELING') return;

    const interval = setInterval(() => {
      incrementElapsed();
    }, 1000);

    return () => clearInterval(interval);
  }, [travelUI.travelState, incrementElapsed]);

  const handleStartTravel = useCallback(() => {
    if (!currentLocation) {
      console.error('Cannot start travel: no current location');
      return;
    }

    startTravelMutation.mutate({
      jobId,
      startLocation: currentLocation,
    });
  }, [jobId, currentLocation, startTravelMutation]);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const handleEndTravel = useCallback(
    (arrivalMethod: ArrivalMethod) => {
      if (!currentLocation) {
        console.error('Cannot end travel: no current location');
        return;
      }

      const distanceAtArrival = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        destinationLocation.lat,
        destinationLocation.lng
      );
      const isOutsideRadius = distanceAtArrival > 75;

      const travelData = {
        jobId,
        endLocation: currentLocation,
        seconds: travelUI.elapsedSeconds,
        arrivalMethod,
        distanceAtArrival,
        isOutsideRadius,
      };

      if (!isOnline) {
        queueAction({
          type: 'endTravel',
          payload: travelData,
          timestamp: Date.now(),
        });

        setTravelState('ARRIVED');
        toast.warning('Arrival saved offline', {
          description: 'Will sync when connection is restored.',
          duration: 5000,
        });

        setTimeout(() => {
          if (onTravelComplete) {
            onTravelComplete();
          }
        }, 500);

        return;
      }

      endTravelMutation.mutate(travelData);

      console.log('Travel analytics:', {
        jobId,
        method: arrivalMethod,
        distanceAtTap: distanceAtArrival,
        seconds: travelUI.elapsedSeconds,
        offline: !isOnline,
        outsideRadius: isOutsideRadius,
      });
    },
    [jobId, currentLocation, destinationLocation, travelUI.elapsedSeconds, endTravelMutation, isOnline, queueAction, setTravelState, onTravelComplete]
  );

  const handleAutoArrival = useCallback(() => {
    handleEndTravel('auto');
  }, [handleEndTravel]);

  const handleManualArrival = useCallback(() => {
    setShowArrivalConfirm(true);
  }, [setShowArrivalConfirm]);

  const confirmManualArrival = useCallback(() => {
    setShowArrivalConfirm(false);
    handleEndTravel('manual');
  }, [handleEndTravel, setShowArrivalConfirm]);

  const cancelManualArrival = useCallback(() => {
    setShowArrivalConfirm(false);
  }, [setShowArrivalConfirm]);

  return {
    travelState: travelUI.travelState,
    elapsedSeconds: travelUI.elapsedSeconds,
    showArrivalConfirm: travelUI.showArrivalConfirm,
    isStarting: startTravelMutation.isPending,
    isEnding: endTravelMutation.isPending,
    handleStartTravel,
    handleAutoArrival,
    handleManualArrival,
    confirmManualArrival,
    cancelManualArrival,
    resetTravel,
  };
};
