import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  type: 'installation' | 'maintenance' | 'repair' | 'consultation';
  customer: string;
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  
  // Sample calendar events
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Water Softener Installation',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
      startTime: '09:00',
      endTime: '11:00',
      location: '123 Main St, Orlando, FL',
      type: 'installation',
      customer: 'Jane Doe'
    },
    {
      id: '2',
      title: 'RO System Maintenance',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1),
      startTime: '13:00',
      endTime: '14:30',
      location: '456 Oak Ave, Orlando, FL',
      type: 'maintenance',
      customer: 'John Smith'
    },
    {
      id: '3',
      title: 'UV Light Replacement',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2),
      startTime: '10:00',
      endTime: '11:00',
      location: '789 Pine Rd, Orlando, FL',
      type: 'repair',
      customer: 'Bob Johnson'
    },
    {
      id: '4',
      title: 'Water Quality Consultation',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 3),
      startTime: '15:00',
      endTime: '16:00',
      location: '101 Elm Blvd, Orlando, FL',
      type: 'consultation',
      customer: 'Sarah Williams'
    }
  ];
  
  // Get events for the current week
  const getWeekEvents = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return events.filter(event => {
      return event.date >= startOfWeek && event.date <= endOfWeek;
    });
  };
  
  // Get days of the current week
  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Format day for display
  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };
  
  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      return event.date.getDate() === date.getDate() &&
             event.date.getMonth() === date.getMonth() &&
             event.date.getFullYear() === date.getFullYear();
    });
  };
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };
  
  // Navigate to next week
  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };
  
  // Get event type badge color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'installation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'repair':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'consultation':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };
  
  const weekDays = getWeekDays();
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Calendar</h1>
      
      {/* Calendar header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-slate-500" />
              <CardTitle className="text-lg">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </CardTitle>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button 
              variant={currentView === 'day' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setCurrentView('day')}
            >
              Day
            </Button>
            <Button 
              variant={currentView === 'week' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setCurrentView('week')}
            >
              Week
            </Button>
            <Button 
              variant={currentView === 'month' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setCurrentView('month')}
            >
              Month
            </Button>
          </div>
          
          {/* Week view */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => (
              <div key={index} className="text-center">
                <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-blue-600' : 'text-slate-600'}`}>
                  {formatDay(day)}
                </div>
                <div 
                  className={`rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 ${
                    isToday(day) 
                      ? 'bg-blue-500 text-white' 
                      : 'text-slate-800'
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Events for the week */}
      <div className="space-y-4">
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          
          if (dayEvents.length === 0) return null;
          
          return (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className={isToday(day) ? 'text-blue-600' : 'text-slate-800'}>
                    {formatDay(day)}, {formatDate(day)}
                  </span>
                  {isToday(day) && (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      Today
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dayEvents.map((event) => (
                    <div 
                      key={event.id}
                      className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{event.title}</h3>
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        
                        <div>Customer: {event.customer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
