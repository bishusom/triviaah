export type EnneagramType = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type EnneagramQuestion = {
  id: string;
  text: string;
  types: EnneagramType[]; // Which types this question measures
  weight: number; // Weight for each type (1-3)
  category: string;
};

export type EnneagramScores = {
  '1': number; // Reformer
  '2': number; // Helper
  '3': number; // Achiever
  '4': number; // Individualist
  '5': number; // Investigator
  '6': number; // Loyalist
  '7': number; // Enthusiast
  '8': number; // Challenger
  '9': number; // Peacemaker
};

export type EnneagramWing = {
  primary: EnneagramType;
  wing: 'left' | 'right' | null;
  leftType: EnneagramType;
  rightType: EnneagramType;
  leftScore: number;
  rightScore: number;
};

export type EnneagramTriad = {
  center: 'head' | 'heart' | 'body' | null;
  headTypes: EnneagramType[];
  heartTypes: EnneagramType[];
  bodyTypes: EnneagramType[];
  headScore: number;
  heartScore: number;
  bodyScore: number;
};

export type EnneagramResult = {
  primaryType: EnneagramType;
  wing: EnneagramWing;
  triad: EnneagramTriad;
  scores: EnneagramScores;
  percentiles: EnneagramScores;
  typeData: {
    name: string;
    description: string;
    coreFear: string;
    coreDesire: string;
    basicProposition: string;
    strengths: string[];
    weaknesses: string[];
    growthPath: string[];
    stressPath: string[];
    famousExamples: string[];
    careers: string[];
    color: string;
  };
  wingDescription: string;
  overallDescription: string;
  integrationLevel: 'healthy' | 'average' | 'unhealthy';
  integrationDescription: string;
  color: string;
};

export type UserEnneagramAnswer = {
  questionId: string;
  answer: number; // -3 to 3
  types: EnneagramType[];
  weight: number;
};