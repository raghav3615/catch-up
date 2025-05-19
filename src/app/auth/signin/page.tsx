'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/firebase/auth';

// We don't import Navbar here anymore since we'll render it in layout.tsx

function SignInContent() {  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const searchParamsError = searchParams?.get('error');
  const [error, setError] = useState<string | null>(searchParamsError || null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { user, loading, signInWithGoogle, signInWithGithub } = useAuth();
  
  // Redirect if already signed in
  useEffect(() => {
    if (user && !loading) {
      router.push(callbackUrl);
    }
  }, [user, loading, router, callbackUrl]);
    const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    const result = await signInWithGoogle();
    if (!result.success && result.error) {
      setError(result.error);
    }
    setIsSigningIn(false);
  };
  
  const handleGithubSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    const result = await signInWithGithub();
    if (!result.success && result.error) {
      setError(result.error);
    }
    setIsSigningIn(false);
  };
  
  return (
    <div className="flex flex-grow items-center justify-center pt-36 pb-16 px-4">
      <div className="max-w-md w-full">
        {/* Background elements */}
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10" />
      
        <div className="glass-card p-8 border border-[#ffffff15] rounded-xl backdrop-blur-md">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent p-0.5 mb-4">
              <div className="w-full h-full rounded-full bg-[#12141C] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold gradient-text">Welcome to VideoConf</h1>
            <p className="text-muted-foreground mt-2 text-center">Sign in to start or join secure video meetings</p>
          </div>
            {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
              <p className="text-red-500">
                {error.includes('account-exists-with-different-credential') 
                  ? 'An account already exists with the same email address but different sign-in credentials' 
                  : error.includes('popup-closed-by-user')
                    ? 'Sign in was cancelled'
                    : error}
              </p>
            </div>
          )}<div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              className="glass-card w-full py-3 px-4 flex items-center justify-center gap-3 border border-[#ffffff20] hover:border-primary/50 transition-colors rounded-lg"
              disabled={loading || isSigningIn}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032c0-3.331,2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12c0,5.523,4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="white"/>
              </svg>
              {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
            </button>
            
            <button
              onClick={handleGithubSignIn}
              className="glass-card w-full py-3 px-4 flex items-center justify-center gap-3 border border-[#ffffff20] hover:border-primary/50 transition-colors rounded-lg"
              disabled={loading || isSigningIn}
            ><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="white"/>
              </svg>
              {isSigningIn ? 'Signing in...' : 'Sign in with GitHub'}
            </button>
          </div>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="flex flex-grow items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading sign-in options...</p>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
