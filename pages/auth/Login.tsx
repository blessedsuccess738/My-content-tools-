import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Wand2 } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email);
      if (user.role === UserRole.ADMIN) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const WateryButton = ({ children, className = '', isLoading, ...props }: any) => (
    <button 
      className={`relative overflow-hidden group backdrop-blur-md bg-white/5 border border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] hover:bg-white/10 hover:border-white/30 hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] text-white rounded-full transition-all duration-300 w-full py-3 font-bold ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      disabled={isLoading}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0"></div>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? 'Processing...' : children}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="https://cdn.coverr.co/videos/coverr-manufacturing-plant-with-robotic-arms-5334/1080p.mp4"
      ></video>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

      <div className="w-full max-w-md p-8 relative z-10 mx-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/30">
             <Wand2 size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white brand-font mb-2">Welcome Back</h2>
          <p className="text-slate-300">Enter your credentials to continue</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-xl mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 outline-none transition-all backdrop-blur-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 outline-none transition-all backdrop-blur-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="flex justify-end">
            <button onClick={() => navigate('/forgot-password')} className="text-sm text-slate-300 hover:text-white transition-colors bg-transparent border-0 cursor-pointer">
              Forgot password?
            </button>
          </div>
          <WateryButton type="submit" isLoading={loading}>
            Sign In
          </WateryButton>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} className="text-white font-bold hover:underline bg-transparent border-0 cursor-pointer">
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};