import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { ArrowLeft, CheckCircle, ExternalLink, Wand2 } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset');
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
        <button onClick={() => navigate('/login')} className="inline-flex items-center text-sm text-slate-300 hover:text-white mb-6 transition-colors bg-transparent border-0 cursor-pointer">
          <ArrowLeft size={16} className="mr-2" /> Back to Login
        </button>

        {isSubmitted ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-green-500/30">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 brand-font">Check your email</h2>
            <p className="text-slate-300 mb-8">
              We've sent a password reset link to <br/>
              <span className="text-white font-medium">{email}</span>
            </p>
            
            {/* Simulation Link for Demo */}
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 mb-6 text-left backdrop-blur-sm">
              <p className="text-xs text-slate-500 font-mono mb-2 uppercase">Developer Mode: Simulate Email Click</p>
              <button onClick={() => navigate('/reset-password?token=demo-token-123')} className="flex items-center text-white hover:text-slate-200 text-sm font-medium bg-transparent border-0 cursor-pointer">
                <ExternalLink size={14} className="mr-2" /> Reset Password Link
              </button>
            </div>

            <button onClick={() => setIsSubmitted(false)} className="w-full py-3 text-sm text-slate-300 hover:text-white transition-colors bg-transparent border-0 cursor-pointer">
              Try another email
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/30">
                 <Wand2 size={28} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white brand-font mb-2">Reset Password</h2>
              <p className="text-slate-300">Enter your email to receive reset instructions</p>
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-xl mb-4 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 outline-none transition-all backdrop-blur-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <WateryButton type="submit" isLoading={loading}>
                Send Reset Link
              </WateryButton>
            </form>
          </>
        )}
      </div>
    </div>
  );
};