export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isAuthenticated: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  createdAt: string;
}

export interface Posting {
  id: string;
  title: string;
  description: string;
  category: 'buy' | 'sell' | 'rent';
  price?: string;
  contact: string;
  author: string;
  createdAt: string;
  images?: string[];
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  department: string;
  availability?: string;
}