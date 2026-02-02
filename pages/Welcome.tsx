import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Zap, Users, Play } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Welcome: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-fuchsia-600/20 rounded-full blur-[100px]" />
      </div>

      <nav className="relative z-10 flex justify-between items-center px-6 py-6 md:px-12">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 brand-font">
          DANCEGEN
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-md mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-sm font-medium text-slate-300">New: Motion Control V2 Available</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 brand-font">
          Turn Any Image Into <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
            A Pro Dancer
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12">
          Upload a character, choose a style, and watch AI bring it to life. 
          Powered by state-of-the-art motion synthesis and generative video models.
        </p>

        <div className="flex flex-col md:flex-row gap-6 w-full max-w-md md:max-w-none justify-center">
          <Link to="/signup">
            <Button className="w-full md:w-auto px-8 py-4 text-lg">
              Start Creating Free
            </Button>
          </Link>
          <a href="#features">
            <Button variant="secondary" className="w-full md:w-auto px-8 py-4 text-lg">
              View Gallery
            </Button>
          </a>
        </div>
      </div>

      <div id="features" className="relative z-10 bg-slate-900/50 backdrop-blur-lg border-t border-slate-800 py-24">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-6">
              <Video size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Motion Transfer</h3>
            <p className="text-slate-400">
              Advanced skeleton mapping transfers real dance moves to your static images with perfect fluidity.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400 mb-6">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Fast Generation</h3>
            <p className="text-slate-400">
              Cloud GPU clusters render your 1080p videos in under a minute. No powerful hardware required.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Character Consistent</h3>
            <p className="text-slate-400">
              Our engine preserves facial identity and clothing details even during complex spins and jumps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};