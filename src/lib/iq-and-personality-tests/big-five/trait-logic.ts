import { TraitDimension, TraitQuestion, TraitScore, TraitPercentiles, TraitResult } from './trait-types';

// Big Five (OCEAN) Personality Test Questions
export const traitQuestions: TraitQuestion[] = [
  // === Openness (O) - 12 questions ===
  { id: 'O1', text: 'I have a vivid imagination', dimension: 'O', reverse: false, category: 'Imagination' },
  { id: 'O2', text: 'I prefer routine over variety', dimension: 'O', reverse: true, category: 'Routine' },
  { id: 'O3', text: 'I enjoy solving complex problems', dimension: 'O', reverse: false, category: 'Complexity' },
  { id: 'O4', text: 'I appreciate art and beauty', dimension: 'O', reverse: false, category: 'Aesthetics' },
  { id: 'O5', text: 'I am curious about many things', dimension: 'O', reverse: false, category: 'Curiosity' },
  { id: 'O6', text: 'I am open to trying new experiences', dimension: 'O', reverse: false, category: 'Adventure' },
  { id: 'O7', text: 'I value traditional ways of doing things', dimension: 'O', reverse: true, category: 'Tradition' },
  { id: 'O8', text: 'I enjoy philosophical discussions', dimension: 'O', reverse: false, category: 'Philosophy' },
  { id: 'O9', text: 'I like to think in abstract terms', dimension: 'O', reverse: false, category: 'Abstract' },
  { id: 'O10', text: 'I am creative and original', dimension: 'O', reverse: false, category: 'Creativity' },
  { id: 'O11', text: 'I prefer practical solutions over innovative ones', dimension: 'O', reverse: true, category: 'Practicality' },
  { id: 'O12', text: 'I enjoy learning new things', dimension: 'O', reverse: false, category: 'Learning' },

  // === Conscientiousness (C) - 12 questions ===
  { id: 'C1', text: 'I am always prepared', dimension: 'C', reverse: false, category: 'Preparation' },
  { id: 'C2', text: 'I pay attention to details', dimension: 'C', reverse: false, category: 'Detail' },
  { id: 'C3', text: 'I get chores done right away', dimension: 'C', reverse: false, category: 'Procrastination' },
  { id: 'C4', text: 'I follow a schedule', dimension: 'C', reverse: false, category: 'Organization' },
  { id: 'C5', text: 'I am exacting in my work', dimension: 'C', reverse: false, category: 'Perfectionism' },
  { id: 'C6', text: 'I like order and regularity', dimension: 'C', reverse: false, category: 'Order' },
  { id: 'C7', text: 'I often forget to put things back', dimension: 'C', reverse: true, category: 'Forgetfulness' },
  { id: 'C8', text: 'I make plans and stick to them', dimension: 'C', reverse: false, category: 'Planning' },
  { id: 'C9', text: 'I am reliable and dependable', dimension: 'C', reverse: false, category: 'Reliability' },
  { id: 'C10', text: 'I complete tasks successfully', dimension: 'C', reverse: false, category: 'Completion' },
  { id: 'C11', text: 'I avoid difficult tasks', dimension: 'C', reverse: true, category: 'Avoidance' },
  { id: 'C12', text: 'I work hard to achieve my goals', dimension: 'C', reverse: false, category: 'Ambition' },

  // === Extraversion (E) - 12 questions ===
  { id: 'E1', text: 'I am the life of the party', dimension: 'E', reverse: false, category: 'Social' },
  { id: 'E2', text: 'I talk to many people at parties', dimension: 'E', reverse: false, category: 'Communication' },
  { id: 'E3', text: 'I feel comfortable around people', dimension: 'E', reverse: false, category: 'Comfort' },
  { id: 'E4', text: 'I start conversations', dimension: 'E', reverse: false, category: 'Initiative' },
  { id: 'E5', text: 'I am quiet around strangers', dimension: 'E', reverse: true, category: 'Reserve' },
  { id: 'E6', text: 'I have a lot of energy in social situations', dimension: 'E', reverse: false, category: 'Energy' },
  { id: 'E7', text: 'I prefer to be alone', dimension: 'E', reverse: true, category: 'Solitude' },
  { id: 'E8', text: 'I enjoy being the center of attention', dimension: 'E', reverse: false, category: 'Attention' },
  { id: 'E9', text: 'I express myself easily', dimension: 'E', reverse: false, category: 'Expression' },
  { id: 'E10', text: 'I find social situations draining', dimension: 'E', reverse: true, category: 'Drain' },
  { id: 'E11', text: 'I like to take charge in groups', dimension: 'E', reverse: false, category: 'Leadership' },
  { id: 'E12', text: 'I am enthusiastic and lively', dimension: 'E', reverse: false, category: 'Enthusiasm' },

  // === Agreeableness (A) - 12 questions ===
  { id: 'A1', text: 'I am interested in people', dimension: 'A', reverse: false, category: 'Interest' },
  { id: 'A2', text: 'I sympathize with others\' feelings', dimension: 'A', reverse: false, category: 'Empathy' },
  { id: 'A3', text: 'I take time out for others', dimension: 'A', reverse: false, category: 'Generosity' },
  { id: 'A4', text: 'I feel others\' emotions', dimension: 'A', reverse: false, category: 'Emotion' },
  { id: 'A5', text: 'I make people feel at ease', dimension: 'A', reverse: false, category: 'Comfort' },
  { id: 'A6', text: 'I am not really interested in others', dimension: 'A', reverse: true, category: 'Indifference' },
  { id: 'A7', text: 'I insult people', dimension: 'A', reverse: true, category: 'Insult' },
  { id: 'A8', text: 'I am kind to almost everyone', dimension: 'A', reverse: false, category: 'Kindness' },
  { id: 'A9', text: 'I like to cooperate with others', dimension: 'A', reverse: false, category: 'Cooperation' },
  { id: 'A10', text: 'I believe people have good intentions', dimension: 'A', reverse: false, category: 'Trust' },
  { id: 'A11', text: 'I respect authority', dimension: 'A', reverse: false, category: 'Respect' },
  { id: 'A12', text: 'I avoid conflicts and arguments', dimension: 'A', reverse: false, category: 'Harmony' },

  // === Neuroticism (N) - 12 questions ===
  { id: 'N1', text: 'I get stressed out easily', dimension: 'N', reverse: false, category: 'Stress' },
  { id: 'N2', text: 'I am relaxed most of the time', dimension: 'N', reverse: true, category: 'Relaxation' },
  { id: 'N3', text: 'I worry about things', dimension: 'N', reverse: false, category: 'Worry' },
  { id: 'N4', text: 'I seldom feel blue', dimension: 'N', reverse: true, category: 'Mood' },
  { id: 'N5', text: 'I am easily disturbed', dimension: 'N', reverse: false, category: 'Disturbance' },
  { id: 'N6', text: 'I get upset easily', dimension: 'N', reverse: false, category: 'Upset' },
  { id: 'N7', text: 'I change my mood frequently', dimension: 'N', reverse: false, category: 'Mood Swings' },
  { id: 'N8', text: 'I have frequent mood swings', dimension: 'N', reverse: false, category: 'Emotional' },
  { id: 'N9', text: 'I get irritated easily', dimension: 'N', reverse: false, category: 'Irritation' },
  { id: 'N10', text: 'I often feel sad', dimension: 'N', reverse: false, category: 'Sadness' },
  { id: 'N11', text: 'I feel insecure about myself', dimension: 'N', reverse: false, category: 'Insecurity' },
  { id: 'N12', text: 'I panic easily in difficult situations', dimension: 'N', reverse: false, category: 'Panic' },
];

export const calculateTraitScores = (answers: { questionId: string; answer: number; dimension: TraitDimension }[]): TraitScore => {
  const score: TraitScore = { O: 0, C: 0, E: 0, A: 0, N: 0 };
  
  answers.forEach(answer => {
    const question = traitQuestions.find(q => q.id === answer.questionId);
    let adjustedAnswer = answer.answer;
    if (question?.reverse) {
      adjustedAnswer = -answer.answer;
    }
    score[answer.dimension] += adjustedAnswer;
  });

  return score;
};

export const calculatePercentiles = (score: TraitScore): TraitPercentiles => {
  // Convert from -30 to 30 range to 0-100 percentile
  const toPercentile = (value: number) => Math.round(((value + 30) / 60) * 100);
  
  return {
    O: toPercentile(score.O),
    C: toPercentile(score.C),
    E: toPercentile(score.E),
    A: toPercentile(score.A),
    N: toPercentile(score.N)
  };
};

export const getTraitResult = (score: TraitScore): TraitResult => {
  const percentiles = calculatePercentiles(score);
  
  // Determine overall personality type based on scores
  const getOverallType = (): string => {
    const types = [];
    
    // Openness
    if (percentiles.O >= 70) types.push('Open');
    else if (percentiles.O <= 30) types.push('Conventional');
    
    // Conscientiousness
    if (percentiles.C >= 70) types.push('Organized');
    else if (percentiles.C <= 30) types.push('Spontaneous');
    
    // Extraversion
    if (percentiles.E >= 70) types.push('Extraverted');
    else if (percentiles.E <= 30) types.push('Introverted');
    
    // Agreeableness
    if (percentiles.A >= 70) types.push('Agreeable');
    else if (percentiles.A <= 30) types.push('Assertive');
    
    // Neuroticism
    if (percentiles.N >= 70) types.push('Sensitive');
    else if (percentiles.N <= 30) types.push('Resilient');
    
    return types.join(' • ') || 'Balanced';
  };

  const getInterpretation = (dimension: TraitDimension, percentile: number): string => {
    if (percentile >= 70) return 'High';
    if (percentile >= 30) return 'Average';
    return 'Low';
  };

  const getDescription = (dimension: TraitDimension, percentile: number): string => {
    const descriptions = {
      O: {
        high: 'You are highly open to new experiences, curious, creative, and imaginative. You enjoy exploring new ideas and concepts.',
        medium: 'You have a balanced approach to new experiences, being both practical and open-minded when appropriate.',
        low: 'You prefer familiarity, tradition, and practical matters. You are grounded and consistent in your approach.'
      },
      C: {
        high: 'You are highly organized, reliable, disciplined, and goal-oriented. You pay attention to details and follow through on commitments.',
        medium: 'You balance responsibility with flexibility, being organized when needed but also adaptable.',
        low: 'You are spontaneous, flexible, and adaptable. You prefer to go with the flow rather than sticking to strict plans.'
      },
      E: {
        high: 'You are outgoing, energetic, and sociable. You gain energy from interacting with others and enjoy being the center of attention.',
        medium: 'You balance social interaction with alone time, adapting to different social situations as needed.',
        low: 'You are reserved, reflective, and prefer solitary activities. You recharge through alone time and deep conversations.'
      },
      A: {
        high: 'You are compassionate, cooperative, and trusting. You prioritize harmony and are considerate of others\' feelings.',
        medium: 'You balance cooperation with assertiveness, being kind but also standing up for yourself when needed.',
        low: 'You are competitive, skeptical, and direct. You prioritize honesty and efficiency over harmony.'
      },
      N: {
        high: 'You experience emotions intensely and may be sensitive to stress. You are emotionally aware and responsive.',
        medium: 'You have a balanced emotional response, experiencing emotions without being overwhelmed by them.',
        low: 'You are emotionally stable, calm, and resilient. You handle stress well and maintain composure under pressure.'
      }
    };

    const level = getInterpretation(dimension, percentile).toLowerCase() as 'high' | 'medium' | 'low';
    return descriptions[dimension][level];
  };

  const overallType = getOverallType();
  const overallDescription = getOverallDescription(overallType, percentiles);
  
  return {
    scores: score,
    percentiles,
    descriptions: {
      O: getDescription('O', percentiles.O),
      C: getDescription('C', percentiles.C),
      E: getDescription('E', percentiles.E),
      A: getDescription('A', percentiles.A),
      N: getDescription('N', percentiles.N)
    },
    interpretations: {
      O: { 
        low: 'Practical, Conventional', 
        medium: 'Balanced, Open-minded', 
        high: 'Creative, Imaginative' 
      },
      C: { 
        low: 'Spontaneous, Flexible', 
        medium: 'Organized but Adaptable', 
        high: 'Disciplined, Reliable' 
      },
      E: { 
        low: 'Reserved, Reflective', 
        medium: 'Socially Balanced', 
        high: 'Outgoing, Energetic' 
      },
      A: { 
        low: 'Assertive, Direct', 
        medium: 'Cooperative but Firm', 
        high: 'Compassionate, Trusting' 
      },
      N: { 
        low: 'Calm, Resilient', 
        medium: 'Emotionally Balanced', 
        high: 'Sensitive, Emotional' 
      }
    },
    overallType,
    overallDescription,
    color: getColorForType(overallType)
  };
};

const getOverallDescription = (type: string, percentiles: TraitPercentiles): string => {
  if (type.includes('Open') && type.includes('Extraverted') && type.includes('Agreeable')) {
    return 'You are an innovative and sociable individual who enjoys exploring new ideas with others. Your open-mindedness combined with your social nature makes you an excellent collaborator and creative thinker.';
  } else if (type.includes('Conventional') && type.includes('Organized') && type.includes('Resilient')) {
    return 'You are a reliable and stable individual who values tradition and structure. Your practical approach and emotional stability make you dependable in both personal and professional settings.';
  } else if (type.includes('Introverted') && type.includes('Open') && type.includes('Resilient')) {
    return 'You are a thoughtful and creative individual who enjoys deep exploration of ideas in solitude. Your emotional stability allows you to pursue your interests with focus and determination.';
  } else if (type.includes('Extraverted') && type.includes('Assertive') && type.includes('Organized')) {
    return 'You are a natural leader who is both socially engaging and goal-oriented. Your combination of extraversion and organization makes you effective in leadership roles and team settings.';
  }
  
  return 'Your personality shows a unique combination of traits that allows you to adapt to different situations effectively. You balance various aspects of your personality depending on the context.';
};

const getColorForType = (type: string): string => {
  if (type.includes('Open') && type.includes('Extraverted')) return 'bg-gradient-to-r from-purple-600 to-pink-600';
  if (type.includes('Organized') && type.includes('Resilient')) return 'bg-gradient-to-r from-blue-600 to-indigo-600';
  if (type.includes('Introverted') && type.includes('Open')) return 'bg-gradient-to-r from-teal-600 to-emerald-600';
  if (type.includes('Extraverted') && type.includes('Assertive')) return 'bg-gradient-to-r from-red-600 to-orange-600';
  return 'bg-gradient-to-r from-gray-600 to-slate-700';
};