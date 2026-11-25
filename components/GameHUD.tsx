'use client';

import React from 'react';
import { GameEngine } from '@/lib/gameEngine';
import { soundManager } from '@/lib/audio';
import { Volume2, VolumeX, Pause, Play, Shield, Sparkles, Home } from 'lucide-react';

interface GameHUDProps {
  engine: GameEngine;
  onPauseToggle: () => void;
  onHomeClick?: () => void;
  isPaused: boolean;
  isMobile?: boolean;
}

export default function GameHUD({ engine, onPauseToggle, onHomeClick, isPaused, isMobile }: GameHUDProps) {
  const [soundOn, setSoundOn] = React.useState(soundManager.soundEnabled);

  const toggleSound = () => {
    const val = soundManager.toggleSound();
    setSoundOn(val);
  };

  return (
    <div className="w-full flex flex-col gap-1.5 select-none z-10 px-1 sm:px-3 text-white">
      {/* Frosted Royal Blue Promotional Marquee Ticker */}
      <div className="w-full overflow-hidden rounded-full bg-[#052644]/80 border border-white/20 py-1 px-2 shadow-md backdrop-blur-md">
        <div className="animate-marquee text-[10px] sm:text-[11px] font-bold text-sky-200 tracking-wider uppercase flex items-center gap-6 whitespace-nowrap">
          <span className="flex items-center gap-1.5 text-[#FBBF24]">
            <Sparkles size={12} className="animate-spin text-[#FBBF24]" />
            ASSEMBLE ALL 6 INGREDIENTS TO WIN EXCLUSIVE MORGEN METE VOUCHERS
          </span>
          <span className="text-sky-400">•</span>
          <span className="flex items-center gap-1.5 text-emerald-300">
            🍯 HONEY SHIELD GRANTS 10s INVINCIBILITY — NO TAIL BITES OR CRASHES
          </span>
          <span className="text-sky-400">•</span>
          <span className="flex items-center gap-1.5 text-[#FBBF24]">
            🏆 BEAT THE HIGH SCORE &amp; CLIMB THE LEADERBOARD
          </span>
          <span className="text-sky-400">•</span>
          <span className="flex items-center gap-1.5 text-emerald-300">
            🥣 CRAFT FRESH MUESLI WITH SEED BALANCE®
          </span>
          <span className="text-sky-400">•</span>

          {/* Repeat set for seamless infinite loop */}
          <span className="flex items-center gap-1.5 text-[#FBBF24]">
            <Sparkles size={12} className="animate-spin text-[#FBBF24]" />
            ASSEMBLE ALL 6 INGREDIENTS TO WIN EXCLUSIVE MORGEN METE VOUCHERS
          </span>
          <span className="text-sky-400">•</span>
          <span className="flex items-center gap-1.5 text-emerald-300">
            🍯 HONEY SHIELD GRANTS 10s INVINCIBILITY — NO TAIL BITES OR CRASHES
          </span>
          <span className="text-sky-400">•</span>
          <span className="flex items-center gap-1.5 text-[#FBBF24]">
            🏆 BEAT THE HIGH SCORE &amp; CLIMB THE LEADERBOARD
          </span>
          <span className="text-sky-400">•</span>
          <span className="flex items-center gap-1.5 text-emerald-300">
            🥣 CRAFT FRESH MUESLI WITH SEED BALANCE®
          </span>
        </div>
      </div>

      {/* Panoramic Top Bar with Frosted Glass Capsules */}
      <div className="w-full flex items-center justify-between gap-1.5 sm:gap-3 py-1">
        {/* Far Left: Seed Balance® Logo */}
        <div className="flex items-center shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/seed-balance-logo-full.png"
            alt="Seed Balance®"
            className="h-7 sm:h-9 w-auto object-contain drop-shadow-md brightness-105"
          />
        </div>

        {/* Score Capsule Pod */}
        <div className="flex items-center gap-2 bg-[#052644]/80 border border-white/20 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 shadow-md shrink-0 backdrop-blur-md">
          <span className="text-base sm:text-xl drop-shadow-xs">🏆</span>
          <div className="text-left">
            <div className="text-[7px] sm:text-[9px] font-bold text-sky-300 tracking-wider uppercase leading-none">
              SCORE
            </div>
            <div className="text-sm sm:text-lg font-black text-white leading-tight">
              {engine.score}
            </div>
          </div>
        </div>

        {/* Center Title: THE MORGEN RUSH with leaves (Desktop Only) */}
        {!isMobile && (
          <div className="hidden md:flex items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/title_game_hud_clean.png"
              alt="The Morgen Rush"
              className="h-9 sm:h-11 w-auto object-contain drop-shadow-lg"
            />
          </div>
        )}

        {/* Bowls Crafted Capsule Pod */}
        <div className="flex items-center gap-2 bg-[#052644]/80 border border-white/20 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 shadow-md shrink-0 backdrop-blur-md">
          <span className="text-base sm:text-xl drop-shadow-xs">🥣</span>
          <div className="text-left">
            <div className="text-[7px] sm:text-[9px] font-bold text-sky-300 tracking-wider uppercase leading-none">
              BOWLS CRAFTED
            </div>
            <div className="text-sm sm:text-lg font-black text-white leading-tight">
              {engine.bowlsCompleted.toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Far Right: Home, Pause & Sound Round Controls in Frosted Royal Blue Glass */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {onHomeClick && (
            <button
              onClick={onHomeClick}
              aria-label="Main Menu"
              title="Return to Main Menu"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#052644]/80 hover:bg-[#07477D] border border-white/25 flex items-center justify-center transition active:scale-95 shadow-md text-white backdrop-blur-md"
            >
              <Home size={13} className="text-white" />
            </button>
          )}
          <button
            onClick={onPauseToggle}
            aria-label="Pause Game"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#052644]/80 hover:bg-[#07477D] border border-white/25 flex items-center justify-center transition active:scale-95 shadow-md text-white backdrop-blur-md"
          >
            {isPaused ? (
              <Play size={14} className="text-emerald-400 fill-emerald-400" />
            ) : (
              <Pause size={14} className="fill-white text-white" />
            )}
          </button>
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#052644]/80 hover:bg-[#07477D] border border-white/25 flex items-center justify-center transition active:scale-95 shadow-md text-white backdrop-blur-md"
          >
            {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} className="text-rose-400" />}
          </button>
        </div>
      </div>
    </div>
  );
}
