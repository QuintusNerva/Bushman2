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

  const getJobTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'UV':
        return 'bg-amber-500 text-white';
      case 'RO':
        return 'bg-orange-500 text-white';
      case 'Softener':
        return 'bg-blue-500 text-white';
      case 'Whole House':
        return 'bg-green-500 text-white';
      case 'Commercial':
        return 'bg-red-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  const formatJobType = (type: string) => {
    if (type === 'RO') return 'RO SYSTEM';
    if (type === 'UV') return 'UV SYSTEM';
    return type.toUpperCase().replace(' ', ' ');
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg px-4 py-3 border border-white/50">
      <h2 className="text-lg font-bold text-slate-800 mb-3">Today's Schedule</h2>

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
              className="flex-shrink-0 w-[240px] bg-white rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden border border-slate-200"
              onClick={() => handleJobClick(job)}
            >
              <div className="p-4">
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  {job.customer.name}
                </h3>
                <p className="text-sm text-slate-600 mb-3 line-clamp-1">
                  {job.location.address}
                </p>
                <div className="inline-block">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${getJobTypeBadgeColor(job.type)}`}>
                    {formatJobType(job.type)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex-shrink-0 w-[240px] bg-white/50 rounded-2xl border-2 border-dashed border-slate-300 p-6 flex items-center justify-center">
            <p className="text-slate-400 text-sm font-medium">No jobs scheduled</p>
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
