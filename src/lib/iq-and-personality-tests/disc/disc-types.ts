export type DISCType = 'D' | 'I' | 'S' | 'C';

export type DISCQuestion = {
  id: string;
  text: string;
  dimension: DISCType;
  reverse: boolean;
  category: string;
};

export type DISCScores = {
  D: number; // Dominance: 0-100
  I: number; // Influence: 0-100
  S: number; // Steadiness: 0-100
  C: number; // Conscientiousness: 0-100
};

export type DISCProfile = {
  primary: DISCType;
  secondary: DISCType | null;
  tertiary: DISCType | null;
  least: DISCType;
};

export type DISCBehavior = {
  natural: DISCScores; // Your natural style
  adapted: DISCScores; // Your adapted/work style
  gap: DISCScores; // Difference between natural and adapted
};

export type DISCResult = {
  scores: DISCScores;
  profile: DISCProfile;
  behavior: DISCBehavior;
  percentiles: DISCScores;
  descriptions: {
    D: string;
    I: string;
    S: string;
    C: string;
  };
  strengths: {
    D: string[];
    I: string[];
    S: string[];
    C: string[];
  };
  weaknesses: {
    D: string[];
    I: string[];
    S: string[];
    C: string[];
  };
  communicationTips: {
    D: string[];
    I: string[];
    S: string[];
    C: string[];
  };
  idealEnvironment: {
    D: string[];
    I: string[];
    S: string[];
    C: string[];
  };
  stressBehaviors: {
    D: string[];
    I: string[];
    S: string[];
    C: string[];
  };
  overallStyle: string;
  overallDescription: string;
  color: string;
  profileName: string; // e.g., "Driver", "Influencer", etc.
};

export type UserDISCAnswer = {
  questionId: string;
  answer: number; // -3 to 3
  dimension: DISCType;
  isWorkStyle?: boolean; // false = natural, true = adapted
};