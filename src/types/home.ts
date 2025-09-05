// types/home.ts
export interface QuizItem {
  category: string;
  name: string;
  path: string;
  image: string;
  tagline: string;
  keywords: string;
}

export interface SectionItem {
  category: string;
  name: string;
  image: string;
  tagline: string;
  keywords: string;
}

export type ReadonlyQuizItem = Readonly<QuizItem>;
export type ReadonlyQuizItems = readonly ReadonlyQuizItem[];

export type ReadonlySectionItem = Readonly<SectionItem>;
export type ReadonlySectionItems = readonly ReadonlySectionItem[];