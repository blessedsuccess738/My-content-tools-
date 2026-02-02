import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Mail, Calendar, Crown, Coins, PlayCircle, Settings } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();

  const creations = [
    { id: 1, src: 'https://picsum.photos/300/400?random=88', title: 'Neon Runner', date: '2 days ago' },
    { id: 2, src: 'https://picsum.photos/300/400?random=89', title: 'Cyber Samurai', date: '5 days ago' },
    { id: 3, src: 'https://picsum.photos/300/400?random=90', title: 'Space Drift', date: '1 week ago' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Profile Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-black to-slate-900 border border-slate-800">
         <div className="h-32 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-20"></div>
         <div className="px-8 pb-8 flex flex-col md:flex-row gap-6 items-start -mt-12 relative z-10">
            <div className="w-24 h-24 rounded-full border-4 border-black bg-slate-800 flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 pt-14 md:pt-12">
               <h1 className="text-2xl font-bold text-white mb-1">{user?.name}</h1>
               <p className="text-slate-400 flex items-center gap-2 text-sm"><Mail size={14} /> {user?.email}</p>
            </div>
            <div className="mt-12 flex gap-3">
               <Button variant="secondary" className="border border-slate-700 bg-slate-800 hover:bg-slate-700">Edit Profile</Button>
               <Button className="flex items-center gap-2"><Crown size={16} /> Upgrade Plan</Button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Stats Column */}
         <div className="space-y-6">
            <Card title="Current Plan">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                     <Crown size={20} />
                  </div>
                  <div>
                     <h3 className="font-bold text-white capitalize">{user?.subscription} Plan</h3>
                     <p className="text-xs text-slate-400">Renews in 14 days</p>
                  </div>
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between text-sm text-slate-300">
                    <span>Credits Balance</span>
                    <span className="font-bold text-white flex items-center gap-1"><Coins size={12} className="text-yellow-400" /> {user?.coins}</span>
                 </div>
                 <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full w-[60%]"></div>
                 </div>
                 <p className="text-xs text-slate-500 mt-2">Get more credits to generate high-quality videos without limits.</p>
               </div>
            </Card>

            <Card title="Account Info">
               <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
                     <span className="text-slate-400 flex items-center gap-2"><User size={14} /> Member Since</span>
                     <span className="text-white">{new Date(user?.joinedDate || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
                     <span className="text-slate-400 flex items-center gap-2"><Settings size={14} /> User ID</span>
                     <span className="text-white font-mono text-xs truncate max-w-[100px]">{user?.id}</span>
                  </div>
               </div>
            </Card>
         </div>

         {/* Content Column */}
         <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-white">Recent Creations</h2>
               <button className="text-sm text-violet-400 hover:text-violet-300">View All</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
               {creations.map((item) => (
                  <div key={item.id} className="group relative aspect-[9/16] bg-slate-800 rounded-xl overflow-hidden border border-slate-700 cursor-pointer hover:border-violet-500/50 transition-all">
                     <img src={item.src} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <h3 className="text-white font-bold text-sm">{item.title}</h3>
                        <p className="text-xs text-slate-400">{item.date}</p>
                     </div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                        <PlayCircle size={20} fill="currentColor" />
                     </div>
                  </div>
               ))}
               
               {/* Add New Placeholder */}
               <div className="aspect-[9/16] bg-slate-900/50 rounded-xl border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-800 hover:text-slate-300 hover:border-slate-500 transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-2">
                     <PlusIcon />
                  </div>
                  <span className="text-sm font-medium">Create New</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);