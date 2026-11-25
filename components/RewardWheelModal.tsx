'use client';

import React, { useState } from 'react';
import { X, Sparkles, Gift, Copy, Check, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '@/lib/audio';

interface RewardWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRIZES = [
  { label: '15% OFF', code: 'MORGEN15', desc: '15% off your next Seed Balance order', color: '#91B64C' },
  { label: 'FREE BOWL', code: 'FREEMETE', desc: 'Free Morgen Mete bowl sample pack', color: '#B52D46' },
  { label: '25% OFF', code: 'RUSH25', desc: '25% VIP gamer discount code', color: '#DF9C25' },
  { label: 'FREE SEEDS', code: 'PUMPKINSEED', desc: 'Bonus Pumpkin Seeds snack pack', color: '#729343' },
  { label: '10% OFF', code: 'BALANCE10', desc: '10% off any muesli flavor', color: '#175A9D' },
  { label: 'SWEET HONEY', code: 'HONEYBOWL', desc: 'Free honey drizzle topping pack', color: '#CF913C' },
];

export default function RewardWheelModal({ isOpen, onClose }: RewardWheelModalProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<(typeof PRIZES)[0] | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (spinning) return;
    soundManager.playClick();
    setSpinning(true);
    setWonPrize(null);

    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const sliceAngle = 360 / PRIZES.length;
    const targetRotation = rotation + 1800 + (360 - prizeIndex * sliceAngle - sliceAngle / 2);

    setRotation(targetRotation);

    setTimeout(() => {
      setSpinning(false);
      const prize = PRIZES[prizeIndex];
      setWonPrize(prize);
      soundManager.playRecipeComplete();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2985D6', '#095797', '#F59E0B', '#10B981'],
      });
    }, 4000);
  };

  const handleCopyCode = () => {
    if (!wonPrize) return;
    navigator.clipboard.writeText(wonPrize.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none">
      <div className="glass-card rounded-[32px] max-w-sm w-full p-6 text-white shadow-2xl relative flex flex-col items-center text-center overflow-hidden bg-gradient-to-b from-[#095797]/95 via-[#07477D]/95 to-[#052644]/95 border-2 border-white/25">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/seed-balance-logo-full.png"
            alt="Seed Balance®"
            className="h-8 sm:h-9 w-auto object-contain mx-auto mb-2 drop-shadow-md brightness-105"
          />
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FBBF24] uppercase tracking-wider mb-1">
            <Sparkles size={14} /> PROMOTIONAL REWARDS
          </div>
          <h2 className="text-2xl font-black text-white drop-shadow-md">SPIN THE WHEEL</h2>
          <p className="text-xs text-sky-200">Win exclusive Seed Balance discount vouchers!</p>
        </div>

        {/* Visual Spin Wheel */}
        <div className="relative my-4 w-56 h-56 flex items-center justify-center">
          {/* Glowing Aura */}
          <div className="absolute inset-0 rounded-full bg-[#2985D6]/30 blur-xl pointer-events-none" />

          {/* Top Pointer */}
          <div className="absolute -top-3.5 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)]" />

          {/* Wheel Disc */}
          <div
            className="w-full h-full rounded-full border-4 border-white/80 shadow-[0_10px_30px_rgba(5,38,68,0.5)] relative overflow-hidden transition-transform ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionDuration: spinning ? '4000ms' : '0ms',
              background: 'conic-gradient(#095797 0deg 60deg, #F59E0B 60deg 120deg, #10B981 120deg 180deg, #2985D6 180deg 240deg, #B52D46 240deg 300deg, #1E78C2 300deg 360deg)',
            }}
          >
            {PRIZES.map((prize, idx) => {
              const angle = idx * 60 + 30;
              return (
                <div
                  key={idx}
                  className="absolute top-0 left-0 w-full h-full flex items-start justify-center pt-3 text-[11px] font-black text-white drop-shadow-md select-none pointer-events-none"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: '50% 50%',
                  }}
                >
                  <span className="bg-black/45 backdrop-blur-xs px-2 py-0.5 rounded-full mt-1 border border-white/30">
                    {prize.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Wheel Center Glass Hub */}
          <div className="absolute z-10 w-12 h-12 rounded-full bg-[#052644] border-2 border-amber-400 flex items-center justify-center shadow-lg">
            <Gift size={20} className="text-[#FBBF24] drop-shadow-xs" />
          </div>
        </div>

        {/* Winner Result Card */}
        {wonPrize ? (
          <div className="w-full bg-[#052644]/95 rounded-2xl p-4 mb-3 animate-in zoom-in-95 border border-amber-400/80 shadow-xl">
            <div className="text-xs text-emerald-400 font-black tracking-wider">CONGRATULATIONS!</div>
            <div className="text-base font-black text-white my-1">{wonPrize.desc}</div>

            <div className="flex items-center justify-center gap-2 mt-2.5 bg-[#07477D] border border-white/20 p-2 rounded-xl">
              <span className="font-mono font-black text-base tracking-widest text-amber-300">
                {wonPrize.code}
              </span>
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1.5 rounded-lg glass-button-primary text-white font-black transition flex items-center gap-1 text-xs active:scale-95"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>

            <a
              href="https://www.instagram.com/seed.balance?knvt=bHZtNGJnYm1lM2wz"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-sky-300 hover:text-white transition font-semibold"
            >
              <span>Redeem with @seed.balance on Instagram</span>
              <ExternalLink size={12} />
            </a>
          </div>
        ) : (
          <button
            onClick={handleSpin}
            disabled={spinning}
            className="w-full py-3.5 rounded-2xl glass-button-gold text-[#052644] font-black text-sm tracking-wider shadow-xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mb-2"
          >
            {spinning ? 'SPINNING...' : 'SPIN THE WHEEL!'}
          </button>
        )}

        {wonPrize && (
          <button
            onClick={handleSpin}
            disabled={spinning}
            className="w-full py-2.5 rounded-xl glass-button-secondary font-bold text-xs transition active:scale-95"
          >
            SPIN AGAIN
          </button>
        )}
      </div>
    </div>
  );
}
