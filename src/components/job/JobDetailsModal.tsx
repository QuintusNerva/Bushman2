import { Job } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createPortal } from 'react-dom';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Car, 
  Clock, 
  DollarSign, 
  FileText, 
  Key, 
  Package, 
  ShoppingBag,
  Calendar,
  Play,
  Navigation,
  PhoneCall
} from 'lucide-react';

interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (jobId: string) => void;
  onReject: (jobId: string) => void;
  contractorLocation?: { lat: number; lng: number };
}

export function JobDetailsModal({ 
  job, 
  isOpen, 
  onClose, 
  onAccept, 
  onReject,
  contractorLocation
}: JobDetailsModalProps) {
  if (!job || !isOpen) return null;

  // Calculate distance from contractor if both locations are available
  const getDistance = () => {
    if (!contractorLocation) return null;
    
    // Haversine formula to calculate distance between two coordinates
    const R = 6371; // Radius of the Earth in km
    const dLat = (job.location.lat - contractorLocation.lat) * Math.PI / 180;
    const dLon = (job.location.lng - contractorLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(contractorLocation.lat * Math.PI / 180) * Math.cos(job.location.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c * 0.621371; // Convert to miles
    
    return distance.toFixed(1);
  };

  // Get when job is needed
  const getWhenNeeded = () => {
    if (!job.scheduledDate) return "Flexible timing";
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const scheduledDate = new Date(job.scheduledDate);
    
    if (scheduledDate.toDateString() === today.toDateString()) {
      return `Today ${scheduledDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(scheduledDate.getTime() + job.estimatedDuration * 60 * 60 * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else if (scheduledDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow ${scheduledDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(scheduledDate.getTime() + job.estimatedDuration * 60 * 60 * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else {
      return `${scheduledDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} ${scheduledDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(scheduledDate.getTime() + job.estimatedDuration * 60 * 60 * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  // Check if job is scheduled
  const isScheduled = job.status === 'scheduled' || job.status === 'claimed';

  // Handle contact customer
  const handleContactCustomer = () => {
    window.open(`tel:${job.customer.phone}`);
  };

  // Handle get directions
  const handleGetDirections = () => {
    if (job.location.lat && job.location.lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${job.location.lat},${job.location.lng}`);
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.location.address)}`);
    }
  };

  // Handle reschedule
  const handleReschedule = () => {
    console.log('Reschedule job:', job.id);
    // Placeholder for reschedule functionality
  };

  // Handle start job
  const handleStartJob = () => {
    console.log('Start job:', job.id);
    // Placeholder for start job functionality
  };

  // Mock data for additional job details
  const mockJobDetails = {
    systemModel: job.type === 'UV' ? 'UV Max Pro 20 System' : 
                 job.type === 'RO' ? 'APEC 5-Stage RO System' : 
                 job.type === 'Softener' ? 'Pentair 48k Grain Softener' : 
                 job.type === 'Whole House' ? 'Carbon Filter System' : 
                 'Standard Water Treatment System',
    paymentAmount: job.priority === 'urgent' ? 220 : 
                   job.priority === 'high' ? 180 : 
                   job.priority === 'medium' ? 150 : 120,
    parkingInfo: 'Driveway parking available',
    accessDetails: job.type === 'UV' ? 'Basement utility room access' : 
                   job.type === 'RO' ? 'Kitchen sink access' : 
                   job.type === 'Softener' ? 'Garage utility area' : 
                   'Main water line access required',
    requiredParts: job.type === 'UV' ? ['UV bulb (39W)', 'Quartz sleeve'] : 
                   job.type === 'RO' ? ['RO membrane', 'Carbon pre-filters (2)', 'Sediment filter'] : 
                   job.type === 'Softener' ? ['Resin beads (1 bag)', 'Control valve O-rings'] : 
                   job.type === 'Whole House' ? ['Carbon media (2 cu ft)', 'Sediment pre-filter'] : 
                   ['Standard replacement filters']
  };

  const distance = getDistance();
  const whenNeeded = getWhenNeeded();

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
      <div className="max-w-md p-0 overflow-hidden bg-gradient-to-b from-slate-100 to-white border-none rounded-2xl clay-card">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 p-4 flex items-center rounded-t-2xl">
          <Button variant="ghost" size="sm" className="mr-2 text-white hover:bg-slate-600/50 clay-icon-button" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold text-white flex-1 text-center mr-8">Job Details</h2>
        </div>

        <div className="p-4 overflow-y-auto max-h-[80vh]">
          {/* Job Header Section */}
          <div className="clay-card mb-4 p-4">
            <div className="flex justify-between items-start mb-1">
              <h1 className="text-xl font-bold text-slate-800">{job.title}</h1>
              <Badge className={`${getPriorityColor(job.priority)} px-3 py-1 text-sm font-medium rounded-full`}>
                {job.priority}
              </Badge>
            </div>
            <p className="text-slate-600">{mockJobDetails.systemModel}</p>
          </div>

          {/* Customer Information Section */}
          <div className="clay-card mb-4 p-4">
            <h3 className="text-md font-semibold text-slate-700 mb-3 flex items-center">
              <User className="h-5 w-5 mr-2 text-indigo-600" />
              Customer Information
            </h3>
            
            <div className="pl-2 mb-3">
              <div className="flex items-center mb-2">
                <Phone className="h-4 w-4 mr-2 text-pink-500" />
                <span className="text-slate-800">{job.customer.name} • {job.customer.phone}</span>
              </div>
              
              {isScheduled && (
                <div className="mb-3">
                  <button 
                    onClick={handleContactCustomer}
                    className="clay-button flex items-center px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-xl mt-1 w-full"
                  >
                    <PhoneCall className="h-4 w-4 mr-2" />
                    Contact Customer
                  </button>
                </div>
              )}
              
              <div className="flex items-start">
                <MessageSquare className="h-4 w-4 mr-2 text-blue-500 mt-1 flex-shrink-0" />
                <p className="text-slate-600 text-sm">
                  "{job.description}"
                </p>
              </div>
            </div>
          </div>

          {/* Location & Timing Section */}
          <div className="clay-card mb-4 p-4">
            <h3 className="text-md font-semibold text-slate-700 mb-3 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-red-500" />
              Location & Timing
            </h3>
            
            <div className="pl-2">
              <div className="flex items-start mb-2">
                <MapPin className="h-4 w-4 mr-2 text-red-400 mt-1 flex-shrink-0" />
                <span className="text-slate-800">{job.location.address}</span>
              </div>
              
              {isScheduled && (
                <div className="mb-3">
                  <button 
                    onClick={handleGetDirections}
                    className="clay-button flex items-center px-3 py-2 text-sm text-green-600 bg-green-50 rounded-xl mt-1 w-full"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </button>
                </div>
              )}
              
              <div className="flex items-center mb-2">
                <Car className="h-4 w-4 mr-2 text-blue-400" />
                <span className="text-slate-600 text-sm">{mockJobDetails.parkingInfo}</span>
              </div>
              
              <div className="flex items-center mb-3">
                <Clock className="h-4 w-4 mr-2 text-orange-400" />
                <span className="text-slate-600 text-sm">{whenNeeded}</span>
              </div>
              
              <div className="clay-inner p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-red-400" />
                  <span className="text-slate-700">{distance} miles away</span>
                </div>
                <div className="text-blue-500 font-medium">
                  Est. {job.estimatedDuration} {job.estimatedDuration === 1 ? 'hour' : 'hours'}
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Work Details Section */}
          <div className="clay-card mb-4 p-4">
            <h3 className="text-md font-semibold text-slate-700 mb-3 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-500" />
              Payment & Work Details
            </h3>
            
            <div className="pl-2">
              <div className="flex items-center mb-3">
                <DollarSign className="h-4 w-4 mr-2 text-green-400" />
                <div className="bg-green-500 text-white px-3 py-1 rounded-full font-semibold">
                  ${mockJobDetails.paymentAmount}
                </div>
                <span className="text-slate-600 text-sm ml-2">paid immediately</span>
              </div>
              
              <div className="flex items-start mb-2">
                <FileText className="h-4 w-4 mr-2 text-slate-400 mt-1 flex-shrink-0" />
                <p className="text-slate-700 text-sm">{job.description}</p>
              </div>
              
              <div className="flex items-center">
                <Key className="h-4 w-4 mr-2 text-purple-400" />
                <span className="text-slate-600 text-sm">{mockJobDetails.accessDetails}</span>
              </div>
            </div>
          </div>

          {/* Parts & Requirements Section */}
          <div className="clay-card mb-4 p-4">
            <h3 className="text-md font-semibold text-slate-700 mb-3 flex items-center">
              <Package className="h-5 w-5 mr-2 text-slate-500" />
              Parts & Requirements
            </h3>
            
            <div className="pl-2 mb-4">
              {mockJobDetails.requiredParts.map((part, index) => (
                <div key={index} className="flex items-center mb-2">
                  <Package className="h-4 w-4 mr-2 text-purple-300" />
                  <span className="text-slate-700 text-sm">{part}</span>
                </div>
              ))}
            </div>
            
            <Button className="w-full clay-button bg-blue-500 hover:bg-blue-600 text-white">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Parts needed for this job
            </Button>
          </div>

          {/* Action Buttons */}
          {isScheduled ? (
            <div className="flex gap-3 mt-5 mb-2">
              <button 
                className="flex-1 clay-button bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-xl flex items-center justify-center"
                onClick={handleReschedule}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Reschedule
              </button>
              <button 
                className="flex-1 clay-button bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl flex items-center justify-center"
                onClick={handleStartJob}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Job
              </button>
            </div>
          ) : (
            <div className="flex gap-3 mt-5 mb-2">
              <Button 
                className="flex-1 clay-button bg-slate-200 hover:bg-slate-300 text-slate-700"
                onClick={() => onReject(job.id)}
              >
                Reject Job
              </Button>
              <Button 
                className="flex-1 clay-button bg-green-500 hover:bg-green-600 text-white"
                onClick={() => onAccept(job.id)}
              >
                Accept Job
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Use React Portal to render the modal at the document body level
  return createPortal(
    modalContent,
    document.body
  );
}
