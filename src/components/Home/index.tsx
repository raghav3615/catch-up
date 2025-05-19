'use client';

import { useAuth } from '@/firebase/auth';
import Hero from './Hero';
import Features from './Features';
import CallToAction from './CallToAction';
import Dashboard from '../Dashboard';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  // Show dashboard for authenticated users
  if (user) {
    return <Dashboard />;
  }

  // Show landing page for unauthenticated users
  return (
    <>
      <Hero />
      <Features />
      <CallToAction />
    </>
  );
}
