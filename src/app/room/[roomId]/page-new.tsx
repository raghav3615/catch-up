'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import io, { Socket } from 'socket.io-client';
import Peer from 'simple-peer';
import Navbar from '@/components/Navbar';

interface PeerConnection {
  peerId: string;
  peer: Peer.Instance;
}

interface PeerWithSenders extends Peer.Instance {
  _senders?: Array<{
    track?: MediaStreamTrack;
    replaceTrack: (track: MediaStreamTrack) => void;
  }>;
}

export default function Room({ params }: { params: { roomId: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { roomId } = params;
  
  const [peers, setPeers] = useState<PeerConnection[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [roomIdCopied, setRoomIdCopied] = useState(false);
  
  const socketRef = useRef<Socket>();
  const peersRef = useRef<PeerConnection[]>([]);
  const userVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!session) {
      router.push('/');
      return;
    }

    // Initialize socket connection
    socketRef.current = io('http://localhost:3001');
    
    // Request camera and microphone access
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }

        // Join room
        socketRef.current?.emit('join-room', roomId);

        // Handle new user joining
        socketRef.current?.on('user-joined', (userId: string) => {
          connectToNewUser(userId, currentStream);
        });

        // Handle receiving signal
        socketRef.current?.on('receive-signal', ({ signal, from }: { signal: any, from: string }) => {
          const item = peersRef.current.find(p => p.peerId === from);
          if (item) {
            item.peer.signal(signal);
          }
        });
      })
      .catch((err) => {
        console.error('Error accessing media devices:', err);
      });

    return () => {
      stream?.getTracks().forEach(track => track.stop());
      screenStream?.getTracks().forEach(track => track.stop());
      socketRef.current?.disconnect();
      peers.forEach(({ peer }) => peer.destroy());
    };
  }, [session, roomId, router, peers, stream, screenStream]);

  const connectToNewUser = (userId: string, stream: MediaStream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socketRef.current?.emit('send-signal', { signal, to: userId });
    });

    peer.on('stream', (remoteStream) => {
      setPeers(peers => [...peers, { peerId: userId, peer }]);
    });

    peersRef.current.push({ peerId: userId, peer });
  };

  if (!session) {
    return null;
  }

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };  
  
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setRoomIdCopied(true);
    setTimeout(() => setRoomIdCopied(false), 3000);
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        // Start screen sharing
        const displayMediaOptions = {
          video: true,
          audio: false
        };
        
        const screenCaptureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        setScreenStream(screenCaptureStream);
        
        // Display screen share to local user
        if (userVideo.current) {
          userVideo.current.srcObject = screenCaptureStream;
        }
        
        // Set up listener for when user ends screen sharing
        screenCaptureStream.getVideoTracks()[0].onended = () => {
          // Restore camera video
          if (userVideo.current && stream) {
            userVideo.current.srcObject = stream;
          }
          
          setIsScreenSharing(false);
          if (screenCaptureStream) {
            screenCaptureStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
          }
          setScreenStream(null);
        };
        
        setIsScreenSharing(true);
      } else {
        // Stop screen sharing
        if (screenStream) {
          screenStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
          
          // Restore original video to local view
          if (userVideo.current && stream) {
            userVideo.current.srcObject = stream;
          }
        }
        
        setIsScreenSharing(false);
        setScreenStream(null);
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
      setIsScreenSharing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Room Info Bar */}
      <div className="fixed top-20 left-0 w-full z-40 bg-[#12141c]/60 backdrop-blur-md border-b border-[#ffffff10] py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">Meeting Room</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="glass-card px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-muted-foreground">Live</span>
            </div>
            <div 
              onClick={copyRoomId}
              className="glass-card px-3 py-1.5 rounded-full text-sm flex items-center gap-2 cursor-pointer hover:border-[#ffffff30] transition-colors"
            >
              {roomIdCopied ? 
                <span className="text-green-500">Copied!</span> : 
                <>
                  <span>Room: {roomId}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </>
              }
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto p-4 md:p-6 pt-28 relative">
        {/* Video grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {/* Local video */}
          <div className="glass-card relative rounded-xl overflow-hidden border border-[#ffffff15]">
            <video
              ref={userVideo}
              autoPlay
              playsInline
              muted
              className={`w-full aspect-video object-cover ${isVideoOff ? 'hidden' : ''}`}
            />
            {isVideoOff && (
              <div className="w-full aspect-video flex items-center justify-center bg-[#0a0a0f]">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="font-bold text-xl text-muted-foreground">
                    {session?.user?.name?.charAt(0) || 'Y'}
                  </div>
                </div>
              </div>
            )}
            {isScreenSharing && (
              <div className="absolute top-3 right-3 glass-card px-3 py-1 rounded-full backdrop-blur-md text-sm flex items-center gap-2 bg-green-500/20">
                <span className="text-green-500">Screen Sharing</span>
              </div>
            )}
            <div className="absolute bottom-3 left-3 glass-card px-3 py-1 rounded-full backdrop-blur-md text-sm flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isMicMuted ? 'bg-red-500' : 'bg-green-500'}`}></span>
              <span>{session?.user?.name || 'You'}</span>
            </div>
          </div>

          {/* Remote videos */}
          {peers.map(({ peerId, peer }) => (
            <div key={peerId} className="glass-card relative rounded-xl overflow-hidden border border-[#ffffff15]">
              <video
                autoPlay
                playsInline
                className="w-full aspect-video object-cover"
                ref={(video) => {
                  if (video) video.srcObject = peer.streams[0];
                }}
              />
              <div className="absolute bottom-3 left-3 glass-card px-3 py-1 rounded-full backdrop-blur-md text-sm">
                User {peerId.slice(0, 4)}
              </div>
            </div>
          ))}
        </div>

        {/* Room controls */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card py-4 px-6 rounded-full backdrop-blur-lg border border-[#ffffff15]">
          <div className="flex items-center gap-6">
            <button
              onClick={toggleMic}
              className="flex flex-col items-center gap-1 group"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isMicMuted ? 'bg-red-500/20' : 'bg-[#ffffff10]'} group-hover:bg-[#ffffff20] transition-colors`}>
                {isMicMuted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </div>
              <span className="text-xs">{isMicMuted ? 'Unmute' : 'Mute'}</span>
            </button>
            
            <button
              onClick={toggleVideo}
              className="flex flex-col items-center gap-1 group"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isVideoOff ? 'bg-red-500/20' : 'bg-[#ffffff10]'} group-hover:bg-[#ffffff20] transition-colors`}>
                {isVideoOff ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <span className="text-xs">{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
            </button>
            
            <button
              onClick={toggleScreenShare}
              className="flex flex-col items-center gap-1 group"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isScreenSharing ? 'bg-green-500/20' : 'bg-[#ffffff10]'} group-hover:bg-[#ffffff20] transition-colors`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isScreenSharing ? 'text-green-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xs">{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</span>
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-600 group-hover:bg-red-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                </svg>
              </div>
              <span className="text-xs">End Call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
