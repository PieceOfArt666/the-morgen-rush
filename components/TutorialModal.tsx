'use client';

import React from 'react';
import { X, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { INGREDIENTS } from '@/lib/ingredients';
import { soundManager } from '@/lib/audio';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPlaying?: () => void;
}

export default function TutorialModal({ isOpen, onClose, onStartPlaying }: TutorialModalProps) {
  if (!isOpen) return null;

  const handleStart = () => {
    soundManager.playClick();
    onClose();
    if (onStartPlaying) {
      onStartPlaying();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200 select-none overflow-y-auto">
      {/* Seed Balance Royal Blue How To Play Card */}
      <div className="glass-card rounded-[36px] max-w-md w-full p-5 sm:p-6 text-white shadow-2xl relative my-auto border-2 border-white/25 bg-gradient-to-b from-[#095797]/95 via-[#07477D]/95 to-[#052644]/95 backdrop-blur-2xl max-h-[92vh] overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/seed-balance-logo-full.png"
            alt="Seed Balance®"
            className="h-8 sm:h-9 w-auto object-contain mx-auto mb-2 drop-shadow-md brightness-105"
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#052644]/80 border border-white/20 text-sky-300 font-black text-[10px] tracking-widest uppercase mb-1">
            <Sparkles size={12} /> SEED BALANCE GAME RULES
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
            HOW TO PLAY
          </h2>
          <p className="text-xs text-sky-200 mt-0.5">
            Master the recipe and craft morning perfection
          </p>
        </div>

        {/* Illustrated Rule Steps */}
        <div className="flex flex-col gap-2.5">
          {/* Step 1 */}
          <div className="flex items-start gap-3 bg-[#052644]/80 border border-white/20 p-3 rounded-2xl shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2985D6] to-[#095797] border border-white/40 flex items-center justify-center text-lg shrink-0 shadow-sm text-white">
              📱
            </div>
            <div>
              <h3 className="font-black text-xs sm:text-sm text-white">1. Slither & Steer</h3>
              <p className="text-[11px] text-sky-200 mt-0.5 leading-relaxed">
                Swipe <span className="text-sky-300 font-bold">UP, DOWN, LEFT or RIGHT</span> on mobile, or use Arrow Keys / WASD on PC to steer your snake mascot.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 bg-[#052644]/80 border border-white/20 p-3 rounded-2xl shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 border border-white/40 text-white flex items-center justify-center text-lg shrink-0 font-black shadow-sm">
              🥣
            </div>
            <div>
              <h3 className="font-black text-xs sm:text-sm text-white">2. Build the Recipe</h3>
              <p className="text-[11px] text-sky-200 mt-0.5 leading-relaxed">
                Only <span className="text-emerald-300 font-bold">ONE ingredient</span> spawns at a time. Collect all 6 in order to assemble a complete <span className="text-sky-300 font-bold">Morgen Mete</span> bowl.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 bg-[#052644]/80 border border-white/20 p-3 rounded-2xl shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FBBF24] to-[#D97706] border border-white/40 flex items-center justify-center text-lg shrink-0 shadow-sm">
              🍯
            </div>
            <div>
              <h3 className="font-black text-xs sm:text-sm text-white flex items-center gap-1.5">
                <span>3. Honey Shield Invincibility</span>
                <Shield size={13} className="text-amber-400" />
              </h3>
              <p className="text-[11px] text-sky-200 mt-0.5 leading-relaxed">
                Whenever you collect Honey, your snake gains <span className="text-amber-400 font-bold">10 seconds of invulnerability</span>! Slither fearlessly through walls and your own tail.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 bg-[#052644]/80 border border-white/20 p-3 rounded-2xl shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-400 to-red-600 border border-white/40 flex items-center justify-center text-lg shrink-0 font-black shadow-sm text-white">
              🎁
            </div>
            <div>
              <h3 className="font-black text-xs sm:text-sm text-white">4. Win Real Vouchers</h3>
              <p className="text-[11px] text-sky-200 mt-0.5 leading-relaxed">
                Every assembled bowl gives <span className="text-emerald-300 font-bold">+100 PTS</span>. Spin the promotional wheel for real discount vouchers &amp; climb the leaderboard!
              </p>
            </div>
          </div>
        </div>

        {/* The 6 High-Res 3D Collectibles Preview */}
        <div className="mt-3 bg-[#052644]/90 border border-white/20 p-3 rounded-2xl">
          <div className="text-[9px] font-black text-sky-300 tracking-wider uppercase mb-2 text-center">
            THE 6 MORGEN METE INGREDIENTS
          </div>
          <div className="grid grid-cols-6 gap-1.5 text-center">
            {INGREDIENTS.map((ing) => (
              <div key={ing.id} className="flex flex-col items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/icon_${ing.id}.png`}
                  alt={ing.name}
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-xs"
                />
                <span className="text-[8px] text-sky-200 font-bold truncate max-w-full mt-0.5">
                  {ing.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button: START PLAYING */}
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={handleStart}
            className="w-full py-3 rounded-full glass-button-primary text-white font-black text-sm sm:text-base tracking-wider shadow-lg flex items-center justify-center gap-2 transition active:scale-95 hover:brightness-105 border border-white/50"
          >
            <span>CONTINUE &amp; PLAY NOW</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
