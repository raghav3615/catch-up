'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/firebase/auth';

export default function Navbar() {
  const { user, signOut, signInWithGoogle, signInWithGithub } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'backdrop-blur-md bg-background/70 py-4 border-b border-[#ffffff10]' 
          : 'py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
            <div className="absolute inset-0.5 rounded-full bg-background flex items-center justify-center">
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">V</span>
            </div>
          </div>
          <span className="text-xl font-bold hidden md:block gradient-text">VideoConf</span>
        </Link>
        
        {/* Center navigation */}
        <div className="hidden md:flex space-x-1">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/features">Features</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
        </div>
        
        {/* Right side - Auth buttons or user menu */}        <div className="flex items-center gap-2">          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/room" className="nav-button bg-gradient-to-r from-primary to-accent hover:opacity-90">
                Start a Meeting
              </Link>              <button
                onClick={async () => {
                  setIsSigningOut(true);
                  await signOut();
                  setIsSigningOut(false);
                }}
                className="nav-button border border-[#ffffff20] hover:bg-[#ffffff15] transition-colors flex items-center gap-1"
                aria-label="Sign out"
                disabled={isSigningOut}
              >
                {isSigningOut ? (
                  <span className="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-1"></span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                )}
                {isSigningOut ? 'Signing Out...' : 'Logout'}
              </button>
              {user.photoURL && (
                <Link href="/profile">
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="w-9 h-9 rounded-full border-2 border-accent/50 cursor-pointer hover:border-accent transition-colors"
                  />
                </Link>
              )}
            </div>          ): (
            <>
              <Link 
                href="/auth/signin" 
                className="nav-button bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                Sign In
              </Link>
              <Link 
                href="https://github.com/raghav3615/catch-up" 
                target="_blank" 
                className="rounded-full p-2 hover:bg-[#ffffff10] transition-colors"
                aria-label="GitHub repository"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="relative px-4 py-2 text-sm text-muted-foreground rounded-full hover:text-foreground transition-colors duration-200"
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 rounded-full hover:bg-[#ffffff0a] transition-colors duration-200" />
    </Link>
  );
}
