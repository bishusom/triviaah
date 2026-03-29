// types/home.ts
export interface ReadonlyQuizItem {
  readonly category: string;
  readonly name: string;
  readonly path: string;
  readonly image: string;
  readonly tagline: string;
  readonly playCount: number;
  readonly isNew: boolean;
  readonly duration: string;
  readonly difficulty: string;
  readonly keywords: string;
}

export interface ReadonlySectionItem {
  readonly category: string;
  readonly name: string;
  readonly image: string;
  readonly tagline: string;
  readonly keywords: string;
  readonly path?: string; // Make path optional for section items
  readonly playCount?: number; // Optional for section items
  readonly isNew?: boolean; // Optional for section items
  readonly duration?: string; // Optional for section items
  readonly difficulty?: string; // Optional for section items
}

export type ReadonlyQuizItems = ReadonlyArray<ReadonlyQuizItem>;
export type ReadonlySectionItems = ReadonlyArray<ReadonlySectionItem>;