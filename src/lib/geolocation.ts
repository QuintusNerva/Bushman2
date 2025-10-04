interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

interface GeolocationError {
  code: number;
  message: string;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export class GeolocationService {
  private watchId: number | null = null;
  private lastPosition: GeolocationPosition | null = null;

  isSupported(): boolean {
    return 'geolocation' in navigator;
  }

  async getCurrentPosition(
    options: GeolocationOptions = {}
  ): Promise<{ lat: number; lng: number; accuracy: number }> {
    if (!this.isSupported()) {
      throw new Error('Geolocation is not supported by this browser');
    }

    const defaultOptions: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options,
    };

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lastPosition = position;
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          reject(this.handleError(error));
        },
        defaultOptions
      );
    });
  }

  watchPosition(
    onSuccess: (position: { lat: number; lng: number; accuracy: number }) => void,
    onError?: (error: string) => void,
    options: GeolocationOptions = {}
  ): void {
    if (!this.isSupported()) {
      onError?.('Geolocation is not supported by this browser');
      return;
    }

    const defaultOptions: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
      ...options,
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.lastPosition = position;
        onSuccess({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        onError?.(this.handleError(error));
      },
      defaultOptions
    );
  }

  clearWatch(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  getLastPosition(): { lat: number; lng: number; accuracy: number } | null {
    if (!this.lastPosition) return null;
    return {
      lat: this.lastPosition.coords.latitude,
      lng: this.lastPosition.coords.longitude,
      accuracy: this.lastPosition.coords.accuracy,
    };
  }

  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private handleError(error: GeolocationError): string {
    switch (error.code) {
      case 1:
        return 'Location access denied. Please enable location permissions.';
      case 2:
        return 'Location unavailable. Please check your device settings.';
      case 3:
        return 'Location request timed out. Please try again.';
      default:
        return 'An unknown error occurred while getting your location.';
    }
  }
}

export const geolocationService = new GeolocationService();
