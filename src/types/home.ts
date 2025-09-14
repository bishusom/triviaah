// types/home.ts
export interface ReadonlyQuizItem {
  readonly category: string;
  readonly name: string;
  readonly path: string;
  readonly image: string;
  readonly tagline: string;
  readonly keywords: string;
}

export interface ReadonlySectionItem {
  readonly category: string;
  readonly name: string;
  readonly image: string;
  readonly tagline: string;
  readonly keywords: string;
  readonly path?: string; // Make path optional for section items
}

export type ReadonlyQuizItems = ReadonlyArray<ReadonlyQuizItem>;
export type ReadonlySectionItems = ReadonlyArray<ReadonlySectionItem>;