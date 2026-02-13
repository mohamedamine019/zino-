export interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  date: string;
  imageUrl: string;
  category: string;
  description: string;
  sellerName: string;
  isPro: boolean;
}

export interface User {
  email: string;
  passwordHash: string; // Simple storage for demo
  name: string;
}

export enum ViewState {
  HOME = 'HOME',
  RESULTS = 'RESULTS',
  DETAIL = 'DETAIL',
  POST_AD = 'POST_AD',
  LOGIN = 'LOGIN',
  MESSAGES = 'MESSAGES'
}

export interface SearchFilters {
  query: string;
  location: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}