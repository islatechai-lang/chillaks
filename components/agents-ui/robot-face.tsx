'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { useMultibandTrackVolume, type TrackReferenceOrPlaceholder, type AgentState } from '@livekit/components-react';
import { cn } from '@/lib/shadcn/utils';

interface RobotFaceProps {
  state: AgentState;
  audioTrack?: TrackReferenceOrPlaceholder;
  className?: string;
}

export function RobotFace({ state, audioTrack, className }: RobotFaceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Get audio volume for mouth animation
  const volumeBands = useMultibandTrackVolume(audioTrack, {
    bands: 1,
    loPass: 100,
    hiPass: 300,
  });
  
  const volume = volumeBands[0] || 0;
  const isSpeaking = state === 'speaking';

  // Sync video source with state
  useEffect(() => {
    if (videoRef.current) {
      const src = isSpeaking ? '/talking2.mp4' : '/idle.mp4';
      if (videoRef.current.src !== window.location.origin + src) {
        videoRef.current.src = src;
        videoRef.current.load();
        videoRef.current.play().catch(console.error);
      }
    }
  }, [isSpeaking]);

  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden rounded-3xl bg-black aspect-square w-full max-w-[400px] mx-auto shadow-2xl border border-white/10", className)}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />
      
      {/* Robot Face Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full gap-8">
        {/* Eyes (Optional, can be added if needed, but for now we focus on the mouth) */}
        
        {/* Mouth Line */}
        <div className="mt-20 flex items-center justify-center w-32 h-20">
            <div 
                className="bg-cyan-400 h-1 rounded-full transition-all duration-75 ease-out shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                style={{ 
                    width: isSpeaking ? `${40 + volume * 60}%` : '30%',
                    transform: `scaleY(${isSpeaking ? 1 + volume * 15 : 1})`,
                    opacity: state === 'listening' ? 0.5 : 1
                }}
            />
        </div>
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute inset-0 pointer-events-none bg-radial-[circle_at_50%_50%] from-cyan-500/10 to-transparent" />
    </div>
  );
}
