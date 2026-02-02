import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Video, Zap, Users, Play, Clapperboard, Film, 
  Camera, Wand2, Sparkles, Music, Mic, Layers, 
  Scissors, Monitor, Smartphone, Share2, Cpu, Globe, Rocket, Aperture
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Welcome: React.FC = () => {
  const words = [
    "SUCCESS", "AI", "CINEMA", "MOTION", "FUTURE", "CREATE", 
    "DREAM", "ANIMATE", "INSPIRE", "POWER", "SPEED", "QUALITY",
    "VISION", "ART", "DESIGN", "MAGIC", "STORY", "ACTION"
  ];

  const features = [
    { icon: Video, label: "AI Video" },
    { icon: Sparkles, label: "VFX" },
    { icon: Mic, label: "Voice" },
    { icon: Music, label: "Music" },
    { icon: Film, label: "Cinema" },
    { icon: Camera, label: "Camera" },
    { icon: Layers, label: "3D" },
    { icon: Wand2, label: "Magic" },
    { icon: Scissors, label: "Edit" },
    { icon: Monitor, label: "Color" },
    { icon: Cpu, label: "Render" },
    { icon: Globe, label: "Publish" },
    { icon: Clapperboard, label: "Direct" },
    { icon: Aperture, label: "Lens" },
    { icon: Zap, label: "Fast" },
    { icon: Rocket, label: "Launch" },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      
      {/* Background Movie Animation */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        {/* Using a tech/cinematic abstract background video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-50"
          src="https://cdn.coverr.co/videos/coverr-digital-tunnel-3665/1080p.mp4"
        ></video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 z-10"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center px-6 py-6 md:px-12 backdrop-blur-sm bg-black/20">
        <div className="flex items-center gap-2">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold brand-font text-xl shadow-[0_0_20px_rgba(124,58,237,0.5)]">S</div>
           <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 brand-font tracking-widest">
            SUCCESS_AI
          </span>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost" className="text-white hover:bg-white/10">Login</Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-white text-black hover:bg-slate-200 border-0 font-bold">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-20 container mx-auto px-6 pt-20 pb-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-in slide-in-from-top-4 duration-700">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]"></span>
          <span className="text-xs font-medium text-slate-300 tracking-widest uppercase">Recording Live</span>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight mb-6 brand-font tracking-tighter mix-blend-screen">
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-600 drop-shadow-2xl">
            DOMINATE
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-white">
            THE SCREEN
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mb-12 font-light leading-relaxed">
          The world's most advanced AI video generation platform. <br/>
          Create cinematic masterpieces from text, images, or pure imagination.
        </p>

        <div className="flex flex-col md:flex-row gap-6 w-full max-w-lg md:max-w-none justify-center mb-20">
          <Link to="/signup">
            <Button className="w-full md:w-auto px-10 py-5 text-lg rounded-full bg-violet-600 hover:bg-violet-500 border-0 shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all hover:scale-105">
              Start Creating Now
            </Button>
          </Link>
          <a href="#demo">
            <Button variant="ghost" className="w-full md:w-auto px-10 py-5 text-lg rounded-full border border-white/20 hover:bg-white/10 text-white backdrop-blur-sm">
              <Play className="mr-2" size={20} fill="currentColor" /> Watch Trailer
            </Button>
          </a>
        </div>
      </div>

      {/* Marquee Words */}
      <div className="relative z-20 py-10 bg-black/50 backdrop-blur-sm border-y border-white/5 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content">
            {[...words, ...words, ...words].map((word, i) => (
              <span key={i} className="inline-block mx-8 text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-800 to-black brand-font stroke-text opacity-50 hover:opacity-100 hover:text-white transition-all cursor-default">
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Icon Grid Section */}
      <div className="relative z-20 py-24 bg-black">
        <div className="container mx-auto px-6">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold mb-4 brand-font">EVERY TOOL YOU NEED</h2>
             <p className="text-slate-500">A complete studio in your browser.</p>
           </div>
           
           <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-8">
             {features.map((feature, idx) => (
               <div key={idx} className="flex flex-col items-center group">
                 <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:bg-violet-600 group-hover:border-violet-500 transition-all duration-300 group-hover:scale-110 shadow-lg group-hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                   <feature.icon size={32} className="text-slate-400 group-hover:text-white transition-colors" />
                 </div>
                 <span className="text-xs md:text-sm font-medium text-slate-500 group-hover:text-white uppercase tracking-wider">{feature.label}</span>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/10 py-12 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
             <span className="text-2xl font-bold text-white brand-font">SUCCESS_AI</span>
             <p className="text-slate-600 text-sm mt-1">© 2025 Success AI Inc.</p>
          </div>
          <div className="flex gap-8 text-slate-500 text-sm">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};