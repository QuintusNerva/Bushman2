import { useState, useEffect } from 'react';
import { JobSidebar } from './components/jobs/JobSidebar';
import { InteractiveMap } from './components/map/InteractiveMap';
import { BottomNav } from './components/layout/BottomNav';
import { CalendarView } from './components/calendar/CalendarView';
import { StoreView } from './components/store/StoreView';
import { MessagesView } from './components/messages/MessagesView';
import { ContractorDashboard } from './components/profile/ContractorDashboard';
import { TravelScreen } from './components/travel/TravelScreen';
import { TodaysSchedule } from './components/dashboard/TodaysSchedule';
import { PopupCard } from './components/ui/popup-card';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { MapPin as MapPinIcon, Phone, Clock, Wrench, Navigation, User, MessageSquare, DollarSign } from 'lucide-react';
import { Job, Supplier } from './types';
import { mockJobs, mockSuppliers } from './data/mockData';
import { useGeolocation } from './hooks/useGeolocation';
import { useOffline } from './hooks/useOffline';
import { Alert, AlertDescription } from './components/ui/alert';
import { Wifi, WifiOff, MapPin } from 'lucide-react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedMapJob, setSelectedMapJob] = useState<Job | null>(null);
  const [selectedMapSupplier, setSelectedMapSupplier] = useState<Supplier | null>(null);
  const [travelingJob, setTravelingJob] = useState<Job | null>(null);

  const { position, error: geoError, getCurrentPosition } = useGeolocation();
  const { isOnline, wasOffline, cacheData, getCachedData } = useOffline();

  const contractorLocation = position || { lat: 28.5383, lng: -81.3792 };

  // Initialize jobs state with enhanced mock data
  const [enhancedMockJobs, setEnhancedMockJobs] = useState<Job[]>(() => {
    const today = new Date();
    return mockJobs.map((job, index) => {
      if (index % 3 === 0) {
        const scheduledDate = new Date(today);
        scheduledDate.setHours(9 + (index % 8), 0, 0, 0);
        return {
          ...job,
          scheduledDate,
          status: index % 2 === 0 ? ('scheduled' as const) : ('claimed' as const)
        };
      }
      return job;
    });
  });

  useEffect(() => {
    getCurrentPosition().catch(() => {});
  }, [getCurrentPosition]);

  useEffect(() => {
    if (!isOnline) {
      cacheData('jobs', enhancedMockJobs, 86400000);
    }
  }, [isOnline, cacheData, enhancedMockJobs]);

  const handleJobSelect = (job: Job) => {
    setSidebarOpen(true);
    console.log('Selected job:', job);
  };

  const handleStartTravel = (job: Job) => {
    setTravelingJob(job);
  };

  const handleTravelComplete = () => {
    setTravelingJob(null);
    setActiveTab('jobs');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const navigateToProfile = () => {
    setActiveTab('profile');
    console.log('Navigating to profile');
  };

  const handleAcceptJob = (jobId: string) => {
    // Find the job and update it to scheduled status
    setEnhancedMockJobs(prevJobs => {
      return prevJobs.map(job => {
        if (job.id === jobId && job.status === 'unclaimed') {
          // Schedule for the next available hour (or now if available)
          const scheduledDate = new Date();
          scheduledDate.setMinutes(0, 0, 0); // Round to the hour
          
          // If current time is past the hour, schedule for next hour
          if (new Date().getMinutes() > 0) {
            scheduledDate.setHours(scheduledDate.getHours() + 1);
          }

          // Calculate payment if not present
          const payment = job.payment || {
            hourlyRate: 125,
            total: job.estimatedDuration * 125,
          };

          toast.success('Job Accepted!', {
            description: `${job.title} has been added to your schedule.`,
          });

          return {
            ...job,
            status: 'scheduled' as const,
            scheduledDate,
            payment,
          };
        }
        return job;
      });
    });
    setSelectedMapJob(null);
  };

  const handleAcceptMapJob = (jobId: string) => {
    const job = enhancedMockJobs.find(j => j.id === jobId);
    if (job) {
      handleStartTravel(job);
    }
    setSelectedMapJob(null);
  };

  const formatJobType = (type: string) => {
    const typeMap: Record<string, string> = {
      'RO': 'Reverse Osmosis System',
      'UV': 'UV Light System',
      'Softener': 'Water Softener',
      'Whole House': 'Whole House System',
      'Commercial': 'Commercial System'
    };
    return typeMap[type] || type;
  };

  const formatScheduledTime = (job: Job) => {
    if (job.status === 'unclaimed') return 'Available Now';
    if (job.scheduledDate) {
      const date = new Date(job.scheduledDate);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
    return 'TBD';
  };

  const getPriorityBadgeClass = (priority: string) => {
    const classes = {
      low: 'bg-green-500/20 text-green-400 border-green-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      high: 'bg-red-500/20 text-red-400 border-red-500/30',
      urgent: 'bg-red-600 text-white border-red-700 glow-gold'
    };
    return classes[priority as keyof typeof classes] || classes.medium;
  };

  const calculateDistance = (targetLat: number, targetLng: number) => {
    const R = 3959;
    const dLat = (targetLat - contractorLocation.lat) * Math.PI / 180;
    const dLon = (targetLng - contractorLocation.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(contractorLocation.lat * Math.PI / 180) *
      Math.cos(targetLat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const calculateDriveTime = (distance: number) => {
    const avgSpeed = 35;
    const timeInHours = distance / avgSpeed;
    const minutes = Math.round(timeInHours * 60);
    return minutes < 1 ? '<1' : minutes.toString();
  };

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'jobs':
        return (
          <div className="relative h-full">
            {/* Full-screen Map Background */}
            <div className="absolute inset-0 z-0">
              <InteractiveMap
                jobs={enhancedMockJobs}
                suppliers={mockSuppliers}
                onJobSelect={handleJobSelect}
                onToggleSidebar={toggleSidebar}
                sidebarOpen={sidebarOpen}
                className="h-full w-full"
                onJobMarkerClick={setSelectedMapJob}
                onSupplierMarkerClick={setSelectedMapSupplier}
                selectedJobId={selectedMapJob?.id || null}
                selectedSupplierId={selectedMapSupplier?.id || null}
              />

              <JobSidebar
                jobs={enhancedMockJobs.filter(job => job.status === 'unclaimed')}
                onJobSelect={handleJobSelect}
                open={sidebarOpen}
                onOpenChange={setSidebarOpen}
              />
            </div>

            {/* Profile Card - Modern Dark Design */}
            <div className="absolute top-0 left-0 right-0 z-20 p-2">
              <div
                className="glass-card-elevated cursor-pointer hover:transform hover:scale-[1.02] transition-all duration-300 mx-2"
                onClick={navigateToProfile}
                style={{ maxWidth: '480px', margin: '0 auto' }}
              >
                <div className="px-4 py-3">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative">
                      <img
                        src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100"
                        alt="Ethan Carter"
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-blue-500/50 shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#2a2f38] shadow-lg glow-green"></div>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mb-1">Technician</p>
                      <h3 className="text-base font-bold text-white leading-tight">Ethan Carter</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="glass-card bg-blue-500/10 border-blue-500/20 rounded-xl px-3 py-2.5 text-center">
                      <p className="text-[10px] text-blue-400 font-semibold mb-1 tracking-wide uppercase">Scheduled</p>
                      <p className="text-2xl font-bold text-white">3</p>
                    </div>
                    <div className="glass-card bg-green-500/10 border-green-500/20 rounded-xl px-3 py-2.5 text-center">
                      <p className="text-[10px] text-green-400 font-semibold mb-1 tracking-wide uppercase">Available</p>
                      <p className="text-2xl font-bold text-white">2</p>
                    </div>
                    <div className="glass-card bg-amber-500/10 border-amber-500/20 rounded-xl px-3 py-2.5 text-center glow-gold">
                      <p className="text-[10px] text-amber-400 font-semibold mb-1 tracking-wide uppercase">Earnings</p>
                      <p className="text-2xl font-bold text-white">$450</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlaid Today's Schedule - Transparent */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
              <TodaysSchedule jobs={enhancedMockJobs} contractorLocation={contractorLocation} />
            </div>
          </div>
        );
      case 'calendar':
        return <CalendarView jobs={enhancedMockJobs} onJobSelect={handleJobSelect} />;
      case 'store':
        return <StoreView />;
      case 'messages':
        return <MessagesView />;
      case 'profile':
        return <ContractorDashboard />;
      default:
        return null;
    }
  };

  if (travelingJob) {
    return (
      <TravelScreen
        job={travelingJob}
        onBack={() => setTravelingJob(null)}
        onTravelComplete={handleTravelComplete}
      />
    );
  }

  return (
    <div className="app-container min-h-screen pb-20" style={{ 
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1d23 100%)',
      minHeight: '100vh'
    }}>
      <Toaster position="top-center" />
      {!isOnline && (
        <Alert className="fixed top-2 left-2 right-2 z-50 glass-card border-orange-500/30 bg-orange-500/10">
          <WifiOff className="h-5 w-5 text-orange-400" />
          <AlertDescription className="text-orange-200 font-medium ml-2">
            You're offline. Some features may be limited.
          </AlertDescription>
        </Alert>
      )}

      {wasOffline && isOnline && (
        <Alert className="fixed top-2 left-2 right-2 z-50 glass-card border-green-500/30 bg-green-500/10">
          <Wifi className="h-5 w-5 text-green-400" />
          <AlertDescription className="text-green-200 font-medium ml-2">
            You're back online!
          </AlertDescription>
        </Alert>
      )}

      {position && (
        <div className="fixed top-2 right-2 z-40 glass-card px-3 py-2 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-400" />
          <span className="text-xs text-blue-200 font-medium">
            Location Active
          </span>
        </div>
      )}

      <div className="h-[calc(100vh-5rem)]">
        {renderTabContent()}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Map Pin Job Details Modal - Rendered at root level for proper z-index */}
      {selectedMapJob && selectedMapJob.customer && selectedMapJob.location && (
        <PopupCard
          isOpen={true}
          onClose={() => setSelectedMapJob(null)}
          title={selectedMapJob.status === 'unclaimed' ? 'Available Job' : `Job #${selectedMapJob.id.slice(0, 8).toUpperCase()}`}
          maxWidth="600px"
          aria-label={`Job details for ${selectedMapJob.customer.name}`}
        >
          {selectedMapJob.status === 'unclaimed' ? (
            // Available Job - Detailed view with Accept button
            <div className="space-y-3">
              {/* Job Header */}
              <div className="glass-card p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-bold text-white">{selectedMapJob.title}</h3>
                  <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${getPriorityBadgeClass(selectedMapJob.priority)}`}>
                    {selectedMapJob.priority}
                  </span>
                </div>
                <p className="text-slate-300">{formatJobType(selectedMapJob.type)} System</p>
              </div>

              {/* Customer Information */}
              <div className="glass-card p-4">
                <h3 className="text-md font-bold text-white mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-purple-400" />
                  Customer Information
                </h3>
                <div className="pl-2">
                  <div className="flex items-center mb-2">
                    <Phone className="w-4 h-4 mr-2 text-pink-400" />
                    <span className="text-slate-200">{selectedMapJob.customer.name} • {selectedMapJob.customer.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <MessageSquare className="w-4 h-4 mr-2 text-blue-400 mt-1 flex-shrink-0" />
                    <p className="text-slate-300 text-sm">"{selectedMapJob.description}"</p>
                  </div>
                </div>
              </div>

              {/* Location & Timing */}
              <div className="glass-card p-4">
                <h3 className="text-md font-bold text-white mb-3 flex items-center">
                  <MapPinIcon className="w-5 h-5 mr-2 text-red-400" />
                  Location & Timing
                </h3>
                <div className="pl-2">
                  <div className="flex items-start mb-2">
                    <MapPinIcon className="w-4 h-4 mr-2 text-red-400 mt-1 flex-shrink-0" />
                    <span className="text-slate-200">{selectedMapJob.location.address}</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <Clock className="w-4 h-4 mr-2 text-orange-400" />
                    <span className="text-slate-300 text-sm">{formatScheduledTime(selectedMapJob)}</span>
                  </div>
                  <div className="glass-card-subtle p-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <Navigation className="w-4 h-4 mr-2 text-cyan-400" />
                      <span className="text-slate-200">{calculateDistance(selectedMapJob.location.lat, selectedMapJob.location.lng)} miles away</span>
                    </div>
                    <div className="text-blue-400 font-semibold">
                      Est. {selectedMapJob.estimatedDuration} {selectedMapJob.estimatedDuration === 1 ? 'hour' : 'hours'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              {selectedMapJob.payment && (
                <div className="glass-card p-4">
                  <h3 className="text-md font-bold text-white mb-3 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                    Payment Details
                  </h3>
                  <div className="pl-2">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                      <div className="bg-gradient-to-r from-green-500 to-green-400 text-white px-4 py-1.5 rounded-full font-bold">
                        ${selectedMapJob.payment.total}
                      </div>
                      <span className="text-slate-300 text-sm ml-2">paid immediately</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button onClick={() => setSelectedMapJob(null)} variant="outline" className="flex-1 border-white/30 hover:bg-white/10 text-white">
                  Decline
                </Button>
                <Button
                  onClick={() => {
                    handleAcceptJob(selectedMapJob.id);
                    setSelectedMapJob(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white transition-all"
                >
                  Accept Job
                </Button>
              </div>
            </div>
          ) : (
            // Scheduled Job - Simple view with Start Travel button
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{selectedMapJob.customer.name}</h3>
                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${getPriorityBadgeClass(selectedMapJob.priority)}`}>
                  {selectedMapJob.priority}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-400">Address</p>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMapJob.location.lat},${selectedMapJob.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      {selectedMapJob.location.address}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-400">Phone</p>
                    <a
                      href={`tel:${selectedMapJob.customer.phone}`}
                      className="text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      {selectedMapJob.customer.phone}
                    </a>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <div className="flex items-start gap-3 mb-3">
                    <Wrench className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-400">Job Type</p>
                      <p className="text-white">{formatJobType(selectedMapJob.type)}</p>
                    </div>
                  </div>

                  {selectedMapJob.description && (
                    <p className="text-sm text-slate-300 mb-3">{selectedMapJob.description}</p>
                  )}

                  <div className="flex items-start gap-3 mb-3">
                    <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-400">Scheduled</p>
                      <p className="text-white">{formatScheduledTime(selectedMapJob)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mb-3">
                    <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-400">Duration</p>
                      <p className="text-white">{selectedMapJob.estimatedDuration} {selectedMapJob.estimatedDuration === 1 ? 'hour' : 'hours'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Navigation className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-400">Distance & Drive Time</p>
                      <p className="text-white">
                        {calculateDistance(selectedMapJob.location.lat, selectedMapJob.location.lng)} miles
                        <span className="text-slate-400"> • ~{calculateDriveTime(parseFloat(calculateDistance(selectedMapJob.location.lat, selectedMapJob.location.lng)))} min drive</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <Button onClick={() => setSelectedMapJob(null)} variant="outline" className="flex-1 border-white/20 hover:bg-white/10">
                  Close
                </Button>
                <Button
                  onClick={() => handleAcceptMapJob(selectedMapJob.id)}
                  className="flex-[2] btn-primary"
                >
                  Start Travel
                </Button>
              </div>
            </div>
          )}
        </PopupCard>
      )}

      {/* Supply House Details Modal - Rendered at root level for proper z-index */}
      {selectedMapSupplier && (
        <PopupCard
          isOpen={true}
          onClose={() => setSelectedMapSupplier(null)}
          title={selectedMapSupplier.name}
          maxWidth="600px"
          aria-label={`Supply house details for ${selectedMapSupplier.name}`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">🏢</div>
              <h3 className="text-xl font-bold text-white">{selectedMapSupplier.name}</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-400">Address</p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMapSupplier.location.lat},${selectedMapSupplier.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {selectedMapSupplier.address}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-400">Phone</p>
                  <a
                    href={`tel:${selectedMapSupplier.phone}`}
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {selectedMapSupplier.phone}
                  </a>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3">
                <div className="flex items-start gap-3 mb-3">
                  <Clock className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-400">Hours Today</p>
                    <p className="text-white">
                      {selectedMapSupplier.hours ? `${selectedMapSupplier.hours.open} - ${selectedMapSupplier.hours.close}` : 'Hours not available'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <Navigation className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-400">Distance</p>
                    <p className="text-white">
                      {calculateDistance(selectedMapSupplier.location.lat, selectedMapSupplier.location.lng)} miles
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-400">Drive Time</p>
                    <p className="text-white">
                      ~{calculateDriveTime(parseFloat(calculateDistance(selectedMapSupplier.location.lat, selectedMapSupplier.location.lng)))} minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-white/10">
              <Button onClick={() => setSelectedMapSupplier(null)} variant="outline" className="flex-1 border-white/20 hover:bg-white/10">
                Close
              </Button>
              <Button
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${selectedMapSupplier.location.lat},${selectedMapSupplier.location.lng}`,
                    '_blank'
                  );
                }}
                className="flex-1 btn-primary"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
              <Button
                onClick={() => {
                  window.location.href = `tel:${selectedMapSupplier.phone}`;
                }}
                className="btn-accent"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            </div>
          </div>
        </PopupCard>
      )}
    </div>
  );
}

export default App;
