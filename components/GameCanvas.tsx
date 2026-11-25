'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { GameEngine } from '@/lib/gameEngine';
import { Direction } from '@/lib/types';
import { INGREDIENTS } from '@/lib/ingredients';
import { soundManager } from '@/lib/audio';

interface GameCanvasProps {
  engine: GameEngine;
  onDirectionChange?: (dir: Direction) => void;
  isMobile?: boolean;
}

export default function GameCanvas({ engine, onDirectionChange, isMobile }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const foodImagesRef = useRef<Record<string, HTMLImageElement>>({});

  // Active Dark Fantasy tutorial arrow and instruction matching the reference site
  const getTutorialInfo = () => {
    switch (engine.tutorialStep) {
      case 'WAIT_UP':
        return { rotation: '0deg', text: 'Swipe to move the snake up and dodge the walls!' };
      case 'WAIT_RIGHT':
        return { rotation: '90deg', text: 'Swipe to move the snake right and dodge the walls!' };
      case 'WAIT_DOWN':
        return { rotation: '180deg', text: 'Swipe to move the snake down and dodge the walls!' };
      case 'WAIT_LEFT':
        return { rotation: '270deg', text: 'Swipe to move your snake to the left.' };
      default:
        return null;
    }
  };
  const activeTutorial = getTutorialInfo();

  // Preload 3D ingredient images for canvas rendering
  useEffect(() => {
    INGREDIENTS.forEach((ing) => {
      const img = new Image();
      img.src = `/icon_${ing.id}.png`;
      foodImagesRef.current[ing.id] = img;
    });
  }, []);

  // Responsive canvas sizing
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    // Available width and height boundaries
    const availableWidth = Math.min(parent.clientWidth - 16, isMobile ? 380 : 600);
    const maxAllowedHeight = isMobile ? Math.min(window.innerHeight - 250, 420) : 480;

    const cellByW = Math.floor(availableWidth / engine.cols);
    const cellByH = Math.floor(maxAllowedHeight / engine.rows);
    const cellSize = Math.max(16, Math.min(cellByW, cellByH));

    const canvasWidth = cellSize * engine.cols;
    const canvasHeight = cellSize * engine.rows;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    engine.cellSize = cellSize;
  }, [engine, isMobile]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.cancelable) e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const minSwipe = 15;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > minSwipe) {
        const dir = dx > 0 ? 'RIGHT' : 'LEFT';
        engine.setDirection(dir);
        onDirectionChange?.(dir);
      }
    } else {
      if (Math.abs(dy) > minSwipe) {
        const dir = dy > 0 ? 'DOWN' : 'UP';
        engine.setDirection(dir);
        onDirectionChange?.(dir);
      }
    }
    touchStartRef.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let dir: Direction | null = null;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') dir = 'UP';
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') dir = 'DOWN';
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') dir = 'LEFT';
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') dir = 'RIGHT';

      if (dir) {
        e.preventDefault();
        engine.setDirection(dir);
        onDirectionChange?.(dir);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engine, onDirectionChange]);

  // Main game loop & render
  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Update engine state
      engine.update(now, dt);

      // Render onto canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const dpr = window.devicePixelRatio || 1;
          ctx.save();
          ctx.scale(dpr, dpr);

          drawScene(ctx, engine, now, foodImagesRef.current);

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [engine, updateCanvasSize]);

  return (
    <div className="relative flex justify-center items-center select-none touch-none w-full">
      {/* Seed Balance Royal Blue Glassy Arena Frame Container with Leaf Corners */}
      <div className="relative p-1.5 rounded-[32px] border-2 border-white/25 shadow-[0_12px_40px_rgba(5,38,68,0.7),inset_0_0_15px_rgba(41,133,214,0.3)] bg-[#07477D]/75 backdrop-blur-xl">
        {/* Top-Left Botanical Leaf Corner */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/leaf_corner_tl_clean.png"
          alt=""
          className="absolute -top-3.5 -left-3.5 w-12 sm:w-14 h-12 sm:h-14 pointer-events-none z-20 object-contain drop-shadow-md select-none"
        />

        {/* Top-Right Botanical Leaf Corner */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/leaf_corner_tr_clean.png"
          alt=""
          className="absolute -top-3.5 -right-3.5 w-12 sm:w-14 h-12 sm:h-14 pointer-events-none z-20 object-contain drop-shadow-md select-none"
        />

        {/* Bottom-Left Botanical Leaf Corner */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/leaf_corner_bl_clean.png"
          alt=""
          className="absolute -bottom-3.5 -left-3.5 w-12 sm:w-14 h-12 sm:h-14 pointer-events-none z-20 object-contain drop-shadow-md select-none"
        />

        {/* Bottom-Right Botanical Leaf Corner */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/leaf_corner_br_clean.png"
          alt=""
          className="absolute -bottom-3.5 -right-3.5 w-12 sm:w-14 h-12 sm:h-14 pointer-events-none z-20 object-contain drop-shadow-md select-none"
        />

        {/* Live Tutorial Overlay with official tutorialArrow.png and instruction */}
        {activeTutorial && (
          <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-[24px] animate-in fade-in duration-200">
            <div className="flex flex-col items-center justify-center text-center px-4 max-w-[320px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/tutorialArrow.png"
                alt="Tutorial Arrow"
                style={{ transform: `rotate(${activeTutorial.rotation})` }}
                className="w-10 sm:w-12 h-auto mb-3 drop-shadow-[0_0_20px_rgba(244,219,53,0.95)] animate-bounce transition-transform duration-200 object-contain"
              />
              <p className="text-sm sm:text-base font-black text-white bg-[#052644]/90 border border-white/30 px-4 py-1.5 rounded-full shadow-xl tracking-wide leading-snug">
                {activeTutorial.text}
              </p>
            </div>
          </div>
        )}

        {/* Tutorial First-Ingredient-Collected Popup Card */}
        {engine.tutorialStep === 'COLLECTED' && (
          <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-md rounded-[26px] flex items-center justify-center p-3 animate-in zoom-in-95 duration-200">
            <div className="glass-card rounded-[28px] p-5 text-center max-w-[280px] w-full shadow-2xl border-2 border-white/30 flex flex-col items-center bg-gradient-to-b from-[#095797] to-[#052644] text-white">
              <div className="w-12 h-12 rounded-full bg-[#1E78C2]/40 border-2 border-cyan-400 flex items-center justify-center text-2xl shadow-lg mb-2 animate-bounce">
                🥣
              </div>
              <h2 className="text-lg font-black text-white tracking-wide mb-1 drop-shadow-xs">
                INGREDIENT COLLECTED!
              </h2>
              <p className="text-xs text-sky-200 leading-relaxed mb-4">
                Now you&apos;re on your own. Slither away!
              </p>
              <button
                onClick={() => {
                  soundManager.playClick();
                  engine.finishTutorial();
                  try {
                    localStorage.setItem('morgen_rush_tutorial_done', 'true');
                  } catch (e) { }
                }}
                className="w-full py-2.5 px-4 rounded-xl glass-button-primary text-white font-black text-xs sm:text-sm tracking-wide shadow-xl transition active:scale-95 hover:brightness-105"
              >
                KEEP GOING! ▶
              </button>
            </div>
          </div>
        )}

        {/* Honey Booster Badge Float over Arena */}
        {engine.shieldDuration > 0 && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center gap-1.5 bg-gradient-to-r from-[#DF9C25] to-[#F4DB35] text-[#052644] px-3 py-1 rounded-full shadow-lg border border-white/60 text-[10px] sm:text-[11px] font-black animate-pulse whitespace-nowrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/booster-shield-3d.png" alt="" className="w-4 h-4 object-contain" />
            <span>HONEY BOOSTER: {engine.shieldDuration.toFixed(1)}s</span>
          </div>
        )}

        {/* Game Canvas */}
        <canvas
          ref={canvasRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="rounded-[24px] cursor-pointer block bg-[#095797]"
        />
      </div>
    </div>
  );
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  engine: GameEngine,
  time: number,
  foodImages: Record<string, HTMLImageElement>
) {
  const cs = engine.cellSize;
  const width = engine.cols * cs;
  const height = engine.rows * cs;

  // 1. Seed Balance Royal Blue Gradient (#095797 to #052644)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#095797');
  bgGrad.addColorStop(0.5, '#07477D');
  bgGrad.addColorStop(1, '#052644');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Glowing Azure Grid Lines
  ctx.strokeStyle = 'rgba(41, 133, 214, 0.22)';
  ctx.lineWidth = 1;
  for (let c = 0; c <= engine.cols; c++) {
    ctx.beginPath();
    ctx.moveTo(c * cs, 0);
    ctx.lineTo(c * cs, height);
    ctx.stroke();
  }
  for (let r = 0; r <= engine.rows; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * cs);
    ctx.lineTo(width, r * cs);
    ctx.stroke();
  }

  // 3. Draw Active 3D Collectible Food Item with Glowing Starburst
  draw3DCollectible(ctx, engine, time, foodImages);

  // 4. Draw 3D Segmented Snake
  draw3DSnake(ctx, engine, time);

  // 5. Draw Particles
  drawParticles(ctx, engine);

  // 6. Draw Floating Texts
  drawFloatingTexts(ctx, engine);
}

function draw3DCollectible(
  ctx: CanvasRenderingContext2D,
  engine: GameEngine,
  time: number,
  foodImages: Record<string, HTMLImageElement>
) {
  const pos = engine.ingredientPos;
  if (pos.x < 0 || pos.y < 0) return;

  const cs = engine.cellSize;
  const bobbing = Math.sin(time * 0.006) * 3;
  const cx = (pos.x + 0.5) * cs;
  const cy = (pos.y + 0.5) * cs + bobbing;
  const size = cs * 1.15;

  const ing = engine.activeIngredient;

  // Golden glowing radial halo
  ctx.save();
  const auraPulse = 0.6 + Math.sin(time * 0.008) * 0.2;
  const glowGrad = ctx.createRadialGradient(cx, cy, size * 0.2, cx, cy, size * 1.4);
  glowGrad.addColorStop(0, 'rgba(244, 219, 53, 0.8)');
  glowGrad.addColorStop(0.5, 'rgba(223, 156, 37, 0.4)');
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 1.4, 0, Math.PI * 2);
  ctx.fill();

  // Golden starburst sparkle rays
  ctx.strokeStyle = 'rgba(255, 235, 120, 0.7)';
  ctx.lineWidth = 1.5;
  for (let r = 0; r < 4; r++) {
    const angle = time * 0.002 + (r * Math.PI) / 2;
    const rayLen = size * (0.6 + Math.sin(time * 0.01 + r) * 0.2);
    ctx.beginPath();
    ctx.moveTo(cx - Math.cos(angle) * rayLen, cy - Math.sin(angle) * rayLen);
    ctx.lineTo(cx + Math.cos(angle) * rayLen, cy + Math.sin(angle) * rayLen);
    ctx.stroke();
  }

  // Draw 3D icon image if loaded
  const iconImg = foodImages[ing.id];
  if (iconImg && iconImg.complete && iconImg.naturalWidth > 0) {
    ctx.drawImage(iconImg, cx - size / 2, cy - size / 2, size, size);
  } else {
    // Fallback emoji
    ctx.font = `${Math.floor(cs * 0.8)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ing.emoji, cx, cy);
  }

  ctx.restore();
}

function draw3DSnake(ctx: CanvasRenderingContext2D, engine: GameEngine, time: number) {
  const cs = engine.cellSize;
  const segments = engine.getSnakeSegments();
  if (segments.length === 0) return;

  const headSeg = segments[0];
  const headX = (headSeg.x + 0.5) * cs;
  const headY = (headSeg.y + 0.5) * cs;

  // 0. Soft Ambient Shadow Under Snake for Glass Depth
  ctx.save();
  for (let i = 0; i < segments.length; i++) {
    const pt = segments[i];
    ctx.beginPath();
    ctx.arc((pt.x + 0.5) * cs, (pt.y + 0.5) * cs + 2.5, cs * 0.44, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(5, 38, 68, 0.45)';
    ctx.fill();
  }
  ctx.restore();

  // 1. Honey Shield Glow Aura (if active)
  if (engine.shieldDuration > 0) {
    ctx.save();
    const auraPulse = 1 + Math.sin(time * 0.015) * 0.15;
    ctx.strokeStyle = 'rgba(244, 219, 53, 0.85)';
    ctx.lineWidth = cs * 1.4 * auraPulse;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(headX, headY);
    for (let i = 1; i < segments.length; i++) {
      ctx.lineTo((segments[i].x + 0.5) * cs, (segments[i].y + 0.5) * cs);
    }
    ctx.stroke();
    ctx.restore();
  }

  // 2. Draw Body Segments (from tail to neck) as 3D textured spheres following continuous curve
  const segRadius = cs * 0.44;

  for (let i = segments.length - 1; i >= 1; i--) {
    const pt = segments[i];
    const px = (pt.x + 0.5) * cs;
    const py = (pt.y + 0.5) * cs;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(pt.angle);

    // Darker green border shadow
    ctx.beginPath();
    ctx.arc(0, 0, segRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#2A4E26';
    ctx.fill();

    // 3D Sphere Radial Gradient: Light lime top, deep green bottom
    const grad = ctx.createRadialGradient(-segRadius * 0.3, -segRadius * 0.3, segRadius * 0.1, 0, 0, segRadius);
    grad.addColorStop(0, '#CCD52E'); // Lime highlight
    grad.addColorStop(0.4, '#91B64C'); // Main green
    grad.addColorStop(1, '#537831'); // Dark shade
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, segRadius * 0.95, 0, Math.PI * 2);
    ctx.fill();

    // Cream underbelly arc at bottom
    ctx.fillStyle = '#F5F1E1';
    ctx.beginPath();
    ctx.arc(0, segRadius * 0.35, segRadius * 0.55, 0, Math.PI);
    ctx.fill();

    // Fine scale lines / textures
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, segRadius * 0.65, -0.8, 0.8);
    ctx.stroke();

    ctx.restore();
  }

  // 3. Draw Head at headSeg rotated by headSeg.angle
  ctx.save();
  ctx.translate(headX, headY);
  ctx.rotate(headSeg.angle);

  const headR = cs * 0.52;

  // Head base outline
  ctx.beginPath();
  ctx.ellipse(0, 0, headR * 1.15, headR * 0.95, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#2A4E26';
  ctx.fill();

  // 3D Head Green Gradient
  const headGrad = ctx.createRadialGradient(-headR * 0.3, -headR * 0.3, headR * 0.1, 0, 0, headR * 1.1);
  headGrad.addColorStop(0, '#CCD52E');
  headGrad.addColorStop(0.5, '#91B64C');
  headGrad.addColorStop(1, '#486E2A');
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, headR * 1.1, headR * 0.9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cream underbelly / chin
  ctx.fillStyle = '#F5F1E1';
  ctx.beginPath();
  ctx.ellipse(headR * 0.2, headR * 0.35, headR * 0.65, headR * 0.35, 0.2, 0, Math.PI);
  ctx.fill();

  // Botanical Leaf Ears / Crest on top of head
  ctx.save();
  ctx.translate(-headR * 0.2, -headR * 0.7);
  ctx.rotate(-0.4);
  ctx.beginPath();
  ctx.ellipse(0, 0, headR * 0.3, headR * 0.55, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#729343';
  ctx.fill();
  ctx.strokeStyle = '#2A4E26';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -headR * 0.45);
  ctx.lineTo(0, headR * 0.45);
  ctx.strokeStyle = '#CCD52E';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();

  // Big Cute Anime/Cartoon Eye
  const eyeX = headR * 0.25;
  const eyeY = -headR * 0.25;
  const eyeR = headR * 0.38;

  // Eye Sclera (White)
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#142D59';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Pupil (Dark Glossy Hazel/Black)
  ctx.fillStyle = '#1A293D';
  ctx.beginPath();
  ctx.arc(eyeX + 2, eyeY, eyeR * 0.65, 0, Math.PI * 2);
  ctx.fill();

  // Eye Iris Amber Rim
  ctx.strokeStyle = '#DF9C25';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(eyeX + 2, eyeY, eyeR * 0.6, 0, Math.PI * 2);
  ctx.stroke();

  // Specular Catchlights (Crisp White Stars)
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(eyeX + 4, eyeY - 3, eyeR * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(eyeX, eyeY + 3, eyeR * 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Cute Open Smile Mouth with pink tongue
  ctx.beginPath();
  ctx.arc(headR * 0.55, headR * 0.12, headR * 0.26, -0.2, 0.8);
  ctx.fillStyle = '#D6455D';
  ctx.fill();
  ctx.strokeStyle = '#142D59';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.restore();
}

function drawParticles(ctx: CanvasRenderingContext2D, engine: GameEngine) {
  for (const p of engine.particles) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawFloatingTexts(ctx: CanvasRenderingContext2D, engine: GameEngine) {
  for (const ft of engine.floatingTexts) {
    ctx.save();
    ctx.globalAlpha = ft.alpha;
    ctx.fillStyle = ft.color;
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 6;
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  }
}
