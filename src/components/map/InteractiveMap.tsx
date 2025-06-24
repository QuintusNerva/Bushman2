import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Job, Supplier } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapControls } from './MapControls';
import { Menu } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface InteractiveMapProps {
  jobs: Job[];
  suppliers: Supplier[];
  onJobSelect: (job: Job) => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  className?: string;
}

// Map controller component
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  
  return null;
}

// Zoom controls component
function ZoomControls() {
  const map = useMap();
  
  const handleZoomIn = () => {
    map.zoomIn();
  };
  
  const handleZoomOut = () => {
    map.zoomOut();
  };
  
  return <MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />;
}

export function InteractiveMap({ 
  jobs, 
  suppliers, 
  onJobSelect, 
  onToggleSidebar,
  sidebarOpen,
  className = ''
}: InteractiveMapProps) {
  const [center, setCenter] = useState<[number, number]>([28.5383, -81.3792]); // Orlando, FL
  const mapRef = useRef<L.Map | null>(null);

  // Create custom icons for different job types
  const createJobIcon = (priority: string) => {
    const colors = {
      urgent: '#dc2626',
      high: '#ea580c',
      medium: '#eab308',
      low: '#22c55e'
    };
    
    const color = colors[priority as keyof typeof colors] || '#64748b';
    
    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          position: relative;
        ">
          <div style="
            width: 12px;
            height: 12px;
            background-color: white;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
          "></div>
        </div>
      `,
      className: 'custom-job-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  // Create supplier icon
  const supplierIcon = L.divIcon({
    html: `
      <div style="
        background-color: #3b82f6;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
      ">
        S
      </div>
    `,
    className: 'custom-supplier-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-sm ${className}`}>
      <MapContainer
        center={center}
        zoom={13}
        className="w-full h-full"
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={center} />
        <ZoomControls />
        
        {/* Job markers */}
        {jobs.map((job) => (
          <Marker
            key={job.id}
            position={[job.location.lat, job.location.lng]}
            icon={createJobIcon(job.priority)}
            eventHandlers={{
              click: () => onJobSelect(job)
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold mb-1">{job.title}</h3>
                <p className="text-sm text-slate-600 mb-2">{job.location.address}</p>
                <div className="flex justify-between items-center">
                  <Badge className={`capitalize ${getPriorityColor(job.priority)}`}>
                    {job.priority}
                  </Badge>
                  <Button size="sm" onClick={() => onJobSelect(job)}>
                    View Details
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Supplier markers */}
        {suppliers.map((supplier) => (
          <Marker
            key={supplier.id}
            position={[supplier.location.lat, supplier.location.lng]}
            icon={supplierIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{supplier.name}</h3>
                <p className="text-sm text-slate-600">{supplier.location.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Sidebar toggle button */}
      <button
        onClick={onToggleSidebar}
        className="absolute top-3 left-3 z-10 bg-white rounded-lg p-2 shadow-md hover:shadow-lg transition-shadow"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5 text-slate-600" />
      </button>
    </div>
  );
}
