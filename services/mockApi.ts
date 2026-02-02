import { User, UserRole, SubscriptionTier, VideoJob, GenerationStatus, VideoConfig } from '../types';
import { ADMIN_EMAIL, SIGNUP_BONUS, GENERATION_COST, MOCK_ADMIN_STATS } from '../constants';

// In-memory mock database
let users: User[] = [
  {
    id: 'admin-1',
    email: ADMIN_EMAIL,
    name: 'Super Admin',
    role: UserRole.ADMIN,
    subscription: SubscriptionTier.PREMIUM,
    coins: 999999,
    joinedDate: new Date().toISOString(),
    isBanned: false,
  },
  {
    id: 'user-1',
    email: 'demo@example.com',
    name: 'Demo User',
    role: UserRole.USER,
    subscription: SubscriptionTier.FREE,
    coins: 100,
    joinedDate: new Date().toISOString(),
    isBanned: false,
  }
];

let jobs: VideoJob[] = [
  {
    id: 'job-1',
    userId: 'user-1',
    status: GenerationStatus.COMPLETED,
    progress: 100,
    inputImageUrl: 'https://picsum.photos/400/600',
    motionTemplateId: 'motion-1',
    config: { quality: 'medium', duration: 8, aspectRatio: '9:16', modelId: 'veo-fast' },
    outputVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', // Sample video
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    cost: 50
  }
];

export const mockApi = {
  login: async (email: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate latency
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) throw new Error('User not found');
    if (user.isBanned) throw new Error('Account suspended');

    // Automatic Admin Role Assignment Check on Login
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && user.role !== UserRole.ADMIN) {
      user.role = UserRole.ADMIN;
      user.subscription = SubscriptionTier.PREMIUM;
    }

    return user;
  },

  signup: async (email: string, name: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // SPECIAL LOGIC: If it's the specific admin email, allow "signup" to act as login
    if (existingUser) {
      if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
         // Ensure it's admin role
         existingUser.role = UserRole.ADMIN;
         existingUser.subscription = SubscriptionTier.PREMIUM;
         return existingUser;
      }
      throw new Error('Email already exists');
    }
    
    // Automatic Admin Role Assignment Logic for new user
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: isAdmin ? UserRole.ADMIN : UserRole.USER,
      subscription: isAdmin ? SubscriptionTier.PREMIUM : SubscriptionTier.FREE,
      coins: SIGNUP_BONUS,
      joinedDate: new Date().toISOString(),
      isBanned: false,
    };
    users.push(newUser);
    return newUser;
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error('User not found');
    // Simulate sending email
    console.log(`Password reset email sent to ${email}`);
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (!token) throw new Error('Invalid or expired token');
    // In a real app, verify token and update user password
    console.log(`Password successfully updated for token ${token}`);
  },

  getUser: async (id: string): Promise<User> => {
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  },

  getAllUsers: async (): Promise<User[]> => {
    // Admin only in real app
    return [...users];
  },

  banUser: async (userId: string, ban: boolean): Promise<void> => {
    const user = users.find(u => u.id === userId);
    if (user && user.email !== ADMIN_EMAIL) {
      user.isBanned = ban;
    }
  },

  updateUserSubscription: async (userId: string, tier: SubscriptionTier): Promise<void> => {
    const user = users.find(u => u.id === userId);
    if (user && user.email !== ADMIN_EMAIL) {
      user.subscription = tier;
    }
  },

  addCoins: async (userId: string, amount: number): Promise<User> => {
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    user.coins += amount;
    return user;
  },

  startGeneration: async (
    userId: string, 
    imageFile: File | null, 
    motionId: string, 
    config: VideoConfig,
    customMotionFile: File | null
  ): Promise<VideoJob> => {
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    if (user.coins < GENERATION_COST) throw new Error('Insufficient coins');

    // Deduct coins
    user.coins -= GENERATION_COST;

    const newJob: VideoJob = {
      id: `job-${Date.now()}`,
      userId,
      status: GenerationStatus.PROCESSING,
      progress: 0,
      inputImageUrl: imageFile ? URL.createObjectURL(imageFile) : 'https://picsum.photos/400/600',
      motionTemplateId: motionId,
      customMotionUrl: customMotionFile ? URL.createObjectURL(customMotionFile) : undefined,
      config,
      createdAt: new Date().toISOString(),
      cost: GENERATION_COST,
    };
    
    jobs.unshift(newJob);
    return newJob;
  },

  checkJobStatus: async (jobId: string): Promise<VideoJob> => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) throw new Error('Job not found');

    // Simulate progress
    if (job.status === GenerationStatus.PROCESSING) {
      job.progress += 10;
      if (job.progress >= 100) {
        job.status = GenerationStatus.COMPLETED;
        job.outputVideoUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
      }
    }
    return { ...job };
  },

  getUserJobs: async (userId: string): Promise<VideoJob[]> => {
    return jobs.filter(j => j.userId === userId);
  },

  getAllJobs: async (): Promise<VideoJob[]> => {
    return [...jobs];
  },

  getStats: async () => {
    return {
      ...MOCK_ADMIN_STATS,
      totalUsers: users.length,
      totalVideos: jobs.length,
    };
  }
};