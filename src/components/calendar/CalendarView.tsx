import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Job } from '@/types';

interface CalendarViewProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
}

export function CalendarView({ jobs, onJobSelect }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Filter only scheduled jobs with dates
  const scheduledJobs = jobs.filter(job => job.scheduledDate);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSameDay = (date1: Date | null, date2: Date) => {
    if (!date1) return false;
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const hasJobs = (date: Date | null) => {
    if (!date) return false;
    return scheduledJobs.some(job => {
      const jobDate = new Date(job.scheduledDate!);
      return isSameDay(jobDate, date);
    });
  };

  const getJobsForDate = (date: Date) => {
    return scheduledJobs.filter(job => {
      const jobDate = new Date(job.scheduledDate!);
      return isSameDay(jobDate, date);
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const selectedJobs = getJobsForDate(selectedDate);

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Calendar Card */}
        <div className="glass-card-elevated p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">Schedule</h1>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6 bg-slate-800/50 rounded-xl p-3">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-slate-200" />
            </button>
            <h2 className="text-xl font-bold text-white">{monthYear}</h2>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-all"
            >
              <ChevronRight className="w-5 h-5 text-slate-200" />
            </button>
          </div>

          {/* Week Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {weekDays.map((day, index) => (
              <div key={index} className="text-center text-xs font-bold text-slate-400 py-2 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const hasJobsOnDay = day && hasJobs(day);
              const isTodayDay = isToday(day);
              const isSelected = day && isSameDay(day, selectedDate);

              return (
                <button
                  key={index}
                  onClick={() => day && setSelectedDate(day)}
                  disabled={!day}
                  className={`
                    aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-semibold relative
                    transition-all duration-200
                    ${!day ? 'invisible' : ''}
                    ${isTodayDay 
                      ? 'bg-blue-500 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900 shadow-lg' 
                      : ''
                    }
                    ${!isTodayDay && day && isSelected
                      ? 'bg-slate-700 text-white ring-2 ring-slate-600'
                      : ''
                    }
                    ${!isTodayDay && !isSelected && day
                      ? 'text-slate-200 hover:bg-slate-700/50 hover:text-white'
                      : ''
                    }
                  `}
                >
                  {day && (
                    <>
                      <span className="text-base">{day.getDate()}</span>
                      {hasJobsOnDay && (
                        <div className="flex gap-0.5 mt-1">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        </div>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-white">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            {selectedJobs.length > 0 && (
              <span className="text-sm text-slate-400">
                {selectedJobs.length} job{selectedJobs.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {selectedJobs.length > 0 ? (
            <div className="space-y-3">
              {selectedJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => onJobSelect(job)}
                  className="glass-card-elevated p-5 hover:scale-[1.01] transition-all duration-200 cursor-pointer border-l-4"
                  style={{
                    borderLeftColor: 
                      job.priority === 'urgent' ? '#ef4444' :
                      job.priority === 'high' ? '#f97316' :
                      job.priority === 'medium' ? '#eab308' : '#22c55e'
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        job.status === 'in-progress' ? 'bg-orange-400' : 
                        job.status === 'scheduled' ? 'bg-blue-400' : 'bg-green-400'
                      }`}></div>
                      <span className={`text-xs font-bold uppercase tracking-wide ${
                        job.status === 'in-progress' ? 'text-orange-400' : 
                        job.status === 'scheduled' ? 'text-blue-400' : 'text-green-400'
                      }`}>
                        {job.status === 'scheduled' ? 'Scheduled' : job.status === 'in-progress' ? 'In Progress' : 'Available'}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      job.priority === 'urgent' ? 'bg-red-500/20 text-red-300 ring-1 ring-red-500/30' :
                      job.priority === 'high' ? 'bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/30' :
                      job.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-500/30' :
                      'bg-green-500/20 text-green-300 ring-1 ring-green-500/30'
                    }`}>
                      {job.priority.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-lg mb-1">{job.title}</h3>
                  <p className="text-sm text-slate-300 mb-3">{job.customer.name}</p>
                  
                  {job.scheduledDate && (
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {formatTime(job.scheduledDate)}
                      </span>
                      <span>•</span>
                      <span>{job.estimatedDuration}h</span>
                      <span>•</span>
                      <span className="text-green-400 font-semibold">${job.payment?.total || 0}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-base font-medium">No jobs scheduled for this day</p>
              <p className="text-slate-500 text-sm mt-1">Select a date with a green dot to view jobs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
