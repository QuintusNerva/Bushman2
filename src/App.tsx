import { useState, useEffect } from 'react';
import { JobSidebar } from './components/jobs/JobSidebar';
import { InteractiveMap } from './components/map/InteractiveMap';
import { BottomNav } from './components/layout/BottomNav';
import { CalendarView } from './components/calendar/CalendarView';
import { StoreView } from './components/store/StoreView';
import { MessagesView } from './components/messages/MessagesView';
import { ContractorDashboard } from './components/profile/ContractorDashboard';
import { TodaysSchedule } from './components/dashboard/TodaysSchedule';
import { Job } from './types';
import { mockJobs } from './data/mockData';
import { useGeolocation } from './hooks/useGeolocation';
import { useOffline } from './hooks/useOffline';
import { Alert, AlertDescription } from './components/ui/alert';
import { Wifi, WifiOff, MapPin } from 'lucide-react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');

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
                suppliers={[]}
                onJobSelect={handleJobSelect}
                onToggleSidebar={toggleSidebar}
                sidebarOpen={sidebarOpen}
                className="h-full w-full"
              />

              <JobSidebar
                jobs={enhancedMockJobs.filter(job => job.status === 'unclaimed')}
                onJobSelect={handleJobSelect}
                open={sidebarOpen}
                onOpenChange={setSidebarOpen}
              />
            </div>

            {/* Overlaid Header - Optimized */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4">
              <div
                className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 max-w-3xl mx-auto"
                onClick={navigateToProfile}
              >
                <div className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100"
                      alt="Ethan Carter"
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-600 font-medium">Technician</p>
                      <h3 className="text-base font-bold text-slate-900">Ethan Carter</h3>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-center px-3">
                        <p className="text-xs text-blue-600 font-semibold mb-0.5">Scheduled</p>
                        <p className="text-xl font-bold text-slate-900">3</p>
                      </div>
                      <div className="text-center px-3">
                        <p className="text-xs text-green-600 font-semibold mb-0.5">Available</p>
                        <p className="text-xl font-bold text-slate-900">2</p>
                      </div>
                      <div className="text-center px-3">
                        <p className="text-xs text-blue-600 font-semibold mb-0.5">Earnings</p>
                        <p className="text-xl font-bold text-slate-900">$450</p>
                      </div>
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full ml-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlaid Today's Schedule - Transparent */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
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
    </div>
  );
}

export default App;
