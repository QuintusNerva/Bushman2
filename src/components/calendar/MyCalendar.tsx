import { useState } from 'react';
import { Job } from '@/types';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { MapPin, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MyCalendarProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
}

export function MyCalendar({ jobs, onJobSelect }: MyCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());

  const scheduledJobs = jobs.filter(job => job.status === 'scheduled' && job.scheduledDate);
  const scheduledDates = scheduledJobs.map(job => new Date(job.scheduledDate!));

  const jobsForSelectedDay = selectedDay
    ? scheduledJobs.filter(job => {
        const jobDate = new Date(job.scheduledDate!);
        return (
          jobDate.getDate() === selectedDay.getDate() &&
          jobDate.getMonth() === selectedDay.getMonth() &&
          jobDate.getFullYear() === selectedDay.getFullYear()
        );
      })
    : [];

  return (
    <div className="p-4 font-['Inter',system-ui,sans-serif] flex flex-col lg:flex-row gap-4 h-full">
      <Card className="clay-card lg:w-1/3">
        <CardContent className="p-2">
          <DayPicker
            mode="single"
            selected={selectedDay}
            onSelect={setSelectedDay}
            modifiers={{ scheduled: scheduledDates }}
            modifiersClassNames={{
              scheduled: 'day-scheduled',
            }}
            className="w-full"
            classNames={{
              root: 'w-full',
              caption: 'flex justify-center items-center relative mb-4',
              caption_label: 'text-lg font-bold text-slate-800',
              nav_button: 'h-8 w-8 clay-icon-button',
              head_row: 'flex justify-around',
              head_cell: 'w-10 h-10 flex items-center justify-center text-slate-500 font-medium',
              row: 'flex justify-around w-full mt-2',
              cell: 'w-10 h-10',
              day: 'w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors',
              day_today: 'bg-blue-100 text-blue-600 font-bold',
              day_selected: 'bg-blue-500 text-white hover:bg-blue-600',
              day_scheduled: 'relative !font-bold',
            }}
            components={{
              DayContent: (props) => (
                <div className="relative w-full h-full flex items-center justify-center">
                  {props.date.getDate()}
                  {scheduledDates.some(d => d.toDateString() === props.date.toDateString()) && (
                    <div className="absolute bottom-1 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  )}
                </div>
              ),
            }}
          />
        </CardContent>
      </Card>
      <div className="flex-1">
        <Card className="clay-card h-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold text-slate-800">
                Jobs for {selectedDay ? selectedDay.toLocaleDateString() : '...'}
              </CardTitle>
              <div className="swipe-indicator">
                Swipe to scroll <ChevronRight />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {jobsForSelectedDay.length > 0 ? (
              <div className="schedule-container scrollable-content">
                {jobsForSelectedDay.map(job => (
                  <div 
                    key={job.id} 
                    className="clay-card-sm p-3 cursor-pointer hover:shadow-md schedule-item"
                    onClick={() => onJobSelect(job)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-slate-800 text-sm">{job.title}</h4>
                      <Badge variant="outline" className="text-xs">{new Date(job.scheduledDate!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 truncate">{job.customer.name}</p>
                    <div className="text-xs text-slate-500 mt-2 space-y-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{job.location.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{job.estimatedDuration} hours</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-10">No jobs scheduled for this day.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
