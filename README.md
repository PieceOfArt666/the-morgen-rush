# Seed Balance: The Morgen Rush 🥣🐍

[![Live Demo](https://img.shields.io/badge/Live-the--morgen--rush.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://the-morgen-rush.vercel.app)

A branded, recipe-based web Snake game crafted with **Next.js 14**, **React**, **TypeScript**, **Tailwind CSS**, **HTML5 Canvas**, and the **Web Audio API**. Inspired by the promotional game mechanics of Dark Fantasy, designed for **Seed Balance** and its signature product **Morgen Mete**.

🎮 **Live Game:** [https://the-morgen-rush.vercel.app](https://the-morgen-rush.vercel.app)

---

## 🌟 Game Concept & Mechanics

Rather than simply collecting generic points, **The Morgen Rush** transforms classic Snake into an engaging **recipe assembly experience**:

1. **The 6 Core Ingredients**:
   - 🌱 **Pumpkin Seeds**: Crunchy, elongated seed providing essential daily nutrients.
   - 🔴 **Cranberry**: Tart crimson berry rich in antioxidants.
   - 🍯 **Golden Honey**: Activates the **Honey Shield** granting 6 seconds of invulnerability against wall and tail collisions!
   - 🫐 **Blackcurrant**: Glossy dark purple berry packed with Vitamin C.
   - 🌾 **Wheat Flakes**: Golden toasted flakes providing crunchy texture.
   - 🥣 **Rolled Oats**: Wholesome oats forming the base of Morgen Mete.

2. **Core Spawning & Scoring Rules**:
   - **One at a time**: Exactly one ingredient exists in the playing arena at any given time.
   - **Persistent**: The ingredient remains until collected by the snake.
   - **Randomized sequence**: In each round, all 6 ingredients spawn in a randomized order (using the Fisher-Yates algorithm) without repetition.
   - **Recipe Completion (+100 PTS)**: Collecting all 6 ingredients completes a **Morgen Mete Muesli Bowl** (`🥣 01`, `🥣 02`...), awarding 100 points, triggering confetti and celebration fanfare, and slightly accelerating the snake.

3. **Promotional Marketing Features**:
   - 🏆 **Interactive Leaderboard**: Save your nickname, compare scores, and compete for the top champion rank.
   - 🎡 **Spin the Reward Wheel**: Direct homage to the reference marketing experience—players spin to win real voucher codes (e.g. `MORGEN15`, `FREEMETE`, `RUSH25`) to redeem with Seed Balance.
   - 📱 **Mobile & Desktop Controls**: Smooth touch swipe gestures, touch on-screen D-Pad, and desktop Arrow Keys / WASD.
   - 🎵 **Web Audio Synth**: Zero-latency procedural sound effects (munch, golden chime, whoosh, shield, game over) and upbeat breakfast lo-fi arcade music without relying on external audio assets.

---

## 🚀 Getting Started

To run the game locally:

```bash
# Start the local development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

To create an optimized production build:

```bash
npm run build
npm start
```
