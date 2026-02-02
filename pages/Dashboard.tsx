import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { 
  Video, Image as ImageIcon, Wand2, Play, Zap, Sparkles, 
  Type, Copy, Film, User, PenTool, Mic, Monitor, Smile, Scissors, Aperture, Ghost, ArrowUpRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const aiTools = [
    { name: 'All AI Tools', icon: Wand2, link: '/create' },
    { name: 'Video to Video', icon: Video, link: '/create' },
    { name: 'Image to Video', icon: ImageIcon, link: '/create' },
    { name: 'Text to Video', icon: Type, link: '/create' },
    { name: 'Image to Image', icon: Copy, link: '/create' },
    { name: 'Image Animation', icon: Film, link: '/create' },
    { name: 'Character Animation', icon: User, link: '/create' },
    { name: 'Text to Image', icon: PenTool, link: '/create' },
  ];

  const quickApps = [
    { title: 'AI Anime Video Generator', icon: Ghost, color: 'from-pink-500/20 to-rose-500/20' },
    { title: 'AI Talking Avatar', icon: Smile, color: 'from-blue-500/20 to-cyan-500/20' },
    { title: 'Video Upscaler', icon: Zap, color: 'from-amber-500/20 to-yellow-500/20' },
    { title: 'Background Remover', icon: Scissors, color: 'from-green-500/20 to-emerald-500/20' },
    { title: 'AI Video Lip Sync', icon: Mic, color: 'from-purple-500/20 to-violet-500/20' },
    { title: 'AI Video Style Transfer', icon: Aperture, color: 'from-indigo-500/20 to-blue-500/20' },
    { title: 'Cartoonize Video Object', icon: Film, color: 'from-orange-500/20 to-red-500/20' },
    { title: 'AI Image Generator', icon: ImageIcon, color: 'from-teal-500/20 to-green-500/20' },
    { title: 'AI Image Upscaler', icon: Monitor, color: 'from-fuchsia-500/20 to-pink-500/20' },
    { title: 'AI VTuber Maker', icon: User, color: 'from-violet-500/20 to-indigo-500/20' },
    { title: 'AI Cartoon Video Generator', icon: Video, color: 'from-sky-500/20 to-blue-500/20' },
  ];

  const inspirations = [
    { id: 1, type: 'Image to Video', src: 'https://picsum.photos/400/600?random=20', title: 'Cyberpunk City' },
    { id: 2, type: 'Video to Video', src: 'https://picsum.photos/400/300?random=21', title: 'Anime Transformation' },
    { id: 3, type: 'Talking Head', src: 'https://picsum.photos/400/500?random=22', title: 'Virtual Host' },
    { id: 4, type: 'Image to Video', src: 'https://picsum.photos/400/400?random=23', title: 'Abstract Flow' },
    { id: 5, type: 'Text to Video', src: 'https://picsum.photos/400/600?random=24', title: 'Neon Driver' },
  ];

  return (
    <div className="space-y-12 pb-24 md:pb-0">
      
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
          <div onClick={() => navigate('/create')}>
            <Button className="rounded-full px-8 bg-white text-slate-900 hover:bg-slate-200 hover:text-slate-900 font-bold border-0">
              Try Now
            </Button>
          </div>
        </div>
      </div>

      {/* AI Tools Grid */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6 px-2">AI Tools</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 px-2">
          {aiTools.map((tool, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(tool.link)}
              className="flex flex-col items-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800 hover:border-violet-500/30 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-violet-600/20 group-hover:border-violet-500/50 transition-all shadow-lg">
                <tool.icon size={24} />
              </div>
              <span className="text-xs font-medium text-slate-400 group-hover:text-white text-center leading-tight h-8 flex items-center">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Apps Grid */}
      <div>
        <div className="flex justify-between items-center mb-6 px-2">
          <h3 className="text-xl font-bold text-white">Quick Apps</h3>
          <button className="text-xs text-slate-500 hover:text-white transition-colors">All Quick Apps</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
          {quickApps.map((app, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate('/create')}
              className="group relative rounded-2xl overflow-hidden aspect-[16/10] border border-slate-800 hover:border-slate-600 transition-all cursor-pointer"
            >
              {/* Fallback pattern background since we don't have real images for all apps */}
              <div className={`absolute inset-0 bg-gradient-to-br ${app.color} via-slate-900 to-slate-950`}></div>
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white">
                  <ArrowUpRight size={16} />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 p-5 w-full">
                <div className="w-10 h-10 rounded-xl bg-black/30 backdrop-blur-md flex items-center justify-center text-white mb-3 shadow-lg">
                   <app.icon size={20} />
                </div>
                <h4 className="text-lg font-bold text-white leading-tight group-hover:text-violet-200 transition-colors">{app.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspirations (Masonry-ish) */}
      <div>
        <div className="flex items-center gap-4 mb-6 px-2 overflow-x-auto no-scrollbar">
          <h3 className="text-xl font-bold text-white shrink-0">Inspirations</h3>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold">All</button>
            <button className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs font-medium whitespace-nowrap">AI Video</button>
            <button className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs font-medium whitespace-nowrap">AI Image</button>
          </div>
        </div>
        
        <div className="columns-2 md:columns-4 gap-4 space-y-4 px-2">
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