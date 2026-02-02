import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { mockApi } from '../../services/mockApi';
import { ArrowLeft, CheckCircle, ExternalLink } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await mockApi.requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <Card className="w-full max-w-md p-8 border-slate-700 bg-slate-800">
        <Link to="/login" className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-6">
          <ArrowLeft size={16} className="mr-2" /> Back to Login
        </Link>

        {isSubmitted ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
            <p className="text-slate-400 mb-8">
              We've sent a password reset link to <br/>
              <span className="text-white font-medium">{email}</span>
            </p>
            
            {/* Simulation Link for Demo */}
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-6 text-left">
              <p className="text-xs text-slate-500 font-mono mb-2 uppercase">Developer Mode: Simulate Email Click</p>
              <Link to="/reset-password?token=demo-token-123" className="flex items-center text-violet-400 hover:text-violet-300 text-sm font-medium">
                <ExternalLink size={14} className="mr-2" /> Reset Password Link
              </Link>
            </div>

            <Button onClick={() => setIsSubmitted(false)} variant="secondary" className="w-full">
              Try another email
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 brand-font mb-2">Reset Password</h2>
              <p className="text-slate-400">Enter your email to receive reset instructions</p>
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <Button type="submit" className="w-full" isLoading={loading}>
                Send Reset Link
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
};