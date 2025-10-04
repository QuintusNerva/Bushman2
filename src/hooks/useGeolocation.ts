import { useState, useEffect, useCallback } from 'react';
import { geolocationService } from '@/lib/geolocation';

interface GeolocationState {
  position: { lat: number; lng: number; accuracy: number } | null;
  error: string | null;
  loading: boolean;
  isSupported: boolean;
}

interface UseGeolocationOptions {
  enableWatch?: boolean;
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    loading: false,
    isSupported: geolocationService.isSupported(),
  });

  const getCurrentPosition = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const position = await geolocationService.getCurrentPosition({
        enableHighAccuracy: options.enableHighAccuracy,
        timeout: options.timeout,
        maximumAge: options.maximumAge,
      });

      setState({
        position,
        error: null,
        loading: false,
        isSupported: true,
      });

      return position;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to get location';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      throw error;
    }
  }, [options.enableHighAccuracy, options.timeout, options.maximumAge]);

  useEffect(() => {
    if (!options.enableWatch) return;

    geolocationService.watchPosition(
      (position) => {
        setState({
          position,
          error: null,
          loading: false,
          isSupported: true,
        });
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          error,
          loading: false,
        }));
      },
      {
        enableHighAccuracy: options.enableHighAccuracy,
        timeout: options.timeout,
        maximumAge: options.maximumAge,
      }
    );

    return () => {
      geolocationService.clearWatch();
    };
  }, [
    options.enableWatch,
    options.enableHighAccuracy,
    options.timeout,
    options.maximumAge,
  ]);

  return {
    ...state,
    getCurrentPosition,
    calculateDistance: geolocationService.calculateDistance.bind(
      geolocationService
    ),
  };
}
