declare module '@/config/triviaCategories.json' {
  const value: {
    [key: string]: {
      title: string;
      description: string;
      longDescription?: string;
      learningPoints?: string[];
      keywords?: string[];
      ogImage?: string;
      related?: string[];
      displayName?: string;
      showPrintableQuizCTA?: boolean;
    };
  };
  export default value;
}
