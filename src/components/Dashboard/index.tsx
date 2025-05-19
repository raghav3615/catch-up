 'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function Dashboard() {
  const { data: session } = useSession();
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
  };  return (
    <div className="flex-1">
      <div className="container mx-auto px-4 pt-36 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
              Welcome, {session?.user?.name?.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground">
              Create a new meeting room or join an existing one
            </p>
          </div>
          
          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Create Room Card */}
            <div className="glass-card p-6 border border-[#ffffff15] hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h2 className="text-xl font-bold mb-2">Create New Meeting</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Start a new video conference and invite others to join
              </p>
              
              <button
                onClick={createRoom}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Create Room
              </button>
            </div>
            
            {/* Join Room Card */}
            <div className="glass-card p-6 border border-[#ffffff15] hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-accent/20 to-accent/10 mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zm-2 7a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zm8-12a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h2 className="text-xl font-bold mb-2">Join Existing Meeting</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Enter a meeting code to join an existing video conference
              </p>
              
              <form onSubmit={joinRoom} className="flex gap-2">
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  placeholder="Enter meeting code"
                  className="input-field flex-grow"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="btn-accent"
                  disabled={!roomCode.trim()}
                >
                  Join
                </button>
              </form>
            </div>
          </div>
          
          {/* Recent Meetings */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Recent Meetings</h3>
            <div className="glass-card divide-y divide-[#ffffff10]">
              <div className="px-4 py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">Project Kickoff</p>
                  <p className="text-sm text-muted-foreground">5 participants • Yesterday</p>
                </div>
                <button className="text-sm text-primary hover:text-primary-hover transition-colors">
                  Rejoin
                </button>
              </div>
              
              <div className="px-4 py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">Weekly Team Sync</p>
                  <p className="text-sm text-muted-foreground">3 participants • May 15, 2025</p>
                </div>
                <button className="text-sm text-primary hover:text-primary-hover transition-colors">
                  Rejoin
                </button>
              </div>
              
              <div className="px-4 py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">Design Review</p>
                  <p className="text-sm text-muted-foreground">4 participants • May 12, 2025</p>
                </div>
                <button className="text-sm text-primary hover:text-primary-hover transition-colors">
                  Rejoin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
