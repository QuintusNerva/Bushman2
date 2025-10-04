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
      <div style="
        width: 24px;
        height: 24px;
        background: #3b82f6;
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    className: 'current-location-marker',
  });
};

const createDestinationMarker = () => {
  return L.divIcon({
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(139,92,246,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      ">
        📍
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
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
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBounds
          currentLocation={currentLocation}
          destinationLocation={destinationLocation}
        />

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

        {routePolyline && routePolyline.length > 0 && (
          <Polyline
            positions={routePolyline.map((p) => [p.lat, p.lng])}
            color="#3b82f6"
            weight={4}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}
      </MapContainer>
    </div>
  );
}
