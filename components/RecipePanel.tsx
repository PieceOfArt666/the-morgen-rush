'use client';

import React from 'react';
import { GameEngine } from '@/lib/gameEngine';
import { INGREDIENTS } from '@/lib/ingredients';

interface RecipePanelProps {
  engine: GameEngine;
  compact?: boolean;
}

export default function RecipePanel({ engine, compact = false }: RecipePanelProps) {
  const currentIdx = engine.recipeIndex; // 0..5

  // COMPACT MOBILE APP HORIZONTAL TRAY (for Android mobile view)
  if (compact) {
    return (
      <div className="w-full max-w-[440px] rounded-[24px] bg-[#07477D]/85 border border-white/20 shadow-[0_10px_30px_rgba(5,38,68,0.5)] p-2.5 sm:p-3 flex flex-col justify-between select-none backdrop-blur-xl relative overflow-hidden text-white">
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <div className="bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-[#052644] px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black flex items-center gap-1 shadow-xs">
            <span>🥣</span>
            <span className="tracking-wide">CURRENT RECIPE</span>
          </div>
          <div className="bg-[#052644]/80 border border-white/20 text-white px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black shadow-inner">
            {currentIdx} / 6
          </div>
        </div>

        {/* 6-Column Horizontal Strip of Ingredients */}
        <div className="grid grid-cols-6 gap-1 sm:gap-1.5 my-1">
          {INGREDIENTS.map((ing, idx) => {
            const orderPos = engine.recipeOrder.indexOf(idx);
            const isCollected = orderPos !== -1 && orderPos < currentIdx;
            const isCurrentTarget = orderPos === currentIdx;

            return (
              <div
                key={ing.id}
                className={`relative rounded-xl p-1 flex flex-col items-center justify-between transition-all duration-300 border ${
                  isCurrentTarget
                    ? 'bg-[#1E78C2]/90 border-cyan-300 shadow-[0_0_15px_rgba(41,133,214,0.7)] scale-105 z-10'
                    : isCollected
                    ? 'bg-emerald-950/70 border-emerald-400/60 shadow-xs opacity-95'
                    : 'bg-[#052644]/65 border-white/10 opacity-75'
                }`}
              >
                {/* Top-Right Checkmark Badge */}
                {isCollected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-white text-white flex items-center justify-center text-[8px] font-black shadow-sm z-10">
                    ✓
                  </div>
                )}

                {/* 3D Ingredient Icon */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center my-0.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/icon_${ing.id}.png`}
                    alt={ing.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-sm select-none pointer-events-none"
                  />
                </div>

                {/* Label */}
                <span
                  className={`text-[8px] sm:text-[9px] font-bold text-center leading-tight truncate max-w-full ${
                    isCurrentTarget
                      ? 'text-white font-black'
                      : isCollected
                      ? 'text-emerald-200'
                      : 'text-sky-200'
                  }`}
                >
                  {ing.name.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Segmented Liquid Progress Bar */}
        <div className="w-full mt-1.5">
          <div className="grid grid-cols-6 gap-1 p-0.5 bg-[#052644]/80 rounded-full border border-white/15">
            {[0, 1, 2, 3, 4, 5].map((segIdx) => {
              const isFilled = segIdx < currentIdx;
              return (
                <div
                  key={segIdx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isFilled
                      ? 'bg-gradient-to-r from-sky-400 to-emerald-400 shadow-[0_0_8px_rgba(56,189,248,0.7)]'
                      : 'bg-white/10'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // STANDARD DESKTOP 3x2 GRID PANEL
  return (
    <div className="w-full max-w-[340px] rounded-[32px] bg-[#07477D]/85 border border-white/20 shadow-[0_12px_40px_rgba(5,38,68,0.5)] p-4 sm:p-5 flex flex-col justify-between select-none backdrop-blur-xl relative overflow-hidden text-white">
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-3">
        {/* Yellow 'CURRENT RECIPE' Badge */}
        <div className="bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-[#052644] px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-xs">
          <span>🥣</span>
          <span className="tracking-wide">CURRENT RECIPE</span>
        </div>

        {/* 'X / 6' Count Badge */}
        <div className="bg-[#052644]/80 border border-white/20 text-white px-3.5 py-1.5 rounded-full text-xs font-black shadow-inner">
          {currentIdx} / 6
        </div>
      </div>

      {/* 3x2 Grid of the 6 Ingredients */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 my-2">
        {INGREDIENTS.map((ing, idx) => {
          const orderPos = engine.recipeOrder.indexOf(idx);
          const isCollected = orderPos !== -1 && orderPos < currentIdx;
          const isCurrentTarget = orderPos === currentIdx;

          return (
            <div
              key={ing.id}
              className={`relative rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-between min-h-[92px] transition-all duration-300 border ${
                isCurrentTarget
                  ? 'bg-[#1E78C2]/90 border-cyan-300 shadow-[0_0_15px_rgba(41,133,214,0.7)] scale-105 z-10'
                  : isCollected
                  ? 'bg-emerald-950/70 border-emerald-400/60 shadow-xs opacity-95'
                  : 'bg-[#052644]/65 border-white/10 opacity-75'
              }`}
            >
              {/* Top-Right Checkmark Badge (when collected) */}
              {isCollected && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 border border-white text-white flex items-center justify-center text-[10px] font-black shadow-sm z-10">
                  ✓
                </div>
              )}

              {/* Bottom-Right Target Ring Indicator */}
              {!isCollected && !isCurrentTarget && (
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full border-2 border-white/20" />
              )}
              {isCurrentTarget && (
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full border-2 border-cyan-300 animate-ping" />
              )}

              {/* 3D Ingredient Icon */}
              <div className="w-12 h-12 flex items-center justify-center my-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/icon_${ing.id}.png`}
                  alt={ing.name}
                  className="w-11 h-11 object-contain drop-shadow-sm select-none pointer-events-none"
                />
              </div>

              {/* Label */}
              <span
                className={`text-[10px] sm:text-[11px] font-black text-center leading-tight truncate max-w-full ${
                  isCurrentTarget
                    ? 'text-white'
                    : isCollected
                    ? 'text-emerald-200'
                    : 'text-sky-200'
                }`}
              >
                {ing.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Segmented Liquid Progress Bar */}
      <div className="w-full mt-3">
        <div className="grid grid-cols-6 gap-1.5 p-1 bg-[#052644]/80 rounded-full border border-white/15">
          {[0, 1, 2, 3, 4, 5].map((segIdx) => {
            const isFilled = segIdx < currentIdx;
            return (
              <div
                key={segIdx}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  isFilled
                    ? 'bg-gradient-to-r from-sky-400 to-emerald-400 shadow-[0_0_8px_rgba(56,189,248,0.7)]'
                    : 'bg-white/10'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
