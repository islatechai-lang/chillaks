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
  const idleVideoRef = useRef<HTMLVideoElement>(null);
  const talkingVideoRef = useRef<HTMLVideoElement>(null);
  
  // Get audio volume for mouth animation
  const volumeBands = useMultibandTrackVolume(audioTrack, {
    bands: 1,
    loPass: 100,
    hiPass: 300,
  });
  
  const volume = volumeBands[0] || 0;
  const isSpeaking = state === 'speaking';

  // Ensure both videos are playing and looping
  useEffect(() => {
    [idleVideoRef.current, talkingVideoRef.current].forEach(v => {
      if (v) {
        v.play().catch(console.error);
      }
    });
  }, []);

  return (
    <div className={cn("fixed inset-0 z-0 flex items-center justify-center overflow-hidden bg-black w-screen h-screen", className)}>
      {/* Idle Video */}
      <video
        ref={idleVideoRef}
        src="/idle.mp4"
        autoPlay
        loop
        muted
        playsInline
        className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            isSpeaking ? "opacity-0" : "opacity-100"
        )}
      />

      {/* Talking Video */}
      <video
        ref={talkingVideoRef}
        src="/talking2.mp4"
        autoPlay
        loop
        muted
        playsInline
        className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            isSpeaking ? "opacity-100" : "opacity-0"
        )}
      />
      
      {/* Robot Face Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        {/* Step: ADJUST POSITION HERE -> Change the mt-[42%] to move it up or down */}
        <div className="mt-[42%] flex items-center justify-center w-60 h-20">
            {/* The "Mouth" with pointy sides and black interior */}
            <div 
                className="bg-black border border-cyan-400/80 transition-all duration-75 ease-out shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center overflow-hidden"
                style={{ 
                    width: isSpeaking ? `${30 + volume * 20}%` : '25%', // Keep it small and balanced
                    height: isSpeaking ? `${3 + volume * 25}px` : '2px',
                    borderRadius: '100% 5% / 100% 5%', // Pointy sides eye/lip shape
                    opacity: state === 'listening' ? 0.3 : 1
                }}
            >
                {/* Subtle interior glow line */}
                <div className="w-full h-[1px] bg-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
            </div>
        </div>
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute inset-0 pointer-events-none bg-radial-[circle_at_50%_50%] from-cyan-500/5 to-transparent" />
    </div>
  );
}
