import { useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAppStore } from '@/store/useAppStore';
import { startTravel as apiStartTravel, endTravel as apiEndTravel } from '@/api/jobs';
import type { ArrivalMethod } from '@/store/useAppStore';

interface UseTravelControllerOptions {
  jobId: string;
  currentLocation: { lat: number; lng: number } | null;
  onTravelComplete?: () => void;
}

export const useTravelController = ({
  jobId,
  currentLocation,
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
      if (onTravelComplete) {
        onTravelComplete();
      }
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

  const handleEndTravel = useCallback(
    (arrivalMethod: ArrivalMethod) => {
      if (!currentLocation) {
        console.error('Cannot end travel: no current location');
        return;
      }

      endTravelMutation.mutate({
        jobId,
        endLocation: currentLocation,
        seconds: travelUI.elapsedSeconds,
        arrivalMethod,
      });
    },
    [jobId, currentLocation, travelUI.elapsedSeconds, endTravelMutation]
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
