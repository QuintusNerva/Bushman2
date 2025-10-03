import { useState } from 'react';
import { Job } from '@/types';
import { JobDetailsModal } from '@/components/job/JobDetailsModal';

interface TodaysScheduleProps {
  jobs: Job[];
  contractorLocation?: { lat: number; lng: number };
}

export function TodaysSchedule({ jobs, contractorLocation }: TodaysScheduleProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysJobs = jobs.filter(job => {
    if (!job.scheduledDate) return false;

    const jobDate = new Date(job.scheduledDate);
    jobDate.setHours(0, 0, 0, 0);

    return jobDate.getTime() === today.getTime() &&
           (job.status === 'scheduled' || job.status === 'claimed');
  });

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAcceptJob = (jobId: string) => {
    console.log('Accept job:', jobId);
    setIsModalOpen(false);
  };

  const handleRejectJob = (jobId: string) => {
    console.log('Reject job:', jobId);
    setIsModalOpen(false);
  };

  const getJobTypeAccentColor = (type: string) => {
    switch (type) {
      case 'UV':
        return 'border-l-amber-500';
      case 'RO':
        return 'border-l-orange-500';
      case 'Softener':
        return 'border-l-blue-500';
      case 'Whole House':
        return 'border-l-green-500';
      case 'Commercial':
        return 'border-l-red-500';
      default:
        return 'border-l-slate-500';
    }
  };

  const getJobTypeTextColor = (type: string) => {
    switch (type) {
      case 'UV':
        return 'text-amber-600';
      case 'RO':
        return 'text-orange-600';
      case 'Softener':
        return 'text-blue-600';
      case 'Whole House':
        return 'text-green-600';
      case 'Commercial':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  const formatJobType = (type: string) => {
    if (type === 'RO') return 'RO SYSTEM';
    if (type === 'UV') return 'UV SYSTEM';
    if (type === 'Softener') return 'WATER SOFTENER';
    return type.toUpperCase().replace(' ', ' ');
  };

  const formatTime = (date: Date | undefined) => {
    if (!date) return '9:00 AM';
    const jobDate = new Date(date);
    return jobDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="px-4 py-3">
      <h2 className="text-lg font-bold text-white mb-3 drop-shadow-lg">Today's Schedule</h2>

      <div
        className="flex overflow-x-auto gap-3 pb-2 -mx-1 px-1"
        style={{
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <style>{`
          .scrollable-content::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {todaysJobs.length > 0 ? (
          todaysJobs.map((job) => (
            <div
              key={job.id}
              className={`flex-shrink-0 w-[280px] bg-white/95 backdrop-blur-md rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 overflow-hidden border-l-4 ${getJobTypeAccentColor(job.type)}`}
              onClick={() => handleJobClick(job)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-500">
                    {formatTime(job.scheduledDate)}
                  </p>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1">
                  {job.customer.name}
                </h3>
                <p className="text-sm text-slate-600 mb-3 line-clamp-1">
                  {job.location.address}
                </p>
                <p className={`text-xs font-bold uppercase tracking-wide ${getJobTypeTextColor(job.type)}`}>
                  {formatJobType(job.type)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex-shrink-0 w-[280px] bg-white/80 backdrop-blur-md rounded-2xl border-2 border-dashed border-white/60 p-6 flex items-center justify-center">
            <p className="text-white text-sm font-medium drop-shadow-md">No jobs scheduled</p>
          </div>
        )}
      </div>

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
