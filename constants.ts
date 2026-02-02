import { DanceMotion } from './types';

export const ADMIN_EMAIL = 'blessedsuccess538@gmail.com';
export const GENERATION_COST = 50;
export const SIGNUP_BONUS = 200;

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