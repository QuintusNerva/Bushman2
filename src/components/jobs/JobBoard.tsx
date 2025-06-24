import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/types';
import { Clock, MapPin, Filter, Search } from 'lucide-react';

interface JobBoardProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
}

export function JobBoard({ jobs, onJobSelect }: JobBoardProps) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter jobs based on selected filter and search query
  const filteredJobs = jobs.filter((job) => {
    // Filter by status
    if (filter !== 'all' && job.status !== filter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !job.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'unclaimed' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('unclaimed')}
          >
            Unclaimed
          </Button>
          <Button 
            variant={filter === 'claimed' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('claimed')}
          >
            Claimed
          </Button>
          <Button variant="outline" size="icon" className="ml-1">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Job list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <Badge className={`capitalize ${getPriorityColor(job.priority)}`}>
                  {job.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-3">{job.description}</p>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location.address}</span>
                </div>
                
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock className="h-4 w-4" />
                  <span>Est. {job.estimatedDuration} {job.estimatedDuration === 1 ? 'hour' : 'hours'}</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => onJobSelect(job)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
        
        {filteredJobs.length === 0 && (
          <div className="col-span-full p-8 text-center bg-slate-50 rounded-lg">
            <h3 className="font-medium mb-1">No jobs found</h3>
            <p className="text-sm text-slate-500">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
