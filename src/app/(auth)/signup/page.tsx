'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function SignupPage() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await register(email, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create your account.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4 text-center">
        <div>
          <h1 className="font-serif-heading text-xl text-[#5FBF8C] mb-3">Check your email</h1>
          <p className="max-w-xs text-sm text-[#808080]">
            We sent a confirmation link to {email}. Follow it to activate your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="font-serif-heading text-2xl text-[#5FBF8C] tracking-wide">STEWARDOS</h1>
          <p className="mt-2 text-xs text-[#808080] font-mono uppercase tracking-widest">
            Begin the operating system
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
              minLength={6}
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
            {submitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#808080]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#5FBF8C] underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
