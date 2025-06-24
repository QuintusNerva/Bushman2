import { Job } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, User, Phone, DollarSign, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface JobModalProps {
  job: Job;
  onClose: () => void;
  onAcceptNow: () => void;
  onScheduleLater: () => void;
}

export function JobModal({ job, onClose, onAcceptNow, onScheduleLater }: JobModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="clay-card w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
              &times;
            </button>
          </div>
          <Badge variant={job.priority === 'urgent' ? 'destructive' : 'secondary'}>
            {job.priority}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
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
          </div>

          <div className="pt-4 space-y-2">
            <Button onClick={onAcceptNow} className="w-full clay-button bg-blue-500 hover:bg-blue-600 text-white">
              Accept Now
            </Button>
            <Button 
              onClick={onScheduleLater} 
              variant="outline" 
              className="w-full clay-button"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
