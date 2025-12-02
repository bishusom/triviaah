// lib/saveScore.ts
export async function saveScore(payload: {
  name: string;
  score: number;
  category: string;
  correct_answers: number;
  total_questions: number;
  time_used: number;
  difficulty?: string;
  subcategory?: string;
}) {
  const response = await fetch('/api/highscores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to save score: ${err}`);
  }

  return response.json();
}