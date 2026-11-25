import { NextResponse } from 'next/server';
import { LeaderboardEntry } from '@/lib/types';

// In-memory initial high scores
let mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', name: 'MuesliMaster', score: 600, bowls: 6, date: 'Today' },
  { id: '2', name: 'SeedSlither', score: 500, bowls: 5, date: 'Today' },
  { id: '3', name: 'CrunchQueen', score: 400, bowls: 4, date: 'Yesterday' },
  { id: '4', name: 'OatChamp', score: 300, bowls: 3, date: '2 days ago' },
  { id: '5', name: 'HealthySnacker', score: 200, bowls: 2, date: '3 days ago' },
];

export async function GET() {
  return NextResponse.json(mockLeaderboard);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, score, bowls } = body;

    if (!name || typeof score !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name: name.slice(0, 15),
      score,
      bowls: bowls || 0,
      date: 'Just now',
    };

    mockLeaderboard.push(newEntry);
    mockLeaderboard.sort((a, b) => b.score - a.score || b.bowls - a.bowls);
    mockLeaderboard = mockLeaderboard.slice(0, 20); // Keep top 20

    return NextResponse.json({ success: true, leaderboard: mockLeaderboard });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}
