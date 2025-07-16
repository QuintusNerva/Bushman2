import { useState } from 'react';
import { Job } from '@/types';
import { JobDetailsModal } from '@/components/job/JobDetailsModal';
import { ChevronRight } from 'lucide-react';

interface TodaysScheduleProps {
  jobs: Job[];
  contractorLocation?: { lat: number; lng: number };
}

export function TodaysSchedule({ jobs, contractorLocation }: TodaysScheduleProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter jobs for today
  const todaysJobs = jobs.filter(job => {
    if (!job.scheduledDate) return false;
    
    const jobDate = new Date(job.scheduledDate);
    jobDate.setHours(0, 0, 0, 0);
    
    return jobDate.getTime() === today.getTime() && 
           (job.status === 'scheduled' || job.status === 'claimed');
  });

  // Generate time slots from 8 AM to 5 PM
  const timeSlots = [];
  for (let hour = 8; hour <= 17; hour++) {
    const time = new Date();
    time.setHours(hour, 0, 0, 0);
    timeSlots.push(time);
  }

  // Get job for a specific time slot
  const getJobForTimeSlot = (time: Date) => {
    return todaysJobs.find(job => {
      if (!job.scheduledDate) return false;
      
      const jobTime = new Date(job.scheduledDate);
      return jobTime.getHours() === time.getHours();
    });
  };

  // Handle job click
  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle job accept/reject (placeholder functions)
  const handleAcceptJob = (jobId: string) => {
    console.log('Accept job:', jobId);
    setIsModalOpen(false);
  };

  const handleRejectJob = (jobId: string) => {
    console.log('Reject job:', jobId);
    setIsModalOpen(false);
  };

  // Get job type color
  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'UV':
        return 'border-amber-400 bg-amber-50';
      case 'RO':
        return 'border-blue-400 bg-blue-50';
      case 'Softener':
        return 'border-green-400 bg-green-50';
      case 'Whole House':
        return 'border-purple-400 bg-purple-50';
      case 'Commercial':
        return 'border-red-400 bg-red-50';
      default:
        return 'border-slate-400 bg-slate-50';
    }
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="clay-card p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">Today's Schedule</h2>
      </div>
      
      <div className="scrollable-content flex overflow-x-auto gap-3 pb-2" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {timeSlots.map((time, index) => {
          const job = getJobForTimeSlot(time);
          
          return (
            <div key={index} className="flex-shrink-0 w-[160px]">
              <div className="text-sm font-medium text-slate-700 mb-1">
                {formatTime(time)}
              </div>
              
              {job ? (
                <div 
                  className={`clay-card-sm p-3 cursor-pointer hover:shadow-md border-l-4 ${getJobTypeColor(job.type)}`}
                  onClick={() => handleJobClick(job)}
                >
                  <div className="font-medium text-slate-800 mb-1">
                    {job.title}
                  </div>
                  <div className="text-sm text-blue-500">
                    {job.customer.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-1">
                    {job.location.address}
                  </div>
                  {job.priority === 'urgent' && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
              ) : (
                <div className="clay-card-sm p-3 border border-dashed border-slate-300 bg-slate-50 text-slate-400 flex items-center justify-center h-[90px]">
                  <span className="text-sm">Available</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="swipe-indicator mt-2 text-center text-slate-400 text-xs">
        Swipe for more <ChevronRight className="inline h-3 w-3" />
      </div>
      
      {/* Job details modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAccept={handleAcceptJob}
        onReject={handleRejectJob}
        contractorLocation={contractorLocation}
      />
    </div>
  );
}
