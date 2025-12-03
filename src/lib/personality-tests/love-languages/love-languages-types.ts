export type LoveLanguageType = 'WA' | 'AS' | 'RG' | 'QT' | 'PT';

export type LoveLanguageQuestion = {
  id: string;
  text: string;
  language: LoveLanguageType;
  reverse: boolean;
  category: string;
};

export type LoveLanguageScores = {
  WA: number; // Words of Affirmation: 0-100
  AS: number; // Acts of Service: 0-100
  RG: number; // Receiving Gifts: 0-100
  QT: number; // Quality Time: 0-100
  PT: number; // Physical Touch: 0-100
};

export type LoveLanguageProfile = {
  primary: LoveLanguageType;
  secondary: LoveLanguageType | null;
  tertiary: LoveLanguageType | null;
  fourth: LoveLanguageType | null;
  fifth: LoveLanguageType;
};

export type LoveLanguageResult = {
  scores: LoveLanguageScores;
  profile: LoveLanguageProfile;
  descriptions: {
    WA: string;
    AS: string;
    RG: string;
    QT: string;
    PT: string;
  };
  expressions: {
    WA: string[];
    AS: string[];
    RG: string[];
    QT: string[];
    PT: string[];
  };
  needs: {
    WA: string[];
    AS: string[];
    RG: string[];
    QT: string[];
    PT: string[];
  };
  communicationTips: {
    WA: string[];
    AS: string[];
    RG: string[];
    QT: string[];
    PT: string[];
  };
  partnerTips: {
    WA: string[];
    AS: string[];
    RG: string[];
    QT: string[];
    PT: string[];
  };
  commonMisunderstandings: {
    WA: string[];
    AS: string[];
    RG: string[];
    QT: string[];
    PT: string[];
  };
  overallStyle: string;
  overallDescription: string;
  color: string;
  profileName: string;
};

export type UserLoveLanguageAnswer = {
  questionId: string;
  answer: number; // 1 to 5
  language: LoveLanguageType;
};