import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Video, Image as ImageIcon, Wand2, Play, Zap, Heart, Sparkles } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const quickApps = [
    {
      id: 'img-to-vid',
      title: 'Image to Video',
      tag: 'AI Video',
      image: 'https://picsum.photos/600/400?random=10',
      color: 'from-orange-500/20 to-pink-500/20',
      link: '/create'
    },
    {
      id: 'txt-to-vid',
      title: 'Text to Video',
      tag: 'AI Video',
      image: 'https://picsum.photos/600/400?random=11',
      color: 'from-violet-500/20 to-purple-500/20',
      link: '/create'
    },
    {
      id: 'frames-to-vid',
      title: 'Frames to Video',
      tag: 'AI Video',
      image: 'https://picsum.photos/600/400?random=12',
      color: 'from-amber-500/20 to-yellow-500/20',
      link: '/create'
    }
  ];

  const inspirations = [
    { id: 1, type: 'Image to Video', src: 'https://picsum.photos/400/600?random=20', title: 'Cyberpunk City' },
    { id: 2, type: 'Video to Video', src: 'https://picsum.photos/400/300?random=21', title: 'Anime Transformation' },
    { id: 3, type: 'Talking Head', src: 'https://picsum.photos/400/500?random=22', title: 'Virtual Host' },
    { id: 4, type: 'Image to Video', src: 'https://picsum.photos/400/400?random=23', title: 'Abstract Flow' },
    { id: 5, type: 'Text to Video', src: 'https://picsum.photos/400/600?random=24', title: 'Neon Driver' },
  ];

  return (
    <div className="space-y-8 pb-24 md:pb-0">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-800 border border-slate-700 min-h-[300px] flex items-end group">
        <img 
          src="https://picsum.photos/1200/600?grayscale&blur=2" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" 
          alt="Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        
        <div className="relative z-10 p-6 md:p-10 max-w-2xl animate-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={12} /> Version 2.4 Live
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 brand-font leading-tight">
            Blurry is Boring. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              Dominate in 6K.
            </span>
          </h2>
          <p className="text-slate-300 mb-6 text-sm md:text-base line-clamp-2">
            Unleash the full potential of your creations with Upscale V2. 
            4K video and 6K image support is now live.
          </p>
          <Link to="/create">
            <Button className="rounded-full px-8 bg-white text-slate-900 hover:bg-slate-200 hover:text-slate-900 font-bold border-0">
              Try Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Actions Icons */}
      <div className="grid grid-cols-3 gap-4 px-2">
        <Link to="/create" className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-slate-800/50 transition-colors group">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-violet-500/50 transition-all duration-300 shadow-lg shadow-black/20">
            <Video size={24} />
          </div>
          <span className="text-xs font-medium text-slate-300 group-hover:text-white">AI Video</span>
        </Link>
        <div className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-slate-800/50 transition-colors group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-fuchsia-500/50 transition-all duration-300 shadow-lg shadow-black/20">
            <ImageIcon size={24} />
          </div>
          <span className="text-xs font-medium text-slate-300 group-hover:text-white">AI Image</span>
        </div>
        <div className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-slate-800/50 transition-colors group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-cyan-500/50 transition-all duration-300 shadow-lg shadow-black/20">
            <Wand2 size={24} />
          </div>
          <span className="text-xs font-medium text-slate-300 group-hover:text-white">AI Editing</span>
        </div>
      </div>

      {/* Quick Apps */}
      <div>
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-lg font-bold text-white">Quick Apps</h3>
          <button className="text-xs text-slate-500 hover:text-white transition-colors">Show all</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickApps.map((app) => (
            <Link to={app.link} key={app.id} className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-slate-800 hover:border-slate-600 transition-all">
              <img src={app.image} alt={app.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className={`absolute inset-0 bg-gradient-to-t ${app.color} via-slate-900/40 to-transparent`}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>
              
              <div className="absolute top-3 right-3 p-2 bg-black/20 backdrop-blur-md rounded-full text-white/70 hover:text-red-400 hover:bg-black/40 transition-colors">
                <Heart size={16} />
              </div>

              <div className="absolute bottom-0 left-0 p-5 w-full">
                <div className="flex items-center gap-2 text-xs font-medium text-white/60 mb-1">
                  <Video size={12} />
                  {app.tag}
                </div>
                <h4 className="text-xl font-bold text-white group-hover:text-violet-200 transition-colors">{app.title}</h4>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Inspirations (Masonry-ish) */}
      <div>
        <div className="flex items-center gap-4 mb-6 px-2 overflow-x-auto no-scrollbar">
          <h3 className="text-lg font-bold text-white shrink-0">Inspirations</h3>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold">All</button>
            <button className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs font-medium whitespace-nowrap">AI Video</button>
            <button className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs font-medium whitespace-nowrap">AI Image</button>
          </div>
        </div>
        
        <div className="columns-2 md:columns-4 gap-4 space-y-4">
          {inspirations.map((item) => (
            <div key={item.id} className="relative group rounded-xl overflow-hidden bg-slate-800 break-inside-avoid cursor-pointer">
              <img src={item.src} alt={item.title} className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                   <Play size={24} fill="currentColor" className="ml-1" />
                 </div>
              </div>
              <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/50 backdrop-blur-sm text-[10px] font-medium text-white">
                {item.type}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};