import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// This file would typically contain Firebase initialization logic.
// For this mock version, we're re-exporting mock data.

// Example Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);

// Export mock data
export { mockJobs, mockSuppliers, mockProducts, mockContractors } from '../data/mockData';
