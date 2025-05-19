'use client';
  
import { useAuth } from '@/firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

export default function Hero() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  
  const createRoom = () => {
    const newRoomCode = uuidv4().slice(0, 8);
    router.push(`/room/${newRoomCode}`);
  };
    return (
    <div className="relative pt-40 pb-24 lg:pb-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-10" />
      
      {/* Background grid */}
      <div className="absolute inset-0 -z-20">
        <div className="h-full w-full bg-[linear-gradient(to_right,#8080800A_1px,transparent_1px),linear-gradient(to_bottom,#8080800A_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <span className="bg-[#ffffff10] text-sm text-muted-foreground px-3 py-1 rounded-full mb-6">
            Version 1.0 Now Available
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 gradient-text leading-tight">
            Video Calls for the Future Web
          </h1>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
            Secure, high-quality video conferencing with no downloads required.
            Connect with anyone, anywhere in just one click.
          </p>            <div className="flex flex-col sm:flex-row gap-4">
            {user ? (
              <button
                onClick={createRoom}
                className="nav-button bg-gradient-to-r from-primary to-accent px-8 py-4 rounded-full text-lg font-medium hover:opacity-90 hover:scale-105 transition-all"
              >
                Create Room
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className="nav-button bg-gradient-to-r from-primary to-accent px-8 py-4 rounded-full text-lg font-medium hover:opacity-90 hover:scale-105 transition-all text-center"
              >
                Get Started
              </Link>
            )}
            
            <a
              href="#features"
              className="nav-button border border-[#ffffff20] hover:border-[#ffffff40] px-8 py-4 rounded-full text-lg font-medium transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
        
        <div className="relative mt-20 rounded-2xl overflow-hidden border border-[#ffffff15] shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10" />
          
          {/* Mockup content */}
          <div className="glass-card p-4 backdrop-blur-md">
            <div className="flex items-center border-b border-[#ffffff10] pb-2 px-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#fdbb2d]" />
                <div className="w-3 h-3 rounded-full bg-[#29c940]" />
              </div>
              <div className="flex-1 text-center text-muted-foreground text-sm ml-4">
                VideoConf Call — Secure Meeting Room
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 min-h-[300px] md:min-h-[400px] bg-[#080a0f] rounded-lg">
              <div className="glass-card rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent opacity-20 animate-pulse" />
                </div>
                <div className="absolute bottom-2 left-2 glass-card px-2 py-1 rounded text-sm">
                  You
                </div>
              </div>
              
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="glass-card rounded-lg overflow-hidden hidden md:block md:odd:hidden lg:block relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accent to-primary opacity-10 animate-pulse" />
                  </div>
                  <div className="absolute bottom-2 left-2 glass-card px-2 py-1 rounded text-sm">
                    User {i}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Trusted by section */}
        <div className="mt-20 text-center">
          <p className="text-sm text-muted-foreground mb-8">TRUSTED BY INNOVATIVE COMPANIES</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {['Acme Inc', 'Globex', 'Soylent', 'Initech', 'Umbrella'].map((company, i) => (
              <div key={i} className="text-muted-foreground/70 font-semibold text-lg">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
