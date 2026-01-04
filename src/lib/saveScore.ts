// lib/saveScore.ts
export async function saveScore(payload: {
  name: string;
  score: number;
  category: string;
}) {
  await fetch('/api/highscores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}