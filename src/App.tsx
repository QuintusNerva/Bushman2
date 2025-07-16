import { useState } from 'react';
import { JobSidebar } from './components/jobs/JobSidebar';
import { InteractiveMap } from './components/map/InteractiveMap';
import { BottomNav } from './components/layout/BottomNav';
import { JobBoard } from './components/jobs/JobBoard';
import { CalendarView } from './components/calendar/CalendarView';
import { StoreView } from './components/store/StoreView';
import { MessagesView } from './components/messages/MessagesView';
import { ContractorDashboard } from './components/profile/ContractorDashboard';
import { TodaysSchedule } from './components/dashboard/TodaysSchedule';
import { Job } from './types';
import { mockJobs } from './data/mockData';

function App() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');

  // Mock contractor location (Orlando)
  const contractorLocation = { lat: 28.5383, lng: -81.3792 };

  // Add scheduled dates to some mock jobs for today's schedule
  const today = new Date();
  const enhancedMockJobs = mockJobs.map((job, index) => {
    // Add scheduled dates to a few jobs for today at different hours
    if (index % 3 === 0) {
      const scheduledDate = new Date(today);
      scheduledDate.setHours(9 + (index % 8), 0, 0, 0); // Distribute between 9 AM and 4 PM
      return {
        ...job,
        scheduledDate,
        status: index % 2 === 0 ? 'scheduled' : 'claimed'
      };
    }
    return job;
  });

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
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
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-slate-800">Available Jobs</h1>
            
            {/* User profile card - Now clickable */}
            <div 
              className="bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={navigateToProfile}
            >
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    JS
                  </div>
                  <div>
                    <h3 className="font-medium">John Smith</h3>
                    <div className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                      <span className="text-slate-600">Available</span>
                    </div>
                  </div>
                  <div className="ml-auto flex gap-8 text-center">
                    <div>
                      <div className="text-blue-500 font-semibold text-lg">5</div>
                      <div className="text-xs text-slate-500">Available</div>
                    </div>
                    <div>
                      <div className="text-green-600 font-semibold text-lg">4</div>
                      <div className="text-xs text-slate-500">Claimed</div>
                    </div>
                    <div>
                      <div className="text-green-600 font-semibold text-lg">$1240</div>
                      <div className="text-xs text-slate-500">Today</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map with sidebar toggle */}
            <div className="relative mb-4">
              <InteractiveMap 
                jobs={enhancedMockJobs} 
                suppliers={[]} 
                onJobSelect={handleJobSelect} 
                onToggleSidebar={toggleSidebar}
                sidebarOpen={sidebarOpen}
                className="h-[400px] md:h-[500px] w-full z-0"
              />
              
              <JobSidebar 
                jobs={enhancedMockJobs.filter(job => job.status === 'unclaimed')} 
                onJobSelect={handleJobSelect}
                open={sidebarOpen}
                onOpenChange={setSidebarOpen}
              />
            </div>
            
            {/* Today's Schedule - Using the TodaysSchedule component */}
            <TodaysSchedule jobs={enhancedMockJobs} contractorLocation={contractorLocation} />
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
      <div className="p-4">
        {renderTabContent()}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default App;
