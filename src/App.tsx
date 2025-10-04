import { useState, useEffect } from 'react';
import { JobSidebar } from './components/jobs/JobSidebar';
import { InteractiveMap } from './components/map/InteractiveMap';
import { BottomNav } from './components/layout/BottomNav';
import { CalendarView } from './components/calendar/CalendarView';
import { StoreView } from './components/store/StoreView';
import { MessagesView } from './components/messages/MessagesView';
import { ContractorDashboard } from './components/profile/ContractorDashboard';
import { TodaysSchedule } from './components/dashboard/TodaysSchedule';
import { PopupCard } from './components/ui/popup-card';
import { Button } from './components/ui/button';
import { MapPin as MapPinIcon, Phone, Clock, Wrench, Navigation } from 'lucide-react';
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

  const { position, error: geoError, getCurrentPosition } = useGeolocation();
  const { isOnline, wasOffline, cacheData, getCachedData } = useOffline();

  const contractorLocation = position || { lat: 28.5383, lng: -81.3792 };

  useEffect(() => {
    getCurrentPosition().catch(() => {});
  }, [getCurrentPosition]);

  useEffect(() => {
    if (!isOnline) {
      cacheData('jobs', mockJobs, 86400000);
    }
  }, [isOnline, cacheData]);

  // Add scheduled dates to some mock jobs for today's schedule
  const today = new Date();
  const enhancedMockJobs: Job[] = mockJobs.map((job, index) => {
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

  const handleJobSelect = (job: Job) => {
    setSidebarOpen(true);
    console.log('Selected job:', job);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    console.log('Active tab:', tab);
  };

  const navigateToProfile = () => {
    setActiveTab('profile');
    console.log('Navigating to profile');
  };

  const handleAcceptMapJob = (jobId: string) => {
    const job = enhancedMockJobs.find(j => j.id === jobId);
    if (job) {
      handleJobSelect(job);
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
      low: 'bg-green-50 text-green-700 border-green-200',
      medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      high: 'bg-red-50 text-red-700 border-red-200',
      urgent: 'bg-red-600 text-white border-red-700'
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

            {/* Profile Card - Scaled Down */}
            <div className="absolute top-0 left-0 right-0 z-20 p-2">
              <div
                className="bg-gradient-to-br from-white/98 to-slate-50/95 backdrop-blur-xl rounded-[18px] shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300 mx-2 border border-white/20"
                onClick={navigateToProfile}
                style={{ maxWidth: '480px', margin: '0 auto' }}
              >
                <div className="px-3 py-2.5">
                  <div className="flex items-start gap-2.5 mb-2.5">
                    <img
                      src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100"
                      alt="Ethan Carter"
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-1.5 ring-white shadow-md"
                    />
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase mb-0.5">Technician</p>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">Ethan Carter</h3>
                    </div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1 shadow-lg ring-3 ring-blue-100"></div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-blue-50/80 rounded-xl px-2.5 py-2 text-center backdrop-blur-sm border border-blue-100/50 shadow-sm">
                      <p className="text-[10px] text-blue-600 font-semibold mb-1 tracking-wide">Scheduled</p>
                      <p className="text-xl font-bold text-slate-900">3</p>
                    </div>
                    <div className="bg-green-50/80 rounded-xl px-2.5 py-2 text-center backdrop-blur-sm border border-green-100/50 shadow-sm">
                      <p className="text-[10px] text-green-600 font-semibold mb-1 tracking-wide">Available</p>
                      <p className="text-xl font-bold text-slate-900">2</p>
                    </div>
                    <div className="bg-purple-50/80 rounded-xl px-2.5 py-2 text-center backdrop-blur-sm border border-purple-100/50 shadow-sm">
                      <p className="text-[10px] text-purple-600 font-semibold mb-1 tracking-wide">Earnings</p>
                      <p className="text-xl font-bold text-slate-900">$450</p>
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
        return <CalendarView />;
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

  return (
    <div className="app-container bg-slate-50 min-h-screen pb-20">
      {!isOnline && (
        <Alert className="fixed top-2 left-2 right-2 z-50 bg-orange-100 border-orange-300">
          <WifiOff className="h-5 w-5 text-orange-600" />
          <AlertDescription className="text-orange-800 font-medium ml-2">
            You're offline. Some features may be limited.
          </AlertDescription>
        </Alert>
      )}

      {wasOffline && isOnline && (
        <Alert className="fixed top-2 left-2 right-2 z-50 bg-green-100 border-green-300">
          <Wifi className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800 font-medium ml-2">
            You're back online!
          </AlertDescription>
        </Alert>
      )}

      {position && (
        <div className="fixed top-2 right-2 z-40 bg-blue-100 border border-blue-300 rounded-lg px-3 py-2 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-600" />
          <span className="text-xs text-blue-800 font-medium">
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
          title={`Job #${selectedMapJob.id.slice(0, 8).toUpperCase()}`}
          maxWidth="600px"
          aria-label={`Job details for ${selectedMapJob.customer.name}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{selectedMapJob.customer.name}</h3>
              <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${getPriorityBadgeClass(selectedMapJob.priority)}`}>
                {selectedMapJob.priority}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Address</p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMapJob.location.lat},${selectedMapJob.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {selectedMapJob.location.address}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Phone</p>
                  <a
                    href={`tel:${selectedMapJob.customer.phone}`}
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {selectedMapJob.customer.phone}
                  </a>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex items-start gap-3 mb-3">
                  <Wrench className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Job Type</p>
                    <p className="text-slate-900">{formatJobType(selectedMapJob.type)}</p>
                  </div>
                </div>

                {selectedMapJob.description && (
                  <p className="text-sm text-slate-600 mb-3">{selectedMapJob.description}</p>
                )}

                <div className="flex items-start gap-3 mb-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Scheduled</p>
                    <p className="text-slate-900">{formatScheduledTime(selectedMapJob)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Duration</p>
                    <p className="text-slate-900">{selectedMapJob.estimatedDuration} {selectedMapJob.estimatedDuration === 1 ? 'hour' : 'hours'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Distance & Drive Time</p>
                    <p className="text-slate-900">
                      {calculateDistance(selectedMapJob.location.lat, selectedMapJob.location.lng)} miles
                      <span className="text-slate-600"> • ~{calculateDriveTime(parseFloat(calculateDistance(selectedMapJob.location.lat, selectedMapJob.location.lng)))} min drive</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={() => setSelectedMapJob(null)} variant="outline" className="flex-1">
                Close
              </Button>
              <Button
                onClick={() => handleAcceptMapJob(selectedMapJob.id)}
                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Accept Job
              </Button>
            </div>
          </div>
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
              <h3 className="text-xl font-bold text-slate-900">{selectedMapSupplier.name}</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Address</p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMapSupplier.location.lat},${selectedMapSupplier.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {selectedMapSupplier.address}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Phone</p>
                  <a
                    href={`tel:${selectedMapSupplier.phone}`}
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {selectedMapSupplier.phone}
                  </a>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex items-start gap-3 mb-3">
                  <Clock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Hours Today</p>
                    <p className="text-slate-900">
                      {selectedMapSupplier.hours ? `${selectedMapSupplier.hours.open} - ${selectedMapSupplier.hours.close}` : 'Hours not available'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <Navigation className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Distance</p>
                    <p className="text-slate-900">
                      {calculateDistance(selectedMapSupplier.location.lat, selectedMapSupplier.location.lng)} miles
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Drive Time</p>
                    <p className="text-slate-900">
                      ~{calculateDriveTime(parseFloat(calculateDistance(selectedMapSupplier.location.lat, selectedMapSupplier.location.lng)))} minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={() => setSelectedMapSupplier(null)} variant="outline" className="flex-1">
                Close
              </Button>
              <Button
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${selectedMapSupplier.location.lat},${selectedMapSupplier.location.lng}`,
                    '_blank'
                  );
                }}
                className="flex-1"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
              <Button
                onClick={() => {
                  window.location.href = `tel:${selectedMapSupplier.phone}`;
                }}
                variant="secondary"
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
