export type HollandType = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export type HollandQuestion = {
  id: string;
  text: string;
  type: HollandType;
  reverse: boolean;
  category: string;
};

export type HollandScores = {
  R: number; // Realistic: 0-100
  I: number; // Investigative: 0-100
  A: number; // Artistic: 0-100
  S: number; // Social: 0-100
  E: number; // Enterprising: 0-100
  C: number; // Conventional: 0-100
};

export type HollandProfile = {
  primary: HollandType;
  secondary: HollandType | null;
  tertiary: HollandType | null;
  fourth: HollandType | null;
  fifth: HollandType | null;
  sixth: HollandType;
};

export type HollandCareer = {
  title: string;
  description: string;
  medianSalary: string;
  growth: string;
  education: string;
  skills: string[];
};

export type HollandResult = {
  scores: HollandScores;
  profile: HollandProfile;
  descriptions: {
    R: string;
    I: string;
    A: string;
    S: string;
    E: string;
    C: string;
  };
  characteristics: {
    R: string[];
    I: string[];
    A: string[];
    S: string[];
    E: string[];
    C: string[];
  };
  workActivities: {
    R: string[];
    I: string[];
    A: string[];
    S: string[];
    E: string[];
    C: string[];
  };
  workEnvironment: {
    R: string[];
    I: string[];
    A: string[];
    S: string[];
    E: string[];
    C: string[];
  };
  suggestedCareers: {
    R: HollandCareer[];
    I: HollandCareer[];
    A: HollandCareer[];
    S: HollandCareer[];
    E: HollandCareer[];
    C: HollandCareer[];
  };
  compatibleTypes: string[];
  developmentAreas: string[];
  careerAdvice: string[];
  overallStyle: string;
  overallDescription: string;
  color: string;
  profileName: string;
  hollandCode: string;
};

export type UserHollandAnswer = {
  questionId: string;
  answer: number; // 1 to 5
  type: HollandType;
};