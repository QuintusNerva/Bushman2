import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/types';
import { Clock, MapPin, Phone, Mail, AlertTriangle } from 'lucide-react';

interface JobSidebarProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobSidebar({ jobs, onJobSelect, open, onOpenChange }: JobSidebarProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    onJobSelect(job);
  };

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-y-auto z-50">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Available Jobs</SheetTitle>
        </SheetHeader>
        
        <div className="job-list divide-y">
          {jobs.map((job) => (
            <div 
              key={job.id}
              className={`p-4 cursor-pointer transition-colors ${
                selectedJob?.id === job.id 
                  ? 'bg-blue-50' 
                  : 'hover:bg-slate-50'
              }`}
              onClick={() => handleJobClick(job)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{job.title}</h3>
                <Badge className={`capitalize ${getPriorityColor(job.priority)}`}>
                  {job.priority}
                </Badge>
              </div>
              
              <p className="text-sm text-slate-600 mb-3">{job.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location.address}</span>
                </div>
                
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock className="h-4 w-4" />
                  <span>Est. {job.estimatedDuration} {job.estimatedDuration === 1 ? 'hour' : 'hours'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-slate-500">
                  <Phone className="h-4 w-4" />
                  <span>{job.customer.phone}</span>
                </div>
                
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail className="h-4 w-4" />
                  <span>{job.customer.email}</span>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button className="flex-1">Claim Job</Button>
                <Button variant="outline" className="flex-1">Contact Customer</Button>
              </div>
            </div>
          ))}
          
          {jobs.length === 0 && (
            <div className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-medium mb-1">No jobs available</h3>
              <p className="text-sm text-slate-500">There are no jobs available in your area at the moment.</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
