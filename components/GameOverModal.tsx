'use client';

import React, { useState } from 'react';
import { RotateCcw, Share2, Check, User, ChevronRight, Trophy } from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  bowls: number;
  ingredientsCount: number;
  highScore: number;
  onPlayAgain: () => void;
  onOpenLeaderboard: () => void;
  onOpenRewards: () => void;
  onSaveScore: (name: string, score: number, bowls: number) => void;
}

export default function GameOverModal({
  isOpen,
  score,
  bowls,
  ingredientsCount,
  highScore,
  onPlayAgain,
  onOpenLeaderboard,
  onOpenRewards,
  onSaveScore,
}: GameOverModalProps) {
  const [playerName, setPlayerName] = useState('');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || saved) return;
    soundManager.playClick();
    onSaveScore(playerName.trim(), score, bowls);
    setSaved(true);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    const text = `🥣 I just crafted ${bowls} Morgen Mete bowls and scored ${score} in Seed Balance: The Morgen Rush! Can you beat my score? https://seedbalance.game`;
    if (navigator.share) {
      navigator.share({ title: 'Seed Balance: The Morgen Rush', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePlayAgainClick = () => {
    soundManager.playClick();
    onPlayAgain();
  };

  const handleSpinRewardsClick = () => {
    soundManager.playClick();
    onOpenRewards();
  };

  const handleLeaderboardClick = () => {
    soundManager.playClick();
    onOpenLeaderboard();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200 select-none overflow-y-auto">
      {/* Main Game Over Card Container in Seed Balance Royal Blue Glass */}
      <div className="relative w-full max-w-[430px] rounded-[36px] sm:rounded-[42px] border-2 border-white/25 shadow-[0_20px_60px_rgba(5,38,68,0.7),inset_0_1px_2px_rgba(255,255,255,0.4)] bg-gradient-to-b from-[#095797]/95 via-[#07477D]/95 to-[#052644]/95 backdrop-blur-2xl text-white p-3 sm:p-4.5 flex flex-col items-center text-center overflow-hidden my-auto">
        {/* Specular top reflection */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

        {/* Unified Pristine Top Header: Seed Balance Logo + THE MORGEN RUSH + Carved Wood GAME OVER Plaque */}
        <div className="w-full flex items-center justify-center z-10 mb-1.5 mt-0.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gameover_top_header.png"
            alt="Seed Balance: The Morgen Rush - Game Over"
            className="w-full max-w-[340px] sm:max-w-[380px] h-auto object-contain drop-shadow-md select-none pointer-events-none transition-transform hover:scale-[1.02] duration-300"
          />
        </div>

        {/* Stats Row: 2 Glass Pods (FINAL SCORE & BOWLS CRAFTED) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full z-10 mb-2">
          {/* Left Pod: FINAL SCORE */}
          <div className="rounded-2xl sm:rounded-3xl bg-[#052644]/80 border border-white/20 p-2 sm:p-2.5 flex items-center gap-2 sm:gap-2.5 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/clean_trophy.png"
              alt="Trophy"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0 drop-shadow-xs select-none pointer-events-none"
            />
            <div className="text-left">
              <div className="text-[8px] sm:text-[9px] font-bold text-sky-300 tracking-wider uppercase">
                FINAL SCORE
              </div>
              <div className="text-lg sm:text-2xl font-black text-white leading-none">
                {score}
              </div>
            </div>
          </div>

          {/* Right Pod: BOWLS CRAFTED */}
          <div className="rounded-2xl sm:rounded-3xl bg-[#052644]/80 border border-white/20 p-2 sm:p-2.5 flex items-center gap-2 sm:gap-2.5 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/clean_bowl.png"
              alt="Muesli Bowl"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0 drop-shadow-xs select-none pointer-events-none"
            />
            <div className="text-left">
              <div className="text-[8px] sm:text-[9px] font-bold text-sky-300 tracking-wider uppercase">
                BOWLS CRAFTED
              </div>
              <div className="text-lg sm:text-2xl font-black text-white leading-none">
                {bowls}
              </div>
            </div>
          </div>
        </div>

        {/* Total Ingredients Eaten Pill in Frosted Royal Blue Glass */}
        <div className="inline-flex items-center gap-2 bg-[#052644]/80 border border-white/20 px-3.5 py-1 rounded-full text-xs font-bold text-sky-200 shadow-md z-10 mb-2">
          <span className="text-emerald-400 text-xs">🍃</span>
          <span>
            Total Ingredients Eaten:{' '}
            <strong className="text-white font-black text-sm">{ingredientsCount}</strong>
          </span>
          <span className="text-emerald-400 text-xs">🍃</span>
        </div>

        {/* Nickname Input Form */}
        <form onSubmit={handleSave} className="flex items-center gap-2 w-full z-10 mb-2">
          <div className="relative flex-1">
            <User
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300 pointer-events-none"
            />
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your nickname"
              maxLength={15}
              disabled={saved}
              className="w-full bg-[#052644]/90 border border-white/30 rounded-full py-2 pl-9 pr-3 text-xs sm:text-sm font-semibold text-white placeholder-sky-300/60 focus:outline-none focus:border-cyan-400 shadow-inner transition"
            />
          </div>
          <button
            type="submit"
            disabled={saved || !playerName.trim()}
            className={`px-4 sm:px-5 py-2 rounded-full font-black text-xs sm:text-sm tracking-wide shadow-md transition active:scale-95 ${
              saved
                ? 'bg-white/20 text-sky-200 cursor-default'
                : 'glass-button-primary text-white hover:brightness-110'
            }`}
          >
            {saved ? 'SAVED ✓' : 'SAVE'}
          </button>
        </form>

        {/* Spin to Win Morgen Mete Vouchers Button */}
        <button
          onClick={handleSpinRewardsClick}
          className="w-full rounded-full py-2.5 px-3.5 bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#D97706] border border-white/60 shadow-[0_8px_20px_rgba(245,158,11,0.35)] flex items-center justify-between text-[#052644] font-black text-xs sm:text-sm transition active:scale-95 hover:brightness-105 z-10 mb-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gameover_spin_wheel.png"
            alt="Spin Wheel"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-xs shrink-0"
          />
          <span className="tracking-wide uppercase text-center flex-1 drop-shadow-xs font-black px-1">
            SPIN TO WIN MORGEN METE VOUCHERS
          </span>
          <ChevronRight size={18} className="text-[#052644] shrink-0 font-bold" />
        </button>

        {/* Main PLAY AGAIN Button with Burst Rays */}
        <button
          onClick={handlePlayAgainClick}
          className="w-full rounded-full py-2.5 sm:py-3 px-6 glass-button-primary text-white font-black text-base sm:text-lg tracking-wider shadow-[0_10px_25px_rgba(5,38,68,0.6)] flex items-center justify-center gap-2 transition active:scale-95 hover:brightness-105 z-10 mb-2 border border-white/50"
        >
          <span className="text-white/70 text-sm font-black">彡</span>
          <RotateCcw size={18} className="text-white" />
          <span>PLAY AGAIN</span>
          <span className="text-white/70 text-sm font-black">彡</span>
        </button>

        {/* Secondary Buttons Row: LEADERBOARD & SHARE in Frosted Royal Blue */}
        <div className="grid grid-cols-2 gap-2.5 w-full z-10 mb-1">
          <button
            onClick={handleLeaderboardClick}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-[#052644]/80 hover:bg-[#07477D] border border-white/20 text-white font-bold text-xs tracking-wider shadow-md transition active:scale-95"
          >
            <Trophy size={14} className="text-[#FBBF24]" />
            <span>LEADERBOARD</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-[#052644]/80 hover:bg-[#07477D] border border-white/20 text-white font-bold text-xs tracking-wider shadow-md transition active:scale-95"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span className="text-emerald-400">COPIED!</span>
              </>
            ) : (
              <>
                <Share2 size={14} className="text-sky-300" />
                <span>SHARE</span>
              </>
            )}
          </button>
        </div>

        {/* Bottom Cute Mascot Snake + Morgen Mete Muesli Bowl Artwork (No duplicate buttons!) */}
        <div className="w-full flex justify-center z-10 -mb-3 sm:-mb-4 mt-1 pointer-events-none select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gameover_mascot_clean.png"
            alt="Morgen Rush Snake Mascot & Muesli Bowl"
            className="w-full max-w-[340px] sm:max-w-[380px] h-auto object-contain drop-shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
