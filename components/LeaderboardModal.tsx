'use client';

import React from 'react';
import { X, Trophy, Medal } from 'lucide-react';
import { LeaderboardEntry } from '@/lib/types';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
}

export default function LeaderboardModal({ isOpen, onClose, entries }: LeaderboardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none">
      <div className="glass-card rounded-[32px] max-w-sm w-full p-6 text-white shadow-2xl relative max-h-[85vh] flex flex-col overflow-hidden bg-gradient-to-b from-[#095797]/95 via-[#07477D]/95 to-[#052644]/95 border-2 border-white/25">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/seed-balance-logo-full.png"
            alt="Seed Balance®"
            className="h-8 sm:h-9 w-auto object-contain mx-auto mb-2 drop-shadow-md brightness-105"
          />
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FBBF24] uppercase tracking-wider mb-1">
            <Trophy size={16} /> TOP SEED CHAMPIONS
          </div>
          <h2 className="text-2xl font-black text-white drop-shadow-md">LEADERBOARD</h2>
          <p className="text-xs text-sky-200">Highest scores and completed Morgen Mete bowls</p>
        </div>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
          {entries.length === 0 ? (
            <div className="text-center text-xs text-sky-300/60 py-8">
              No scores recorded yet. Be the first to craft a recipe!
            </div>
          ) : (
            entries.map((entry, idx) => {
              const isGold = idx === 0;
              const isSilver = idx === 1;
              const isBronze = idx === 2;

              return (
                <div
                  key={entry.id || idx}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    isGold
                      ? 'bg-gradient-to-r from-amber-500/30 to-yellow-600/20 border-amber-400/50 shadow-sm'
                      : isSilver
                      ? 'bg-white/15 border-white/30 shadow-sm'
                      : isBronze
                      ? 'bg-amber-700/30 border-amber-600/40 shadow-sm'
                      : 'bg-[#052644]/75 border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 flex items-center justify-center font-black text-xs">
                      {isGold ? (
                        <Medal size={22} className="text-[#FBBF24] drop-shadow-xs" />
                      ) : isSilver ? (
                        <Medal size={20} className="text-slate-300 drop-shadow-xs" />
                      ) : isBronze ? (
                        <Medal size={20} className="text-amber-500 drop-shadow-xs" />
                      ) : (
                        <span className="text-sky-300 font-bold">#{idx + 1}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white truncate max-w-[120px]">
                        {entry.name}
                      </div>
                      <div className="text-[10px] text-sky-200 flex items-center gap-1 mt-0.5">
                        <span>🥣 {entry.bowls} bowls</span>
                        <span>•</span>
                        <span>{entry.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-white">
                      {entry.score}
                    </div>
                    <div className="text-[9px] text-sky-300 font-bold">PTS</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
