import { CAPADomain, CAPAQuestion, CAPAScore, CAPAResult, UserAnswer } from './capa-types';

// Complete set of 70 questions across 6 cognitive domains
export const questions: CAPAQuestion[] = [
  // === VERBAL INTELLIGENCE (15 questions) ===
  {
    id: 'v1',
    domain: 'verbal',
    type: 'analogy',
    text: 'Book is to Library as Painting is to:',
    instruction: 'Complete the analogy',
    options: ['Gallery', 'Museum', 'Studio', 'Collection'],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 2,
    difficulty: 2
  },
  {
    id: 'v2',
    domain: 'verbal',
    type: 'analogy',
    text: 'Which word does not belong: Wisdom, Knowledge, Intelligence, Emotion, Cognition',
    instruction: 'Select the odd one out',
    options: ['Wisdom', 'Knowledge', 'Intelligence', 'Emotion', 'Cognition'],
    correctIndex: 3,
    answerType: 'multiple_choice',
    points: 3,
    difficulty: 3
  },
  {
    id: 'v3',
    domain: 'verbal',
    type: 'logic',
    text: 'If all A are B, and some B are C, which statement must be true?',
    instruction: 'Select the logically certain statement',
    options: [
      'Some A are C',
      'All A are C',
      'Some C are A',
      'Cannot determine'
    ],
    correctIndex: 3,
    answerType: 'multiple_choice',
    points: 4,
    difficulty: 4
  },
  {
    id: 'v5',
    domain: 'verbal',
    type: 'logic',
    text: 'All mammals are warm-blooded. Whales are mammals. Therefore:',
    instruction: 'Choose the valid conclusion',
    options: [
      'Whales are warm-blooded',
      'All warm-blooded animals are whales',
      'Some whales are not mammals',
      'Mammals live only in water'
    ],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 3,
    difficulty: 3
  },
  {
    id: 'v6',
    domain: 'verbal',
    type: 'analogy',
    text: 'Clock is to Time as Thermometer is to:',
    instruction: 'Complete the analogy',
    options: ['Temperature', 'Weather', 'Heat', 'Mercury'],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 2,
    difficulty: 2
  },
  {
    id: 'v7',
    domain: 'verbal',
    type: 'logic',
    text: 'Which word is most different: Mountain, River, Ocean, Forest, Valley',
    instruction: 'Select the odd one out',
    options: ['Mountain', 'River', 'Ocean', 'Forest', 'Valley'],
    correctIndex: 2,
    answerType: 'multiple_choice',
    points: 3,
    difficulty: 3
  },
  {
    id: 'v9',
    domain: 'verbal',
    type: 'logic',
    text: 'If no cats are dogs, and some dogs are pets, which is true?',
    instruction: 'Select the certain statement',
    options: [
      'Some cats are pets',
      'No cats are pets',
      'Some pets are not dogs',
      'Cannot determine'
    ],
    correctIndex: 3,
    answerType: 'multiple_choice',
    points: 4,
    difficulty: 4
  },
  {
    id: 'v10',
    domain: 'verbal',
    type: 'analogy',
    text: 'Pen is to Write as Knife is to:',
    instruction: 'Complete the analogy',
    options: ['Cut', 'Sharp', 'Steel', 'Tool'],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 2,
    difficulty: 2
  },
  {
    id: 'v13',
    domain: 'verbal',
    type: 'logic',
    text: 'Which pair of words has the same relationship as "cold : hot"?',
    instruction: 'Select the analogous pair',
    options: [
      'big : large',
      'wet : dry',
      'fast : quick',
      'happy : joyful'
    ],
    correctIndex: 1,
    answerType: 'multiple_choice',
    points: 3,
    difficulty: 3
  },
  {
    id: 'v15',
    domain: 'verbal',
    type: 'logic',
    text: 'All roses are flowers. Some flowers fade quickly. Therefore:',
    instruction: 'Select the valid conclusion',
    options: [
      'All roses fade quickly',
      'Some roses may fade quickly',
      'No roses fade quickly',
      'Flowers that fade quickly are always roses'
    ],
    correctIndex: 1,
    answerType: 'multiple_choice',
    points: 4,
    difficulty: 4
  },

  // === NUMERICAL INTELLIGENCE (15 questions) ===
  {
    id: 'n1',
    domain: 'numerical',
    type: 'sequence',
    text: 'What comes next: 2, 4, 8, 16, ___',
    instruction: 'Identify the pattern and continue',
    options: ['24', '32', '28', '30'],
    correctIndex: 1,
    answerType: 'multiple_choice',
    points: 2,
    difficulty: 2
  },
  {
    id: 'n2',
    domain: 'numerical',
    type: 'calculation',
    text: 'If 3 workers complete a task in 12 days, how many days for 4 workers?',
    instruction: 'Calculate the answer',
    options: ['9', '10', '8', '11'],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 3,
    difficulty: 3
  },
  {
    id: 'n3',
    domain: 'numerical',
    type: 'logic',
    text: 'In a group of 50 people, 30 speak English, 25 speak French, and 10 speak both. How many speak neither?',
    instruction: 'Calculate using set theory',
    options: ['5', '10', '15', '20'],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 4,
    difficulty: 4
  },
  {
    id: 'n4',
    domain: 'numerical',
    type: 'sequence',
    text: 'What comes next: 1, 4, 9, 16, 25, ___',
    instruction: 'Identify the pattern',
    options: ['36', '49', '30', '40'],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 3,
    difficulty: 3
  },
  {
    id: 'n5',
    domain: 'numerical',
    type: 'calculation',
    text: 'A shirt costs $40 after a 20% discount. What was the original price?',
    instruction: 'Calculate the original price',
    options: ['$48', '$50', '$52', '$45'],
    correctIndex: 1,
    answerType: 'multiple_choice',
    points: 4,
    difficulty: 4
  },
  {
    id: 'n7',
    domain: 'numerical',
    type: 'calculation',
    text: 'If 3x + 7 = 22, what is x?',
    instruction: 'Solve for x',
    options: ['5', '4', '6', '3'],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 3,
    difficulty: 3
  },
  {
    id: 'n9',
    domain: 'numerical',
    type: 'sequence',
    text: 'What comes next: 1, 3, 6, 10, 15, ___',
    instruction: 'Identify the triangular number pattern',
    options: ['21', '25', '20', '18'],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 3,
    difficulty: 3
  },
  {
    id: 'n10',
    domain: 'numerical',
    type: 'calculation',
    text: 'A train travels 300 km in 4 hours. What is its average speed?',
    instruction: 'Calculate speed',
    options: ['75 km/h', '80 km/h', '70 km/h', '65 km/h'],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 2,
    difficulty: 2
  },
  {
    id: 'n12',
    domain: 'numerical',
    type: 'sequence',
    text: 'What comes next: 2, 3, 5, 7, 11, ___',
    instruction: 'Identify the prime number sequence',
    options: ['13', '15', '17', '19'],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 4,
    difficulty: 4
  },
  {
    id: 'n15',
    domain: 'numerical',
    type: 'calculation',
    text: 'If a recipe requires 2 cups of flour for 8 cookies, how much flour for 20 cookies?',
    instruction: 'Calculate proportion',
    options: ['5 cups', '4 cups', '6 cups', '3 cups'],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 3,
    difficulty: 3
  },

  // === SPATIAL INTELLIGENCE (10 questions) ===
  {
    id: 's1',
    domain: 'spatial',
    type: 'rotation',
    text: 'Which cube matches the unfolded pattern?\n(Imagine a cube with: front=★, top=⬤, right=▲, left=⬟, back=⬢, bottom=⬥)',
    instruction: 'Visualize the 3D shape from its net',
    options: [
      'Cube A: Front=★, Top=⬤, Right=▲',
      'Cube B: Front=▲, Top=★, Right=⬤',
      'Cube C: Front=⬤, Top=▲, Right=★',
      'Cube D: Front=★, Top=▲, Right=⬤'
    ],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 5,
    difficulty: 4
  },
  {
    id: 's2',
    domain: 'spatial',
    type: 'pattern',
    text: 'Which shape completes the pattern?\n⬤ □ ▲ ⬤ □ ▲ ⬤ □ ?',
    instruction: 'Identify the pattern rule',
    options: ['▲', '□', '⬤', '●'],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 3,
    difficulty: 3
  },
  {
    id: 's3',
    domain: 'spatial',
    type: 'rotation',
    text: 'Imagine rotating this shape 90° clockwise:\n▲\n| |\n□ ○\nWhich arrangement results?',
    instruction: 'Visualize the rotation',
    options: [
      '○ □\n  ▲',
      '□ ○\n▲',
      '▲ □\n○',
      '□ ▲\n○'
    ],
    correctIndex: 3,
    answerType: 'multiple_choice',
    points: 4,
    difficulty: 4
  },
   {
    id: 's4',
    domain: 'spatial',
    type: 'pattern',
    text: 'Remember pattern: ★ □ ▲ ★ □ ?',
    instruction: 'What comes next in the pattern?',
    options: ['▲', '□', '★', '●'],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 4,
    difficulty: 3,
    timeLimit: 20
  },
  {
    id: 's5',
    domain: 'spatial',
    type: 'rotation',
    text: 'Which is the mirror image of: ▲ □ ○',
    instruction: 'Visualize the reflection',
    options: [
      '○ □ ▲',
      '▲ □ ○',
      '□ ▲ ○',
      '○ ▲ □'
    ],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 3,
    difficulty: 3
  },
  {
    id: 's6',
    domain: 'spatial',
    type: 'pattern',
    text: 'What comes next in the 3D sequence:\nCube → Sphere → Pyramid → ?',
    instruction: 'Identify the 3D shape pattern',
    options: ['Cylinder', 'Cone', 'Octahedron', 'Torus'],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 4,
    difficulty: 4
  },
  {
    id: 's8',
    domain: 'spatial',
    type: 'pattern',
    text: 'Complete the grid pattern:\nRow 1: ★ □ ★\nRow 2: □ ★ □\nRow 3: ★ □ ?',
    instruction: 'Identify the checkerboard pattern',
    options: ['★', '□', '▲', '●'],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 3,
    difficulty: 3
  },
  {
    id: 's9',
    domain: 'spatial',
    type: 'rotation',
    text: 'Which view shows the object from above?\n(Describe: Base=□, Top=▲, Sides=★)',
    instruction: 'Visualize top-down view',
    options: [
      '▲ with ★ on sides',
      '□ with ★ on sides',
      '★ with ▲ in center',
      '□ with ▲ in center'
    ],
    correctIndex: 3,
    answerType: 'multiple_choice',
    points: 5,
    difficulty: 5
  },

  // === WORKING MEMORY (10 questions) ===
  {
    id: 'm1',
    domain: 'memory',
    type: 'memory',
    text: 'Remember these items: Apple, River, Mountain, Clock, Bridge',
    instruction: 'You will be asked to recall them in order',
    options: [],
    answerType: 'text',
    correctAnswer: 'Apple,River,Mountain,Clock,Bridge',
    points: 5,
    difficulty: 3,
    timeLimit: 15
  },
  {
    id: 'm2',
    domain: 'memory',
    type: 'memory',
    text: 'Memorize these numbers: 7, 2, 9, 4, 6',
    instruction: 'Repeat them in reverse order',
    options: [],
    answerType: 'text',
    correctAnswer: '6,4,9,2,7',
    points: 5,
    difficulty: 4,
    timeLimit: 15
  },
  {
    id: 'm3',
    domain: 'memory',
    type: 'memory',
    text: 'Memorize this sequence: Red, Blue, Green, Yellow, Black',
    instruction: 'Recall colors in correct order',
    options: [],
    answerType: 'text',
    correctAnswer: 'Red,Blue,Green,Yellow,Black',
    points: 4,
    difficulty: 3,
    timeLimit: 15
  },
  {
    id: 'm5',
    domain: 'memory',
    type: 'memory',
    text: 'Memorize: Dog, Cat, Bird, Fish, Turtle',
    instruction: 'Recall animals in alphabetical order',
    options: [],
    answerType: 'text',
    correctAnswer: 'Bird,Cat,Dog,Fish,Turtle',
    points: 5,
    difficulty: 4,
    timeLimit: 20
  },
  {
    id: 'm8',
    domain: 'memory',
    type: 'memory',
    text: 'Remember numbers: 3, 8, 1, 7, 9, 4',
    instruction: 'Add first and last number, then middle two',
    options: [],
    answerType: 'number',
    correctAnswer: '14',
    points: 5,
    difficulty: 4,
    timeLimit: 20
  },
  {
    id: 'm10',
    domain: 'memory',
    type: 'memory',
    text: 'Remember: 4729 1835 6041',
    instruction: 'Recall and add middle digits of each number',
    options: [],
    answerType: 'number',
    correctAnswer: '25',
    points: 7,
    difficulty: 5,
    timeLimit: 30
  },

  // === LOGICAL REASONING (10 questions) ===
  {
    id: 'r1',
    domain: 'reasoning',
    type: 'logic',
    text: 'All philosophers are thinkers. Some thinkers are writers. Which is true?',
    instruction: 'Select the certain conclusion',
    options: [
      'Some writers are philosophers',
      'All writers are thinkers',
      'Some philosophers are writers',
      'None of the above are certain'
    ],
    correctIndex: 3,
    answerType: 'multiple_choice',
    points: 4,
    difficulty: 4
  },
  {
    id: 'r2',
    domain: 'reasoning',
    type: 'logic',
    text: 'If some A are B, and no B are C, then:',
    instruction: 'What can be concluded about A and C?',
    options: [
      'Some A are not C',
      'No A are C',
      'Some C are A',
      'Cannot determine'
    ],
    correctIndex: 3,
    answerType: 'multiple_choice',
    points: 4,
    difficulty: 4
  },
  {
    id: 'r4',
    domain: 'reasoning',
    type: 'logic',
    text: 'If P implies Q, and Q is false, then:',
    instruction: 'What must be true about P?',
    options: [
      'P is true',
      'P is false',
      'P could be true or false',
      'Cannot determine'
    ],
    correctIndex: 1,
    answerType: 'multiple_choice',
    points: 4,
    difficulty: 4
  },
  {
    id: 'r5',
    domain: 'reasoning',
    type: 'logic',
    text: 'No birds are mammals. All bats are mammals. Therefore:',
    instruction: 'What follows logically?',
    options: [
      'Some birds are bats',
      'No bats are birds',
      'All mammals are bats',
      'Some mammals are birds'
    ],
    correctIndex: 1,
    answerType: 'multiple_choice',
    points: 3,
    difficulty: 3
  },
  {
    id: 'r7',
    domain: 'reasoning',
    type: 'logic',
    text: 'All squares are rectangles. All rectangles have four sides. Therefore:',
    instruction: 'What necessarily follows?',
    options: [
      'All four-sided shapes are squares',
      'Some squares have four sides',
      'All squares have four sides',
      'Some rectangles are not squares'
    ],
    correctIndex: 2,
    answerType: 'multiple_choice',
    points: 3,
    difficulty: 3
  },
  {
    id: 'r9',
    domain: 'reasoning',
    type: 'logic',
    text: 'No reptiles are mammals. All snakes are reptiles. Therefore:',
    instruction: 'What is necessarily true?',
    options: [
      'Some snakes are mammals',
      'No snakes are mammals',
      'All reptiles are snakes',
      'Some mammals are reptiles'
    ],
    correctIndex: 1,
    answerType: 'multiple_choice',
    points: 3,
    difficulty: 3
  },

  // === PROCESSING SPEED (10 tasks) ===
  {
    id: 'p1',
    domain: 'processing',
    type: 'speed',
    text: 'Mark all matching symbols within 30 seconds:\nTarget: ★\nFind: ★ □ ▲ ★ ● ■ ★ ◆',
    instruction: 'Count how many ★ symbols you see',
    options: ['3', '4', '5', '2'],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 3,
    timeLimit: 30,
    difficulty: 2
  },
  {
    id: 'p3',
    domain: 'processing',
    type: 'speed',
    text: 'Find the odd one out quickly: 12, 15, 18, 22, 24',
    instruction: 'Which number doesn\'t belong?',
    options: ['12', '22', '15', '18'],
    correctIndex: 1,
    answerType: 'multiple_choice',
    points: 3,
    timeLimit: 20,
    difficulty: 3
  },
  {
    id: 'p5',
    domain: 'processing',
    type: 'speed',
    text: 'Visual scanning: How many triangles?\n▲ ▲ □ ▲ ■ ▲ ● ▲',
    instruction: 'Count all triangle symbols',
    options: ['4', '5', '6', '3'],
    correctIndex: 1,
    answerType: 'multiple_choice',
    points: 3,
    timeLimit: 20,
    difficulty: 3
  },
  {
    id: 'p7',
    domain: 'processing',
    type: 'speed',
    text: 'Symbol matching: Match ★ with identical symbols\n★ ☆ ★ ⭐ ★ ✰ ★',
    instruction: 'Count identical stars (★ not ☆ ⭐ ✰)',
    options: ['3', '4', '5', '2'],
    correctIndex: 1,
    answerType: 'multiple_choice',
    points: 3,
    timeLimit: 25,
    difficulty: 3
  },
  {
    id: 'p9',
    domain: 'processing',
    type: 'speed',
    text: 'Visual discrimination: Find different shape\n□ □ ■ □ □ □',
    instruction: 'Which position has the different shape?',
    options: ['3rd', '1st', '2nd', '4th'],
    correctIndex: 0,
    answerType: 'multiple_choice',
    points: 3,
    timeLimit: 20,
    difficulty: 3
  }
];

// Utility function to get max possible scores per domain
export const getMaxDomainScores = (): Record<CAPADomain, number> => {
  const maxScores: Record<CAPADomain, number> = {
    verbal: 0,
    numerical: 0,
    spatial: 0,
    memory: 0,
    reasoning: 0,
    processing: 0
  };

  questions.forEach(question => {
    maxScores[question.domain] += question.points;
  });

  return maxScores;
};

// Calculate percentiles based on raw scores
const calculatePercentiles = (scores: Record<CAPADomain, number>): Record<CAPADomain, number> => {
  const maxScores = getMaxDomainScores();
  
  return Object.keys(scores).reduce((acc, domain) => {
    const rawScore = scores[domain as CAPADomain];
    const maxScore = maxScores[domain as CAPADomain];
    const percentile = Math.round((rawScore / maxScore) * 100);
    return {
      ...acc,
      [domain]: Math.min(100, Math.max(0, percentile)) // Clamp between 0-100
    };
  }, {} as Record<CAPADomain, number>);
};

// Calculate composite percentile (average of all domains)
const calculateCompositePercentile = (percentiles: Record<CAPADomain, number>): number => {
  const values = Object.values(percentiles);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.round(avg);
};

// Calculate confidence band (wider at extremes, narrower in middle)
const calculateConfidenceBand = (percentile: number): [number, number] => {
  // More precise in middle (50th percentile), wider at extremes
  const margin = Math.max(3, 15 - Math.abs(percentile - 50) / 10);
  return [
    Math.max(0, Math.round(percentile - margin)),
    Math.min(100, Math.round(percentile + margin))
  ];
};

// Determine cognitive profile from domain scores
const determineProfileFromScores = (percentiles: Record<CAPADomain, number>): string => {
  const { verbal, numerical, spatial, memory, reasoning, processing } = percentiles;
  
  // Analytical Strategist: Strong reasoning and numerical
  if (reasoning >= 80 && numerical >= 75 && reasoning >= verbal + 10) {
    return 'Analytical Strategist';
  }
  
  // Creative Synthesizer: Strong verbal and spatial
  if (verbal >= 80 && spatial >= 75 && verbal >= numerical + 10) {
    return 'Creative Synthesizer';
  }
  
  // Practical Implementor: Strong memory and processing speed
  if (memory >= 80 && processing >= 75 && processing >= reasoning + 10) {
    return 'Practical Implementor';
  }
  
  // Balanced Integrator: All scores within 20 points of each other
  const scores = [verbal, numerical, spatial, memory, reasoning, processing];
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  if (max - min <= 20) {
    return 'Balanced Integrator';
  }
  
  // Default based on highest score
  const domains: CAPADomain[] = ['verbal', 'numerical', 'spatial', 'memory', 'reasoning', 'processing'];
  const highestDomain = domains.reduce((a, b) => percentiles[a] > percentiles[b] ? a : b);
  
  switch (highestDomain) {
    case 'reasoning':
    case 'numerical':
      return 'Analytical Strategist';
    case 'verbal':
    case 'spatial':
      return 'Creative Synthesizer';
    case 'memory':
    case 'processing':
      return 'Practical Implementor';
    default:
      return 'Balanced Integrator';
  }
};

// Scoring algorithm
export const calculateCAPAScores = (
  answers: UserAnswer[],
  timeTaken: number
): CAPAScore => {
  const domainScores: Record<CAPADomain, number> = {
    verbal: 0,
    numerical: 0,
    spatial: 0,
    memory: 0,
    reasoning: 0,
    processing: 0
  };

  let totalPoints = 0;

  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question && answer.isCorrect && !answer.skipped) {
      domainScores[question.domain] += question.points;
      totalPoints += question.points;
    }
  });

  // Calculate percentiles
  const percentiles = calculatePercentiles(domainScores);
  const compositePercentile = calculateCompositePercentile(percentiles);
  const profile = determineProfileFromScores(percentiles);
  
  return {
    ...domainScores,
    rawTotal: totalPoints,
    percentile: compositePercentile,
    cognitiveProfile: profile,
    confidenceBand: calculateConfidenceBand(compositePercentile),
    testDuration: timeTaken / 60 // Convert to minutes
  };
};

// Profile determination
export const getCognitiveProfile = (score: CAPAScore): CAPAResult => {
  const profiles: Record<string, CAPAResult> = {
    'Analytical Strategist': {
      profileType: 'AS',
      name: 'Analytical Strategist',
      description: 'Exceptional logical reasoning and problem-solving abilities. Excel at breaking down complex problems into manageable components. Prefer data-driven decisions and systematic approaches.',
      cognitiveStrengths: ['Logical Analysis', 'Pattern Recognition', 'Systematic Thinking', 'Decision Making', 'Quantitative Reasoning'],
      cognitiveChallenges: ['Quick Intuitive Decisions', 'Emotional Processing', 'Multitasking', 'Abstract Creativity'],
      learningStyles: ['Structured Learning', 'Logical Sequencing', 'Case Studies', 'Problem-Based Learning'],
      careerSuggestions: ['Data Scientist', 'Systems Analyst', 'Software Architect', 'Research Scientist', 'Financial Analyst'],
      famousSimilarProfiles: ['Alan Turing', 'Ada Lovelace', 'John Nash', 'Stephen Hawking'],
      percentile: score.percentile,
      color: 'bg-gradient-to-r from-blue-600 to-indigo-700',
      brainAreas: ['Prefrontal Cortex', 'Parietal Lobe', 'Left Hemisphere'],
      thinkingStyle: 'Systematic & Analytical'
    },
    'Creative Synthesizer': {
      profileType: 'CS',
      name: 'Creative Synthesizer',
      description: 'Outstanding ability to connect disparate ideas and create novel solutions. Excellent verbal and spatial intelligence with strong conceptual thinking and imaginative capacity.',
      cognitiveStrengths: ['Creative Thinking', 'Conceptual Integration', 'Verbal Fluency', 'Visual Imagination', 'Metaphorical Thinking'],
      cognitiveChallenges: ['Routine Tasks', 'Detailed Focus', 'Repetitive Work', 'Linear Processing'],
      learningStyles: ['Concept Mapping', 'Visual Learning', 'Project-Based', 'Metaphor & Analogy'],
      careerSuggestions: ['Innovation Consultant', 'Creative Director', 'Architect', 'Writer', 'UX Designer'],
      famousSimilarProfiles: ['Leonardo da Vinci', 'Steve Jobs', 'Marie Curie', 'Albert Einstein'],
      percentile: score.percentile,
      color: 'bg-gradient-to-r from-purple-600 to-pink-600',
      brainAreas: ['Temporal Lobes', 'Right Hemisphere', 'Default Mode Network'],
      thinkingStyle: 'Integrative & Creative'
    },
    'Practical Implementor': {
      profileType: 'PI',
      name: 'Practical Implementor',
      description: 'Strong working memory and processing speed. Excellent at executing plans, managing complex operations, and maintaining focus under pressure. Highly efficient and detail-oriented.',
      cognitiveStrengths: ['Working Memory', 'Processing Speed', 'Task Management', 'Attention to Detail', 'Procedural Memory'],
      cognitiveChallenges: ['Abstract Theory', 'Long-term Strategy', 'Conceptual Thinking', 'Big Picture Vision'],
      learningStyles: ['Hands-on Practice', 'Step-by-step Instructions', 'Repetition', 'Simulation'],
      careerSuggestions: ['Project Manager', 'Surgeon', 'Air Traffic Controller', 'Financial Trader', 'Software Developer'],
      famousSimilarProfiles: ['Florence Nightingale', 'Henry Ford', 'Grace Hopper', 'Elon Musk'],
      percentile: score.percentile,
      color: 'bg-gradient-to-r from-green-600 to-teal-600',
      brainAreas: ['Frontal Lobes', 'Basal Ganglia', 'Cerebellum'],
      thinkingStyle: 'Pragmatic & Efficient'
    },
    'Balanced Integrator': {
      profileType: 'BI',
      name: 'Balanced Integrator',
      description: 'Well-rounded cognitive abilities across all domains. Adaptable and capable in diverse situations with strong social intelligence and holistic thinking patterns.',
      cognitiveStrengths: ['Adaptability', 'Versatility', 'Emotional Intelligence', 'Social Cognition', 'Holistic Processing'],
      cognitiveChallenges: ['Extreme Specialization', 'Niche Expertise', 'Depth in Single Area', 'Technical Focus'],
      learningStyles: ['Mixed Methods', 'Social Learning', 'Experiential', 'Collaborative'],
      careerSuggestions: ['General Manager', 'Entrepreneur', 'Diplomat', 'Teacher', 'Psychologist'],
      famousSimilarProfiles: ['Benjamin Franklin', 'Winston Churchill', 'Nelson Mandela', 'Oprah Winfrey'],
      percentile: score.percentile,
      color: 'bg-gradient-to-r from-gray-600 to-blue-500',
      brainAreas: ['Whole Brain Integration', 'Corpus Callosum', 'Anterior Cingulate'],
      thinkingStyle: 'Holistic & Adaptive'
    }
  };

  return profiles[score.cognitiveProfile] || profiles['Balanced Integrator'];
};

// Domain descriptions
export const getDomainDescription = (domain: CAPADomain): { 
  name: string; 
  description: string; 
  icon: string;
  brainArea: string;
  typicalProfessions: string[];
} => {
  const domains = {
    verbal: {
      name: 'Verbal Intelligence',
      description: 'Ability to understand, use, and manipulate language. Involves vocabulary, verbal reasoning, language comprehension, and verbal fluency.',
      icon: '🔤',
      brainArea: 'Left Temporal Lobe (Wernicke\'s & Broca\'s areas)',
      typicalProfessions: ['Writer', 'Lawyer', 'Teacher', 'Journalist']
    },
    numerical: {
      name: 'Numerical Intelligence',
      description: 'Capacity to understand and work with numbers, mathematical concepts, logical relationships, and quantitative reasoning.',
      icon: '🔢',
      brainArea: 'Parietal Lobe (Angular Gyrus, Intraparietal Sulcus)',
      typicalProfessions: ['Engineer', 'Accountant', 'Data Analyst', 'Researcher']
    },
    spatial: {
      name: 'Spatial Intelligence',
      description: 'Ability to visualize and manipulate objects in space, recognize patterns, understand spatial relationships, and mental rotation.',
      icon: '🧭',
      brainArea: 'Right Parietal Lobe, Occipital Lobe',
      typicalProfessions: ['Architect', 'Pilot', 'Surgeon', 'Graphic Designer']
    },
    memory: {
      name: 'Working Memory',
      description: 'Capacity to hold and manipulate information in mind over short periods. Essential for reasoning, learning, and complex cognitive tasks.',
      icon: '🧠',
      brainArea: 'Prefrontal Cortex, Hippocampus',
      typicalProfessions: ['Programmer', 'Translator', 'Chess Player', 'Scientist']
    },
    reasoning: {
      name: 'Logical Reasoning',
      description: 'Ability to analyze information, draw conclusions, solve problems using logical principles, and identify patterns in abstract information.',
      icon: '⚖️',
      brainArea: 'Frontal Lobe, Prefrontal Cortex',
      typicalProfessions: ['Detective', 'Strategist', 'Philosopher', 'Consultant']
    },
    processing: {
      name: 'Processing Speed',
      description: 'Speed at which cognitive tasks can be performed, including attention, perception, decision-making, and simple cognitive operations.',
      icon: '⚡',
      brainArea: 'Basal Ganglia, White Matter Tracts',
      typicalProfessions: ['Trader', 'Athlete', 'Emergency Responder', 'Performer']
    }
  };
  
  return domains[domain];
};

// Calculate time bonus for speed questions
export const calculateSpeedBonus = (answers: UserAnswer[]): number => {
  const speedQuestions = answers.filter(a => {
    const q = questions.find(q => q.id === a.questionId);
    return q?.domain === 'processing';
  });
  
  if (speedQuestions.length === 0) return 0;
  
  // Calculate average time per speed question
  const totalTime = speedQuestions.reduce((sum, a) => sum + a.timeTaken, 0);
  const avgTime = totalTime / speedQuestions.length;
  
  // Bonus points for faster responses (under 15 seconds average)
  if (avgTime < 10) return 10;
  if (avgTime < 15) return 7;
  if (avgTime < 20) return 5;
  if (avgTime < 25) return 3;
  return 0;
};

// Check if answer is correct for text/number answers
export const checkTextAnswer = (questionId: string, userAnswer: string): boolean => {
  const question = questions.find(q => q.id === questionId);
  if (!question || question.answerType === 'multiple_choice') return false;
  
  const userAns = userAnswer.trim().toLowerCase();
  const correctAns = question.correctAnswer?.toString().trim().toLowerCase();
  
  if (!correctAns) return false;
  
  // For memory sequences, allow flexible formatting
  if (question.type === 'memory') {
    const userParts = userAns.split(/[,\s]+/).filter(Boolean);
    const correctParts = correctAns.split(/[,\s]+/).filter(Boolean);
    
    if (userParts.length !== correctParts.length) return false;
    
    // Check for exact sequence match
    return userParts.every((part, i) => part === correctParts[i]);
  }
  
  // For numeric answers, allow numeric comparison
  if (question.answerType === 'number') {
    const userNum = parseFloat(userAns);
    const correctNum = parseFloat(correctAns);
    return !isNaN(userNum) && !isNaN(correctNum) && Math.abs(userNum - correctNum) < 0.01;
  }
  
  // For text answers, exact match (case-insensitive)
  return userAns === correctAns;
};

export const checkMemoryAnswer = (questionId: string, userAnswer: string): boolean => {
  const question = questions.find(q => q.id === questionId);
  if (!question || question.domain !== 'memory') return false;

  const normalizedUser = userAnswer
    .toLowerCase()
    .replace(/[^\w\s]/g, '')           // remove punctuation
    .replace(/\s+/g, ' ')              // normalize spaces
    .trim();

  const correct = question.correctAnswer as string;
  const normalizedCorrect = correct
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Allow comma or space separation
  const userItems = normalizedUser.split(/[\s,]+/).filter(Boolean);
  const correctItems = normalizedCorrect.split(/[\s,]+/).filter(Boolean);

  if (userItems.length !== correctItems.length) return false;

  return userItems.every((item, i) => item === correctItems[i]);
};