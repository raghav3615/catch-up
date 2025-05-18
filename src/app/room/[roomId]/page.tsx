'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import io, { Socket } from 'socket.io-client';
import Peer from 'simple-peer';

interface PeerConnection {
  peerId: string;
  peer: Peer.Instance;
}

export default function Room({ params }: { params: { roomId: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { roomId } = params;
  
  const [peers, setPeers] = useState<PeerConnection[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
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
      socketRef.current?.disconnect();
      peers.forEach(({ peer }) => peer.destroy());
    };
  }, [session, roomId, router]);

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

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Local video */}
          <div className="glass-card relative rounded-lg overflow-hidden">
            <video
              ref={userVideo}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-2 left-2 glass-card px-2 py-1 rounded">
              You
            </div>
          </div>

          {/* Remote videos */}
          {peers.map(({ peerId, peer }) => (
            <div key={peerId} className="glass-card relative rounded-lg overflow-hidden">
              <video
                autoPlay
                playsInline
                className="w-full h-64 object-cover"
                ref={(video) => {
                  if (video) video.srcObject = peer.streams[0];
                }}
              />
              <div className="absolute bottom-2 left-2 glass-card px-2 py-1 rounded">
                User {peerId.slice(0, 4)}
              </div>
            </div>
          ))}
        </div>

        {/* Room controls */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button
            onClick={() => {
              if (stream) {
                const videoTrack = stream.getVideoTracks()[0];
                if (videoTrack) {
                  videoTrack.enabled = !videoTrack.enabled;
                }
              }
            }}
            className="btn-secondary"
          >
            Toggle Video
          </button>
          <button
            onClick={() => {
              if (stream) {
                const audioTrack = stream.getAudioTracks()[0];
                if (audioTrack) {
                  audioTrack.enabled = !audioTrack.enabled;
                }
              }
            }}
            className="btn-secondary"
          >
            Toggle Audio
          </button>
          <button
            onClick={() => router.push('/')}
            className="btn-accent"
          >
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
} 