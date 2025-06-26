import { Job } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Calendar } from 'lucide-react';

interface JobQuickViewProps {
  job: Job;
  onViewDetails: () => void;
  contractorLocation?: { lat: number; lng: number };
}

export function JobQuickView({ job, onViewDetails, contractorLocation }: JobQuickViewProps) {
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
    
    return `${distance.toFixed(1)} miles`;
  };

  // Get when job is needed
  const getWhenNeeded = () => {
    if (!job.scheduledDate) return "Flexible";
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const scheduledDate = new Date(job.scheduledDate);
    
    if (scheduledDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (scheduledDate.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return scheduledDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const distance = getDistance();
  const whenNeeded = getWhenNeeded();

  return (
    <div className="bg-white rounded-lg shadow-md p-3 min-w-[280px] max-w-[320px]">
      {/* First line: Job type and priority */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-slate-800 text-base">{job.title}</h3>
        <Badge className={`capitalize text-xs ${getPriorityColor(job.priority)}`}>
          {job.priority}
        </Badge>
      </div>
      
      {/* Second line: Address and distance */}
      <div className="flex items-center gap-1 mb-2 text-sm text-slate-600">
        <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
        <span className="truncate">{job.location.address}</span>
        {distance && (
          <span className="text-xs text-slate-500 whitespace-nowrap ml-1">
            • {distance}
          </span>
        )}
      </div>
      
      {/* Third line: Time estimate and when needed */}
      <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>Est. {job.estimatedDuration} {job.estimatedDuration === 1 ? 'hour' : 'hours'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{whenNeeded}</span>
        </div>
      </div>
      
      {/* View Details button */}
      <Button 
        className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm py-1 h-auto"
        onClick={onViewDetails}
      >
        View Details
      </Button>
    </div>
  );
}
