import { Direction, Position, Ingredient } from './types';
import { INGREDIENTS, generateRandomRecipeOrder } from './ingredients';
import { soundManager } from './audio';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  alpha: number;
  vy: number;
  color: string;
}

export type TutorialStep =
  | 'OFF'
  | 'INTRO'
  | 'WAIT_UP'
  | 'MOVE_UP'
  | 'WAIT_RIGHT'
  | 'MOVE_RIGHT'
  | 'WAIT_DOWN'
  | 'MOVE_DOWN'
  | 'WAIT_LEFT'
  | 'MOVE_LEFT'
  | 'COLLECTED';

export interface SnakeSegment {
  x: number; // float grid coordinate
  y: number; // float grid coordinate
  angle: number; // radians
}

export interface GameEngineState {
  score: number;
  bowlsCompleted: number;
  ingredientsEaten: number;
  recipeOrder: number[];
  recipeIndex: number; // 0 to 5
  activeIngredient: Ingredient;
  ingredientPos: Position;
  snake: Position[];
  prevSnake: Position[];
  direction: Direction;
  nextDirection: Direction;
  isGameOver: boolean;
  isPaused: boolean;
  shieldTimeRemaining: number; // in seconds
  speedMultiplier: number;
}

export class GameEngine {
  public cols: number = 18;
  public rows: number = 12;
  public cellSize: number = 32;

  // Continuous physics properties (Dark Fantasy Engine)
  public headPos: { x: number; y: number } = { x: 7, y: 6 };
  public targetPos: { x: number; y: number } = { x: 8, y: 6 };
  public targetGrid: Position = { x: 8, y: 6 };
  public angle: number = 0; // head rotation angle (radians)
  public speed: number = 5.2; // grid cells per second
  public history: SnakeSegment[] = [];
  public bodyLength: number = 4;
  public segmentSpacing: number = 0.82; // grid units spacing along history

  public snake: Position[] = [];
  public prevSnake: Position[] = [];
  public direction: Direction = 'RIGHT';
  public queuedDirection: Direction = 'RIGHT';
  public nextDirection: Direction = 'RIGHT';

  public recipeOrder: number[] = [0, 1, 2, 3, 4, 5];
  public recipeIndex: number = 0;
  public activeIngredient: Ingredient = INGREDIENTS[0];
  public ingredientPos: Position = { x: 10, y: 10 };

  public score: number = 0;
  public bowlsCompleted: number = 0;
  public ingredientsEaten: number = 0;
  public shieldDuration: number = 0; // seconds remaining

  public isGameOver: boolean = false;
  public isPaused: boolean = false;

  public baseTickInterval: number = 170; // ms per grid tick
  public tickInterval: number = 170;
  public lastTickTime: number = 0;

  public get speedMultiplier(): number {
    return +(this.speed / 5.2).toFixed(2);
  }

  public particles: Particle[] = [];
  public floatingTexts: FloatingText[] = [];
  private textCounter: number = 0;

  public tutorialStep: TutorialStep = 'OFF';
  public onRecipeCompleteCallback?: (bowls: number) => void;
  public onGameOverCallback?: (finalScore: number, bowls: number, ingredientsCount: number) => void;
  public onTutorialCollectedCallback?: () => void;
  public onHoneyPowerUpCallback?: () => void;

  constructor() {
    this.reset();
  }

  // Sample smooth position along historical motion path (Dark Fantasy algorithm)
  public getSegmentAtDistance(dist: number): SnakeSegment | null {
    if (this.history.length === 0) return null;
    if (dist <= 0) return this.history[0];
    let accum = 0;
    for (let i = 0; i < this.history.length - 1; i++) {
      const p1 = this.history[i];
      const p2 = this.history[i + 1];
      const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      if (d > 0) {
        if (accum + d >= dist) {
          const t = (dist - accum) / d;
          return {
            x: p1.x + (p2.x - p1.x) * t,
            y: p1.y + (p2.y - p1.y) * t,
            angle: p1.angle + (p2.angle - p1.angle) * t,
          };
        }
        accum += d;
      }
    }
    return this.history[this.history.length - 1];
  }

  public getSnakeSegments(): SnakeSegment[] {
    const list: SnakeSegment[] = [{ x: this.headPos.x, y: this.headPos.y, angle: this.angle }];
    for (let i = 1; i < this.bodyLength; i++) {
      const seg = this.getSegmentAtDistance(i * this.segmentSpacing);
      if (seg) list.push(seg);
    }
    return list;
  }

  public reset(cols: number = 18, rows: number = 12) {
    this.cols = cols;
    this.rows = rows;
    this.tutorialStep = 'OFF';
    this.direction = 'RIGHT';
    this.queuedDirection = 'RIGHT';
    this.nextDirection = 'RIGHT';
    this.angle = 0;
    this.speed = 5.2;
    this.bodyLength = 4;
    this.score = 0;
    this.bowlsCompleted = 0;
    this.ingredientsEaten = 0;
    this.shieldDuration = 0;
    this.isGameOver = false;
    this.isPaused = false;
    this.particles = [];
    this.floatingTexts = [];
    this.tickInterval = this.baseTickInterval;

    const startX = Math.floor(this.cols / 2);
    const startY = Math.floor(this.rows / 2);
    this.headPos = { x: startX, y: startY };
    this.targetGrid = { x: startX + 1, y: startY };
    this.targetPos = { x: startX + 1, y: startY };

    // Seed continuous path history
    this.history = [];
    for (let i = 0; i < 80; i++) {
      this.history.push({ x: startX - i * 0.05, y: startY, angle: 0 });
    }

    this.snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ];
    this.prevSnake = JSON.parse(JSON.stringify(this.snake));

    this.recipeOrder = [0, 1, 2, 3, 4, 5];
    this.recipeIndex = 0;
    this.activeIngredient = INGREDIENTS[this.recipeOrder[this.recipeIndex]];

    this.spawnNextIngredient();
    this.lastTickTime = performance.now();
  }

  // Dark Fantasy Interactive Border Tutorial Engine
  public startTutorial(cols: number = 18, rows: number = 12) {
    this.cols = cols;
    this.rows = rows;
    this.tutorialStep = 'INTRO';
    this.direction = 'LEFT';
    this.queuedDirection = 'LEFT';
    this.nextDirection = 'LEFT';
    this.angle = Math.PI;
    this.speed = 4.8;
    this.bodyLength = 4;
    this.score = 0;
    this.bowlsCompleted = 0;
    this.ingredientsEaten = 0;
    this.shieldDuration = 0;
    this.isGameOver = false;
    this.isPaused = false;
    this.particles = [];
    this.floatingTexts = [];
    this.tickInterval = 170;

    const startX = Math.floor(this.cols / 2);
    const startY = Math.floor(this.rows / 2);
    this.headPos = { x: startX, y: startY };
    this.targetGrid = { x: startX - 1, y: startY };
    this.targetPos = { x: startX - 1, y: startY };

    this.history = [];
    for (let i = 0; i < 80; i++) {
      this.history.push({ x: startX + i * 0.05, y: startY, angle: Math.PI });
    }

    this.recipeOrder = [0, 1, 2, 3, 4, 5];
    this.recipeIndex = 0;
    this.activeIngredient = INGREDIENTS[this.recipeOrder[0]];
    this.ingredientPos = { x: -10, y: -10 };
    this.lastTickTime = performance.now();
  }

  public finishTutorial() {
    this.tutorialStep = 'OFF';
    this.isPaused = false;
    this.speed = 5.2;
    this.spawnNextIngredient();
  }

  public setDirection(newDir: Direction) {
    if (this.isGameOver) return;

    // Dark Fantasy Tutorial guided directional inputs
    if (this.tutorialStep !== 'OFF') {
      if (this.tutorialStep === 'WAIT_UP' && newDir === 'UP') {
        this.tutorialStep = 'MOVE_UP';
        this.direction = 'UP';
        this.queuedDirection = 'UP';
        soundManager.playTurn();
        return;
      }
      if (this.tutorialStep === 'WAIT_RIGHT' && newDir === 'RIGHT') {
        this.tutorialStep = 'MOVE_RIGHT';
        this.direction = 'RIGHT';
        this.queuedDirection = 'RIGHT';
        soundManager.playTurn();
        return;
      }
      if (this.tutorialStep === 'WAIT_DOWN' && newDir === 'DOWN') {
        this.tutorialStep = 'MOVE_DOWN';
        this.direction = 'DOWN';
        this.queuedDirection = 'DOWN';
        soundManager.playTurn();
        return;
      }
      if (this.tutorialStep === 'WAIT_LEFT' && newDir === 'LEFT') {
        this.tutorialStep = 'MOVE_LEFT';
        this.direction = 'LEFT';
        this.queuedDirection = 'LEFT';
        soundManager.playTurn();
        return;
      }
      return;
    }

    if (this.isPaused) return;

    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };
    if (newDir !== opposites[this.direction] && newDir !== this.direction) {
      this.queuedDirection = newDir;
      this.nextDirection = newDir;
      soundManager.playTurn();
    }
  }

  public spawnNextIngredient() {
    // Collect all unoccupied positions
    const occupied = new Set<string>();
    for (const seg of this.snake) {
      occupied.add(`${seg.x},${seg.y}`);
    }

    const available: Position[] = [];
    for (let c = 1; c < this.cols - 1; c++) {
      for (let r = 1; r < this.rows - 1; r++) {
        if (!occupied.has(`${c},${r}`)) {
          available.push({ x: c, y: r });
        }
      }
    }

    if (available.length > 0) {
      const chosen = available[Math.floor(Math.random() * available.length)];
      this.ingredientPos = chosen;
    } else {
      // Board full - player won!
      this.ingredientPos = { x: -1, y: -1 };
    }
  }

  public update(now: number, deltaSeconds: number) {
    if (this.isGameOver || this.isPaused) return;

    const dt = Math.min(deltaSeconds, 0.05);

    // Update shield timer
    if (this.shieldDuration > 0) {
      this.shieldDuration = Math.max(0, this.shieldDuration - dt);
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= 0.02;
      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // Continuous 60fps smooth slither physics
    this.moveContinuous(dt);
  }

  private moveContinuous(dt: number) {
    if (
      this.tutorialStep === 'WAIT_UP' ||
      this.tutorialStep === 'WAIT_RIGHT' ||
      this.tutorialStep === 'WAIT_DOWN' ||
      this.tutorialStep === 'WAIT_LEFT' ||
      this.tutorialStep === 'COLLECTED'
    ) {
      return;
    }

    const dx = this.targetPos.x - this.headPos.x;
    const dy = this.targetPos.y - this.headPos.y;
    const dist = Math.hypot(dx, dy);
    const step = this.speed * dt;

    if (dist <= step) {
      this.headPos.x = this.targetPos.x;
      this.headPos.y = this.targetPos.y;

      // Dark Fantasy Tutorial border checkpoints
      if (this.tutorialStep === 'INTRO' && this.targetGrid.x <= 2) {
        this.tutorialStep = 'WAIT_UP';
        soundManager.playTurn();
        return;
      }
      if (this.tutorialStep === 'MOVE_UP' && this.targetGrid.y <= 2) {
        this.tutorialStep = 'WAIT_RIGHT';
        soundManager.playTurn();
        return;
      }
      if (this.tutorialStep === 'MOVE_RIGHT' && this.targetGrid.x >= this.cols - 3) {
        this.tutorialStep = 'WAIT_DOWN';
        soundManager.playTurn();
        return;
      }
      if (this.tutorialStep === 'MOVE_DOWN' && this.targetGrid.y >= Math.floor(this.rows / 2)) {
        this.tutorialStep = 'WAIT_LEFT';
        this.ingredientPos = { x: Math.floor(this.cols / 2), y: Math.floor(this.rows / 2) };
        soundManager.playTurn();
        return;
      }

      // Turn according to queued direction
      this.direction = this.queuedDirection;
      let vx = 0;
      let vy = 0;
      switch (this.direction) {
        case 'UP': vy = -1; this.angle = -Math.PI / 2; break;
        case 'DOWN': vy = 1; this.angle = Math.PI / 2; break;
        case 'LEFT': vx = -1; this.angle = Math.PI; break;
        case 'RIGHT': vx = 1; this.angle = 0; break;
      }

      const nextCol = this.targetGrid.x + vx;
      const nextRow = this.targetGrid.y + vy;

      // Wall collision check
      if (nextCol < 0 || nextCol >= this.cols || nextRow < 0 || nextRow >= this.rows) {
        if (this.shieldDuration > 0) {
          this.targetGrid.x = (nextCol + this.cols) % this.cols;
          this.targetGrid.y = (nextRow + this.rows) % this.rows;
          this.headPos.x = this.targetGrid.x;
          this.headPos.y = this.targetGrid.y;
          this.addFloatingText('SLITHERING THROUGH WALLS! 🍯', this.headPos.x, this.headPos.y, '#DF9C25');
        } else {
          this.gameOver();
          return;
        }
      } else {
        this.targetGrid.x = nextCol;
        this.targetGrid.y = nextRow;
      }

      this.targetPos.x = this.targetGrid.x;
      this.targetPos.y = this.targetGrid.y;
    } else {
      this.headPos.x += (dx / dist) * step;
      this.headPos.y += (dy / dist) * step;
    }

    // Prepend trail to history
    this.history.unshift({ x: this.headPos.x, y: this.headPos.y, angle: this.angle });
    if (this.history.length > 2500) {
      this.history.pop();
    }

    // Synchronize legacy this.snake
    const segs = this.getSnakeSegments();
    this.snake = segs.map((s) => ({ x: Math.round(s.x), y: Math.round(s.y) }));

    // Self-collision check (only against segments behind the neck)
    if (this.tutorialStep === 'OFF') {
      for (let i = 4; i < segs.length; i++) {
        const seg = segs[i];
        if (Math.hypot(this.headPos.x - seg.x, this.headPos.y - seg.y) < 0.45) {
          if (this.shieldDuration > 0) {
            break;
          } else {
            this.gameOver();
            return;
          }
        }
      }
    }

    // Collectible check
    if (this.ingredientPos.x >= 0 && this.ingredientPos.y >= 0) {
      const distToFood = Math.hypot(this.headPos.x - this.ingredientPos.x, this.headPos.y - this.ingredientPos.y);
      if (distToFood < 0.65) {
        if (this.tutorialStep === 'MOVE_LEFT') {
          this.tutorialStep = 'COLLECTED';
          this.ingredientsEaten++;
          this.recipeIndex = 1;
          this.score += 10;
          this.bodyLength++;
          soundManager.playMunch();
          this.addFloatingText('+10', this.headPos.x, this.headPos.y, '#F4DB35');
          this.onTutorialCollectedCallback?.();
          return;
        }
        this.handleIngredientEaten();
      }
    }
  }

  private handleIngredientEaten() {
    this.ingredientsEaten++;
    this.bodyLength++;
    soundManager.playMunch();

    const currentIng = this.activeIngredient;

    // Spawn burst particles at ingredient position
    this.spawnParticles(
      this.ingredientPos.x,
      this.ingredientPos.y,
      currentIng.color,
      currentIng.secondaryColor
    );

    // If honey, activate 10-second Honey Booster
    if (currentIng.id === 'honey') {
      this.shieldDuration = 10.0;
      soundManager.playShield();
      this.addFloatingText('🍯 HONEY BOOSTER! (10s)', this.ingredientPos.x, this.ingredientPos.y, '#DF9C25');
      this.onHoneyPowerUpCallback?.();
    } else {
      this.addFloatingText(`+ ${currentIng.name}`, this.ingredientPos.x, this.ingredientPos.y, currentIng.color);
    }

    // Advance recipe progress
    this.recipeIndex++;

    if (this.recipeIndex >= 6) {
      // Completed full Morgen Mete recipe!
      this.bowlsCompleted++;
      this.score += 100;
      soundManager.playRecipeComplete();

      this.addFloatingText('RECIPE COMPLETE! +100', this.ingredientPos.x, this.ingredientPos.y - 1, '#CCD52E');

      if (this.onRecipeCompleteCallback) {
        this.onRecipeCompleteCallback(this.bowlsCompleted);
      }

      this.speed = Math.min(8.5, this.speed + 0.35);

      this.recipeOrder = [0, 1, 2, 3, 4, 5];
      this.recipeIndex = 0;
    }

    this.activeIngredient = INGREDIENTS[this.recipeOrder[this.recipeIndex]];
    this.spawnNextIngredient();
  }

  private gameOver() {
    this.isGameOver = true;
    soundManager.playGameOver();
    if (this.onGameOverCallback) {
      this.onGameOverCallback(this.score, this.bowlsCompleted, this.ingredientsEaten);
    }
  }

  private spawnParticles(gridX: number, gridY: number, color1: string, color2: string) {
    const px = (gridX + 0.5) * this.cellSize;
    const py = (gridY + 0.5) * this.cellSize;
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 1.2;
      this.particles.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() > 0.4 ? color1 : color2,
        radius: Math.random() * 3.5 + 2,
        alpha: 1,
        life: 0,
        maxLife: Math.floor(Math.random() * 25 + 20),
      });
    }
  }

  private addFloatingText(text: string, gridX: number, gridY: number, color: string) {
    this.floatingTexts.push({
      id: ++this.textCounter,
      text,
      x: (gridX + 0.5) * this.cellSize,
      y: gridY * this.cellSize,
      alpha: 1,
      vy: -1.2,
      color,
    });
  }

  public getState(): GameEngineState {
    return {
      score: this.score,
      bowlsCompleted: this.bowlsCompleted,
      ingredientsEaten: this.ingredientsEaten,
      recipeOrder: this.recipeOrder,
      recipeIndex: this.recipeIndex,
      activeIngredient: this.activeIngredient,
      ingredientPos: this.ingredientPos,
      snake: this.snake,
      prevSnake: this.prevSnake,
      direction: this.direction,
      nextDirection: this.nextDirection,
      isGameOver: this.isGameOver,
      isPaused: this.isPaused,
      shieldTimeRemaining: this.shieldDuration,
      speedMultiplier: +(this.baseTickInterval / this.tickInterval).toFixed(2),
    };
  }
}
