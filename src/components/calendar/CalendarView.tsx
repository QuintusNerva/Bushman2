import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarJob {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'in-progress' | 'scheduled';
  image?: string;
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('month');

  const jobs: CalendarJob[] = [
    {
      id: '1',
      title: 'Install Kitchen Cabinets',
      date: new Date(2024, 9, 5),
      startTime: '9:00 AM',
      endTime: '12:00 PM',
      status: 'in-progress',
      image: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'Bathroom Remodel',
      date: new Date(2024, 9, 5),
      startTime: '1:00 PM',
      endTime: '5:00 PM',
      status: 'scheduled',
      image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'Install Hardwood Flooring',
      date: new Date(2024, 9, 16),
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      status: 'scheduled',
      image: 'https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

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
    return jobs.some(job => isSameDay(job.date, date));
  };

  const getJobsForDate = (date: Date) => {
    return jobs.filter(job => isSameDay(job.date, date));
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
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const selectedJobs = getJobsForDate(selectedDate);

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <div className="w-6 h-6 flex flex-col justify-center gap-1">
                <div className="h-0.5 bg-slate-800 w-5"></div>
                <div className="h-0.5 bg-slate-800 w-5"></div>
                <div className="h-0.5 bg-slate-800 w-5"></div>
              </div>
            </button>
            <h1 className="text-xl font-bold text-slate-900">Schedule</h1>
            <div className="w-10"></div>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setCurrentView('day')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentView === 'day'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setCurrentView('week')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentView === 'week'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setCurrentView('month')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentView === 'month'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Month
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h2 className="text-lg font-bold text-slate-900">{monthYear}</h2>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day, index) => (
              <div key={index} className="text-center text-sm font-medium text-slate-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => day && setSelectedDate(day)}
                disabled={!day}
                className={`
                  aspect-square rounded-xl flex items-center justify-center text-sm font-medium relative
                  transition-all duration-200
                  ${!day ? 'invisible' : ''}
                  ${isToday(day) ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : ''}
                  ${!isToday(day) && day ? 'text-slate-900 hover:bg-slate-100' : ''}
                  ${isSameDay(day, selectedDate) && !isToday(day) ? 'bg-slate-100' : ''}
                `}
              >
                {day && day.getDate()}
                {day && hasJobs(day) && !isToday(day) && (
                  <div className="absolute bottom-1 w-1 h-1 bg-green-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 px-1">
            Jobs on {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </h2>

          {selectedJobs.length > 0 ? (
            selectedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        job.status === 'in-progress' ? 'bg-orange-500' : 'bg-green-500'
                      }`}></div>
                      <span className={`text-xs font-semibold ${
                        job.status === 'in-progress' ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {job.status === 'in-progress' ? 'In Progress' : 'Scheduled'}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">{job.title}</h3>
                    <p className="text-sm text-slate-600">
                      {job.startTime} - {job.endTime}
                    </p>
                  </div>
                  {job.image && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={job.image}
                        alt={job.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <p className="text-slate-400 text-sm">No jobs scheduled for this day</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
