export interface Job {
  id: string;
  title: string;
  description: string;
  type: string;
  status: 'unclaimed' | 'claimed' | 'in-progress' | 'completed';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration: number;
  createdAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  hours: {
    open: string;
    close: string;
  };
}
