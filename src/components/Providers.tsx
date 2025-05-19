'use client';

import { AuthProvider } from '@/firebase/auth';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}