import { Job, Supplier, Product, Contractor } from '@/types';

// Real Orlando area coordinates and addresses
export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Water Softener Installation',
    description: 'Install new water softener system for residential home. Customer reports hard water issues affecting appliances and plumbing fixtures.',
    type: 'Softener',
    status: 'unclaimed',
    location: {
      lat: 28.5383,
      lng: -81.3792,
      address: '1234 Orange Ave, Orlando, FL 32801'
    },
    customer: {
      name: 'Sarah Johnson',
      phone: '(407) 555-0123',
      email: 'sarah.johnson@email.com'
    },
    priority: 'medium',
    estimatedDuration: 3,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    title: 'Emergency RO System Repair',
    description: 'Reverse osmosis system not producing water. Customer needs immediate repair for restaurant operations.',
    type: 'RO',
    status: 'unclaimed',
    location: {
      lat: 28.5421,
      lng: -81.3656,
      address: '5678 Colonial Dr, Orlando, FL 32804'
    },
    customer: {
      name: 'Mike Rodriguez',
      phone: '(407) 555-0456',
      email: 'mike.rodriguez@email.com'
    },
    priority: 'urgent',
    estimatedDuration: 2,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    id: '3',
    title: 'UV Light Replacement',
    description: 'Annual UV light bulb replacement and system maintenance. Scheduled maintenance for residential customer.',
    type: 'UV',
    status: 'claimed',
    location: {
      lat: 28.4813,
      lng: -81.4481,
      address: '9012 Sand Lake Rd, Orlando, FL 32819'
    },
    customer: {
      name: 'Jennifer Chen',
      phone: '(407) 555-0789',
      email: 'jennifer.chen@email.com'
    },
    priority: 'low',
    estimatedDuration: 1,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    claimedBy: 'contractor-1',
  },
  {
    id: '4',
    title: 'Whole House Filter Installation',
    description: 'Install comprehensive whole house water filtration system. New construction home needs complete water treatment solution.',
    type: 'Whole House',
    status: 'quoted',
    location: {
      lat: 28.6139,
      lng: -81.2081,
      address: '3456 University Blvd, Orlando, FL 32817'
    },
    customer: {
      name: 'David Thompson',
      phone: '(407) 555-0321',
      email: 'david.thompson@email.com'
    },
    priority: 'high',
    estimatedDuration: 6,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: '5',
    title: 'Commercial Water System Maintenance',
    description: 'Quarterly maintenance for office building water treatment system. Includes filter changes and system inspection.',
    type: 'Commercial',
    status: 'scheduled',
    location: {
      lat: 28.4177,
      lng: -81.2999,
      address: '7890 International Dr, Orlando, FL 32837'
    },
    customer: {
      name: 'Orlando Business Center',
      phone: '(407) 555-0654',
      email: 'maintenance@orlandobiz.com'
    },
    priority: 'medium',
    estimatedDuration: 4,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  },
  {
    id: '6',
    title: 'Softener System Repair',
    description: 'Water softener not regenerating properly. Customer reports hard water returning after recent installation.',
    type: 'Softener',
    status: 'unclaimed',
    location: {
      lat: 28.5644,
      lng: -81.3378,
      address: '2468 Mills Ave, Orlando, FL 32803'
    },
    customer: {
      name: 'Robert Wilson',
      phone: '(407) 555-0987',
      email: 'robert.wilson@email.com'
    },
    priority: 'high',
    estimatedDuration: 2,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: '7',
    title: 'RO Membrane Replacement',
    description: 'Replace reverse osmosis membranes and pre-filters. Customer reports decreased water quality and flow rate.',
    type: 'RO',
    status: 'unclaimed',
    location: {
      lat: 28.3852,
      lng: -81.5639,
      address: '1357 Turkey Lake Rd, Orlando, FL 32839'
    },
    customer: {
      name: 'Lisa Martinez',
      phone: '(407) 555-0246',
      email: 'lisa.martinez@email.com'
    },
    priority: 'medium',
    estimatedDuration: 2,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
  {
    id: '8',
    title: 'Emergency Water System Shutdown',
    description: 'Major leak in commercial water treatment system. Immediate response needed to prevent property damage.',
    type: 'Commercial',
    status: 'unclaimed',
    location: {
      lat: 28.5017,
      lng: -81.3731,
      address: '8642 Orange Blossom Trl, Orlando, FL 32809'
    },
    customer: {
      name: 'Metro Shopping Plaza',
      phone: '(407) 555-0135',
      email: 'emergency@metroplaza.com'
    },
    priority: 'urgent',
    estimatedDuration: 3,
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
  },
  {
    id: '9',
    title: 'UV System Installation',
    description: 'Install new UV sterilization system for well water treatment. Customer concerned about bacteria in private well.',
    type: 'UV',
    status: 'claimed',
    location: {
      lat: 28.4389,
      lng: -81.4092,
      address: '9753 Vineland Ave, Orlando, FL 32821'
    },
    customer: {
      name: 'Amanda Foster',
      phone: '(407) 555-0864',
      email: 'amanda.foster@email.com'
    },
    priority: 'high',
    estimatedDuration: 3,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    claimedBy: 'contractor-2',
  },
  {
    id: '10',
    title: 'Whole House System Upgrade',
    description: 'Upgrade existing whole house system with new technology. Customer wants improved efficiency and smart monitoring.',
    type: 'Whole House',
    status: 'completed',
    location: {
      lat: 28.5892,
      lng: -81.3089,
      address: '4681 Curry Ford Rd, Orlando, FL 32812'
    },
    customer: {
      name: 'Kevin Park',
      phone: '(407) 555-0579',
      email: 'kevin.park@email.com'
    },
    priority: 'low',
    estimatedDuration: 5,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Orlando Water Solutions',
    address: '1500 Orange Ave, Orlando, FL 32801',
    phone: '(407) 555-1000',
    location: {
      lat: 28.5450,
      lng: -81.3800,
    },
    hours: {
      open: '7:00 AM',
      close: '6:00 PM',
    },
  },
  {
    id: '2',
    name: 'Central Florida Parts Supply',
    address: '2800 Colonial Dr, Orlando, FL 32803',
    phone: '(407) 555-2000',
    location: {
      lat: 28.5500,
      lng: -81.3600,
    },
    hours: {
      open: '6:30 AM',
      close: '5:30 PM',
    },
  },
  {
    id: '3',
    name: 'Metro Water Equipment',
    address: '4200 International Dr, Orlando, FL 32819',
    phone: '(407) 555-3000',
    location: {
      lat: 28.4800,
      lng: -81.4700,
    },
    hours: {
      open: '8:00 AM',
      close: '7:00 PM',
    },
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Pentair Water Softener 48k Grain',
    category: 'Water Softeners',
    price: 899.99,
    description: 'High-efficiency water softener for medium to large homes',
    image: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg',
    inStock: true,
    supplier: 'Orlando Water Solutions',
  },
  {
    id: '2',
    name: 'APEC 5-Stage RO System',
    category: 'Reverse Osmosis',
    price: 299.99,
    description: 'Premium 5-stage reverse osmosis drinking water system',
    image: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg',
    inStock: true,
    supplier: 'Central Florida Parts Supply',
  },
  {
    id: '3',
    name: 'Viqua UV Sterilizer 12 GPM',
    category: 'UV Systems',
    price: 449.99,
    description: 'UV water sterilizer for bacterial and viral disinfection',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
    inStock: false,
    supplier: 'Metro Water Equipment',
  },
  {
    id: '4',
    name: 'Whole House Carbon Filter',
    category: 'Filters',
    price: 189.99,
    description: 'High-capacity carbon filter for chlorine and odor removal',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
    inStock: true,
    supplier: 'Orlando Water Solutions',
  },
  {
    id: '5',
    name: 'Commercial RO Membrane 4040',
    category: 'Membranes',
    price: 159.99,
    description: 'High-rejection commercial grade RO membrane',
    image: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg',
    inStock: true,
    supplier: 'Central Florida Parts Supply',
  },
  {
    id: '6',
    name: 'Salt Brine Tank 18x33',
    category: 'Tanks',
    price: 129.99,
    description: 'Durable brine tank for water softener systems',
    image: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg',
    inStock: true,
    supplier: 'Metro Water Equipment',
  },
];

export const mockContractors: Contractor[] = [
  {
    id: 'contractor-1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(407) 555-1234',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
    rating: 4.8,
    completedJobs: 127,
    specialties: ['Water Softeners', 'RO Systems'],
    location: {
      lat: 28.5383,
      lng: -81.3792,
    },
  },
  {
    id: 'contractor-2',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '(407) 555-5678',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    rating: 4.9,
    completedJobs: 89,
    specialties: ['UV Systems', 'Whole House'],
    location: {
      lat: 28.5421,
      lng: -81.3656,
    },
  },
  {
    id: 'contractor-3',
    name: 'Robert Johnson',
    email: 'robert.johnson@email.com',
    phone: '(407) 555-9012',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    rating: 4.7,
    completedJobs: 156,
    specialties: ['Commercial', 'Emergency Repairs'],
    location: {
      lat: 28.4813,
      lng: -81.4481,
    },
  },
];
