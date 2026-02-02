export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  coins: number;
  joinedDate: string;
  isBanned: boolean;
}

export enum GenerationStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface DanceMotion {
  id: string;
  name: string;
  category: 'Afrobeats' | 'Amapiano' | 'Hip-Hop' | 'Freestyle' | 'Custom';
  thumbnailUrl: string;
  previewUrl?: string; // URL to a preview gif/video of the motion
  duration: number; // in seconds
}

export interface VideoJob {
  id: string;
  userId: string;
  status: GenerationStatus;
  progress: number; // 0-100
  inputImageUrl: string;
  motionTemplateId: string;
  outputVideoUrl?: string;
  createdAt: string;
  cost: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SystemStats {
  totalUsers: number;
  totalVideos: number;
  totalCoinsSpent: number;
  dailyActivity: { name: string; generations: number; newUsers: number }[];
}