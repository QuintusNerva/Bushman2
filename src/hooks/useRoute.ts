import { useState, useEffect } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface RouteData {
  polyline: Location[];
  distance: number;
  duration: number;
}

export const useRoute = (
  origin: Location | null,
  destination: Location,
  enabled: boolean = true
) => {
  const [route, setRoute] = useState<RouteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled || !origin) {
      setRoute(null);
      return;
    }

    const fetchRoute = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const straightLinePolyline = [origin, destination];

        const distance = calculateDistance(
          origin.lat,
          origin.lng,
          destination.lat,
          destination.lng
        );

        const avgSpeedMph = 35;
        const duration = (distance / avgSpeedMph) * 3600;

        setRoute({
          polyline: straightLinePolyline,
          distance: distance,
          duration: duration,
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch route'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoute();
  }, [origin?.lat, origin?.lng, destination.lat, destination.lng, enabled]);

  return { route, isLoading, error };
};

const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
