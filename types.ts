export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum SubscriptionTier {
  FREE = 'free',
  PRO = 'pro',
  PREMIUM = 'premium',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  subscription: SubscriptionTier;
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

export type VideoQuality = 'low' | 'medium' | 'high';
export type AspectRatio = '9:16' | '16:9' | '1:1';

export interface VideoConfig {
  quality: VideoQuality;
  duration: number;
  aspectRatio: AspectRatio;
}

export interface VideoJob {
  id: string;
  userId: string;
  status: GenerationStatus;
  progress: number; // 0-100
  inputImageUrl: string;
  motionTemplateId: string;
  customMotionUrl?: string;
  config: VideoConfig;
  outputVideoUrl?: string;
  operationName?: string; // For tracking Gemini Veo operations
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