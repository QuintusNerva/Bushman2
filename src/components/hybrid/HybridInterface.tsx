import { useState, useRef, useEffect } from 'react';
import { Job, Supplier } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Clock, MapPin, Phone, User, AlertTriangle, Calendar, CheckCircle, DollarSign, Menu, X, Filter, Plus, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { JobModal } from './JobModal';
import { ContactModal } from './ContactModal';

interface JobPinProps {
  job: Job;
  position: { top: string; left: string };
  isSelected: boolean;
  onClick: (job: Job) => void;
  scale: number;
}

function JobPin({ job, position, isSelected, onClick, scale }: JobPinProps) {
  const getPinColor = () => {
    if (job.priority === 'urgent') return 'bg-red-500 border-red-600';
    if (job.priority === 'high') return 'bg-orange-500 border-orange-600';
    return 'bg-blue-500 border-blue-600';
  };

  const pinSize = Math.max(20, 24 * scale); // Minimum size for touch targets
  const dotSize = Math.max(6, 8 * scale);

  return (
    <div
      style={{ 
        position: 'absolute', 
        top: position.top, 
        left: position.left,
        zIndex: isSelected ? 500 : 400,
        transform: 'translate(-50%, -50%)',
        width: `${pinSize}px`,
        height: `${pinSize}px`,
      }}
      className={cn(
        "rounded-full border-2 cursor-pointer transition-all duration-200 flex items-center justify-center",
        getPinColor(),
        isSelected ? "scale-125 shadow-lg" : "hover:scale-110 shadow-md"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick(job);
      }}
    >
      <div 
        className="bg-white rounded-full"
        style={{
          width: `${dotSize}px`,
          height: `${dotSize}px`,
        }}
      ></div>
      {/* Pin tail */}
      <div 
        className={cn(
          "absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-transparent",
          job.priority === 'urgent' ? "border-t-red-500" : 
          job.priority === 'high' ? "border-t-orange-500" : "border-t-blue-500"
        )}
        style={{
          borderLeftWidth: `${Math.max(3, 4 * scale)}px`,
          borderRightWidth: `${Math.max(3, 4 * scale)}px`,
          borderTopWidth: `${Math.max(6, 8 * scale)}px`,
        }}
      ></div>
    </div>
  );
}

interface CompactJobCardProps {
  job: Job;
  position: { top: string; left: string };
  onJobSelect: (job: Job) => void;
  onDragStart: (job: Job) => void;
  onClose: () => void;
  scale: number;
}

function CompactJobCard({ job, position, onJobSelect, onDragStart, onClose, scale }: CompactJobCardProps) {
  const formatPay = (duration: number) => {
    const hourlyRate = 85;
    const urgentMultiplier = job.priority === 'urgent' ? 1.5 : 1;
    return Math.round(duration * hourlyRate * urgentMultiplier);
  };

  const getDistance = () => {
    return `${(Math.random() * 5 + 0.5).toFixed(1)} mi`;
  };

  const cardWidth = Math.max(200, 240 * scale);
  const offsetY = Math.max(15, 20 * scale);

  return (
    <div
      style={{ 
        position: 'absolute', 
        top: position.top, 
        left: position.left,
        zIndex: 600,
        transform: `translate(-50%, calc(-100% - ${offsetY}px))`,
        width: `${cardWidth}px`,
      }}
      className="clay-card p-3 cursor-pointer hover:shadow-lg transition-all duration-200 animate-in slide-in-from-bottom-2"
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart(job);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onJobSelect(job);
      }}
    >
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute -top-1 -right-1 w-6 h-6 bg-slate-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-slate-700 transition-colors z-10"
      >
        <X className="w-3 h-3" />
      </button>

      <div className="flex items-start justify-between mb-2">
        {job.priority === 'urgent' && (
          <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            Urgent
          </Badge>
        )}
        <span className="text-sm font-bold text-green-600 ml-auto">
          ${formatPay(job.estimatedDuration)}
        </span>
      </div>
      
      <h3 className="font-semibold text-slate-800 text-sm mb-2 line-clamp-1">
        {job.title}
      </h3>
      
      <div className="text-xs text-slate-600 space-y-1">
        <div>{getDistance()} • {job.estimatedDuration}h</div>
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span className="line-clamp-1">{job.customer.name}</span>
        </div>
      </div>

      {/* Tap indicator */}
      <div className="text-xs text-slate-400 mt-2 text-center">
        Tap for details
      </div>
    </div>
  );
}

interface HybridInterfaceProps {
  jobs: Job[];
  suppliers: Supplier[];
  onJobSelect: (job: Job) => void;
  onJobAccept: (jobId: string) => void;
  onJobStatusUpdate: (jobId: string, updates: Partial<Job>) => void;
}

export function HybridInterface({ jobs, suppliers, onJobSelect, onJobAccept, onJobStatusUpdate }: HybridInterfaceProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [draggedJob, setDraggedJob] = useState<Job | null>(null);
  const [mapScale, setMapScale] = useState(1);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const timelineRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapContentRef = useRef<HTMLDivElement>(null);

  // Mock current user data
  const currentUser = {
    name: 'John Smith',
    status: 'Available',
    earnings: 1240
  };

  // Calculate stats
  const availableJobs = jobs.filter(job => job.status === 'unclaimed').length;
  const claimedJobs = jobs.filter(job => job.status === 'claimed' || job.status === 'quoted' || job.status === 'scheduled').length;

  // Generate time slots for timeline
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      const time = hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
      if (hour === 12) slots.push('12:00 PM');
      else slots.push(time);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Get scheduled jobs for timeline
  const getScheduledJob = (timeSlot: string) => {
    return jobs.find(job => {
      if (!job.scheduledDate) return false;
      const jobHour = job.scheduledDate.getHours();
      const slotHour = timeSlot.includes('AM') 
        ? (timeSlot.startsWith('12') ? 0 : parseInt(timeSlot))
        : (timeSlot.startsWith('12') ? 12 : parseInt(timeSlot) + 12);
      return jobHour === slotHour;
    });
  };

  // Map zoom handlers with proper event handling
  const handleZoomIn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMapScale(prev => {
      const newScale = Math.min(prev * 1.3, 3);
      console.log('Zooming in:', prev, '->', newScale);
      return newScale;
    });
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMapScale(prev => {
      const newScale = Math.max(prev / 1.3, 0.5);
      console.log('Zooming out:', prev, '->', newScale);
      return newScale;
    });
  };

  // Map pan handlers
  const handleMapMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.zoom-controls') || target.closest('.job-pin') || target.closest('.compact-job-card')) {
      return;
    }
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapPosition.x, y: e.clientY - mapPosition.y });
    setSelectedPin(null);
  };

  const handleMapMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setMapPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMapMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for map
  const handleMapTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const target = e.target as HTMLElement;
      if (target.closest('.zoom-controls') || target.closest('.job-pin') || target.closest('.compact-job-card')) {
        return;
      }
      
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - mapPosition.x, y: touch.clientY - mapPosition.y });
      setSelectedPin(null);
    }
  };

  const handleMapTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      setMapPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleMapTouchEnd = () => {
    setIsDragging(false);
  };

  const handlePinClick = (job: Job) => {
    if (selectedPin === job.id) {
      setSelectedPin(null);
    } else {
      setSelectedPin(job.id);
    }
  };

  const handleCompactCardClick = (job: Job) => {
    setSelectedJob(job);
    setSelectedPin(null);
  };

  const handleAcceptNow = () => {
    setShowContactModal(true);
  };

  const handleScheduleLater = () => {
    setSelectedJob(null);
  };

  const handleContactCustomer = (method: 'call' | 'text') => {
    if (selectedJob) {
      console.log(`${method} customer:`, selectedJob.customer.phone);
      onJobAccept(selectedJob.id);
      setShowContactModal(false);
      setSelectedJob(null);
    }
  };

  const handleDragStart = (job: Job) => {
    setDraggedJob(job);
    setSelectedPin(null);
  };

  const handleTimeSlotDrop = (timeSlot: string, event: React.DragEvent) => {
    event.preventDefault();
    if (draggedJob) {
      const today = new Date();
      const slotHour = timeSlot.includes('AM') 
        ? (timeSlot.startsWith('12') ? 0 : parseInt(timeSlot))
        : (timeSlot.startsWith('12') ? 12 : parseInt(timeSlot) + 12);
      
      const scheduledDate = new Date(today);
      scheduledDate.setHours(slotHour, 0, 0, 0);
      
      onJobStatusUpdate(draggedJob.id, {
        status: 'scheduled',
        scheduledDate,
        claimedBy: 'contractor-123'
      });
      
      setDraggedJob(null);
    }
  };

  const handleTimeSlotDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  // Position pins based on job locations
  const getPinPosition = (job: Job, index: number) => {
    const latRange = [28.3, 28.7];
    const lngRange = [-81.6, -81.1];
    
    const topPercent = ((latRange[1] - job.location.lat) / (latRange[1] - latRange[0])) * 100;
    const leftPercent = ((job.location.lng - lngRange[0]) / (lngRange[1] - lngRange[0])) * 100;
    
    return {
      top: `${Math.max(10, Math.min(90, topPercent))}%`,
      left: `${Math.max(10, Math.min(90, leftPercent))}%`
    };
  };

  // Add mouse leave handler to stop dragging
  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleTouchEnd = () => setIsDragging(false);
    
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Apply transform to map content
  useEffect(() => {
    if (mapContentRef.current) {
      mapContentRef.current.style.transform = `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapScale})`;
    }
  }, [mapScale, mapPosition]);

  return (
    <div className="h-full w-full flex flex-col clay-background">
      {/* Header Stats Bar */}
      <div className="clay-card m-4 mb-0 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">{currentUser.name}</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-600">{currentUser.status}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{availableJobs}</div>
              <div className="text-xs text-slate-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{claimedJobs}</div>
              <div className="text-xs text-slate-600">Claimed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-600">${currentUser.earnings}</div>
              <div className="text-xs text-slate-600">Today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex relative m-4 mt-3">
        {/* Map Background */}
        <div className={cn(
          "relative transition-all duration-300",
          sidebarOpen ? "w-full md:w-[70%]" : "w-full"
        )}>
          <div 
            ref={mapRef}
            className="h-full w-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg relative overflow-hidden border border-slate-200 shadow-lg select-none"
            onMouseDown={handleMapMouseDown}
            onMouseMove={handleMapMouseMove}
            onMouseUp={handleMapMouseUp}
            onMouseLeave={handleMapMouseUp}
            onTouchStart={handleMapTouchStart}
            onTouchMove={handleMapTouchMove}
            onTouchEnd={handleMapTouchEnd}
            style={{ 
              cursor: isDragging ? 'grabbing' : 'grab',
              touchAction: 'none'
            }}
          >
            {/* Zoomable Map Content */}
            <div 
              ref={mapContentRef}
              className="map-background absolute inset-0 transition-transform duration-200 ease-out"
              style={{
                transformOrigin: 'center center',
                willChange: 'transform'
              }}
            >
              {/* Map Grid Pattern */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg width="100%" height="100%" className="absolute inset-0">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              
              {/* Orlando Label */}
              <div className="absolute top-4 left-4 clay-card p-2 pointer-events-none">
                <div className="text-sm font-semibold text-slate-700">Orlando, FL</div>
              </div>

              {/* Map Features */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-0 right-0 h-1 bg-slate-300 opacity-60"></div>
                <div className="absolute top-2/3 left-0 right-0 h-1 bg-slate-300 opacity-60"></div>
                <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-slate-300 opacity-60"></div>
                <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-slate-300 opacity-60"></div>
                <div className="absolute bottom-1/4 right-1/4 w-16 h-12 bg-blue-200 rounded-full opacity-70"></div>
                <div className="absolute top-1/4 left-1/3 w-12 h-8 bg-green-200 rounded opacity-60"></div>
                <div className="absolute bottom-1/3 left-1/6 w-10 h-10 bg-green-200 rounded-full opacity-60"></div>
              </div>

              {/* Job Pins */}
              {jobs
                .filter(job => job.status === 'unclaimed')
                .map((job, index) => {
                  const position = getPinPosition(job, index);
                  return (
                    <div key={job.id}>
                      <div className="job-pin">
                        <JobPin
                          job={job}
                          position={position}
                          isSelected={selectedPin === job.id}
                          onClick={handlePinClick}
                          scale={mapScale}
                        />
                      </div>
                      
                      {/* Compact Job Card */}
                      {selectedPin === job.id && (
                        <div className="compact-job-card">
                          <CompactJobCard
                            job={job}
                            position={position}
                            onJobSelect={handleCompactCardClick}
                            onDragStart={handleDragStart}
                            onClose={() => setSelectedPin(null)}
                            scale={mapScale}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Zoom Controls */}
            <div className="zoom-controls absolute top-4 right-4 flex flex-col gap-2 z-50">
              <button
                onMouseDown={handleZoomIn}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleZoomIn(e as any);
                }}
                disabled={mapScale >= 3}
                className={cn(
                  "w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center transition-all duration-200 hover:shadow-xl",
                  mapScale >= 3 ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"
                )}
              >
                <Plus className="w-5 h-5 text-slate-700" />
              </button>
              <button
                onMouseDown={handleZoomOut}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleZoomOut(e as any);
                }}
                disabled={mapScale <= 0.5}
                className={cn(
                  "w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center transition-all duration-200 hover:shadow-xl",
                  mapScale <= 0.5 ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"
                )}
              >
                <Minus className="w-5 h-5 text-slate-700" />
              </button>
            </div>

            {/* Zoom Level Indicator */}
            <div className="absolute bottom-4 left-4 clay-card px-3 py-1 z-40">
              <span className="text-sm font-medium text-slate-700">{Math.round(mapScale * 100)}%</span>
            </div>
          </div>

          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute bottom-20 right-4 clay-floating-button z-40"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Collapsible Sidebar */}
        <div className={cn(
          "clay-card transition-all duration-300 overflow-hidden",
          sidebarOpen 
            ? "w-full md:w-[30%] ml-0 md:ml-3" 
            : "w-0 ml-0",
          "md:relative absolute inset-y-0 right-0 z-50"
        )}>
          {sidebarOpen && (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-800">Available Jobs</h3>
                  <button className="clay-icon-button text-slate-600">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-slate-600">
                  {availableJobs} jobs in your area
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {jobs
                  .filter(job => job.status === 'unclaimed')
                  .map(job => (
                    <div
                      key={job.id}
                      className="clay-card-sm p-2 cursor-pointer hover:shadow-md transition-all"
                      draggable
                      onDragStart={() => handleDragStart(job)}
                      onClick={() => handleCompactCardClick(job)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        {job.priority === 'urgent' && (
                          <Badge className="bg-red-500 text-white text-xs px-1 py-0.5">Urgent</Badge>
                        )}
                        <span className="text-sm font-bold text-green-600 ml-auto">
                          ${Math.round(job.estimatedDuration * 85 * (job.priority === 'urgent' ? 1.5 : 1))}
                        </span>
                      </div>
                      <h4 className="font-medium text-slate-800 text-sm mb-1 line-clamp-1">
                        {job.title}
                      </h4>
                      <div className="text-xs text-slate-600 space-y-0.5">
                        <div>{job.estimatedDuration}h • {job.customer.name}</div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="line-clamp-1">{job.location.address}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Timeline - Touch Scrollable */}
      <div className="clay-card m-4 mt-3 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800">Today's Schedule</h3>
          <div className="text-xs text-slate-500">
            Swipe to scroll →
          </div>
        </div>
        
        <div 
          ref={timelineRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide touch-pan-x"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {timeSlots.map(timeSlot => {
            const scheduledJob = getScheduledJob(timeSlot);
            
            return (
              <div
                key={timeSlot}
                className={cn(
                  "flex-shrink-0 w-24 h-16 clay-inner rounded-lg flex flex-col items-center justify-center text-xs transition-all",
                  scheduledJob ? "bg-blue-50 border-blue-200" : "border-dashed border-slate-300",
                  draggedJob && !scheduledJob && "border-blue-400 bg-blue-50"
                )}
                onDrop={(e) => handleTimeSlotDrop(timeSlot, e)}
                onDragOver={handleTimeSlotDragOver}
              >
                <div className="font-medium text-slate-700">{timeSlot}</div>
                {scheduledJob ? (
                  <div className="text-center mt-1">
                    <div className="text-blue-600 font-medium line-clamp-1">
                      {scheduledJob.customer.name}
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400 mt-1">Drop here</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Job Modal */}
      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onAcceptNow={handleAcceptNow}
          onScheduleLater={handleScheduleLater}
        />
      )}

      {/* Contact Modal */}
      {showContactModal && selectedJob && (
        <ContactModal
          job={selectedJob}
          onClose={() => setShowContactModal(false)}
          onContact={handleContactCustomer}
        />
      )}
    </div>
  );
}
