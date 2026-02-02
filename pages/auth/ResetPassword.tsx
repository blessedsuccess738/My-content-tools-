import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import { CheckCircle, AlertCircle, Wand2 } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or expired password reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!token) {
      setError('Missing reset token');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(token, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
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

  if (success) {
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

        <div className="w-full max-w-md p-8 relative z-10 mx-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-green-500/30">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 brand-font">Password Reset!</h2>
          <p className="text-slate-300 mb-8">
            Your password has been successfully updated. You can now login with your new credentials.
          </p>
          <WateryButton onClick={() => navigate('/login')}>
            Return to Login
          </WateryButton>
        </div>
      </div>
    );
  }

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
          <h2 className="text-3xl font-bold text-white brand-font mb-2">New Password</h2>
          <p className="text-slate-300">Please enter your new password below</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-xl mb-4 text-sm flex items-start gap-2 justify-center">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">New Password</label>
            <input
              type="password"
              required
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 outline-none transition-all backdrop-blur-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Confirm Password</label>
            <input
              type="password"
              required
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 outline-none transition-all backdrop-blur-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <WateryButton type="submit" isLoading={loading} disabled={!!error && !token}>
            Reset Password
          </WateryButton>
        </form>
      </div>
    </div>
  );
};