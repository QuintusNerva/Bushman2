import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Job, Supplier } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ZoomController } from './ZoomController';
import { createJobMarker, createSupplierMarker, createContractorMarker, PIN_COLORS } from './MapMarkers';
import { PopupCard } from '@/components/ui/popup-card';
import { MapPin, Phone, Clock, Wrench, Navigation } from 'lucide-react';


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
    setSelectedJob(job);
    setSelectedSupplier(null);
  };

  const handleSupplierMarkerClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSelectedJob(null);
  };
  
  const handleAcceptJob = (jobId: string) => {
    console.log(`Job ${jobId} accepted`);
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      onJobSelect(job);
    }
    setSelectedJob(null);
  };

  const handleCloseJobCard = () => {
    setSelectedJob(null);
  };

  const handleCloseSupplyCard = () => {
    setSelectedSupplier(null);
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
                  click: () => handleJobMarkerClick(job),
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

      {/* Job Details Modal */}
      {selectedJob && selectedJob.customer && selectedJob.location && (
        <PopupCard
          isOpen={true}
          onClose={handleCloseJobCard}
          title={`Job #${selectedJob.id.slice(0, 8).toUpperCase()}`}
          maxWidth="600px"
          aria-label={`Job details for ${selectedJob.customer.name}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{selectedJob.customer.name}</h3>
              <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${getPriorityBadgeClass(selectedJob.priority)}`}>
                {selectedJob.priority}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Address</p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedJob.location.lat},${selectedJob.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {selectedJob.location.address}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Phone</p>
                  <a
                    href={`tel:${selectedJob.customer.phone}`}
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {selectedJob.customer.phone}
                  </a>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex items-start gap-3 mb-3">
                  <Wrench className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Job Type</p>
                    <p className="text-slate-900">{formatJobType(selectedJob.type)}</p>
                  </div>
                </div>

                {selectedJob.description && (
                  <p className="text-sm text-slate-600 mb-3">{selectedJob.description}</p>
                )}

                <div className="flex items-start gap-3 mb-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Scheduled</p>
                    <p className="text-slate-900">{formatScheduledTime(selectedJob)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Duration</p>
                    <p className="text-slate-900">{selectedJob.estimatedDuration} {selectedJob.estimatedDuration === 1 ? 'hour' : 'hours'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Distance & Drive Time</p>
                    <p className="text-slate-900">
                      {calculateDistance(selectedJob.location.lat, selectedJob.location.lng)} miles
                      <span className="text-slate-600"> • ~{calculateDriveTime(parseFloat(calculateDistance(selectedJob.location.lat, selectedJob.location.lng)))} min drive</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleCloseJobCard} variant="outline" className="flex-1">
                Close
              </Button>
              <Button
                onClick={() => {
                  handleAcceptJob(selectedJob.id);
                }}
                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Accept Job
              </Button>
            </div>
          </div>
        </PopupCard>
      )}

      {/* Supply House Modal */}
      {selectedSupplier && (
        <PopupCard
          isOpen={true}
          onClose={handleCloseSupplyCard}
          title={selectedSupplier.name}
          maxWidth="600px"
          aria-label={`Supply house details for ${selectedSupplier.name}`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-4xl">🏢</div>
              <h3 className="text-xl font-bold text-slate-900">{selectedSupplier.name}</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Address</p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSupplier.location.lat},${selectedSupplier.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {selectedSupplier.address}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Phone</p>
                  <a
                    href={`tel:${selectedSupplier.phone}`}
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {selectedSupplier.phone}
                  </a>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex items-start gap-3 mb-3">
                  <Clock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Hours Today</p>
                    <p className="text-slate-900">
                      {selectedSupplier.hours ? `${selectedSupplier.hours.open} - ${selectedSupplier.hours.close}` : 'Hours not available'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <Navigation className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Distance</p>
                    <p className="text-slate-900">
                      {calculateDistance(selectedSupplier.location.lat, selectedSupplier.location.lng)} miles
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Drive Time</p>
                    <p className="text-slate-900">
                      ~{calculateDriveTime(parseFloat(calculateDistance(selectedSupplier.location.lat, selectedSupplier.location.lng)))} minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleCloseSupplyCard} variant="outline" className="flex-1">
                Close
              </Button>
              <Button
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${selectedSupplier.location.lat},${selectedSupplier.location.lng}`,
                    '_blank'
                  );
                }}
                className="flex-1"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
              <Button
                onClick={() => {
                  window.location.href = `tel:${selectedSupplier.phone}`;
                }}
                variant="secondary"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            </div>
          </div>
        </PopupCard>
      )}
    </>
  );
}
