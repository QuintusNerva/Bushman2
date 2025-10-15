import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Job, Supplier } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ZoomController } from './ZoomController';
import { createJobMarker, createSupplierMarker, createContractorMarker } from './MapMarkers';


interface MapControlsProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

function MapControls({ onToggleSidebar, sidebarOpen }: MapControlsProps) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
  }, [map, sidebarOpen]);

  return (
    <>
      <div className="absolute top-3 left-3 z-[1000]">
        <Button
          variant="outline"
          size="icon"
          className="bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl h-11 w-11 rounded-xl border-gray-200 hover:bg-white transition-all"
          onClick={onToggleSidebar}
        >
          {sidebarOpen ? <ChevronLeft className="h-5 w-5 text-gray-700" /> : <ChevronRight className="h-5 w-5 text-gray-700" />}
        </Button>
      </div>
      <ZoomController />
    </>
  );
}

interface InteractiveMapProps {
  jobs: Job[];
  suppliers: Supplier[];
  onJobSelect: (job: Job) => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  className?: string;
  onJobMarkerClick?: (job: Job) => void;
  onSupplierMarkerClick?: (supplier: Supplier) => void;
  selectedJobId?: string | null;
  selectedSupplierId?: string | null;
}

export function InteractiveMap({
  jobs,
  suppliers,
  onJobSelect,
  onToggleSidebar,
  sidebarOpen,
  className = 'h-[400px] w-full',
  onJobMarkerClick,
  onSupplierMarkerClick,
  selectedJobId,
  selectedSupplierId
}: InteractiveMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  
  // Mock contractor location (Orlando)
  const contractorLocation = { lat: 28.5383, lng: -81.3792 };
  
  // Calculate center of map based on jobs
  const getMapCenter = () => {
    if (jobs.length === 0) return [28.5383, -81.3792]; // Default to Orlando
    
    const lats = jobs.map(job => job.location.lat);
    const lngs = jobs.map(job => job.location.lng);
    
    const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
    
    return [centerLat, centerLng];
  };
  
  const handleJobMarkerClick = (job: Job) => {
    if (onJobMarkerClick) {
      onJobMarkerClick(job);
    }
  };

  const handleSupplierMarkerClick = (supplier: Supplier) => {
    if (onSupplierMarkerClick) {
      onSupplierMarkerClick(supplier);
    }
  };
  

  const calculateDistance = (targetLat: number, targetLng: number) => {
    const R = 3959;
    const dLat = (targetLat - contractorLocation.lat) * Math.PI / 180;
    const dLon = (targetLng - contractorLocation.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(contractorLocation.lat * Math.PI / 180) *
      Math.cos(targetLat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const formatJobType = (type: string) => {
    // Handle special cases for job types
    const typeMap: Record<string, string> = {
      'RO': 'Reverse Osmosis System',
      'UV': 'UV Light System',
      'Softener': 'Water Softener',
      'Whole House': 'Whole House System',
      'Commercial': 'Commercial System'
    };
    return typeMap[type] || type;
  };

  const formatScheduledTime = (job: Job) => {
    if (job.status === 'unclaimed') return 'Available Now';
    if (job.scheduledDate) {
      const date = new Date(job.scheduledDate);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
    return 'TBD';
  };

  const getPriorityBadgeClass = (priority: string) => {
    const classes = {
      low: 'bg-green-50 text-green-700 border-green-200',
      medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      high: 'bg-red-50 text-red-700 border-red-200',
      urgent: 'bg-red-600 text-white border-red-700'
    };
    return classes[priority as keyof typeof classes] || classes.medium;
  };

  const calculateDriveTime = (distance: number) => {
    const avgSpeed = 35;
    const timeInHours = distance / avgSpeed;
    const minutes = Math.round(timeInHours * 60);
    return minutes < 1 ? '<1' : minutes.toString();
  };


  // Create gradient polyline from contractor to first job (if jobs exist)
  const getRoutePolylines = () => {
    if (jobs.length === 0) return [];
    
    // Sort jobs by priority to create a route
    const sortedJobs = [...jobs].sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    });

    const firstJob = sortedJobs[0];
    
    return [
      {
        positions: [
          [contractorLocation.lat, contractorLocation.lng],
          [firstJob.location.lat, firstJob.location.lng]
        ] as [number, number][],
        color: '#5b9bd5', // Blue to pink gradient effect
      }
    ];
  };

  return (
    <div className={`relative ${className}`}>
        <MapContainer
          center={getMapCenter() as [number, number]}
          zoom={12}
          minZoom={3}
          maxZoom={18}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          touchZoom={true}
          zoomControl={false}
          style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
          ref={mapRef as any}
        >
          {/* Light, clean tile layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          
          {/* Route polylines with gradient effect */}
          {getRoutePolylines().map((route, idx) => (
            <Polyline
              key={idx}
              positions={route.positions}
              pathOptions={{
                color: route.color,
                weight: 5,
                opacity: 0.8,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          ))}
          
          {/* Job markers */}
          {jobs.map((job) => {
            const isSelected = selectedJobId === job.id;
            return (
              <Marker
                key={job.id}
                position={[job.location.lat, job.location.lng]}
                icon={createJobMarker(job.status, isSelected)}
                eventHandlers={{
                  click: () => handleJobMarkerClick(job),
                }}
              />
            );
          })}
          
          {/* Supplier markers */}
          {suppliers.map((supplier) => {
            const isSelected = selectedSupplierId === supplier.id;
            return (
              <Marker
                key={supplier.id}
                position={[supplier.location.lat, supplier.location.lng]}
                icon={createSupplierMarker(isSelected)}
                eventHandlers={{
                  click: () => handleSupplierMarkerClick(supplier),
                }}
              />
            );
          })}
          
          {/* Contractor marker */}
          <Marker
            position={[contractorLocation.lat, contractorLocation.lng]}
            icon={createContractorMarker()}
          />
          
          {/* Map controls */}
          <MapControls onToggleSidebar={onToggleSidebar} sidebarOpen={sidebarOpen} />
        </MapContainer>
      </div>
  );
}
