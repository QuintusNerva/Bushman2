import { Home, Calendar, ShoppingBag, MessageSquare } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'jobs', label: 'Jobs', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'store', label: 'Store', icon: ShoppingBag },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-card-elevated border-t border-white/10 z-50">
      <div className="flex justify-around items-center h-20 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center justify-center w-full h-full min-h-[44px] px-2 rounded-lg transition-all duration-300 ${
                isActive ? 'text-blue-400 bg-blue-500/20' : 'text-slate-400'
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon className={`h-6 w-6 transition-all duration-300 ${isActive ? 'text-blue-400 scale-110' : 'text-slate-400'}`} />
              <span className={`text-xs mt-1.5 ${isActive ? 'font-semibold text-white' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
