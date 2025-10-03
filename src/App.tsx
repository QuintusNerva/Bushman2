import { useState } from 'react';
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

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');

  // Mock contractor location (Orlando)
  const contractorLocation = { lat: 28.5383, lng: -81.3792 };

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

            {/* Overlaid Header - Transparent */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4">
              <div
                className="bg-white/95 backdrop-blur-md rounded-3xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200"
                onClick={navigateToProfile}
              >
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100"
                      alt="Ethan Carter"
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 font-medium">Technician</p>
                      <h3 className="text-lg font-bold text-slate-900">Ethan Carter</h3>
                    </div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-50/80 rounded-2xl p-4 text-center">
                      <p className="text-sm text-blue-600 font-semibold mb-1">Scheduled</p>
                      <p className="text-3xl font-bold text-slate-900">3</p>
                    </div>
                    <div className="bg-green-50/80 rounded-2xl p-4 text-center">
                      <p className="text-sm text-green-600 font-semibold mb-1">Available</p>
                      <p className="text-3xl font-bold text-slate-900">2</p>
                    </div>
                    <div className="bg-blue-50/80 rounded-2xl p-4 text-center">
                      <p className="text-sm text-blue-600 font-semibold mb-1">Earnings</p>
                      <p className="text-3xl font-bold text-slate-900">$450</p>
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
      <div className="h-[calc(100vh-5rem)]">
        {renderTabContent()}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default App;
