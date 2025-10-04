import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface UseGeofenceOptions {
  currentLocation: { lat: number; lng: number } | null;
  destinationLocation: { lat: number; lng: number };
  currentSpeed: number;
  enabled: boolean;
  onAutoArrival: () => void;
}

const GEOFENCE_RADIUS_METERS = 75;
const GEOFENCE_DURATION_SECONDS = 10;
const MAX_SPEED_MPS = 2;

const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const useGeofence = ({
  currentLocation,
  destinationLocation,
  currentSpeed,
  enabled,
  onAutoArrival,
}: UseGeofenceOptions) => {
  const {
    setGeofenceActive,
    incrementGeofenceTimer,
    resetGeofenceTimer,
    travelUI,
  } = useAppStore();

  useEffect(() => {
    if (!enabled || !currentLocation) {
      setGeofenceActive(false);
      resetGeofenceTimer();
      return;
    }

    const distance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      destinationLocation.lat,
      destinationLocation.lng
    );

    const withinRadius = distance <= GEOFENCE_RADIUS_METERS;
    const speedBelowThreshold = currentSpeed < MAX_SPEED_MPS;
    const isInGeofence = withinRadius && speedBelowThreshold;

    setGeofenceActive(isInGeofence);

    if (!isInGeofence) {
      resetGeofenceTimer();
    }
  }, [
    currentLocation,
    destinationLocation,
    currentSpeed,
    enabled,
    setGeofenceActive,
    resetGeofenceTimer,
  ]);

  useEffect(() => {
    if (!enabled || !travelUI.isGeofenceActive) return;

    const interval = setInterval(() => {
      incrementGeofenceTimer();

      if (travelUI.geofenceTimer + 1 >= GEOFENCE_DURATION_SECONDS) {
        onAutoArrival();
        resetGeofenceTimer();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    enabled,
    travelUI.isGeofenceActive,
    travelUI.geofenceTimer,
    incrementGeofenceTimer,
    resetGeofenceTimer,
    onAutoArrival,
  ]);

  return {
    isInGeofence: travelUI.isGeofenceActive,
    geofenceProgress: travelUI.geofenceTimer / GEOFENCE_DURATION_SECONDS,
  };
};
