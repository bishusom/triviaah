import {
  HollandType,
  HollandQuestion,
  HollandScores,
  HollandResult,
  HollandProfile,
  HollandCareer,
  UserHollandAnswer
} from './holland-types';

export const hollandQuestions: HollandQuestion[] = [
  // Realistic (R)
  { id: 'R1', text: 'I enjoy working with tools and machinery', type: 'R', reverse: false, category: 'Practical' },
  { id: 'R2', text: 'I prefer hands-on, physical activities over desk work', type: 'R', reverse: false, category: 'Physical' },
  { id: 'R3', text: 'I like building, fixing, or repairing things', type: 'R', reverse: false, category: 'Construction' },
  { id: 'R4', text: 'I enjoy outdoor activities and working with nature', type: 'R', reverse: false, category: 'Outdoor' },
  { id: 'R5', text: 'I prefer concrete, tangible results over abstract ideas', type: 'R', reverse: false, category: 'Results' },
  { id: 'R6', text: 'I like working with my hands more than working with people', type: 'R', reverse: false, category: 'Preference' },
  
  // Investigative (I)
  { id: 'I1', text: 'I enjoy solving complex problems and puzzles', type: 'I', reverse: false, category: 'Problem Solving' },
  { id: 'I2', text: 'I like conducting research and analyzing data', type: 'I', reverse: false, category: 'Research' },
  { id: 'I3', text: 'I prefer working independently on intellectual challenges', type: 'I', reverse: false, category: 'Independence' },
  { id: 'I4', text: 'I enjoy learning about scientific or technical subjects', type: 'I', reverse: false, category: 'Science' },
  { id: 'I5', text: 'I value knowledge and understanding above practical results', type: 'I', reverse: false, category: 'Knowledge' },
  { id: 'I6', text: 'I like understanding how things work at a fundamental level', type: 'I', reverse: false, category: 'Understanding' },
  
  // Artistic (A)
  { id: 'A1', text: 'I enjoy creative activities like writing, painting, or designing', type: 'A', reverse: false, category: 'Creative' },
  { id: 'A2', text: 'I prefer flexible, unstructured work environments', type: 'A', reverse: false, category: 'Flexibility' },
  { id: 'A3', text: 'I value self-expression and originality', type: 'A', reverse: false, category: 'Expression' },
  { id: 'A4', text: 'I enjoy working with ideas, words, or artistic media', type: 'A', reverse: false, category: 'Media' },
  { id: 'A5', text: 'I dislike rigid rules and prefer creative freedom', type: 'A', reverse: false, category: 'Freedom' },
  { id: 'A6', text: 'I appreciate beauty and artistic expression in my work', type: 'A', reverse: false, category: 'Aesthetics' },
  
  // Social (S)
  { id: 'S1', text: 'I enjoy helping, teaching, or caring for others', type: 'S', reverse: false, category: 'Helping' },
  { id: 'S2', text: 'I prefer working in teams rather than alone', type: 'S', reverse: false, category: 'Teamwork' },
  { id: 'S3', text: 'I value cooperation and harmony in the workplace', type: 'S', reverse: false, category: 'Harmony' },
  { id: 'S4', text: 'I enjoy understanding people\'s feelings and motivations', type: 'S', reverse: false, category: 'Empathy' },
  { id: 'S5', text: 'I like resolving conflicts and helping people grow', type: 'S', reverse: false, category: 'Development' },
  { id: 'S6', text: 'I find satisfaction in contributing to others\' well-being', type: 'S', reverse: false, category: 'Contribution' },
  
  // Enterprising (E)
  { id: 'E1', text: 'I enjoy leading, managing, or persuading others', type: 'E', reverse: false, category: 'Leadership' },
  { id: 'E2', text: 'I like taking risks and pursuing ambitious goals', type: 'E', reverse: false, category: 'Risk Taking' },
  { id: 'E3', text: 'I value success, achievement, and recognition', type: 'E', reverse: false, category: 'Achievement' },
  { id: 'E4', text: 'I enjoy competitive environments and challenges', type: 'E', reverse: false, category: 'Competition' },
  { id: 'E5', text: 'I prefer influencing others over being influenced', type: 'E', reverse: false, category: 'Influence' },
  { id: 'E6', text: 'I like starting new projects or business ventures', type: 'E', reverse: false, category: 'Initiative' },
  
  // Conventional (C)
  { id: 'C1', text: 'I enjoy organizing information and maintaining systems', type: 'C', reverse: false, category: 'Organization' },
  { id: 'C2', text: 'I prefer structured, orderly work environments', type: 'C', reverse: false, category: 'Structure' },
  { id: 'C3', text: 'I value accuracy, reliability, and attention to detail', type: 'C', reverse: false, category: 'Accuracy' },
  { id: 'C4', text: 'I enjoy working with numbers, data, or financial records', type: 'C', reverse: false, category: 'Data' },
  { id: 'C5', text: 'I like following established procedures and guidelines', type: 'C', reverse: false, category: 'Procedures' },
  { id: 'C6', text: 'I prefer clear expectations and well-defined tasks', type: 'C', reverse: false, category: 'Clarity' }
];

export const calculateHollandScores = (answers: UserHollandAnswer[]): HollandScores => {
  const scores: HollandScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  
  answers.forEach(answer => {
    const question = hollandQuestions.find(q => q.id === answer.questionId);
    let adjustedAnswer = answer.answer;
    if (question?.reverse) {
      adjustedAnswer = 6 - answer.answer; // Reverse score (1-5 scale)
    }
    scores[answer.type] += adjustedAnswer;
  });

  // Normalize scores to 0-100 range
  const maxPossibleScore = 5 * 6; // 6 questions per type, max 5 points each
  (Object.keys(scores) as HollandType[]).forEach(type => {
    const typeAnswers = answers.filter(a => a.type === type).length;
    const maxScoreForType = typeAnswers * 5;
    if (maxScoreForType > 0) {
      scores[type] = Math.round((scores[type] / maxScoreForType) * 100);
    }
  });

  return scores;
};

export const determineHollandProfile = (scores: HollandScores): HollandProfile => {
  const scoreEntries = Object.entries(scores) as [HollandType, number][];
  
  // Sort by score descending
  const sorted = [...scoreEntries].sort((a, b) => b[1] - a[1]);
  
  const primary = sorted[0][0];
  const secondary = sorted[1][1] > 70 ? sorted[1][0] : null;
  const tertiary = sorted[2][1] > 60 ? sorted[2][0] : null;
  const fourth = sorted[3][1] > 50 ? sorted[3][0] : null;
  const fifth = sorted[4][1] > 40 ? sorted[4][0] : null;
  const sixth = sorted[5][0];

  return {
    primary,
    secondary,
    tertiary,
    fourth,
    fifth,
    sixth
  };
};

export const getHollandCode = (profile: HollandProfile): string => {
  const { primary, secondary, tertiary } = profile;
  let code = primary;
  if (secondary) code += secondary;
  if (tertiary) code += tertiary;
  return code;
};

export const getProfileName = (profile: HollandProfile): string => {
  const { primary, secondary, tertiary } = profile;
  
  const typeNames: Record<HollandType, string> = {
    'R': 'Realistic',
    'I': 'Investigative',
    'A': 'Artistic',
    'S': 'Social',
    'E': 'Enterprising',
    'C': 'Conventional'
  };

  const primaryName = typeNames[primary];
  const secondaryName = secondary ? typeNames[secondary] : null;
  const tertiaryName = tertiary ? typeNames[tertiary] : null;

  if (secondary && tertiary) {
    return `${primaryName}-${secondaryName}-${tertiaryName}`;
  } else if (secondary) {
    return `${primaryName}-${secondaryName}`;
  } else {
    return `${primaryName}`;
  }
};

export const getTypeDescriptions = (): Record<HollandType, string> => ({
  R: 'Realistic types are practical, hands-on people who enjoy working with tools, machines, and physical materials. They prefer concrete tasks over abstract ideas and often enjoy outdoor or technical work.',
  I: 'Investigative types are analytical, curious thinkers who enjoy solving complex problems through research and analysis. They value knowledge and prefer working independently on intellectual challenges.',
  A: 'Artistic types are creative, original individuals who enjoy self-expression through various media. They prefer unstructured environments where they can use their imagination and creativity.',
  S: 'Social types are helpful, cooperative people who enjoy working with others to teach, heal, or support. They value relationships and prefer teamwork over individual work.',
  E: 'Enterprising types are ambitious, persuasive individuals who enjoy leading, managing, and influencing others. They value achievement, recognition, and competitive environments.',
  C: 'Conventional types are organized, detail-oriented people who enjoy working with data, systems, and procedures. They prefer structured, orderly environments with clear expectations.'
});

export const getCharacteristics = (): Record<HollandType, string[]> => ({
  R: ['Practical', 'Mechanical', 'Athletic', 'Stable', 'Persistent', 'Tool-oriented'],
  I: ['Analytical', 'Intellectual', 'Curious', 'Methodical', 'Independent', 'Reserved'],
  A: ['Creative', 'Imaginative', 'Intuitive', 'Expressive', 'Nonconforming', 'Emotional'],
  S: ['Cooperative', 'Friendly', 'Helpful', 'Patient', 'Empathetic', 'Understanding'],
  E: ['Ambitious', 'Energetic', 'Confident', 'Persuasive', 'Sociable', 'Risk-taking'],
  C: ['Organized', 'Efficient', 'Conscientious', 'Detail-oriented', 'Conforming', 'Practical']
});

export const getWorkActivities = (): Record<HollandType, string[]> => ({
  R: ['Operating machinery', 'Building structures', 'Repairing equipment', 'Working outdoors', 'Using tools', 'Physical labor'],
  I: ['Conducting research', 'Analyzing data', 'Solving complex problems', 'Conducting experiments', 'Developing theories', 'Investigating'],
  A: ['Creating art', 'Writing stories', 'Designing concepts', 'Performing arts', 'Creative problem-solving', 'Developing new ideas'],
  S: ['Teaching others', 'Counseling individuals', 'Helping people', 'Training staff', 'Mediating conflicts', 'Providing care'],
  E: ['Leading teams', 'Selling products', 'Managing projects', 'Starting businesses', 'Making decisions', 'Negotiating deals'],
  C: ['Organizing files', 'Processing data', 'Maintaining records', 'Following procedures', 'Calculating numbers', 'Managing systems']
});

export const getWorkEnvironment = (): Record<HollandType, string[]> => ({
  R: ['Workshops', 'Construction sites', 'Farms', 'Garages', 'Laboratories', 'Outdoor settings'],
  I: ['Research labs', 'Universities', 'Think tanks', 'Scientific facilities', 'Technical companies', 'Libraries'],
  A: ['Studios', 'Theaters', 'Advertising agencies', 'Design firms', 'Music venues', 'Creative spaces'],
  S: ['Schools', 'Hospitals', 'Counseling centers', 'Community centers', 'Social services', 'Team offices'],
  E: ['Corporate offices', 'Sales floors', 'Business meetings', 'Conference rooms', 'Startup environments', 'Executive suites'],
  C: ['Accounting offices', 'Banking institutions', 'Government agencies', 'Data centers', 'Administrative offices', 'Financial firms']
});

export const getSuggestedCareers = (): Record<HollandType, HollandCareer[]> => ({
  R: [
    { 
      title: 'Mechanical Engineer', 
      description: 'Design and develop mechanical devices and systems',
      medianSalary: '$95,300',
      growth: '4% (As fast as average)',
      education: "Bachelor's degree",
      skills: ['CAD Software', 'Problem-solving', 'Mathematics', 'Physics']
    },
    { 
      title: 'Electrician', 
      description: 'Install, maintain, and repair electrical systems',
      medianSalary: '$60,040',
      growth: '6% (Faster than average)',
      education: 'Apprenticeship or technical school',
      skills: ['Electrical Systems', 'Blueprint Reading', 'Safety Procedures', 'Troubleshooting']
    },
    { 
      title: 'Civil Engineer', 
      description: 'Design and supervise construction projects',
      medianSalary: '$95,490',
      growth: '5% (Faster than average)',
      education: "Bachelor's degree",
      skills: ['Project Management', 'Structural Design', 'AutoCAD', 'Mathematics']
    }
  ],
  I: [
    { 
      title: 'Data Scientist', 
      description: 'Analyze complex data to uncover insights and patterns',
      medianSalary: '$103,500',
      growth: '31% (Much faster than average)',
      education: "Master's degree preferred",
      skills: ['Python/R', 'Statistics', 'Machine Learning', 'Data Visualization']
    },
    { 
      title: 'Research Scientist', 
      description: 'Conduct experiments and analyze results in scientific fields',
      medianSalary: '$82,240',
      growth: '8% (Faster than average)',
      education: "PhD often required",
      skills: ['Research Methodology', 'Data Analysis', 'Scientific Writing', 'Critical Thinking']
    },
    { 
      title: 'Software Developer', 
      description: 'Design, develop, and test software applications',
      medianSalary: '$120,730',
      growth: '25% (Much faster than average)',
      education: "Bachelor's degree",
      skills: ['Programming Languages', 'Problem-solving', 'Algorithms', 'Software Design']
    }
  ],
  A: [
    { 
      title: 'Graphic Designer', 
      description: 'Create visual concepts to communicate ideas',
      medianSalary: '$57,990',
      growth: '3% (Slower than average)',
      education: "Bachelor's degree",
      skills: ['Adobe Creative Suite', 'Typography', 'Color Theory', 'Visual Communication']
    },
    { 
      title: 'Writer/Author', 
      description: 'Create written content for various media',
      medianSalary: '$73,150',
      growth: '4% (As fast as average)',
      education: "Bachelor's degree helpful",
      skills: ['Writing', 'Research', 'Creativity', 'Storytelling']
    },
    { 
      title: 'Art Director', 
      description: 'Oversee visual style and images in publications',
      medianSalary: '$105,180',
      growth: '4% (As fast as average)',
      education: "Bachelor's degree",
      skills: ['Leadership', 'Visual Design', 'Project Management', 'Creative Direction']
    }
  ],
  S: [
    { 
      title: 'Teacher', 
      description: 'Educate students at various academic levels',
      medianSalary: '$63,240',
      growth: '4% (As fast as average)',
      education: "Bachelor's degree + certification",
      skills: ['Instruction', 'Classroom Management', 'Communication', 'Patience']
    },
    { 
      title: 'Social Worker', 
      description: 'Help individuals and families overcome challenges',
      medianSalary: '$55,350',
      growth: '9% (Faster than average)',
      education: "Bachelor's or Master's degree",
      skills: ['Counseling', 'Case Management', 'Empathy', 'Crisis Intervention']
    },
    { 
      title: 'Nurse', 
      description: 'Provide medical care and support to patients',
      medianSalary: '$81,220',
      growth: '6% (Faster than average)',
      education: "Bachelor's degree + licensure",
      skills: ['Medical Knowledge', 'Compassion', 'Attention to Detail', 'Communication']
    }
  ],
  E: [
    { 
      title: 'Marketing Manager', 
      description: 'Plan and execute marketing strategies',
      medianSalary: '$142,170',
      growth: '10% (Faster than average)',
      education: "Bachelor's degree",
      skills: ['Strategy Development', 'Market Research', 'Leadership', 'Communication']
    },
    { 
      title: 'Sales Manager', 
      description: 'Lead sales teams and develop sales strategies',
      medianSalary: '$132,290',
      growth: '5% (As fast as average)',
      education: "Bachelor's degree",
      skills: ['Sales Techniques', 'Team Leadership', 'Negotiation', 'Customer Relations']
    },
    { 
      title: 'Entrepreneur', 
      description: 'Start and grow new business ventures',
      medianSalary: 'Varies widely',
      growth: 'Varies by industry',
      education: 'Varies, business degree helpful',
      skills: ['Risk-taking', 'Innovation', 'Business Planning', 'Financial Management']
    }
  ],
  C: [
    { 
      title: 'Accountant', 
      description: 'Prepare and examine financial records',
      medianSalary: '$77,250',
      growth: '4% (As fast as average)',
      education: "Bachelor's degree",
      skills: ['Accounting Software', 'Mathematics', 'Attention to Detail', 'Analytical Thinking']
    },
    { 
      title: 'Financial Analyst', 
      description: 'Guide business decisions by analyzing financial data',
      medianSalary: '$96,220',
      growth: '9% (Faster than average)',
      education: "Bachelor's degree",
      skills: ['Financial Modeling', 'Excel', 'Data Analysis', 'Communication']
    },
    { 
      title: 'Administrative Services Manager', 
      description: 'Coordinate administrative activities',
      medianSalary: '$101,870',
      growth: '7% (Faster than average)',
      education: "Bachelor's degree",
      skills: ['Organization', 'Leadership', 'Budgeting', 'Process Improvement']
    }
  ]
});

export const getCompatibleTypes = (primary: HollandType): string[] => {
  const compatibilities: Record<HollandType, string[]> = {
    R: ['Realistic types work well with Investigative and Conventional types', 'They complement Artistic types through practical implementation', 'May find Social types too people-focused'],
    I: ['Investigative types work well with Realistic and Artistic types', 'They complement Conventional types through data analysis', 'May find Enterprising types too competitive'],
    A: ['Artistic types work well with Investigative and Social types', 'They complement Enterprising types through creative solutions', 'May find Conventional types too restrictive'],
    S: ['Social types work well with Artistic and Enterprising types', 'They complement Conventional types through team coordination', 'May find Realistic types too task-oriented'],
    E: ['Enterprising types work well with Social and Conventional types', 'They complement Realistic types through leadership', 'May find Investigative types too analytical'],
    C: ['Conventional types work well with Realistic and Enterprising types', 'They complement Investigative types through data organization', 'May find Artistic types too unstructured']
  };
  return compatibilities[primary];
};

export const getDevelopmentAreas = (primary: HollandType): string[] => {
  const areas: Record<HollandType, string[]> = {
    R: ['Develop interpersonal communication skills', 'Practice abstract thinking and creativity', 'Learn to work more collaboratively in teams'],
    I: ['Improve public speaking and presentation skills', 'Develop practical implementation abilities', 'Learn to work more effectively in teams'],
    A: ['Develop organizational and time management skills', 'Practice working within structured frameworks', 'Learn to accept constructive criticism'],
    S: ['Develop analytical and critical thinking skills', 'Practice setting boundaries in helping relationships', 'Learn to make decisions independently'],
    E: ['Develop active listening and empathy skills', 'Practice attention to detail in execution', 'Learn to value process as much as results'],
    C: ['Develop creative problem-solving skills', 'Practice flexibility and adaptability', 'Learn to take calculated risks']
  };
  return areas[primary];
};

export const getCareerAdvice = (primary: HollandType): string[] => {
  const advice: Record<HollandType, string[]> = {
    R: ['Seek hands-on training and certifications', 'Look for roles with clear, tangible outcomes', 'Consider apprenticeships in skilled trades', 'Build a portfolio of practical projects'],
    I: ['Pursue advanced degrees in your field of interest', 'Join professional associations and research groups', 'Seek mentorship from experienced researchers', 'Publish your findings and analyses'],
    A: ['Build a strong creative portfolio', 'Network within creative communities', 'Consider freelance or project-based work', 'Protect time for creative exploration'],
    S: ['Seek roles with direct people interaction', 'Look for organizations with strong cultures of support', 'Consider additional training in counseling or education', 'Join professional helping networks'],
    E: ['Seek leadership opportunities early in your career', 'Build a strong professional network', 'Look for roles with performance-based incentives', 'Consider entrepreneurship or business ownership'],
    C: ['Seek roles in established, stable organizations', 'Look for positions with clear processes and procedures', 'Consider certifications in your specific field', 'Build expertise in specialized software or systems']
  };
  return advice[primary];
};

export const getHollandResult = (scores: HollandScores): HollandResult => {
  const profile = determineHollandProfile(scores);
  const hollandCode = getHollandCode(profile);
  const profileName = getProfileName(profile);
  
  const descriptions = getTypeDescriptions();
  const characteristics = getCharacteristics();
  const workActivities = getWorkActivities();
  const workEnvironment = getWorkEnvironment();
  const suggestedCareers = getSuggestedCareers();
  const compatibleTypes = getCompatibleTypes(profile.primary);
  const developmentAreas = getDevelopmentAreas(profile.primary);
  const careerAdvice = getCareerAdvice(profile.primary);
  
  // Determine overall description
  const getOverallDescription = (): string => {
    const { primary, secondary, tertiary } = profile;
    const primaryScore = scores[primary];
    
    let intensity = '';
    if (primaryScore >= 90) intensity = 'very strongly ';
    else if (primaryScore >= 80) intensity = 'strongly ';
    else if (primaryScore >= 70) intensity = '';
    else intensity = 'moderately ';
    
    const baseDescription = `Your primary career interest is ${intensity}${descriptions[primary].toLowerCase().split('. ')[0]}`;
    
    if (secondary) {
      const secondaryScore = scores[secondary];
      const secondaryIntensity = secondaryScore >= 80 ? 'strong ' : secondaryScore >= 70 ? 'moderate ' : '';
      return `${baseDescription}, with ${secondaryIntensity}${descriptions[secondary].toLowerCase().split('. ')[0]} as an important secondary interest.`;
    }
    
    return `${baseDescription}.`;
  };
  
  // Determine color based on primary type
  const getColor = (primary: HollandType): string => {
    const colors = {
      R: 'bg-gradient-to-r from-orange-600 to-amber-600', // Orange for realistic
      I: 'bg-gradient-to-r from-green-600 to-emerald-700', // Green for investigative
      A: 'bg-gradient-to-r from-purple-600 to-pink-600', // Purple for artistic
      S: 'bg-gradient-to-r from-blue-600 to-indigo-700', // Blue for social
      E: 'bg-gradient-to-r from-red-600 to-rose-600', // Red for enterprising
      C: 'bg-gradient-to-r from-yellow-500 to-amber-600' // Yellow for conventional
    };
    return colors[primary];
  };

  return {
    scores,
    profile,
    descriptions,
    characteristics,
    workActivities,
    workEnvironment,
    suggestedCareers,
    compatibleTypes,
    developmentAreas,
    careerAdvice,
    overallStyle: profileName,
    overallDescription: getOverallDescription(),
    color: getColor(profile.primary),
    profileName,
    hollandCode
  };
};