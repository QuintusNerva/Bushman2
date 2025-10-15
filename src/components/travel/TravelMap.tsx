import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface TravelMapProps {
  currentLocation: { lat: number; lng: number } | null;
  destinationLocation: { lat: number; lng: number };
  routePolyline?: { lat: number; lng: number }[];
  className?: string;
}

const createCurrentLocationMarker = () => {
  return L.divIcon({
    html: `
      <style>
        .marker-dot-current {
          width: 20px;
          height: 20px;
          background-color: #5b9bd5;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
          cursor: pointer;
        }
      </style>
      <div class="marker-dot-current"></div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    className: 'current-location-marker',
  });
};

const createDestinationMarker = () => {
  return L.divIcon({
    html: `
      <style>
        .marker-dot-destination {
          width: 24px;
          height: 24px;
          background-color: #a78bfa;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
          cursor: pointer;
        }
      </style>
      <div class="marker-dot-destination"></div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    className: 'destination-marker',
  });
};

function MapBounds({
  currentLocation,
  destinationLocation,
}: {
  currentLocation: { lat: number; lng: number } | null;
  destinationLocation: { lat: number; lng: number };
}) {
  const map = useMap();

  useEffect(() => {
    if (currentLocation) {
      const bounds = L.latLngBounds([
        [currentLocation.lat, currentLocation.lng],
        [destinationLocation.lat, destinationLocation.lng],
      ]);
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 15 });
    } else {
      map.setView([destinationLocation.lat, destinationLocation.lng], 13);
    }
  }, [currentLocation, destinationLocation, map]);

  return null;
}

export function TravelMap({
  currentLocation,
  destinationLocation,
  routePolyline,
  className = 'h-full w-full',
}: TravelMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  const center = currentLocation || destinationLocation;

  return (
    <div className={className}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full rounded-2xl"
        ref={mapRef}
        zoomControl={false}
      >
        {/* Light, clean tile layer - same as main map */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MapBounds
          currentLocation={currentLocation}
          destinationLocation={destinationLocation}
        />

        {/* Route polyline */}
        {routePolyline && routePolyline.length > 0 && (
          <Polyline
            positions={routePolyline.map((p) => [p.lat, p.lng])}
            pathOptions={{
              color: '#5b9bd5',
              weight: 5,
              opacity: 0.8,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />
        )}

        {currentLocation && (
          <Marker
            position={[currentLocation.lat, currentLocation.lng]}
            icon={createCurrentLocationMarker()}
          />
        )}

        <Marker
          position={[destinationLocation.lat, destinationLocation.lng]}
          icon={createDestinationMarker()}
        />
      </MapContainer>
    </div>
  );
}
