export type UserRole = 'client' | 'provider' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  city?: string;
  isPaid?: boolean; // For client fee (R$ 10) or provider sub (R$ 29.90)
  rating?: number;
  reviewsCount?: number;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  name: string;
  category: string;
  bio: string;
  hourlyRate: number;
  city: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  avatar: string;
  whatsapp: string;
  completedJobs: number;
}

export interface JobRequest {
  id: string;
  clientId: string;
  clientName: string;
  category: string;
  title: string;
  description: string;
  budget: number;
  city: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  proposalsCount: number;
}

export interface Proposal {
  id: string;
  jobId: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerRating: number;
  price: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}
