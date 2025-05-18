'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const { data: session, status } = useSession();
  const [roomCode, setRoomCode] = useState('');
  const router = useRouter();

  const createRoom = () => {
    const newRoomCode = uuidv4().slice(0, 8);
    router.push(`/room/${newRoomCode}`);
  };

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim()) {
      router.push(`/room/${roomCode.trim()}`);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-[var(--primary)]">Loading...</div>
      </div>
    );
  }
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="glass-card p-8 max-w-md w-full mx-4">
          <h1 className="text-4xl font-bold mb-6 text-center gradient-text">Video Conference</h1>
          <p className="text-center text-[var(--muted-foreground)] mb-8">
            Connect with anyone, anywhere with secure video calls
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => signIn('google')}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032c0-3.331,2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12c0,5.523,4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="white"/>
              </svg>
              Sign in with Google
            </button>
            
            <button
              onClick={() => signIn('github')}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="white"/>
              </svg>
              Sign in with GitHub
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-center text-[var(--muted-foreground)]">
          <p>Secure, high-quality video conferencing</p>
          <p className="mt-1">No download required, works in your browser</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="glass-card p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold gradient-text">
            Welcome, {session.user?.name?.split(' ')[0]}
          </h1>          {session.user?.image && (
            <img 
              src={session.user.image} 
              alt="Profile"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--background)]" 
            />
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="glass-card p-4 hover:border-[var(--primary)] transition-colors">
            <button
              onClick={createRoom}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Room
            </button>
          </div>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border)]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[var(--card)] text-[var(--muted-foreground)]">or join existing</span>
          </div>
        </div>

        <form onSubmit={joinRoom} className="glass-card p-4 hover:border-[var(--accent)] transition-colors">
          <div className="flex space-x-2">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Enter room code"
              className="input-field flex-grow"
            />
            <button
              type="submit"
              className="btn-accent flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--muted-foreground)] mb-4 text-center">
            Connected with {session.user?.email}
          </p>
          <button
            onClick={() => signOut()}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm9.707 8.707a1 1 0 01-1.414 0L9 9.414V13a1 1 0 11-2 0V9.414l-2.293 2.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Sign out
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-center text-[var(--muted-foreground)] max-w-md px-4">
        <p>Secure, end-to-end encrypted video calls</p>
      </div>
    </div>
  );
}
