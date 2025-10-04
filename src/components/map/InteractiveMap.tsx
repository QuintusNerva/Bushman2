import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Job, Supplier } from '@/types';
import { JobQuickView } from './JobQuickView';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { JobDetailsModal } from '@/components/job/JobDetailsModal';
import { ZoomController } from './ZoomController';

// Fix for default marker icons in Leaflet with Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-job-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const jobIcon = createCustomIcon('#3b82f6'); // blue
const supplierIcon = createCustomIcon('#10b981'); // green
const contractorIcon = createCustomIcon('#8b5cf6'); // purple

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
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedJobForModal, setSelectedJobForModal] = useState<Job | null>(null);
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
  
  const handleMarkerClick = (job: Job) => {
    setSelectedJob(job);
    
    // Center map on selected job
    if (mapRef.current) {
      mapRef.current.setView([job.location.lat, job.location.lng], 13);
    }
  };
  
  const handleViewDetails = () => {
    if (selectedJob) {
      setSelectedJobForModal(selectedJob);
      setDetailsModalOpen(true);
      
      // Notify parent component about job selection
      onJobSelect(selectedJob);
    }
  };

  const handleAcceptJob = (jobId: string) => {
    console.log(`Job ${jobId} accepted`);
    setDetailsModalOpen(false);
    // Here you would implement the logic to accept the job
  };

  const handleRejectJob = (jobId: string) => {
    console.log(`Job ${jobId} rejected`);
    setDetailsModalOpen(false);
    // Here you would implement the logic to reject the job
  };
  
  // Ensure modal is rendered at the document root level
  useEffect(() => {
    // Create a modal container if it doesn't exist
    let modalContainer = document.getElementById('modal-container');
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = 'modal-container';
      document.body.appendChild(modalContainer);
    }
    
    return () => {
      // Clean up on unmount
      const container = document.getElementById('modal-container');
      if (container && container.childNodes.length === 0) {
        document.body.removeChild(container);
      }
    };
  }, []);
  
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
          {jobs.map((job) => (
            <Marker 
              key={job.id}
              position={[job.location.lat, job.location.lng]}
              icon={jobIcon}
              eventHandlers={{
                click: () => handleMarkerClick(job),
              }}
            />
          ))}
          
          {/* Supplier markers */}
          {suppliers.map((supplier) => (
            <Marker 
              key={supplier.id}
              position={[supplier.location.lat, supplier.location.lng]}
              icon={supplierIcon}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-medium">{supplier.name}</h3>
                  <p className="text-sm">{supplier.address}</p>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Contractor marker */}
          <Marker 
            position={[contractorLocation.lat, contractorLocation.lng]}
            icon={contractorIcon}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-medium">Your Location</h3>
              </div>
            </Popup>
          </Marker>
          
          {/* Map controls */}
          <MapControls onToggleSidebar={onToggleSidebar} sidebarOpen={sidebarOpen} />
        </MapContainer>
        
        {/* Selected job quick view */}
        {selectedJob && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000]">
            <JobQuickView 
              job={selectedJob} 
              onViewDetails={handleViewDetails}
              contractorLocation={contractorLocation}
            />
          </div>
        )}
      </div>

      {/* Job Details Modal - Rendered outside the map container */}
      {selectedJobForModal && (
        <JobDetailsModal
          job={selectedJobForModal}
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          onAccept={handleAcceptJob}
          onReject={handleRejectJob}
          contractorLocation={contractorLocation}
        />
      )}
    </>
  );
}
