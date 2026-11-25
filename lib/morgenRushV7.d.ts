export type IngredientId = 'pumpkin' | 'cranberry' | 'honey' | 'blackcurrant' | 'wheat' | 'oats';

export declare const INGREDIENTS: [IngredientId, string][];

export declare function shuffled(random?: () => number): IngredientId[];

export interface GameOptions {
  cols?: number;
  rows?: number;
  random?: () => number;
}

export declare function createGame(options?: GameOptions): any;

export declare function createTutorial(options?: GameOptions): any;

export declare function mountGame(
  root: HTMLElement,
  assetBase?: string,
  assets?: Record<string, string>
): () => void;
