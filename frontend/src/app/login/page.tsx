'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { apiClient, ApiError } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
      toast.success('Logged in successfully!');
      login({ accessToken: data.accessToken, refreshToken: data.refreshToken }, data.user);
    } catch (err: unknown) {
      let errorMessage = 'Login failed';
      if (err instanceof ApiError) {
        errorMessage = err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
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
      toast.success(`Logged in as ${demoEmail.split('@')[0]}!`);
      login({ accessToken: data.accessToken, refreshToken: data.refreshToken }, data.user);
    } catch (err: unknown) {
      let errorMessage = 'Demo login failed';
      if (err instanceof ApiError) {
        errorMessage = err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center bg-background p-4 sm:p-8 font-sans selection:bg-zinc-800 selection:text-white">
      <div className="mb-10 flex flex-col items-center animate-stagger-fade-up">
        <Image src="/logo.svg" alt="Kanban Logo" width={48} height={48} className="rounded-2xl shadow-sm mb-5" priority />
        <h1 className="text-3xl font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">Kanban</h1>
        <p className="mt-3 text-[15px] text-zinc-500 font-medium">Real-time collaborative boards</p>
      </div>
      
      <div 
        className="w-full max-w-md animate-stagger-fade-up opacity-0"
        style={{ animationDelay: '100ms' }}
      >
        <div className="p-2 rounded-[2.5rem] bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm">
          <div className="bg-white dark:bg-zinc-950 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/20 border border-zinc-100 dark:border-zinc-800 p-8 sm:p-10">
            <h2 className="mb-8 text-center text-[22px] font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">Sign in to your account</h2>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/50 p-4 text-sm text-red-600 dark:text-red-400 font-medium flex items-center justify-center text-center">
                  {error}
                </div>
              )}
              
              <div className="space-y-5">
                <div>
                  <label htmlFor="email-address" className="mb-2 block text-[13px] font-medium text-zinc-500 uppercase tracking-wider">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-5 py-3.5 text-[15px] font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-zinc-400 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-100 dark:focus:ring-zinc-800 transition-all duration-300 ease-(--ease-spring)"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="mb-2 block text-[13px] font-medium text-zinc-500 uppercase tracking-wider">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-5 py-3.5 text-[15px] font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-zinc-400 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-100 dark:focus:ring-zinc-800 transition-all duration-300 ease-(--ease-spring)"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100 py-3.5 text-[15px] font-medium text-white dark:text-zinc-900 transition-all duration-500 ease-(--ease-spring) hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-zinc-200 dark:focus:ring-zinc-700 disabled:opacity-50 disabled:active:scale-100 shadow-sm"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.5} /> : 'Sign in'}
                </button>
              </div>

              <div className="relative mt-8 mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                  <span className="bg-white dark:bg-zinc-950 px-4 text-zinc-400 dark:text-zinc-500 font-semibold">Demo Login As</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('nahid@kanban.com')}
                  disabled={loading}
                  className="flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-2.5 text-[14px] font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 ease-(--ease-spring) active:scale-[0.97] focus:outline-none focus:ring-4 focus:ring-zinc-100 dark:focus:ring-zinc-800 disabled:opacity-50"
                >
                  Nahid
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('pervej@kanban.com')}
                  disabled={loading}
                  className="flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-2.5 text-[14px] font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 ease-(--ease-spring) active:scale-[0.97] focus:outline-none focus:ring-4 focus:ring-zinc-100 dark:focus:ring-zinc-800 disabled:opacity-50"
                >
                  Pervej
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('ruhan@kanban.com')}
                  disabled={loading}
                  className="flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-2.5 text-[14px] font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 ease-(--ease-spring) active:scale-[0.97] focus:outline-none focus:ring-4 focus:ring-zinc-100 dark:focus:ring-zinc-800 disabled:opacity-50"
                >
                  Ruhan
                </button>
              </div>
              
              <div className="text-center pt-4">
                <Link href="/register" className="text-[14px] font-medium text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100 underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 hover:decoration-zinc-900 dark:hover:decoration-zinc-100">
                  Don&apos;t have an account? Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
