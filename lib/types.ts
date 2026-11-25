export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export interface Ingredient {
  id: string;
  name: string;
  color: string;
  secondaryColor: string;
  emoji: string;
  description: string;
  healthBenefit: string;
  points: number; // For informational/flavor purposes; main score is per recipe
}

export interface RecipeState {
  order: number[]; // Indices of ingredients in current recipe (shuffled 0..5)
  currentIndex: number; // Current target index in the recipe (0..5)
  completedCount: number; // Number of completed Morgen Mete bowls
  collectedThisRecipe: number[]; // Indices collected so far in current recipe
}

export interface GameStats {
  score: number;
  bowlsCompleted: number;
  ingredientsEaten: number;
  highestBowls: number;
  highScore: number;
  timePlayed: number; // in seconds
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  bowls: number;
  date: string;
  badge?: string;
}

export interface RewardPrize {
  id: string;
  label: string;
  code: string;
  description: string;
  color: string;
  probability: number;
}
