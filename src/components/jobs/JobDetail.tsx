import { Job } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, Phone, User, Clock, DollarSign, Calendar, Check, Play, FileText } from 'lucide-react';

interface JobDetailProps {
  job: Job;
  onStatusUpdate: (jobId: string, updates: Partial<Job>) => void;
  onBack: () => void;
}

export function JobDetail({ job, onStatusUpdate, onBack }: JobDetailProps) {
  const handleStatusChange = (status: Job['status']) => {
    onStatusUpdate(job.id, { status });
  };

  const renderActions = () => {
    switch (job.status) {
      case 'claimed':
        return (
          <div className="flex gap-2">
            <Button onClick={() => handleStatusChange('quoted')} className="flex-1 clay-button bg-purple-500 hover:bg-purple-600 text-white">
              <FileText className="w-4 h-4 mr-2" />
              Create Quote
            </Button>
            <Button onClick={() => handleStatusChange('scheduled')} className="flex-1 clay-button bg-orange-500 hover:bg-orange-600 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </div>
        );
      case 'quoted':
        return (
          <Button onClick={() => handleStatusChange('scheduled')} className="w-full clay-button bg-orange-500 hover:bg-orange-600 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Job
          </Button>
        );
      case 'scheduled':
        return (
          <Button onClick={() => handleStatusChange('completed')} className="w-full clay-button bg-green-500 hover:bg-green-600 text-white">
            <Check className="w-4 h-4 mr-2" />
            Mark as Completed
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 font-['Inter',system-ui,sans-serif]">
      <Button onClick={onBack} variant="ghost" className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Jobs
      </Button>

      <Card className="clay-card">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold text-slate-800">{job.title}</CardTitle>
            <Badge variant={job.priority === 'urgent' ? 'destructive' : 'secondary'} className="text-sm">
              {job.priority}
            </Badge>
          </div>
          <p className="text-slate-600">{job.type}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-slate-700 mb-2">Description</h3>
            <p className="text-slate-600">{job.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-slate-700">Customer</p>
                  <p className="text-slate-600">{job.customer.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-slate-700">Phone</p>
                  <p className="text-slate-600">{job.customer.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium text-slate-700">Location</p>
                  <p className="text-slate-600">{job.location.address}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-medium text-slate-700">Duration</p>
                  <p className="text-slate-600">{job.estimatedDuration} hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="font-medium text-slate-700">Estimated Pay</p>
                  <p className="text-slate-600">${job.estimatedDuration * 85}</p>
                </div>
              </div>
              {job.scheduledDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-slate-700">Scheduled</p>
                    <p className="text-slate-600">{new Date(job.scheduledDate).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            {renderActions()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
