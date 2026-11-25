'use client';

import React from 'react';
import { Direction } from '@/lib/types';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface TouchControlsProps {
  onDirection: (dir: Direction) => void;
}

export default function TouchControls({ onDirection }: TouchControlsProps) {
  const triggerDir = (dir: Direction) => {
    soundManager.playClick();
    onDirection(dir);
  };

  return (
    <div className="w-full max-w-[240px] grid grid-cols-3 gap-2 my-2 select-none touch-manipulation">
      <div />
      <button
        type="button"
        onClick={() => triggerDir('UP')}
        aria-label="Up"
        className="w-14 h-14 rounded-2xl bg-[#052644]/80 hover:bg-[#07477D] active:bg-[#095797] text-white flex items-center justify-center shadow-md transition mx-auto active:scale-90 border border-white/25 backdrop-blur-md"
      >
        <ArrowUp size={24} />
      </button>
      <div />

      <button
        type="button"
        onClick={() => triggerDir('LEFT')}
        aria-label="Left"
        className="w-14 h-14 rounded-2xl bg-[#052644]/80 hover:bg-[#07477D] active:bg-[#095797] text-white flex items-center justify-center shadow-md transition mx-auto active:scale-90 border border-white/25 backdrop-blur-md"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="w-14 h-14 rounded-2xl bg-[#052644]/50 border border-white/15 flex items-center justify-center text-xs font-black text-sky-300/70 mx-auto">
        DPAD
      </div>

      <button
        type="button"
        onClick={() => triggerDir('RIGHT')}
        aria-label="Right"
        className="w-14 h-14 rounded-2xl bg-[#052644]/80 hover:bg-[#07477D] active:bg-[#095797] text-white flex items-center justify-center shadow-md transition mx-auto active:scale-90 border border-white/25 backdrop-blur-md"
      >
        <ArrowRight size={24} />
      </button>

      <div />
      <button
        type="button"
        onClick={() => triggerDir('DOWN')}
        aria-label="Down"
        className="w-14 h-14 rounded-2xl bg-[#052644]/80 hover:bg-[#07477D] active:bg-[#095797] text-white flex items-center justify-center shadow-md transition mx-auto active:scale-90 border border-white/25 backdrop-blur-md"
      >
        <ArrowDown size={24} />
      </button>
      <div />
    </div>
  );
}
