import { Job } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MessageSquare, X } from 'lucide-react';

interface ContactModalProps {
  job: Job;
  onClose: () => void;
  onContact: (method: 'call' | 'text') => void;
}

export function ContactModal({ job, onClose, onContact }: ContactModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="clay-card w-full max-w-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Contact Customer</CardTitle>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600">
            How would you like to contact {job.customer.name} about this job?
          </p>

          <div className="space-y-2">
            <Button 
              onClick={() => onContact('call')} 
              className="w-full clay-button bg-green-500 hover:bg-green-600 text-white"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call {job.customer.phone}
            </Button>
            <Button 
              onClick={() => onContact('text')} 
              variant="outline" 
              className="w-full clay-button"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Text Message
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
