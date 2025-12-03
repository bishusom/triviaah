import { 
  DISCType, 
  DISCQuestion, 
  DISCScores, 
  DISCResult,
  DISCProfile,
  DISCBehavior,
  UserDISCAnswer 
} from './disc-types';

// DISC Assessment Questions (28 questions total - 14 natural, 14 work style)
export const discQuestions: DISCQuestion[] = [
  // === Natural Style Questions ===
  // Dominance (D)
  { id: 'D1', text: 'I am decisive and direct in my approach', dimension: 'D', reverse: false, category: 'Decision Making' },
  { id: 'D2', text: 'I enjoy taking charge of situations', dimension: 'D', reverse: false, category: 'Leadership' },
  { id: 'D3', text: 'I prefer to work independently rather than in teams', dimension: 'D', reverse: true, category: 'Independence' },
  { id: 'D4', text: 'I am comfortable with confrontation when necessary', dimension: 'D', reverse: false, category: 'Conflict' },
  
  // Influence (I)
  { id: 'I1', text: 'I enjoy socializing and meeting new people', dimension: 'I', reverse: false, category: 'Sociability' },
  { id: 'I2', text: 'I am optimistic and enthusiastic', dimension: 'I', reverse: false, category: 'Optimism' },
  { id: 'I3', text: 'I express my emotions openly', dimension: 'I', reverse: false, category: 'Expression' },
  { id: 'I4', text: 'I prefer collaborative work environments', dimension: 'I', reverse: false, category: 'Collaboration' },
  
  // Steadiness (S)
  { id: 'S1', text: 'I value stability and consistency', dimension: 'S', reverse: false, category: 'Stability' },
  { id: 'S2', text: 'I am patient and calm under pressure', dimension: 'S', reverse: false, category: 'Patience' },
  { id: 'S3', text: 'I prefer gradual change over sudden disruptions', dimension: 'S', reverse: false, category: 'Change' },
  { id: 'S4', text: 'I am a good listener', dimension: 'S', reverse: false, category: 'Listening' },
  
  // Conscientiousness (C)
  { id: 'C1', text: 'I pay attention to details and accuracy', dimension: 'C', reverse: false, category: 'Detail' },
  { id: 'C2', text: 'I follow rules and procedures carefully', dimension: 'C', reverse: false, category: 'Procedure' },
  { id: 'C3', text: 'I prefer structure and organization', dimension: 'C', reverse: false, category: 'Structure' },
  { id: 'C4', text: 'I am analytical in my approach to problems', dimension: 'C', reverse: false, category: 'Analysis' },
  
  // === Work Style Questions ===
  // Dominance (D) - Work
  { id: 'WD1', text: 'At work, I push for quick results', dimension: 'D', reverse: false, category: 'Work Results' },
  { id: 'WD2', text: 'In the workplace, I challenge the status quo', dimension: 'D', reverse: false, category: 'Work Innovation' },
  
  // Influence (I) - Work
  { id: 'WI1', text: 'At work, I build networks and relationships', dimension: 'I', reverse: false, category: 'Work Networking' },
  { id: 'WI2', text: 'In the workplace, I motivate and inspire others', dimension: 'I', reverse: false, category: 'Work Motivation' },
  
  // Steadiness (S) - Work
  { id: 'WS1', text: 'At work, I maintain harmony in the team', dimension: 'S', reverse: false, category: 'Work Harmony' },
  { id: 'WS2', text: 'In the workplace, I provide consistent support', dimension: 'S', reverse: false, category: 'Work Support' },
  
  // Conscientiousness (C) - Work
  { id: 'WC1', text: 'At work, I ensure quality and precision', dimension: 'C', reverse: false, category: 'Work Quality' },
  { id: 'WC2', text: 'In the workplace, I follow established processes', dimension: 'C', reverse: false, category: 'Work Process' },
  
  // Additional questions for balanced assessment
  { id: 'B1', text: 'I adapt my style to different situations', dimension: 'S', reverse: false, category: 'Adaptability' },
  { id: 'B2', text: 'I enjoy taking calculated risks', dimension: 'D', reverse: false, category: 'Risk' },
  { id: 'B3', text: 'I value creative thinking and new ideas', dimension: 'I', reverse: false, category: 'Creativity' },
  { id: 'B4', text: 'I base decisions on data and facts', dimension: 'C', reverse: false, category: 'Data' },
];

export const calculateDISCScores = (answers: { questionId: string; answer: number; dimension: DISCType }[]): DISCScores => {
  const scores: DISCScores = { D: 0, I: 0, S: 0, C: 0 };
  
  answers.forEach(answer => {
    const question = discQuestions.find(q => q.id === answer.questionId);
    let adjustedAnswer = answer.answer;
    if (question?.reverse) {
      adjustedAnswer = -answer.answer;
    }
    // Convert from -3 to 3 to 0 to 6 for positive scoring
    const positiveAnswer = adjustedAnswer + 3; // Now 0 to 6
    scores[answer.dimension] += positiveAnswer;
  });

  // Normalize scores to 0-100 range
  const maxPossibleScore = answers.filter(a => a.dimension === 'D').length * 6;
  if (maxPossibleScore > 0) {
    (Object.keys(scores) as DISCType[]).forEach(type => {
      const typeAnswers = answers.filter(a => a.dimension === type).length;
      const maxScoreForType = typeAnswers * 6;
      if (maxScoreForType > 0) {
        scores[type] = Math.round((scores[type] / maxScoreForType) * 100);
      }
    });
  }

  return scores;
};

export const calculateNaturalAndAdaptedScores = (answers: UserDISCAnswer[]): DISCBehavior => {
  const naturalAnswers = answers.filter(a => !a.isWorkStyle);
  const adaptedAnswers = answers.filter(a => a.isWorkStyle);
  
  const naturalScores = calculateDISCScores(naturalAnswers);
  const adaptedScores = calculateDISCScores(adaptedAnswers);
  
  const gap: DISCScores = { D: 0, I: 0, S: 0, C: 0 };
  (Object.keys(gap) as DISCType[]).forEach(type => {
    gap[type] = adaptedScores[type] - naturalScores[type];
  });

  return {
    natural: naturalScores,
    adapted: adaptedScores,
    gap
  };
};

export const determineDISCProfile = (scores: DISCScores): DISCProfile => {
  const scoreEntries = Object.entries(scores) as [DISCType, number][];
  
  // Sort by score descending
  const sorted = [...scoreEntries].sort((a, b) => b[1] - a[1]);
  
  const primary = sorted[0][0];
  const secondary = sorted[1][1] > 60 ? sorted[1][0] : null;
  const tertiary = sorted[2][1] > 50 ? sorted[2][0] : null;
  const least = sorted[3][0];

  return {
    primary,
    secondary,
    tertiary,
    least
  };
};

export const getProfileName = (profile: DISCProfile): string => {
  const { primary, secondary } = profile;
  
  const profileNames: Record<string, string> = {
    'D': 'Driver',
    'I': 'Influencer',
    'S': 'Supporter',
    'C': 'Conscientious',
    'DI': 'Achiever',
    'ID': 'Persuader',
    'DS': 'Challenger',
    'SD': 'Stabilizer',
    'DC': 'Analytical Driver',
    'CD': 'Precise Driver',
    'IS': 'Inspiring Supporter',
    'SI': 'Supportive Influencer',
    'IC': 'Creative Analyst',
    'CI': 'Analytical Influencer',
    'SC': 'Systematic Supporter',
    'CS': 'Supportive Analyst'
  };

  const key = secondary ? `${primary}${secondary}` : primary;
  return profileNames[key] || `${primary} Dominant`;
};

export const getTypeDescriptions = (): Record<DISCType, string> => ({
  D: 'Direct, decisive, and results-oriented. Dominance types are competitive, ambitious, and focused on achieving goals. They prefer to take charge and make things happen.',
  I: 'Outgoing, enthusiastic, and people-oriented. Influence types are persuasive, optimistic, and excel at motivating others. They thrive on social interaction and recognition.',
  S: 'Steady, patient, and team-oriented. Steadiness types are reliable, cooperative, and prefer stable environments. They value harmony and consistent relationships.',
  C: 'Careful, analytical, and quality-oriented. Conscientiousness types are precise, systematic, and focus on accuracy. They prefer structure and following procedures.'
});

export const getTypeStrengths = (): Record<DISCType, string[]> => ({
  D: ['Results-driven', 'Decisive', 'Independent', 'Courageous', 'Direct'],
  I: ['Persuasive', 'Optimistic', 'Sociable', 'Enthusiastic', 'Motivating'],
  S: ['Reliable', 'Patient', 'Cooperative', 'Good listener', 'Team player'],
  C: ['Accurate', 'Analytical', 'Quality-focused', 'Systematic', 'Detail-oriented']
});

export const getTypeWeaknesses = (): Record<DISCType, string[]> => ({
  D: ['Impatient', 'Aggressive', 'Insensitive', 'Dominating', 'Blunt'],
  I: ['Disorganized', 'Impulsive', 'Overly optimistic', 'Talkative', 'Emotional'],
  S: ['Resistant to change', 'Indecisive', 'Overly accommodating', 'Passive', 'Slow-paced'],
  C: ['Overly critical', 'Perfectionistic', 'Indecisive', 'Rigid', 'Overly cautious']
});

export const getCommunicationTips = (): Record<DISCType, string[]> => ({
  D: ['Be direct and to the point', 'Focus on results and benefits', 'Avoid unnecessary details', 'Respect their time', 'Be prepared and confident'],
  I: ['Be enthusiastic and friendly', 'Use stories and examples', 'Allow time for discussion', 'Provide recognition', 'Keep it positive'],
  S: ['Be patient and calm', 'Show genuine interest', 'Provide reassurance', 'Be consistent', 'Avoid pressure tactics'],
  C: ['Be precise and factual', 'Provide data and evidence', 'Allow time for analysis', 'Be organized', 'Respect their need for accuracy']
});

export const getIdealEnvironment = (): Record<DISCType, string[]> => ({
  D: ['Fast-paced', 'Challenging', 'Results-focused', 'Autonomous', 'Opportunities for advancement'],
  I: ['Social', 'Recognition opportunities', 'Creative freedom', 'Team-oriented', 'Varied activities'],
  S: ['Stable', 'Predictable', 'Team-focused', 'Supportive', 'Clear expectations'],
  C: ['Structured', 'Detail-oriented', 'Quality-focused', 'Independent work', 'Clear procedures']
});

export const getStressBehaviors = (): Record<DISCType, string[]> => ({
  D: ['Become aggressive', 'Make rash decisions', 'Become controlling', 'Show impatience', 'Overwork'],
  I: ['Become scattered', 'Avoid difficult tasks', 'Seek excessive attention', 'Over-promise', 'Become defensive'],
  S: ['Become passive-aggressive', 'Avoid conflict', 'Resist change', 'Withdraw', 'Become indecisive'],
  C: ['Become overly critical', 'Micromanage', 'Over-analyze', 'Procrastinate', 'Become rigid']
});

export const getDISCResult = (behavior: DISCBehavior): DISCResult => {
  const naturalProfile = determineDISCProfile(behavior.natural);
  const adaptedProfile = determineDISCProfile(behavior.adapted);
  
  // Use natural profile for overall assessment
  const profile = naturalProfile;
  const profileName = getProfileName(profile);
  
  // Calculate percentiles based on natural scores
  const percentiles = { ...behavior.natural }; // Already normalized to 0-100
  
  const descriptions = getTypeDescriptions();
  const strengths = getTypeStrengths();
  const weaknesses = getTypeWeaknesses();
  const communicationTips = getCommunicationTips();
  const idealEnvironment = getIdealEnvironment();
  const stressBehaviors = getStressBehaviors();
  
  // Determine overall style description
  const getOverallDescription = (): string => {
    const { primary, secondary } = profile;
    const primaryScore = behavior.natural[primary];
    
    let intensity = '';
    if (primaryScore >= 80) intensity = 'strongly ';
    else if (primaryScore >= 60) intensity = '';
    else intensity = 'moderately ';
    
    const baseDescription = `You have a ${intensity}${descriptions[primary].toLowerCase().split('. ')[0]}`;
    
    if (secondary) {
      const secondaryScore = behavior.natural[secondary];
      const secondaryIntensity = secondaryScore >= 70 ? 'strong ' : secondaryScore >= 50 ? 'moderate ' : '';
      return `${baseDescription}, with ${secondaryIntensity}${descriptions[secondary].toLowerCase().split('. ')[0]} tendencies.`;
    }
    
    return `${baseDescription}.`;
  };
  
  // Determine color based on primary type
  const getColor = (primary: DISCType): string => {
    const colors = {
      D: 'bg-gradient-to-r from-red-600 to-orange-600',
      I: 'bg-gradient-to-r from-yellow-500 to-amber-600',
      S: 'bg-gradient-to-r from-green-600 to-emerald-700',
      C: 'bg-gradient-to-r from-blue-600 to-indigo-700'
    };
    return colors[primary];
  };

  return {
    scores: behavior.natural,
    profile,
    behavior,
    percentiles,
    descriptions,
    strengths,
    weaknesses,
    communicationTips,
    idealEnvironment,
    stressBehaviors,
    overallStyle: profileName,
    overallDescription: getOverallDescription(),
    color: getColor(profile.primary),
    profileName
  };
};