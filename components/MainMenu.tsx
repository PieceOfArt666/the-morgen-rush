'use client';

import React from 'react';
import { soundManager } from '@/lib/audio';
import { Play, Volume2, VolumeX, Music, Gamepad2, BarChart2, Gift, ExternalLink } from 'lucide-react';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenTutorial: () => void;
  onOpenLeaderboard: () => void;
  onOpenRewards: () => void;
  highScore: number;
  highestBowls: number;
}

export default function MainMenu({
  onStartGame,
  onOpenTutorial,
  onOpenLeaderboard,
  onOpenRewards,
  highScore,
  highestBowls,
}: MainMenuProps) {
  const [soundOn, setSoundOn] = React.useState(soundManager.soundEnabled);
  const [musicOn, setMusicOn] = React.useState(soundManager.musicEnabled);

  const handlePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundManager.playClick();
    soundManager.startBGM();
    onStartGame();
  };

  const handleTutorial = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    onOpenTutorial();
  };

  const handleLeaderboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    onOpenLeaderboard();
  };

  const handleRewards = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    onOpenRewards();
  };

  return (
    <div className="w-full max-w-[480px] rounded-[36px] p-5 sm:p-6 shadow-[0_25px_60px_rgba(5,38,68,0.7)] flex flex-col items-center justify-between text-white select-none relative overflow-hidden transition-all duration-300 border border-white/25 border-t-white/45 bg-gradient-to-b from-[#095797]/90 via-[#07477D]/95 to-[#052644]/95 backdrop-blur-2xl">
      {/* Specular Top Rim Reflection */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

      {/* Top Header Row */}
      <div className="w-full flex items-center justify-between z-10 relative mb-1 px-1">
        <div className="w-16" /> {/* spacer to balance audio buttons */}

        {/* Clean Full Seed Balance® Logo without any cutoffs */}
        <div className="flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/seed-balance-logo-full.png"
            alt="Seed Balance®"
            className="h-10 sm:h-12 w-auto object-contain drop-shadow-md brightness-105"
          />
        </div>

        {/* Top-Right Audio Controls */}
        <div className="flex items-center gap-1.5 w-16 justify-end">
          <button
            onClick={() => {
              const s = soundManager.toggleSound();
              setSoundOn(s);
            }}
            className="w-8 h-8 rounded-full bg-[#052644]/80 hover:bg-[#07477D] border border-white/25 flex items-center justify-center transition active:scale-95 shadow-md text-white backdrop-blur-md"
            aria-label="Toggle Sound"
          >
            {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} className="text-rose-400" />}
          </button>
          <button
            onClick={() => {
              const m = soundManager.toggleMusic();
              setMusicOn(m);
            }}
            className="w-8 h-8 rounded-full bg-[#052644]/80 hover:bg-[#07477D] border border-white/25 flex items-center justify-center transition active:scale-95 shadow-md text-white backdrop-blur-md"
            aria-label="Toggle Music"
          >
            <Music size={15} className={musicOn ? 'text-[#FBBF24] drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'text-slate-400'} />
          </button>
        </div>
      </div>

      {/* Center Hero Illustration: Title + Snake Mascot + 6-Ingredient Ring (Pristine on Royal Blue Halo) */}
      <div className="w-full flex flex-col items-center z-10 my-1 cursor-pointer" onClick={() => handlePlay()}>
        <div className="relative w-full flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-pristine.png"
            alt="The Morgen Rush Mascot & Ingredients"
            className="w-full max-w-[440px] object-contain drop-shadow-2xl transition-transform hover:scale-[1.02] duration-300 pointer-events-none select-none"
          />
        </div>

        {/* Dynamic Score & Bowls Capsule Pod in Frosted Royal Blue Glass */}
        <div className="flex items-center justify-between w-full max-w-[310px] bg-[#052644]/75 border border-white/20 rounded-2xl px-5 py-2.5 mt-2.5 shadow-lg backdrop-blur-md">
          {/* Left: Best Score */}
          <div className="flex items-center gap-2">
            <span className="text-xl drop-shadow-xs">🏆</span>
            <div>
              <div className="text-[8px] font-bold text-sky-300 tracking-wider uppercase">
                BEST SCORE
              </div>
              <div className="text-lg font-black text-white leading-tight">
                {highScore}
              </div>
            </div>
          </div>

          <div className="w-[1px] h-7 bg-white/20" />

          {/* Right: Bowls Crafted */}
          <div className="flex items-center gap-2">
            <span className="text-xl drop-shadow-xs">🥣</span>
            <div>
              <div className="text-[8px] font-bold text-sky-300 tracking-wider uppercase">
                BOWLS CRAFTED
              </div>
              <div className="text-lg font-black text-white leading-tight">
                {highestBowls}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="flex flex-col items-center gap-2.5 z-10 w-full mt-2">
        {/* Main CTA Button: PLAY NOW with Action Burst Rays */}
        <div className="relative w-full max-w-[360px]">
          {/* Action Burst Rays */}
          <div className="absolute -top-3.5 right-6 text-sky-300 text-xl font-black tracking-tighter select-none pointer-events-none drop-shadow-md">
            彡
          </div>

          <button
            onClick={handlePlay}
            className="w-full py-3.5 sm:py-4 px-6 rounded-full font-black text-base sm:text-lg tracking-wider text-white flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98] relative overflow-hidden group shadow-[0_10px_28px_rgba(5,38,68,0.6)] border border-white/50 bg-gradient-to-b from-[#2985D6] via-[#095797] to-[#07477D] hover:brightness-110"
          >
            {/* Glossy top specular highlight */}
            <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/40 to-transparent rounded-t-full pointer-events-none" />

            <Play size={18} className="fill-white transition-transform group-hover:scale-110 drop-shadow-sm" />
            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] uppercase tracking-wide">PLAY NOW</span>
          </button>
        </div>

        {/* 3 Secondary Capsule Buttons (Fully Working) in Frosted Royal Blue Glass */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-[380px] mt-1">
          {/* How to Play */}
          <button
            onClick={handleTutorial}
            className="py-2.5 px-2 bg-[#052644]/75 hover:bg-[#07477D]/90 border border-white/20 text-white rounded-full flex items-center justify-center gap-1.5 text-[11px] font-extrabold shadow-sm active:scale-95 transition"
          >
            <Gamepad2 size={15} className="text-sky-300" />
            <span>HOW TO PLAY</span>
          </button>

          {/* Leaderboard */}
          <button
            onClick={handleLeaderboard}
            className="py-2.5 px-2 bg-[#052644]/75 hover:bg-[#07477D]/90 border border-white/20 text-white rounded-full flex items-center justify-center gap-1.5 text-[11px] font-extrabold shadow-sm active:scale-95 transition"
          >
            <BarChart2 size={15} className="text-sky-300" />
            <span>LEADERBOARD</span>
          </button>

          {/* Spin Rewards */}
          <button
            onClick={handleRewards}
            className="py-2.5 px-2 bg-gradient-to-b from-[#FBBF24] via-[#F59E0B] to-[#D97706] hover:brightness-105 border border-white/60 text-[#052644] rounded-full flex items-center justify-center gap-1.5 text-[11px] font-black shadow-[0_4px_15px_rgba(245,158,11,0.35)] active:scale-95 transition relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
            <Gift size={15} className="text-[#052644]" />
            <span>SPIN REWARDS</span>
          </button>
        </div>

        {/* Instagram Footer Link */}
        <div className="flex items-center justify-center gap-2 mt-2 w-full text-sky-200/80 text-[10px]">
          <div className="w-10 h-[1px] bg-white/20" />
          <a
            href="https://www.instagram.com/seed.balance?knvt=bHZtNGJnYm1lM2wz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sky-200 hover:text-white transition font-semibold"
          >
            <span>Follow @seed.balance on Instagram</span>
            <ExternalLink size={10} />
          </a>
          <div className="w-10 h-[1px] bg-white/20" />
        </div>
      </div>
    </div>
  );
}
