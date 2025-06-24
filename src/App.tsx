import { useState } from 'react';
import { JobSidebar } from './components/jobs/JobSidebar';
import { InteractiveMap } from './components/map/InteractiveMap';
import { BottomNav } from './components/layout/BottomNav';
import { JobBoard } from './components/jobs/JobBoard';
import { CalendarView } from './components/calendar/CalendarView';
import { StoreView } from './components/store/StoreView';
import { MessagesView } from './components/messages/MessagesView';
import { ContractorDashboard } from './components/profile/ContractorDashboard';
import { Job } from './types';

// Sample data for testing
const sampleJobs: Job[] = [
  {
    id: '1',
    title: 'Water Softener Installation',
    description: 'Install new water softener system in residential home',
    type: 'Softener',
    status: 'unclaimed',
    location: {
      lat: 28.5383,
      lng: -81.3792,
      address: '123 Main St, Orlando, FL'
    },
    customer: {
      name: 'Jane Doe',
      phone: '407-555-1234',
      email: 'jane@example.com'
    },
    priority: 'high',
    estimatedDuration: 3,
    createdAt: new Date('2023-06-15')
  },
  {
    id: '2',
    title: 'RO System Maintenance',
    description: 'Perform routine maintenance on reverse osmosis system',
    type: 'RO',
    status: 'unclaimed',
    location: {
      lat: 28.5483,
      lng: -81.3692,
      address: '456 Oak Ave, Orlando, FL'
    },
    customer: {
      name: 'John Smith',
      phone: '407-555-5678',
      email: 'john@example.com'
    },
    priority: 'medium',
    estimatedDuration: 1.5,
    createdAt: new Date('2023-06-16')
  },
  {
    id: '3',
    title: 'UV Light Replacement',
    description: 'Replace UV light in water purification system',
    type: 'UV',
    status: 'unclaimed',
    location: {
      lat: 28.5283,
      lng: -81.3892,
      address: '789 Pine Rd, Orlando, FL'
    },
    customer: {
      name: 'Bob Johnson',
      phone: '407-555-9012',
      email: 'bob@example.com'
    },
    priority: 'urgent',
    estimatedDuration: 1,
    createdAt: new Date('2023-06-17')
  },
  {
    id: '4',
    title: 'Whole House Filter Installation',
    description: 'Install new whole house water filtration system',
    type: 'Whole House',
    status: 'unclaimed',
    location: {
      lat: 28.5183,
      lng: -81.3992,
      address: '101 Elm Blvd, Orlando, FL'
    },
    customer: {
      name: 'Sarah Williams',
      phone: '407-555-3456',
      email: 'sarah@example.com'
    },
    priority: 'low',
    estimatedDuration: 4,
    createdAt: new Date('2023-06-18')
  }
];

function App() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');

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

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'jobs':
        return (
          <>
            <h1 className="text-2xl font-bold text-slate-800">Available Jobs</h1>
            
            {/* User profile card */}
            <div className="bg-white rounded-xl shadow-sm">
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
            <div className="relative">
              <InteractiveMap 
                jobs={sampleJobs} 
                suppliers={[]} 
                onJobSelect={handleJobSelect} 
                onToggleSidebar={toggleSidebar}
                sidebarOpen={sidebarOpen}
                className="h-[calc(100vh-280px)] min-h-[500px]"
              />
              
              <JobSidebar 
                jobs={sampleJobs.filter(job => job.status === 'unclaimed')} 
                onJobSelect={handleJobSelect}
                open={sidebarOpen}
                onOpenChange={setSidebarOpen}
              />
            </div>
            
            {/* Today's Schedule */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-800">Today's Schedule</h3>
                <div className="text-sm text-slate-500">
                  Swipe to scroll →
                </div>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                {['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'].map((time) => (
                  <div key={time} className="min-w-[100px] w-[100px] flex-shrink-0 border border-dashed border-slate-300 rounded-lg p-3 text-center">
                    <div className="font-medium text-slate-700">{time}</div>
                    <div className="text-sm text-slate-400">Drop here</div>
                  </div>
                ))}
              </div>
            </div>
          </>
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
      <div className="p-4 space-y-4">
        {renderTabContent()}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default App;
