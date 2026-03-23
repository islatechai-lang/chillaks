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
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 scale-[1.3] -translate-y-[5%] -translate-x-[1px]",
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
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 scale-[1.3] -translate-y-[5%] -translate-x-[1px]",
          isSpeaking ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Robot Face Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        {/* Step: ADJUST POSITION HERE -> Change the mt-[44%] to move it up or down */}
        <div className="mt-[55%] flex items-center justify-center w-[650px] h-40 pointer-events-none">
          {/* SVG Mouth for perfect Eye Shape control */}
          <svg
            viewBox="0 0 100 100"
            className={cn(
              "w-full h-full drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-300",
              isSpeaking ? "opacity-100" : "opacity-0" 
            )}
          >
            <defs>
              <linearGradient id="mouthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path
              // M 0,50 (Left Point) - Full width
              // Q 50, (50 - openingH) 100,50 (Top Curve to Right Point)
              // Q 50, (50 + openingH) 0,50 (Bottom Curve back to Left Point)
              d={`
                  M 0 50 
                  Q 50 ${isSpeaking ? 50 - (1 + volume * 45) : 49} 100 50 
                  Q 50 ${isSpeaking ? 50 + (1 + volume * 45) : 51} 0 50 
                  Z
                `}
              fill="black"
              fillOpacity="1"
              stroke="url(#mouthGradient)"
              strokeWidth="1"
              strokeLinecap="round"
              style={{ transition: 'd 0.05s ease-out' }}
            />
          </svg>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute inset-0 pointer-events-none bg-radial-[circle_at_50%_50%] from-cyan-500/5 to-transparent" />
    </div>
  );
}
