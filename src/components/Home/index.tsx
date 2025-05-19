'use client';

import { useSession } from 'next-auth/react';
import Hero from './Hero';
import Features from './Features';
import CallToAction from './CallToAction';
import Dashboard from '../Dashboard';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  // Show dashboard for authenticated users
  if (session) {
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
