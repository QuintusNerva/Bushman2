import { Job } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Phone, User, Flame, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  onSelect: (job: Job) => void;
  onAccept?: (jobId: string) => void;
  showAcceptButton?: boolean;
  isUrgent?: boolean;
}

export function JobCard({ job, onSelect, onAccept, showAcceptButton = true, isUrgent = false }: JobCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Softener': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'RO': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'UV': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Whole House': return 'bg-green-100 text-green-700 border-green-200';
      case 'Commercial': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatScheduleTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 0) return 'Overdue';
    if (diffInHours < 2) return 'Starts in 1 hour';
    if (diffInHours < 24) return `Starts in ${diffInHours} hours`;
    if (diffInDays === 1) return `Tomorrow ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    if (diffInDays < 7) {
      const dayName = date.toLocaleDateString([], { weekday: 'long' });
      return `${dayName} ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just posted';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getActionButton = () => {
    if (job.status === 'unclaimed' && showAcceptButton && onAccept) {
      return (
        <Button 
          size="sm" 
          className={cn(
            "clay-button font-medium",
            isUrgent 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-blue-500 hover:bg-blue-600 text-white"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onAccept(job.id);
          }}
        >
          {isUrgent ? 'Accept Urgent' : 'Accept Job'}
        </Button>
      );
    }
    
    return (
      <Button 
        size="sm" 
        variant="outline"
        className="clay-button text-blue-600 border-blue-200 hover:bg-blue-50"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(job);
        }}
      >
        View Details
      </Button>
    );
  };

  return (
    <Card 
      className={cn(
        "clay-card hover:shadow-lg transition-all duration-200 cursor-pointer",
        isUrgent && "ring-1 ring-red-200 shadow-red-100"
      )} 
      onClick={() => onSelect(job)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              {job.title}
              {isUrgent && (
                <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  Urgent
                </Badge>
              )}
            </CardTitle>
            
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={cn("text-xs font-medium", getTypeColor(job.type))}>
                {job.type}
              </Badge>
              {job.scheduledDate && (
                <Badge className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatScheduleTime(job.scheduledDate)}
                </Badge>
              )}
            </div>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {formatTimeAgo(job.createdAt)}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {job.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="font-medium text-slate-700 truncate">{job.location.address}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="font-medium text-slate-700">{job.customer.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <span className="text-slate-600">{job.customer.phone}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span className="text-slate-600">{job.estimatedDuration}h estimated duration</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          {getActionButton()}
        </div>
      </CardContent>
    </Card>
  );
}
