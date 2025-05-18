'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="glass-card p-8 max-w-md w-full mx-4">
        <h1 className="text-4xl font-bold mb-6 text-center gradient-text">Sign In</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-center">
            {error === 'CredentialsSignin' ? 'Invalid credentials' : 'An error occurred during sign in'}
          </div>
        )}
        
        <div className="space-y-4">
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032c0-3.331,2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12c0,5.523,4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="white"/>
            </svg>
            Sign in with Google
          </button>
          
          <button
            onClick={() => signIn('github', { callbackUrl })}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="white"/>
            </svg>
            Sign in with GitHub
          </button>
        </div>
        
        <div className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-center text-[var(--muted-foreground)] max-w-md">
        <p>Video Conference App allows you to connect with anyone, anywhere with secure video calls</p>
        <p className="mt-1">No download required, works directly in your browser</p>
      </div>
    </div>
  );
}
