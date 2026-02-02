import { DanceMotion } from './types';

export const ADMIN_EMAIL = 'blessedsuccess538@gmail.com';
export const GENERATION_COST = 50; // Default base cost
export const SIGNUP_BONUS = 500;

export interface StyleModel {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  promptModifier: string;
}

export const VIDEO_STYLES: StyleModel[] = [
  {
    id: 'anime-jap',
    name: 'Japanese Anime',
    description: 'v6 Model',
    thumbnail: 'https://picsum.photos/200/300?random=10', // Replace with real asset in prod
    promptModifier: 'anime style, japanese anime animation, vibrant colors, cell shaded, studio ghibli style, high quality 2d animation',
  },
  {
    id: 'realistic',
    name: 'Realistic',
    description: 'v6 Model',
    thumbnail: 'https://picsum.photos/200/300?random=11',
    promptModifier: 'photorealistic, 4k, highly detailed, cinematic lighting, raw footage style, 8k uhd, ray tracing',
  },
  {
    id: '2.5d',
    name: '2.5D Illustration',
    description: 'v6 Model',
    thumbnail: 'https://picsum.photos/200/300?random=12',
    promptModifier: '2.5d style, semi-realistic, digital painting, smooth rendering, artstation style, detailed textures',
  },
  {
    id: 'western',
    name: 'Western Animation',
    description: 'v6 Model',
    thumbnail: 'https://picsum.photos/200/300?random=13',
    promptModifier: 'western cartoon style, comic book aesthetics, bold lines, dynamic motion, superhero cartoon style',
  },
  {
    id: 'pixel',
    name: 'Pixel Art',
    description: 'v1 Model',
    thumbnail: 'https://picsum.photos/200/300?random=14',
    promptModifier: 'pixel art style, 16-bit, retro game aesthetic, blocky, vibrant pixelated details',
  },
  {
    id: '3d-toon',
    name: '3D Cartoon',
    description: 'v4 Model',
    thumbnail: 'https://picsum.photos/200/300?random=15',
    promptModifier: '3d cartoon style, pixar style, cgi, volumetric lighting, cute, soft textures, 3d render',
  }
];

// Keep existing AI Models for backend selection
export const AI_MODELS = [
  { 
    id: 'veo-fast', 
    name: 'Gemini Veo Fast', 
    cost: 50, 
    description: 'Rapid generation, ideal for social media previews.', 
    apiModel: 'veo-3.1-fast-generate-preview',
    badge: 'FAST'
  },
  { 
    id: 'veo-pro', 
    name: 'Gemini Veo Pro', 
    cost: 120, 
    description: 'Cinematic quality with enhanced lighting and physics.', 
    apiModel: 'veo-3.1-generate-preview',
    badge: 'PRO'
  },
  { 
    id: 'sora-sim', 
    name: 'Sora AI', 
    cost: 200, 
    description: 'Ultra-realistic world simulation (Powered by Veo backend for demo).', 
    apiModel: 'veo-3.1-generate-preview', 
    badge: 'NEW'
  },
  { 
    id: 'kling-std', 
    name: 'Kling AI', 
    cost: 80, 
    description: 'Balanced motion coherence for character dance.', 
    apiModel: 'veo-3.1-fast-generate-preview', 
    badge: 'POPULAR'
  },
];

export const MOTION_TEMPLATES: DanceMotion[] = [
  {
    id: 'motion-1',
    name: 'Afro Vibe 01',
    category: 'Afrobeats',
    thumbnailUrl: 'https://picsum.photos/300/200?random=1',
    duration: 8,
  },
  {
    id: 'motion-2',
    name: 'Amapiano Shuffle',
    category: 'Amapiano',
    thumbnailUrl: 'https://picsum.photos/300/200?random=2',
    duration: 10,
  },
  {
    id: 'motion-3',
    name: 'Urban Glide',
    category: 'Hip-Hop',
    thumbnailUrl: 'https://picsum.photos/300/200?random=3',
    duration: 7,
  },
  {
    id: 'motion-4',
    name: 'Freestyle Flow',
    category: 'Freestyle',
    thumbnailUrl: 'https://picsum.photos/300/200?random=4',
    duration: 12,
  },
];

export const MOCK_ADMIN_STATS = {
  totalUsers: 1240,
  totalVideos: 8503,
  totalCoinsSpent: 425150,
  dailyActivity: [
    { name: 'Mon', generations: 120, newUsers: 10 },
    { name: 'Tue', generations: 230, newUsers: 15 },
    { name: 'Wed', generations: 180, newUsers: 8 },
    { name: 'Thu', generations: 290, newUsers: 25 },
    { name: 'Fri', generations: 350, newUsers: 30 },
    { name: 'Sat', generations: 410, newUsers: 45 },
    { name: 'Sun', generations: 380, newUsers: 40 },
  ],
};