'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { apiClient, ApiError } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiClient('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login({ accessToken: data.accessToken, refreshToken: data.refreshToken }, data.user);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message || 'Login failed');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    setError('');

    try {
      const data = await apiClient('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: demoEmail, password: 'asdf1234' }),
      });
      login({ accessToken: data.accessToken, refreshToken: data.refreshToken }, data.user);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message || 'Demo login failed');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Demo login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center bg-linear-to-br from-[#F8F9FC] to-[#EEF2FF] p-4">
      <div className="mb-8 flex flex-col items-center">
        <Image src="/logo.svg" alt="Logo" width={48} height={48} className="w-12 h-12 mb-3" /> 
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Kanban</h1>
        <p className="mt-2 text-sm text-slate-600">Real-time collaborative boards</p>
      </div>
      
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_20px_40px_-15px_rgba(59,130,246,0.08)]">
        <h2 className="mb-6 text-center text-xl font-semibold text-slate-900">Sign in to your account</h2>
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-blue-500 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-600 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.5} /> : 'Sign in'}
            </button>
          </div>

          <div className="relative mt-6 mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-slate-500 font-medium">Demo Login As</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleDemoLogin('nahid@kanban.com')}
              disabled={loading}
              className="flex items-center justify-center rounded-lg border border-slate-200 bg-white py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
            >
              Nahid
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('pervej@kanban.com')}
              disabled={loading}
              className="flex items-center justify-center rounded-lg border border-slate-200 bg-white py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
            >
              Pervej
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('ruhan@kanban.com')}
              disabled={loading}
              className="flex items-center justify-center rounded-lg border border-slate-200 bg-white py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
            >
              Ruhan
            </button>
          </div>
          
          <div className="text-center text-sm pt-2">
            <Link href="/register" className="font-medium text-blue-500 transition-colors hover:text-blue-600">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
