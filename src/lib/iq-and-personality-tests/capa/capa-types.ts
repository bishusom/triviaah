// Cognitive Abilities Profile Assessment Types
export type CAPADomain = 'verbal' | 'numerical' | 'spatial' | 'memory' | 'reasoning' | 'processing';
export type CAPAQuestionType = 'analogy' | 'pattern' | 'sequence' | 'rotation' | 'memory' | 'calculation' | 'logic' | 'speed';

export interface CAPAQuestion {
  id: string;
  domain: CAPADomain;
  type: CAPAQuestionType;
  text: string;
  instruction?: string;
  options?: string[];
  correctIndex?: number; // For multiple choice questions
  correctAnswer?: string | number | string[]; // For text/number/sequence questions
  answerType: 'multiple_choice' | 'text' | 'number' | 'sequence';
  points: number;
  timeLimit?: number; // in seconds
  difficulty: number; // 1-5
  imageUrl?: string; // for spatial/pattern questions
}

export interface CAPAScore {
  verbal: number;
  numerical: number;
  spatial: number;
  memory: number;
  reasoning: number;
  processing: number;
  rawTotal: number;
  percentile: number;
  cognitiveProfile: string;
  confidenceBand: [number, number];
  testDuration: number; // in minutes
}

export interface CAPAResult {
  profileType: string;
  name: string;
  description: string;
  cognitiveStrengths: string[];
  cognitiveChallenges: string[];
  learningStyles: string[];
  careerSuggestions: string[];
  famousSimilarProfiles: string[];
  percentile: number;
  color: string;
  brainAreas: string[]; // Which brain areas this profile typically excels in
  thinkingStyle: string;
}

export interface UserAnswer {
  questionId: string;
  answer: string | number | string[];
  timeTaken: number; // in seconds
  isCorrect: boolean;
  confidence?: number; // 1-5 scale
  skipped: boolean;
}

export interface TestSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  answers: UserAnswer[];
  domainScores: Partial<Record<CAPADomain, number>>;
  completed: boolean;
  userId?: string;
  deviceInfo?: string;
}