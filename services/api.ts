import { GoogleGenAI } from "@google/genai";
import { User, UserRole, SubscriptionTier, VideoJob, GenerationStatus, VideoConfig } from '../types';
import { ADMIN_EMAIL, SIGNUP_BONUS, GENERATION_COST, MOCK_ADMIN_STATS, MOTION_TEMPLATES, AI_MODELS } from '../constants';

const DB_KEYS = {
  USERS: 'dancegen_users',
  JOBS: 'dancegen_jobs',
  CURRENT_USER: 'dancegen_current_user_id'
};

// Helper to access LocalStorage "Database"
const db = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]'),
  setUsers: (users: User[]) => localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users)),
  getJobs: (): VideoJob[] => JSON.parse(localStorage.getItem(DB_KEYS.JOBS) || '[]'),
  setJobs: (jobs: VideoJob[]) => localStorage.setItem(DB_KEYS.JOBS, JSON.stringify(jobs)),
};

// Initialize Admin if not exists
const initDb = () => {
  const users = db.getUsers();
  if (!users.find(u => u.email === ADMIN_EMAIL)) {
    users.push({
      id: 'admin-1',
      email: ADMIN_EMAIL,
      name: 'Super Admin',
      role: UserRole.ADMIN,
      subscription: SubscriptionTier.PREMIUM,
      coins: 999999,
      joinedDate: new Date().toISOString(),
      isBanned: false,
    });
    db.setUsers(users);
  }
};
initDb();

// Safely get API Key
const getApiKey = () => {
  try {
    return process.env.API_KEY;
  } catch (error) {
    console.warn("API Key not found in environment variables");
    return undefined;
  }
};

// Helper to convert File or URL to Base64
async function getBase64FromUrlOrFile(input: File | string): Promise<string> {
  if (input instanceof File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(input);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/png;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  } else {
    // If it's a URL (e.g., from Gemini generation)
    if (input.startsWith('data:')) {
       return input.split(',')[1];
    }
    // If it's a remote URL (fallback), fetch it
    const response = await fetch(input);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }
}

export const api = {
  // --- AUTHENTICATION ---
  login: async (email: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800)); 
    
    const users = db.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) throw new Error('User not found');
    if (user.isBanned) throw new Error('Account suspended');

    // Auto-promote Admin
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && user.role !== UserRole.ADMIN) {
      user.role = UserRole.ADMIN;
      user.subscription = SubscriptionTier.PREMIUM;
      db.setUsers(users.map(u => u.id === user.id ? user : u));
    }

    return user;
  },

  signup: async (email: string, name: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = db.getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // Login if Admin email exists, else error
    if (existingUser) {
      if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
         existingUser.role = UserRole.ADMIN;
         existingUser.subscription = SubscriptionTier.PREMIUM;
         db.setUsers(users.map(u => u.id === existingUser.id ? existingUser : u));
         return existingUser;
      }
      throw new Error('Email already exists');
    }
    
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
    db.setUsers(users);
    return newUser;
  },

  getUser: async (id: string): Promise<User> => {
    const user = db.getUsers().find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`[API] Password reset requested for ${email}`);
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`[API] Password updated for token ${token}`);
  },

  // --- GOOGLE GENAI INTEGRATION ---
  generateAIImage: async (prompt: string): Promise<string> => {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.warn("Missing API Key");
      await new Promise(resolve => setTimeout(resolve, 1500));
      return `https://picsum.photos/1024/1024?random=${Date.now()}`;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `A full body shot of a dancer character, ${prompt}, white background, high quality, 4k, photorealistic` }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
      throw new Error("No image generated");
    } catch (error) {
      console.error("GenAI Error:", error);
      return `https://picsum.photos/1024/1024?random=${Date.now()}`;
    }
  },

  // --- VIDEO GENERATION (Gemini Veo & Others) ---
  startGeneration: async (
    userId: string, 
    imageFile: File | null, 
    motionId: string, 
    config: VideoConfig,
    customMotionFile: File | null,
    aiGeneratedImageUrl?: string,
    referenceImageFile?: File 
  ): Promise<VideoJob> => {
    const users = db.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    let estimatedCost = 15;
    if (config.duration > 5) estimatedCost += 10;
    if (customMotionFile) estimatedCost += 10;
    
    if (user.coins < estimatedCost) throw new Error('Insufficient coins');

    user.coins -= estimatedCost;
    db.setUsers(users.map(u => u.id === userId ? user : u));

    let inputUrl = 'https://picsum.photos/400/600';
    let base64Image = '';
    
    try {
      const fileToProcess = referenceImageFile || imageFile; 
      if (aiGeneratedImageUrl) {
          inputUrl = aiGeneratedImageUrl;
          base64Image = await getBase64FromUrlOrFile(aiGeneratedImageUrl);
      } else if (fileToProcess) {
          inputUrl = URL.createObjectURL(fileToProcess);
          base64Image = await getBase64FromUrlOrFile(fileToProcess);
      }
    } catch (e) {
      console.warn("Failed to process image for Veo, using prompt only fallback", e);
    }

    let operationName = undefined;
    const apiKey = getApiKey();

    if (apiKey && base64Image) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        
        const apiModelToUse = 'veo-3.1-fast-generate-preview';
        
        const finalPrompt = customMotionFile 
          ? `Cinematic video, character motion transfer, high quality, 4k. Style matching the reference image.` 
          : `Cinematic video, high quality, 4k`; 

        // Veo only supports 16:9 or 9:16. Default to 9:16 if 1:1 is selected.
        let safeAspectRatio: '16:9' | '9:16' = '9:16';
        if (config.aspectRatio === '16:9') safeAspectRatio = '16:9';
        
        const operation = await ai.models.generateVideos({
          model: apiModelToUse,
          prompt: finalPrompt,
          image: {
            imageBytes: base64Image,
            mimeType: 'image/png', 
          },
          config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: safeAspectRatio, 
          }
        });
        operationName = operation.name;
        console.log(`Veo Operation Started:`, operationName);
      } catch (e) {
        console.error("Veo Launch Failed:", e);
      }
    }

    const newJob: VideoJob = {
      id: `job-${Date.now()}`,
      userId,
      status: GenerationStatus.PROCESSING,
      progress: 0,
      inputImageUrl: inputUrl,
      motionTemplateId: motionId,
      customMotionUrl: customMotionFile ? URL.createObjectURL(customMotionFile) : undefined,
      referenceImageUrl: referenceImageFile ? URL.createObjectURL(referenceImageFile) : undefined,
      config,
      operationName, 
      createdAt: new Date().toISOString(),
      cost: estimatedCost,
    };
    
    const jobs = db.getJobs();
    jobs.unshift(newJob);
    db.setJobs(jobs);

    return newJob;
  },

  checkJobStatus: async (jobId: string): Promise<VideoJob> => {
    const jobs = db.getJobs();
    const jobIndex = jobs.findIndex(j => j.id === jobId);
    if (jobIndex === -1) throw new Error('Job not found');

    const job = jobs[jobIndex];
    const apiKey = getApiKey();

    if (job.status === GenerationStatus.PROCESSING) {
      if (job.operationName && apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          let op = { name: job.operationName, done: false, result: {}, metadata: {} };
          
          const updatedOp = await ai.operations.getVideosOperation({ operation: op });
          
          if (updatedOp.done) {
             const videoUri = updatedOp.response?.generatedVideos?.[0]?.video?.uri;
             if (videoUri) {
               job.outputVideoUrl = `${videoUri}&key=${apiKey}`;
               job.status = GenerationStatus.COMPLETED;
               job.progress = 100;
             } else {
               job.status = GenerationStatus.FAILED;
             }
          } else {
             if (job.progress < 90) job.progress += 5;
          }
        } catch (e) {
          console.error("Polling Error:", e);
        }
      } else {
        // Fallback Simulation
        job.progress += Math.floor(Math.random() * 10) + 2;
        if (job.progress >= 100) {
          job.progress = 100;
          job.status = GenerationStatus.COMPLETED;
          job.outputVideoUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';
        }
      }
      
      jobs[jobIndex] = job;
      db.setJobs(jobs);
    }
    
    return { ...job };
  },

  getUserJobs: async (userId: string): Promise<VideoJob[]> => {
    return db.getJobs().filter(j => j.userId === userId);
  },

  // --- ADMIN ---
  getAllUsers: async (): Promise<User[]> => {
    return db.getUsers();
  },

  banUser: async (userId: string, ban: boolean): Promise<void> => {
    const users = db.getUsers();
    const user = users.find(u => u.id === userId);
    if (user && user.email !== ADMIN_EMAIL) {
      user.isBanned = ban;
      db.setUsers(users);
    }
  },

  updateUserSubscription: async (userId: string, tier: SubscriptionTier): Promise<void> => {
    const users = db.getUsers();
    const user = users.find(u => u.id === userId);
    if (user && user.email !== ADMIN_EMAIL) {
      user.subscription = tier;
      db.setUsers(users);
    }
  },

  addCoins: async (userId: string, amount: number): Promise<User> => {
    const users = db.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    user.coins += amount;
    db.setUsers(users);
    return user;
  },

  getStats: async () => {
    const users = db.getUsers();
    const jobs = db.getJobs();
    return {
      ...MOCK_ADMIN_STATS,
      totalUsers: users.length,
      totalVideos: jobs.length,
    };
  }
};