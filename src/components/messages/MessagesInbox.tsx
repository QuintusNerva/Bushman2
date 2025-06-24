import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockContractors } from '@/data/mockData';

export function MessagesInbox() {
  return (
    <div className="p-4">
      <Card className="clay-card">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockContractors.map(contractor => (
            <div key={contractor.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
              <Avatar>
                <AvatarImage src={contractor.avatar} />
                <AvatarFallback>{contractor.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{contractor.name}</h3>
                <p className="text-sm text-slate-500">Last message preview...</p>
              </div>
              <span className="text-xs text-slate-400">2h ago</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
