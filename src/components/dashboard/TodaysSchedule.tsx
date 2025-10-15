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
        return 'border-l-amber-400';
      case 'RO':
        return 'border-l-orange-400';
      case 'Softener':
        return 'border-l-blue-400';
      case 'Whole House':
        return 'border-l-green-400';
      case 'Commercial':
        return 'border-l-red-400';
      default:
        return 'border-l-slate-400';
    }
  };

  const getJobTypeTextColor = (type: string) => {
    switch (type) {
      case 'UV':
        return 'text-amber-400';
      case 'RO':
        return 'text-orange-400';
      case 'Softener':
        return 'text-blue-400';
      case 'Whole House':
        return 'text-green-400';
      case 'Commercial':
        return 'text-red-400';
      default:
        return 'text-slate-400';
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
    <div className="px-2 py-2">
      <h2
        className="text-sm font-bold mb-2 px-1.5"
        style={{
          color: '#FFFFFF',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.4)',
          letterSpacing: '0.5px'
        }}
      >
        Today's Schedule
      </h2>

      <div
        className="flex overflow-x-auto gap-2.5 pb-2 px-1.5 snap-x snap-mandatory"
        style={{
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollPaddingLeft: '6px'
        }}
      >
        <style>{`
          .today-schedule-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {todaysJobs.length > 0 ? (
          todaysJobs.map((job) => (
            <div
              key={job.id}
              className={`flex-shrink-0 w-[220px] glass-card-elevated backdrop-blur-xl rounded-[14px] shadow-lg cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden border-l-[4px] snap-start ${getJobTypeAccentColor(job.type)}`}
              onClick={() => handleJobClick(job)}
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {formatTime(job.scheduledDate)}
                  </p>
                </div>

                <h3 className="font-bold text-white text-sm mb-1.5 leading-tight">
                  {job.customer.name}
                </h3>
                <p className="text-xs text-slate-300 mb-2 line-clamp-1 leading-relaxed">
                  {job.location.address}
                </p>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${getJobTypeTextColor(job.type)}`}>
                  {formatJobType(job.type)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex-shrink-0 w-[220px] glass-card-elevated backdrop-blur-xl rounded-[14px] border-2 border-dashed border-white/30 p-4 flex items-center justify-center shadow-lg snap-start">
            <p className="text-white text-sm font-semibold drop-shadow-lg">No jobs scheduled</p>
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
