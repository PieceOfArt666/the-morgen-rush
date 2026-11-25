import { Ingredient } from './types';

export const INGREDIENTS: Ingredient[] = [
  {
    id: 'pumpkin-seeds',
    name: 'Pumpkin Seeds',
    color: '#729343',
    secondaryColor: '#537831',
    emoji: '🌱',
    description: 'Crunchy zinc-rich green seeds for sustained daily energy.',
    healthBenefit: 'High in Zinc & Magnesium',
    points: 10,
  },
  {
    id: 'cranberry',
    name: 'Cranberry',
    color: '#B52D46',
    secondaryColor: '#8E1D33',
    emoji: '🔴',
    description: 'Tart, chewy crimson berries loaded with antioxidants.',
    healthBenefit: 'Antioxidant Powerhouse',
    points: 15,
  },
  {
    id: 'honey',
    name: 'Honey',
    color: '#DF9C25',
    secondaryColor: '#CF913C',
    emoji: '🍯',
    description: 'Luscious golden sweetness that grants temporary shield invulnerability!',
    healthBenefit: 'Natural Immunity & Shield Power-Up',
    points: 25,
  },
  {
    id: 'blackcurrant',
    name: 'Blackcurrant',
    color: '#44204F',
    secondaryColor: '#2C1333',
    emoji: '🫐',
    description: 'Rich dark purple European berries bursting with Vitamin C.',
    healthBenefit: 'Immune Boosting Vitamin C',
    points: 20,
  },
  {
    id: 'wheat-flakes',
    name: 'Wheat Flakes',
    color: '#C68D34',
    secondaryColor: '#A46E20',
    emoji: '🌾',
    description: 'Toasted whole wheat golden flakes providing satisfying morning crunch.',
    healthBenefit: 'Fiber for Healthy Digestion',
    points: 10,
  },
  {
    id: 'rolled-oats',
    name: 'Rolled Oats',
    color: '#D0BB8C',
    secondaryColor: '#B69E6E',
    emoji: '🥣',
    description: 'Hearty whole-grain oats forming the wholesome base of Morgen Mete.',
    healthBenefit: 'Slow-Release Wholesome Carbs',
    points: 10,
  },
];

// Fisher-Yates shuffle to generate a unique random order of 0..5
export function generateRandomRecipeOrder(): number[] {
  const array = [0, 1, 2, 3, 4, 5];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
