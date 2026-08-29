'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't sign you in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="font-serif-heading text-2xl text-[#5FBF8C] tracking-wide">STEWARDOS</h1>
          <p className="mt-2 text-xs text-[#808080] font-mono uppercase tracking-widest">
            Consistency · Truth · Execution
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs uppercase tracking-wide text-[#808080]">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded bg-[#111] border border-[#262626] px-3 py-2.5 text-sm text-[#E0E0E0] focus:outline-none focus:border-[#5FBF8C]"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs uppercase tracking-wide text-[#808080]">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded bg-[#111] border border-[#262626] px-3 py-2.5 text-sm text-[#E0E0E0] focus:outline-none focus:border-[#5FBF8C]"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded bg-[#5FBF8C] py-2.5 text-sm font-medium text-black hover:bg-[#7FD1A6] disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#808080]">
          No account?{' '}
          <Link href="/signup" className="text-[#5FBF8C] underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
