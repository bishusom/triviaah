// matrixiq-types-fixed.ts
export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type PatternType = 'shape' | 'rotation' | 'size' | 'color' | 'quantity' | 'combined';

export interface CellPattern {
  shape: string;
  color: string;
  rotation: number;
  size: number;
  quantity: number;
}

export interface MatrixQuestion {
  id: string;
  difficulty: Difficulty;
  patternType: PatternType;
  points: number;
  // Instead of storing the correct answer index, we'll generate it dynamically
  // but include it here for compatibility
  correctAnswer?: number; // Made optional
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: number; // Index of selected option
  isCorrect: boolean;
  timeTaken: number;
  skipped: boolean;
}

export interface TestScore {
  rawScore: number;
  maxScore: number;
  percentile: number;
  iqEstimate: number;
  accuracyRate: number;
  avgResponseTime: number;
}

export interface QuestionData {
  matrix: (CellPattern | null)[]; // 9 cells, last is null for missing
  correctAnswer: CellPattern;
  options: CellPattern[]; // 6 options
  correctIndex: number; // Index of correct answer in options array
}