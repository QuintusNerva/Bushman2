import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Job, Supplier } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ZoomController } from './ZoomController';
import { createJobMarker, createSupplierMarker, createContractorMarker, PIN_COLORS } from './MapMarkers';
import { EnhancedJobCard } from './EnhancedJobCard';
import { EnhancedSupplyCard } from './EnhancedSupplyCard';


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
          className="bg-white shadow-md h-11 w-11 rounded-lg"
          onClick={onToggleSidebar}
        >
          {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
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
}

export function InteractiveMap({
  jobs,
  suppliers,
  onJobSelect,
  onToggleSidebar,
  sidebarOpen,
  className = 'h-[400px] w-full'
}: InteractiveMapProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [cardPosition, setCardPosition] = useState<{ x: number; y: number } | null>(null);
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
  
  const handleJobMarkerClick = (job: Job, event: L.LeafletMouseEvent) => {
    setSelectedJob(job);
    setSelectedSupplier(null);

    const point = mapRef.current?.latLngToContainerPoint(event.latlng);
    if (point) {
      setCardPosition({ x: point.x + 40, y: point.y - 20 });
    }
  };

  const handleSupplierMarkerClick = (supplier: Supplier, event: L.LeafletMouseEvent) => {
    setSelectedSupplier(supplier);
    setSelectedJob(null);

    const point = mapRef.current?.latLngToContainerPoint(event.latlng);
    if (point) {
      setCardPosition({ x: point.x + 40, y: point.y - 20 });
    }
  };
  
  const handleAcceptJob = (jobId: string) => {
    console.log(`Job ${jobId} accepted`);
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      onJobSelect(job);
    }
    setSelectedJob(null);
    setCardPosition(null);
  };

  const handleCloseJobCard = () => {
    setSelectedJob(null);
    setCardPosition(null);
  };

  const handleCloseSupplyCard = () => {
    setSelectedSupplier(null);
    setCardPosition(null);
  };
  
  
  return (
    <>
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
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Job markers */}
          {jobs.map((job) => {
            const isSelected = selectedJob?.id === job.id;
            return (
              <Marker
                key={job.id}
                position={[job.location.lat, job.location.lng]}
                icon={createJobMarker(job.status, isSelected)}
                eventHandlers={{
                  click: (e) => handleJobMarkerClick(job, e),
                }}
              />
            );
          })}
          
          {/* Supplier markers */}
          {suppliers.map((supplier) => {
            const isSelected = selectedSupplier?.id === supplier.id;
            return (
              <Marker
                key={supplier.id}
                position={[supplier.location.lat, supplier.location.lng]}
                icon={createSupplierMarker(isSelected)}
                eventHandlers={{
                  click: (e) => handleSupplierMarkerClick(supplier, e),
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
        
        {/* Enhanced job card with 3D projection */}
        {selectedJob && cardPosition && (
          <EnhancedJobCard
            job={selectedJob}
            position={cardPosition}
            pinColor={selectedJob.status === 'unclaimed' ? PIN_COLORS.available : PIN_COLORS.scheduled}
            onClose={handleCloseJobCard}
            onAccept={handleAcceptJob}
            contractorLocation={contractorLocation}
          />
        )}

        {/* Enhanced supply house card with 3D projection */}
        {selectedSupplier && cardPosition && (
          <EnhancedSupplyCard
            supplier={selectedSupplier}
            position={cardPosition}
            pinColor={PIN_COLORS.supplyHouse}
            onClose={handleCloseSupplyCard}
            contractorLocation={contractorLocation}
          />
        )}
      </div>
    </>
  );
}
