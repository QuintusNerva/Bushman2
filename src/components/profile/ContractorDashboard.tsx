import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Briefcase, 
  DollarSign, 
  Star, 
  Clock, 
  CheckCircle,
  Package,
  MessageCircle,
  Phone,
  Mail,
  // Replace Paypal with a similar icon, e.g., DollarSign
  DollarSign as PaypalIcon,
  // Replace Venmo with a similar icon, e.g., DollarSign
  DollarSign as VenmoIcon,
  // Replace Zelle with a similar icon, e.g., CreditCard
  DollarSign as ZelleIcon,
  // Replace CashApp with a similar icon, e.g., DollarSign
  DollarSign as CashAppIcon
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

export function ContractorDashboard() {
  const contractor = {
    name: "John Contractor",
    email: "john@contractor.com",
    phone: "(555) 123-4567",
    rating: 4.8,
    completedJobs: 127,
    totalEarnings: 45280,
    activeJobs: 3,
    pendingQuotes: 2
  };

  const recentJobs = [
    { id: '1', title: 'Water Softener Installation', status: 'completed', earnings: 450 },
    { id: '2', title: 'RO System Maintenance', status: 'in-progress', earnings: 0 },
    { id: '3', title: 'UV Sterilizer Repair', status: 'quoted', earnings: 0 },
  ];

  const recentOrders = [
    { id: '1', items: 'Fleck 5600SXT, Filters (3)', status: 'ready', total: 1299.99 },
    { id: '2', items: 'APEC RO System', status: 'pending', total: 299.99 },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-white/50 backdrop-blur-sm border-b border-white/20">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg" />
            <AvatarFallback>JC</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{contractor.name}</h1>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-semibold">{contractor.rating}</span>
              <span className="text-muted-foreground">({contractor.completedJobs} jobs)</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="clay-card">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <p className="text-xl font-bold">{contractor.activeJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="clay-card">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-xl font-bold">${contractor.totalEarnings.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="overview" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="overview" className="space-y-4 mt-0">
              {/* Recent Jobs */}
              <Card className="clay-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Recent Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentJobs.map(job => (
                    <div key={job.id} className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <Badge variant={
                          job.status === 'completed' ? 'default' :
                          job.status === 'in-progress' ? 'secondary' : 'outline'
                        }>
                          {job.status}
                        </Badge>
                      </div>
                      {job.earnings > 0 && (
                        <span className="font-bold text-green-600">${job.earnings}</span>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card className="clay-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                      <div>
                        <p className="font-medium">{order.items}</p>
                        <Badge variant={order.status === 'ready' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>
                      <span className="font-bold">${order.total}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-4 mt-0">
              <Card className="clay-card">
                <CardHeader>
                  <CardTitle>Job Statistics</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{contractor.completedJobs}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{contractor.activeJobs}</p>
                    <p className="text-sm text-muted-foreground">Active</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4 mt-0">
              <Card className="clay-card">
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Your recent parts orders will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-4 mt-0">
              <Card className="clay-card">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <span>{contractor.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <span>{contractor.phone}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="clay-card">
                <CardHeader>
                  <CardTitle>Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Water Softeners</Badge>
                    <Badge>RO Systems</Badge>
                    <Badge>UV Sterilizers</Badge>
                    <Badge>Whole House Systems</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Info Section */}
              <Card className="clay-card">
                <CardHeader>
                  <CardTitle>Payment Info (Get Paid Fast 💸)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <PaypalIcon className="w-5 h-5 text-muted-foreground" />
                    <Input placeholder="PayPal Email" />
                    <Switch label="Preferred Method" />
                  </div>
                  <div className="flex items-center gap-3">
                    <VenmoIcon className="w-5 h-5 text-muted-foreground" />
                    <Input placeholder="Venmo Handle" />
                    <Switch label="Preferred Method" />
                  </div>
                  <div className="flex items-center gap-3">
                    <ZelleIcon className="w-5 h-5 text-muted-foreground" />
                    <Input placeholder="Zelle Email or Phone" />
                    <Switch label="Preferred Method" />
                  </div>
                  <div className="flex items-center gap-3">
                    <CashAppIcon className="w-5 h-5 text-muted-foreground" />
                    <Input placeholder="CashApp Tag" />
                    <Switch label="Preferred Method" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    "We don't store your banking credentials — just your preferred handle so our team can send payment."
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
