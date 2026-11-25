'use client';

import React, { useEffect, useRef } from 'react';
import { mountGame } from '@/lib/morgenRushV7';

export default function GamePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cleanup = mountGame(containerRef.current, '/assets/');
    return () => {
      cleanup?.();
    };
  }, []);

  return <div ref={containerRef} id="root" style={{ minHeight: '100dvh' }} />;
}
