export interface Job {
  id: string;
  title: string;
  description: string;
  type: string;
  status: 'unclaimed' | 'claimed' | 'quoted' | 'scheduled' | 'completed' | 'en_route' | 'in_progress' | 'in-progress';
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
  claimedBy?: string;
  scheduledDate?: Date;
  travel_start_time?: Date;
  job_start_time?: Date;
  job_complete_time?: Date;
  job_duration_minutes?: number;
  completion_photo_url?: string;
  install_notes?: string;
  ready_for_payment_review?: boolean;
}

export interface Quote {
  id: string;
  jobId: string;
  contractorId: string;
  partsCost: number;
  laborCost: number;
  tax: number;
  total: number;
  notes: string;
  photos?: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface Contractor {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  rating: number;
  completedJobs: number;
  specialties: string[];
  location: {
    lat: number;
    lng: number;
  };
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  inStock: boolean;
  supplier: string;
}

export interface Order {
  id: string;
  contractorId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'ready' | 'picked-up';
  supplierId: string;
  pickupLocation: string;
  createdAt: Date;
  estimatedReady?: Date;
}

export interface Supplier {
  id: string;
  name: string;
  address: string;
  phone: string;
  location: {
    lat: number;
    lng: number;
  };
  hours: {
    open: string;
    close: string;
  };
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  jobId?: string;
  content: string;
  type: 'text' | 'image';
  timestamp: Date;
  read: boolean;
}
