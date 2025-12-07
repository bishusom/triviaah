import { 
  EnneagramType, 
  EnneagramQuestion, 
  EnneagramScores, 
  EnneagramResult,
  EnneagramWing,
  EnneagramTriad 
} from './enneagram-types';

// Enneagram Test Questions (3 questions per type, 27 total)
export const enneagramQuestions: EnneagramQuestion[] = [
  // === Type 1: The Reformer ===
  { 
    id: '1a', 
    text: 'I am a perfectionist and notice when things aren\'t done correctly', 
    types: ['1'], 
    weight: 3, 
    category: 'Perfectionism' 
  },
  { 
    id: '1b', 
    text: 'I feel responsible for fixing problems and making things better', 
    types: ['1'], 
    weight: 2, 
    category: 'Responsibility' 
  },
  { 
    id: '1c', 
    text: 'I have high standards for myself and others', 
    types: ['1'], 
    weight: 2, 
    category: 'Standards' 
  },

  // === Type 2: The Helper ===
  { 
    id: '2a', 
    text: 'I naturally put others\' needs before my own', 
    types: ['2'], 
    weight: 3, 
    category: 'Altruism' 
  },
  { 
    id: '2b', 
    text: 'I enjoy being needed and appreciated by others', 
    types: ['2'], 
    weight: 2, 
    category: 'Appreciation' 
  },
  { 
    id: '2c', 
    text: 'I am sensitive to rejection and feeling unloved', 
    types: ['2'], 
    weight: 2, 
    category: 'Sensitivity' 
  },

  // === Type 3: The Achiever ===
  { 
    id: '3a', 
    text: 'I am driven to succeed and be the best at what I do', 
    types: ['3'], 
    weight: 3, 
    category: 'Achievement' 
  },
  { 
    id: '3b', 
    text: 'I adapt my personality to fit in and be liked', 
    types: ['3'], 
    weight: 2, 
    category: 'Adaptability' 
  },
  { 
    id: '3c', 
    text: 'My self-worth is tied to my accomplishments', 
    types: ['3'], 
    weight: 2, 
    category: 'Self-worth' 
  },

  // === Type 4: The Individualist ===
  { 
    id: '4a', 
    text: 'I often feel different from others and unique', 
    types: ['4'], 
    weight: 3, 
    category: 'Individuality' 
  },
  { 
    id: '4b', 
    text: 'I experience emotions deeply and intensely', 
    types: ['4'], 
    weight: 2, 
    category: 'Emotionality' 
  },
  { 
    id: '4c', 
    text: 'I am drawn to beauty, art, and creative expression', 
    types: ['4'], 
    weight: 2, 
    category: 'Creativity' 
  },

  // === Type 5: The Investigator ===
  { 
    id: '5a', 
    text: 'I need plenty of time alone to think and recharge', 
    types: ['5'], 
    weight: 3, 
    category: 'Solitude' 
  },
  { 
    id: '5b', 
    text: 'I feel most secure when I have specialized knowledge', 
    types: ['5'], 
    weight: 2, 
    category: 'Knowledge' 
  },
  { 
    id: '5c', 
    text: 'I observe before participating in social situations', 
    types: ['5'], 
    weight: 2, 
    category: 'Observation' 
  },

  // === Type 6: The Loyalist ===
  { 
    id: '6a', 
    text: 'I am always planning for potential problems', 
    types: ['6'], 
    weight: 3, 
    category: 'Preparedness' 
  },
  { 
    id: '6b', 
    text: 'I value loyalty and commitment in relationships', 
    types: ['6'], 
    weight: 2, 
    category: 'Loyalty' 
  },
  { 
    id: '6c', 
    text: 'I seek security and stability in my life', 
    types: ['6'], 
    weight: 2, 
    category: 'Security' 
  },

  // === Type 7: The Enthusiast ===
  { 
    id: '7a', 
    text: 'I avoid pain and discomfort by staying busy and positive', 
    types: ['7'], 
    weight: 3, 
    category: 'Avoidance' 
  },
  { 
    id: '7b', 
    text: 'I am always planning my next exciting experience', 
    types: ['7'], 
    weight: 2, 
    category: 'Planning' 
  },
  { 
    id: '7c', 
    text: 'I have many interests and get bored easily', 
    types: ['7'], 
    weight: 2, 
    category: 'Variety' 
  },

  // === Type 8: The Challenger ===
  { 
    id: '8a', 
    text: 'I take charge and protect those I care about', 
    types: ['8'], 
    weight: 3, 
    category: 'Protection' 
  },
  { 
    id: '8b', 
    text: 'I value honesty and directness in communication', 
    types: ['8'], 
    weight: 2, 
    category: 'Honesty' 
  },
  { 
    id: '8c', 
    text: 'I dislike being controlled or manipulated', 
    types: ['8'], 
    weight: 2, 
    category: 'Autonomy' 
  },

  // === Type 9: The Peacemaker ===
  { 
    id: '9a', 
    text: 'I avoid conflict and seek harmony in relationships', 
    types: ['9'], 
    weight: 3, 
    category: 'Harmony' 
  },
  { 
    id: '9b', 
    text: 'I go along with others to keep the peace', 
    types: ['9'], 
    weight: 2, 
    category: 'Accommodation' 
  },
  { 
    id: '9c', 
    text: 'I procrastinate on decisions that might create conflict', 
    types: ['9'], 
    weight: 2, 
    category: 'Procrastination' 
  },
];

export const calculateEnneagramScores = (answers: { questionId: string; answer: number }[]): EnneagramScores => {
  const scores: EnneagramScores = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 };
  
  answers.forEach(answer => {
    const question = enneagramQuestions.find(q => q.id === answer.questionId);
    if (question) {
      // Convert answer from -3 to 3 to 0 to 6 for positive scoring
      const positiveAnswer = answer.answer + 3; // Now 0 to 6
      const weightedScore = positiveAnswer * question.weight;
      
      question.types.forEach(type => {
        scores[type] += weightedScore;
      });
    }
  });

  return scores;
};

export const calculatePercentiles = (scores: EnneagramScores, maxPossibleScore: number): EnneagramScores => {
  // Convert to percentages (0-100)
  const percentiles: EnneagramScores = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 };
  
  (Object.keys(scores) as EnneagramType[]).forEach(type => {
    percentiles[type] = Math.round((scores[type] / maxPossibleScore) * 100);
  });

  return percentiles;
};

export const determinePrimaryType = (scores: EnneagramScores): EnneagramType => {
  let maxScore = -1;
  let primaryType: EnneagramType = '1';
  
  (Object.keys(scores) as EnneagramType[]).forEach(type => {
    if (scores[type] > maxScore) {
      maxScore = scores[type];
      primaryType = type;
    }
  });

  return primaryType;
};

export const determineWing = (scores: EnneagramScores, primaryType: EnneagramType): EnneagramWing => {
  const typeNumber = parseInt(primaryType);
  const leftType = ((typeNumber - 2 + 9) % 9 + 1).toString() as EnneagramType; // Type before (counter-clockwise)
  const rightType = (typeNumber % 9 + 1).toString() as EnneagramType; // Type after (clockwise)
  
  const leftScore = scores[leftType];
  const rightScore = scores[rightType];
  
  let wing: 'left' | 'right' | null = null;
  
  if (leftScore > rightScore && leftScore > scores[primaryType] * 0.6) {
    wing = 'left';
  } else if (rightScore > leftScore && rightScore > scores[primaryType] * 0.6) {
    wing = 'right';
  }

  return {
    primary: primaryType,
    wing,
    leftType,
    rightType,
    leftScore,
    rightScore
  };
};

export const determineTriad = (scores: EnneagramScores): EnneagramTriad => {
  const headTypes: EnneagramType[] = ['5', '6', '7'];
  const heartTypes: EnneagramType[] = ['2', '3', '4'];
  const bodyTypes: EnneagramType[] = ['8', '9', '1'];
  
  const headScore = headTypes.reduce((sum, type) => sum + scores[type], 0);
  const heartScore = heartTypes.reduce((sum, type) => sum + scores[type], 0);
  const bodyScore = bodyTypes.reduce((sum, type) => sum + scores[type], 0);
  
  let center: 'head' | 'heart' | 'body' | null = null;
  const maxScore = Math.max(headScore, heartScore, bodyScore);
  
  if (maxScore === headScore) center = 'head';
  else if (maxScore === heartScore) center = 'heart';
  else if (maxScore === bodyScore) center = 'body';

  return {
    center,
    headTypes,
    heartTypes,
    bodyTypes,
    headScore,
    heartScore,
    bodyScore
  };
};

export const determineIntegrationLevel = (scores: EnneagramScores, primaryType: EnneagramType): 'healthy' | 'average' | 'unhealthy' => {
  const maxPossibleScore = 108; // 3 questions × weight 3 × answer 6 × 2 (for two highest scoring questions)
  const primaryScore = scores[primaryType];
  const percentage = (primaryScore / maxPossibleScore) * 100;
  
  if (percentage >= 70) return 'healthy';
  if (percentage >= 40) return 'average';
  return 'unhealthy';
};

export const getTypeData = (type: EnneagramType) => {
  const typeData = {
    '1': {
      name: 'The Reformer',
      description: 'Principled, purposeful, self-controlled, and perfectionistic. Reformers are ethical and conscientious with a strong sense of right and wrong.',
      coreFear: 'Being corrupt, evil, or defective',
      coreDesire: 'To be good, balanced, and have integrity',
      basicProposition: 'You are okay if you do what is right',
      strengths: ['Ethical', 'Reliable', 'Organized', 'Self-disciplined', 'Principled'],
      weaknesses: ['Critical', 'Perfectionistic', 'Rigid', 'Judgmental', 'Controlling'],
      growthPath: ['Learn to accept imperfections', 'Practice flexibility', 'Express anger constructively'],
      stressPath: ['Become anxious and controlling', 'Withdraw emotionally', 'Become critical of self and others'],
      famousExamples: ['Michelle Obama', 'Nelson Mandela', 'Martha Stewart', 'Gandhi'],
      careers: ['Judge', 'Auditor', 'Editor', 'Quality Control', 'Social Reformer'],
      color: 'bg-gradient-to-r from-blue-600 to-indigo-700'
    },
    '2': {
      name: 'The Helper',
      description: 'Caring, generous, people-pleasing, and possessive. Helpers are warm, empathetic, and seek to be loved by helping others.',
      coreFear: 'Being unwanted or unworthy of love',
      coreDesire: 'To feel loved and appreciated',
      basicProposition: 'You are okay if you are helpful to others',
      strengths: ['Empathetic', 'Supportive', 'Generous', 'Nurturing', 'Relationship-focused'],
      weaknesses: ['People-pleasing', 'Manipulative', 'Self-sacrificing', 'Needy', 'Possessive'],
      growthPath: ['Set healthy boundaries', 'Acknowledge own needs', 'Practice receiving help'],
      stressPath: ['Become manipulative', 'Play the victim', 'Become demanding'],
      famousExamples: ['Mother Teresa', 'Princess Diana', 'Mr. Rogers', 'Dolly Parton'],
      careers: ['Nurse', 'Teacher', 'Counselor', 'Social Worker', 'Customer Service'],
      color: 'bg-gradient-to-r from-pink-500 to-rose-600'
    },
    '3': {
      name: 'The Achiever',
      description: 'Adaptable, excelling, driven, and image-conscious. Achievers are success-oriented, pragmatic, and focused on goals and achievement.',
      coreFear: 'Being worthless or without value',
      coreDesire: 'To feel valuable and worthwhile',
      basicProposition: 'You are okay if you are successful and admired',
      strengths: ['Ambitious', 'Adaptable', 'Energetic', 'Confident', 'Goal-oriented'],
      weaknesses: ['Vain', 'Workaholic', 'Deceptive', 'Competitive', 'Image-conscious'],
      growthPath: ['Connect with authentic self', 'Value being over doing', 'Practice vulnerability'],
      stressPath: ['Become workaholic', 'Lose touch with feelings', 'Become deceptive'],
      famousExamples: ['Oprah Winfrey', 'Tom Cruise', 'Madonna', 'Barack Obama'],
      careers: ['Salesperson', 'Executive', 'Politician', 'Entertainer', 'Athlete'],
      color: 'bg-gradient-to-r from-yellow-500 to-amber-600'
    },
    '4': {
      name: 'The Individualist',
      description: 'Expressive, dramatic, self-absorbed, and temperamental. Individualists are creative, romantic, and seek meaning through authenticity.',
      coreFear: 'Having no identity or personal significance',
      coreDesire: 'To find themselves and their significance',
      basicProposition: 'You are okay if you are unique and authentic',
      strengths: ['Creative', 'Authentic', 'Empathetic', 'Introspective', 'Artistic'],
      weaknesses: ['Moody', 'Self-absorbed', 'Envious', 'Dramatic', 'Melancholic'],
      growthPath: ['Practice gratitude', 'Engage in reality', 'Develop consistency'],
      stressPath: ['Withdraw into fantasy', 'Become self-pitying', 'Isolate from others'],
      famousExamples: ['Vincent van Gogh', 'Frida Kahlo', 'Johnny Depp', 'Edgar Allan Poe'],
      careers: ['Artist', 'Writer', 'Designer', 'Actor', 'Therapist'],
      color: 'bg-gradient-to-r from-purple-600 to-pink-600'
    },
    '5': {
      name: 'The Investigator',
      description: 'Perceptive, innovative, secretive, and isolated. Investigators are intense, cerebral, and seek knowledge and understanding.',
      coreFear: 'Being helpless, useless, or incapable',
      coreDesire: 'To be capable and competent',
      basicProposition: 'You are okay if you understand how things work',
      strengths: ['Analytical', 'Observant', 'Knowledgeable', 'Innovative', 'Self-sufficient'],
      weaknesses: ['Detached', 'Secretive', 'Isolated', 'Cynical', 'Overly theoretical'],
      growthPath: ['Engage with the world', 'Share knowledge', 'Practice emotional expression'],
      stressPath: ['Withdraw completely', 'Become cynical', 'Isolate from feelings'],
      famousExamples: ['Albert Einstein', 'Bill Gates', 'Stephen Hawking', 'Emily Dickinson'],
      careers: ['Scientist', 'Researcher', 'Programmer', 'Philosopher', 'Archivist'],
      color: 'bg-gradient-to-r from-gray-600 to-slate-700'
    },
    '6': {
      name: 'The Loyalist',
      description: 'Engaging, responsible, anxious, and suspicious. Loyalists are reliable, hard-working, and seek security through preparation.',
      coreFear: 'Being without support or guidance',
      coreDesire: 'To have security and support',
      basicProposition: 'You are okay if you are prepared and secure',
      strengths: ['Loyal', 'Responsible', 'Committed', 'Practical', 'Prepared'],
      weaknesses: ['Anxious', 'Suspicious', 'Defensive', 'Pessimistic', 'Indecisive'],
      growthPath: ['Trust intuition', 'Take calculated risks', 'Develop self-confidence'],
      stressPath: ['Become paranoid', 'Project fears', 'Become rigidly defensive'],
      famousExamples: ['Mark Zuckerberg', 'Julia Roberts', 'Tom Hanks', 'J.K. Rowling'],
      careers: ['Security Officer', 'Accountant', 'Teacher', 'Administrator', 'Planner'],
      color: 'bg-gradient-to-r from-green-600 to-emerald-700'
    },
    '7': {
      name: 'The Enthusiast',
      description: 'Spontaneous, versatile, distractible, and scattered. Enthusiasts are optimistic, adventurous, and seek happiness and stimulation.',
      coreFear: 'Being deprived and in pain',
      coreDesire: 'To be satisfied and content',
      basicProposition: 'You are okay if you are happy and free',
      strengths: ['Enthusiastic', 'Optimistic', 'Spontaneous', 'Versatile', 'Adventurous'],
      weaknesses: ['Scattered', 'Escapist', 'Self-indulgent', 'Impulsive', 'Unfocused'],
      growthPath: ['Practice focus', 'Embrace discomfort', 'Develop depth'],
      stressPath: ['Become manic', 'Avoid responsibility', 'Chase empty experiences'],
      famousExamples: ['Robin Williams', 'Richard Branson', 'Ellen DeGeneres', 'Steve Jobs'],
      careers: ['Entrepreneur', 'Event Planner', 'Travel Guide', 'Entertainer', 'Marketer'],
      color: 'bg-gradient-to-r from-orange-500 to-yellow-600'
    },
    '8': {
      name: 'The Challenger',
      description: 'Self-confident, decisive, willful, and confrontational. Challengers are powerful, dominating, and seek control and justice.',
      coreFear: 'Being harmed or controlled by others',
      coreDesire: 'To protect themselves and be in control',
      basicProposition: 'You are okay if you are strong and in control',
      strengths: ['Confident', 'Decisive', 'Protective', 'Authoritative', 'Justice-oriented'],
      weaknesses: ['Dominating', 'Confrontational', 'Intimidating', 'Stubborn', 'Controlling'],
      growthPath: ['Practice vulnerability', 'Listen to others', 'Channel power constructively'],
      stressPath: ['Become tyrannical', 'Isolate from feelings', 'Become aggressive'],
      famousExamples: ['Martin Luther King Jr.', 'Winston Churchill', 'Ernest Hemingway', 'Queen Latifah'],
      careers: ['CEO', 'Lawyer', 'Military Officer', 'Entrepreneur', 'Activist'],
      color: 'bg-gradient-to-r from-red-600 to-orange-600'
    },
    '9': {
      name: 'The Peacemaker',
      description: 'Receptive, reassuring, complacent, and resigned. Peacemakers are easygoing, accommodating, and seek inner and outer peace.',
      coreFear: 'Loss and separation',
      coreDesire: 'To have inner stability and peace of mind',
      basicProposition: 'You are okay if you are at peace',
      strengths: ['Accepting', 'Stable', 'Reassuring', 'Supportive', 'Mediator'],
      weaknesses: ['Complacent', 'Resigned', 'Stubborn', 'Passive-aggressive', 'Narcotizing'],
      growthPath: ['Express opinions', 'Take initiative', 'Engage with conflict'],
      stressPath: ['Become passive-aggressive', 'Numb out', 'Disengage completely'],
      famousExamples: ['Abraham Lincoln', 'Audrey Hepburn', 'Keanu Reeves', 'Fred Rogers'],
      careers: ['Mediator', 'Counselor', 'Teacher', 'Nurse', 'Social Worker'],
      color: 'bg-gradient-to-r from-teal-500 to-emerald-600'
    }
  };

  return typeData[type];
};

export const getWingDescription = (primaryType: EnneagramType, wing: 'left' | 'right' | null): string => {
  if (!wing) return 'You show balanced characteristics without a strong wing influence.';
  
  const typeNumber = parseInt(primaryType);
  const wingType = wing === 'left' ? ((typeNumber - 2 + 9) % 9 + 1) : (typeNumber % 9 + 1);
  
  const wingDescriptions: Record<string, string> = {
    '1w2': 'The Advocate: Combines idealism with interpersonal warmth. More people-oriented than pure Type 1.',
    '1w9': 'The Idealist: Combines perfectionism with calm detachment. More philosophical than pure Type 1.',
    '2w1': 'The Servant: Combines helping with principles. More structured than pure Type 2.',
    '2w3': 'The Host: Combines helping with ambition. More sociable and success-oriented than pure Type 2.',
    '3w2': 'The Charmer: Combines achievement with interpersonal skills. More charming than pure Type 3.',
    '3w4': 'The Professional: Combines achievement with individualism. More creative and introspective than pure Type 3.',
    '4w3': 'The Aristocrat: Combines creativity with ambition. More socially polished than pure Type 4.',
    '4w5': 'The Bohemian: Combines creativity with intellectual depth. More withdrawn and analytical than pure Type 4.',
    '5w4': 'The Iconoclast: Combines knowledge with creativity. More artistic than pure Type 5.',
    '5w6': 'The Problem Solver: Combines knowledge with loyalty. More practical and security-oriented than pure Type 5.',
    '6w5': 'The Defender: Combines loyalty with analytical thinking. More intellectual than pure Type 6.',
    '6w7': 'The Buddy: Combines loyalty with enthusiasm. More outgoing and fun-loving than pure Type 6.',
    '7w6': 'The Entertainer: Combines enthusiasm with loyalty. More responsible than pure Type 7.',
    '7w8': 'The Realist: Combines enthusiasm with assertiveness. More direct and forceful than pure Type 7.',
    '8w7': 'The Maverick: Combines power with enthusiasm. More adventurous than pure Type 8.',
    '8w9': 'The Bear: Combines power with peacemaking. More diplomatic than pure Type 8.',
    '9w8': 'The Referee: Combines peacemaking with assertiveness. More outgoing than pure Type 9.',
    '9w1': 'The Dreamer: Combines peacemaking with idealism. More principled than pure Type 9.',
  };

  return wingDescriptions[`${primaryType}w${wingType}`] || 'You have a balanced wing influence.';
};

export const getEnneagramResult = (scores: EnneagramScores): EnneagramResult => {
  const maxPossibleScore = 108; // For calculating percentages
  const percentiles = calculatePercentiles(scores, maxPossibleScore);
  const primaryType = determinePrimaryType(scores);
  const wing = determineWing(scores, primaryType);
  const triad = determineTriad(scores);
  const integrationLevel = determineIntegrationLevel(scores, primaryType);
  const typeData = getTypeData(primaryType);
  const wingDescription = getWingDescription(primaryType, wing.wing);
  
  // Determine overall description based on integration level
  const integrationDescriptions = {
    healthy: 'You are demonstrating healthy, integrated characteristics of your type, showing self-awareness and growth.',
    average: 'You show typical characteristics of your type, with both strengths and areas for growth.',
    unhealthy: 'You may be experiencing stress or disconnection, showing some unhealthy patterns of your type.'
  };

  // Create overall description
  const overallDescription = `${typeData.name}. ${typeData.description} ${integrationDescriptions[integrationLevel]}`;

  return {
    primaryType,
    wing,
    triad,
    scores,
    percentiles,
    typeData,
    wingDescription,
    overallDescription,
    integrationLevel,
    integrationDescription: integrationDescriptions[integrationLevel],
    color: typeData.color
  };
};