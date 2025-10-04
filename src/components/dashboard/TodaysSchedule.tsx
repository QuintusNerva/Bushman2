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
    <div className="px-3 py-4">
      <h2
        className="text-xl font-bold mb-4 px-2"
        style={{
          color: '#FFFFFF',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.4)',
          letterSpacing: '0.5px'
        }}
      >
        Today's Schedule
      </h2>

      <div
        className="flex overflow-x-auto gap-4 pb-3 px-2 snap-x snap-mandatory"
        style={{
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollPaddingLeft: '8px'
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
              className={`flex-shrink-0 w-[320px] bg-white/98 backdrop-blur-xl rounded-[20px] shadow-xl cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden border-l-[6px] snap-start ${getJobTypeAccentColor(job.type)}`}
              onClick={() => handleJobClick(job)}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {formatTime(job.scheduledDate)}
                  </p>
                </div>

                <h3 className="font-bold text-slate-900 text-lg mb-2 leading-tight">
                  {job.customer.name}
                </h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-1 leading-relaxed">
                  {job.location.address}
                </p>
                <p className={`text-sm font-bold uppercase tracking-wider ${getJobTypeTextColor(job.type)}`}>
                  {formatJobType(job.type)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex-shrink-0 w-[320px] bg-white/90 backdrop-blur-xl rounded-[20px] border-2 border-dashed border-white/70 p-8 flex items-center justify-center shadow-lg snap-start">
            <p className="text-white text-base font-semibold drop-shadow-lg">No jobs scheduled</p>
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
