export type MBTIDimension = {
  type: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  name: string;
  description: string;
  color: string;
};

export type MBTIQuestion = {
  id: string;
  text: string;
  dimension: keyof MBTIScore; // 'EI' | 'SN' | 'TF' | 'JP'
  reverse: boolean; // Whether the scoring should be reversed
};

export type MBTIResult = {
  type: string; // e.g., "INFP", "ESTJ"
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
  famousPeople: string[];
  color: string;
  percentage: number; // How common this type is
};

export type MBTIScore = {
  EI: number; // -30 to 30 (negative = I, positive = E)
  SN: number; // -30 to 30 (negative = S, positive = N)
  TF: number; // -30 to 30 (negative = T, positive = F)
  JP: number; // -30 to 30 (negative = J, positive = P)
};

export type UserAnswer = {
  questionId: string;
  answer: number; // -3 to 3 (Strongly Disagree to Strongly Agree)
  dimension: keyof MBTIScore;
};