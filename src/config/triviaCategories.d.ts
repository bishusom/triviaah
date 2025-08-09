declare module '@/config/triviaCategories.json' {
  const value: {
    [key: string]: {
      title: string;
      description: string;
      keywords?: string[];
      ogImage?: string;
      related?: string[];
    };
  };
  export default value;
}