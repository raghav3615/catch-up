'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function CallToAction() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const createRoom = () => {
    const newRoomCode = uuidv4().slice(0, 8);
    router.push(`/room/${newRoomCode}`);
  };
  
  return (
    <div className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 blur-3xl -z-10">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-transparent to-background/80" />
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="glass-card p-8 md:p-12 lg:p-16 border border-[#ffffff15] rounded-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-primary to-transparent" />
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-accent to-transparent" />
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
              Ready to Experience the Future of Video Calls?
            </h2>
            
            <p className="text-lg text-muted-foreground mb-10">
              Join thousands of users who have already switched to our secure, high-quality video conferencing platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={session ? createRoom : () => signIn()}
                className="nav-button bg-gradient-to-r from-primary to-accent px-8 py-4 rounded-full text-lg font-medium hover:opacity-90"
              >
                {session ? 'Start a New Meeting' : 'Get Started for Free'}
              </button>
              
              <a
                href="#features"
                className="nav-button border border-[#ffffff20] hover:border-[#ffffff40] px-8 py-4 rounded-full text-lg font-medium transition-colors"
              >
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
