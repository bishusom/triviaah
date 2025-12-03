export type TraitDimension = 'O' | 'C' | 'E' | 'A' | 'N';

export type TraitQuestion = {
  id: string;
  text: string;
  dimension: TraitDimension;
  reverse: boolean;
  category: string;
};

export type TraitScore = {
  O: number; // Openness (raw score: -30 to 30)
  C: number; // Conscientiousness (raw score: -30 to 30)
  E: number; // Extraversion (raw score: -30 to 30)
  A: number; // Agreeableness (raw score: -30 to 30)
  N: number; // Neuroticism (raw score: -30 to 30)
};

export type TraitPercentiles = {
  O: number; // 0-100
  C: number;
  E: number;
  A: number;
  N: number;
};

export type TraitInterpretations = {
  O: { low: string; medium: string; high: string };
  C: { low: string; medium: string; high: string };
  E: { low: string; medium: string; high: string };
  A: { low: string; medium: string; high: string };
  N: { low: string; medium: string; high: string };
};

export type TraitResult = {
  scores: TraitScore;
  percentiles: TraitPercentiles;
  descriptions: {
    O: string;
    C: string;
    E: string;
    A: string;
    N: string;
  };
  interpretations: TraitInterpretations;
  overallType: string;
  overallDescription: string;
  color: string;
};

export type UserAnswer = {
  questionId: string;
  answer: number; // -3 to 3 (Strongly Disagree to Strongly Agree)
  dimension: TraitDimension;
};