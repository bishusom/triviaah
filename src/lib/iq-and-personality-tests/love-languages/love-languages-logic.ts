import {
  LoveLanguageType,
  LoveLanguageQuestion,
  LoveLanguageScores,
  LoveLanguageResult,
  LoveLanguageProfile,
  UserLoveLanguageAnswer
} from './love-languages-types';

export const loveLanguageQuestions: LoveLanguageQuestion[] = [
  // Words of Affirmation (WA)
  { id: 'WA1', text: 'I feel most loved when my partner says "I love you" or gives me compliments', language: 'WA', reverse: false, category: 'Verbal' },
  { id: 'WA2', text: 'Hearing words of encouragement and appreciation makes me feel valued', language: 'WA', reverse: false, category: 'Verbal' },
  { id: 'WA3', text: 'I appreciate when my partner writes me love notes or texts sweet messages', language: 'WA', reverse: false, category: 'Written' },
  { id: 'WA4', text: 'Kind words are more important to me than gifts or physical affection', language: 'WA', reverse: false, category: 'Priority' },
  { id: 'WA5', text: 'Public praise or recognition from my partner means a lot to me', language: 'WA', reverse: false, category: 'Public' },
  { id: 'WA6', text: 'I don\'t need gifts or acts of service if my partner expresses love verbally', language: 'WA', reverse: true, category: 'Alternative' },
  
  // Acts of Service (AS)
  { id: 'AS1', text: 'I feel loved when my partner helps with chores or tasks without being asked', language: 'AS', reverse: false, category: 'Helpful' },
  { id: 'AS2', text: 'When my partner goes out of their way to make my life easier, I feel cherished', language: 'AS', reverse: false, category: 'Effort' },
  { id: 'AS3', text: 'Making me breakfast or doing something practical shows me love more than words', language: 'AS', reverse: false, category: 'Practical' },
  { id: 'AS4', text: 'I appreciate when my partner remembers and takes care of small details for me', language: 'AS', reverse: false, category: 'Attention' },
  { id: 'AS5', text: 'Actions speak louder than words when it comes to expressing love', language: 'AS', reverse: false, category: 'Philosophy' },
  { id: 'AS6', text: 'A partner who shares responsibilities without complaint makes me feel secure', language: 'AS', reverse: false, category: 'Teamwork' },
  
  // Receiving Gifts (RG)
  { id: 'RG1', text: 'Thoughtful gifts, no matter how small, make me feel deeply loved', language: 'RG', reverse: false, category: 'Thoughtful' },
  { id: 'RG2', text: 'I appreciate when my partner remembers special occasions with gifts', language: 'RG', reverse: false, category: 'Occasions' },
  { id: 'RG3', text: 'The effort my partner puts into choosing a gift matters more than its cost', language: 'RG', reverse: false, category: 'Effort' },
  { id: 'RG4', text: 'A physical token of love helps me feel connected to my partner', language: 'RG', reverse: false, category: 'Token' },
  { id: 'RG5', text: 'Surprise gifts make me feel especially loved and remembered', language: 'RG', reverse: false, category: 'Surprise' },
  { id: 'RG6', text: 'I cherish gifts because they serve as lasting reminders of my partner\'s love', language: 'RG', reverse: false, category: 'Memory' },
  
  // Quality Time (QT)
  { id: 'QT1', text: 'Undivided attention from my partner makes me feel most loved', language: 'QT', reverse: false, category: 'Attention' },
  { id: 'QT2', text: 'I value deep conversations and shared activities more than gifts or words', language: 'QT', reverse: false, category: 'Connection' },
  { id: 'QT3', text: 'Having my partner\'s full focus, without distractions, is precious to me', language: 'QT', reverse: false, category: 'Focus' },
  { id: 'QT4', text: 'Creating memories together through shared experiences builds our connection', language: 'QT', reverse: false, category: 'Experiences' },
  { id: 'QT5', text: 'I feel distant from my partner when we don\'t spend meaningful time together', language: 'QT', reverse: false, category: 'Need' },
  { id: 'QT6', text: 'Regular date nights or special time together keeps our relationship strong', language: 'QT', reverse: false, category: 'Consistency' },
  
  // Physical Touch (PT)
  { id: 'PT1', text: 'Physical affection like holding hands or hugging makes me feel secure and loved', language: 'PT', reverse: false, category: 'Affection' },
  { id: 'PT2', text: 'I feel disconnected from my partner without regular physical contact', language: 'PT', reverse: false, category: 'Connection' },
  { id: 'PT3', text: 'A loving touch can communicate more than words ever could', language: 'PT', reverse: false, category: 'Communication' },
  { id: 'PT4', text: 'Physical intimacy is an important way for me to feel emotionally connected', language: 'PT', reverse: false, category: 'Intimacy' },
  { id: 'PT5', text: 'I appreciate when my partner initiates physical affection without prompting', language: 'PT', reverse: false, category: 'Initiative' },
  { id: 'PT6', text: 'Small touches throughout the day help me feel loved and connected', language: 'PT', reverse: false, category: 'Consistency' }
];

export const calculateLoveLanguageScores = (answers: UserLoveLanguageAnswer[]): LoveLanguageScores => {
  const scores: LoveLanguageScores = { WA: 0, AS: 0, RG: 0, QT: 0, PT: 0 };
  
  answers.forEach(answer => {
    const question = loveLanguageQuestions.find(q => q.id === answer.questionId);
    let adjustedAnswer = answer.answer;
    if (question?.reverse) {
      adjustedAnswer = 6 - answer.answer; // Reverse score (1-5 scale)
    }
    scores[answer.language] += adjustedAnswer;
  });

  // Normalize scores to 0-100 range
  const maxPossibleScore = 5 * 6; // 5 questions per language, max 5 points each
  (Object.keys(scores) as LoveLanguageType[]).forEach(language => {
    const languageAnswers = answers.filter(a => a.language === language).length;
    const maxScoreForLanguage = languageAnswers * 5;
    if (maxScoreForLanguage > 0) {
      scores[language] = Math.round((scores[language] / maxScoreForLanguage) * 100);
    }
  });

  return scores;
};

export const determineLoveLanguageProfile = (scores: LoveLanguageScores): LoveLanguageProfile => {
  const scoreEntries = Object.entries(scores) as [LoveLanguageType, number][];
  
  // Sort by score descending
  const sorted = [...scoreEntries].sort((a, b) => b[1] - a[1]);
  
  const primary = sorted[0][0];
  const secondary = sorted[1][1] > 70 ? sorted[1][0] : null;
  const tertiary = sorted[2][1] > 60 ? sorted[2][0] : null;
  const fourth = sorted[3][1] > 50 ? sorted[3][0] : null;
  const fifth = sorted[4][0];

  return {
    primary,
    secondary,
    tertiary,
    fourth,
    fifth
  };
};

export const getProfileName = (profile: LoveLanguageProfile): string => {
  const { primary } = profile;
  
  const profileNames: Record<LoveLanguageType, string> = {
    'WA': 'Words of Affirmation',
    'AS': 'Acts of Service',
    'RG': 'Receiving Gifts',
    'QT': 'Quality Time',
    'PT': 'Physical Touch'
  };

  return profileNames[primary];
};

export const getTypeDescriptions = (): Record<LoveLanguageType, string> => ({
  WA: 'You feel most loved when your partner expresses affection through spoken words, praise, or appreciation. Verbal compliments mean the world to you, and hearing "I love you" is important. Insults or harsh words can be particularly hurtful.',
  AS: 'You feel most loved when your partner does things for you that make your life easier or better. Actions speak louder than words for you. When your partner helps with tasks or takes initiative to support you, it shows they care.',
  RG: 'You feel most loved when you receive thoughtful gifts that show you were remembered. The gift itself is a symbol of love and thoughtfulness. It\'s not about materialism but the emotional thought behind the gift.',
  QT: 'You feel most loved when you have your partner\'s undivided attention. Quality conversations, shared activities, and simply being together make you feel connected. Distractions or postponed dates can make you feel unimportant.',
  PT: 'You feel most loved through physical touch. Holding hands, hugs, kisses, and other physical expressions of love make you feel secure and connected. Physical presence and accessibility are crucial to you.'
});

export const getExpressions = (): Record<LoveLanguageType, string[]> => ({
  WA: [
    'Give genuine compliments frequently',
    'Say "I love you" often and meaningfully',
    'Leave loving notes or texts',
    'Express appreciation for little things',
    'Use encouraging words during difficult times'
  ],
  AS: [
    'Help with chores without being asked',
    'Make breakfast or coffee for your partner',
    'Take care of errands or tasks',
    'Fix something that\'s broken',
    'Prepare a special meal'
  ],
  RG: [
    'Give thoughtful gifts "just because"',
    'Remember special occasions with meaningful gifts',
    'Bring home their favorite treat',
    'Create handmade or personalized gifts',
    'Pay attention to things they mention wanting'
  ],
  QT: [
    'Plan regular date nights',
    'Have device-free conversations',
    'Take walks together',
    'Try new activities together',
    'Simply sit and talk without distractions'
  ],
  PT: [
    'Hold hands while walking',
    'Give hugs throughout the day',
    'Sit close while watching TV',
    'Give back rubs or massages',
    'Initiate physical affection'
  ]
});

export const getNeeds = (): Record<LoveLanguageType, string[]> => ({
  WA: [
    'Regular verbal affirmation',
    'Compliments about specific qualities',
    'Words of encouragement during challenges',
    'Hearing "I love you" daily',
    'Positive feedback and praise'
  ],
  AS: [
    'Help with daily responsibilities',
    'Partnership in household tasks',
    'Proactive support without asking',
    'Follow-through on promises',
    'Practical demonstrations of care'
  ],
  RG: [
    'Thoughtful gifts that show you listen',
    'Surprise tokens of affection',
    'Meaningful gifts for special occasions',
    'Flowers or small gifts "just because"',
    'Gifts that require thought and effort'
  ],
  QT: [
    'Undivided attention during conversations',
    'Regular quality time together',
    'Shared experiences and activities',
    'Eye contact and active listening',
    'Consistent date nights'
  ],
  PT: [
    'Regular physical affection',
    'Non-sexual touch throughout the day',
    'Physical closeness during activities',
    'Comforting touch during stress',
    'Initiation of physical contact'
  ]
});

export const getCommunicationTips = (): Record<LoveLanguageType, string[]> => ({
  WA: [
    'Use specific, sincere compliments',
    'Express gratitude regularly',
    'Write love notes or letters',
    'Verbalize your feelings often',
    'Avoid harsh criticism or sarcasm'
  ],
  AS: [
    'Notice what needs to be done',
    'Take initiative without being asked',
    'Ask "How can I help you today?"',
    'Complete tasks you promise to do',
    'Pay attention to small helpful actions'
  ],
  RG: [
    'Remember important dates',
    'Notice what they admire or mention',
    'Give gifts that show you listen',
    'Wrap gifts thoughtfully',
    'Include a meaningful note with gifts'
  ],
  QT: [
    'Put away phones during time together',
    'Plan activities you both enjoy',
    'Be fully present during conversations',
    'Schedule regular quality time',
    'Create new experiences together'
  ],
  PT: [
    'Initiate physical contact regularly',
    'Learn what types of touch they prefer',
    'Be physically present and available',
    'Use touch to comfort and connect',
    'Respect boundaries while being affectionate'
  ]
});

export const getPartnerTips = (): Record<LoveLanguageType, string[]> => ({
  WA: [
    'Compliment their appearance and character',
    'Say "I love you" in different ways',
    'Acknowledge their efforts and achievements',
    'Use their love language even if it\'s not yours',
    'Be generous with words of affirmation'
  ],
  AS: [
    'Do tasks before they ask',
    'Notice what would make their day easier',
    'Help with their responsibilities',
    'Make their favorite meal unexpectedly',
    'Take care of something they\'ve been putting off'
  ],
  RG: [
    'Give gifts that show you pay attention',
    'Remember anniversaries and special dates',
    'Surprise them with small, thoughtful gifts',
    'Put effort into gift wrapping and presentation',
    'Give gifts that create memories'
  ],
  QT: [
    'Plan surprise dates or activities',
    'Listen actively without distractions',
    'Ask thoughtful questions about their day',
    'Create rituals or traditions together',
    'Make time for them a priority'
  ],
  PT: [
    'Initiate hugs and kisses daily',
    'Hold hands in public and private',
    'Give massages or back rubs',
    'Sit close when you\'re together',
    'Use touch to show support during stress'
  ]
});

export const getCommonMisunderstandings = (): Record<LoveLanguageType, string[]> => ({
  WA: [
    'Thinking they\'re "needy" or insecure',
    'Misinterpreting their need for words as superficial',
    'Forgetting that silence can feel like rejection',
    'Not realizing how much harsh words hurt them',
    'Assuming actions speak louder than words for everyone'
  ],
  AS: [
    'Thinking they\'re controlling or demanding',
    'Misunderstanding their appreciation of help as laziness',
    'Not seeing undone tasks as emotional neglect',
    'Forgetting that broken promises feel like broken trust',
    'Assuming they should ask for help when needed'
  ],
  RG: [
    'Thinking they\'re materialistic or shallow',
    'Misinterpreting gift-giving as buying love',
    'Not understanding the symbolism behind gifts',
    'Forgetting that missed occasions feel like being forgotten',
    'Assuming expensive gifts matter more than thoughtful ones'
  ],
  QT: [
    'Thinking they\'re clingy or demanding',
    'Misunderstanding their need for attention as neediness',
    'Not seeing distractions as rejection',
    'Forgetting that cancelled plans feel like broken promises',
    'Assuming being in the same room is quality time'
  ],
  PT: [
    'Thinking they\'re overly sexual or physical',
    'Misunderstanding their need for touch as only sexual',
    'Not seeing lack of touch as emotional distance',
    'Forgetting that physical distance feels like emotional distance',
    'Assuming they should initiate all physical contact'
  ]
});

export const getLoveLanguageResult = (scores: LoveLanguageScores): LoveLanguageResult => {
  const profile = determineLoveLanguageProfile(scores);
  const profileName = getProfileName(profile);
  
  const descriptions = getTypeDescriptions();
  const expressions = getExpressions();
  const needs = getNeeds();
  const communicationTips = getCommunicationTips();
  const partnerTips = getPartnerTips();
  const commonMisunderstandings = getCommonMisunderstandings();
  
  // Determine overall description
  const getOverallDescription = (): string => {
    const { primary, secondary } = profile;
    const primaryScore = scores[primary];
    
    let intensity = '';
    if (primaryScore >= 90) intensity = 'very strongly ';
    else if (primaryScore >= 80) intensity = 'strongly ';
    else if (primaryScore >= 70) intensity = '';
    else intensity = 'moderately ';
    
    const baseDescription = `Your primary love language is ${intensity}${descriptions[primary].toLowerCase().split('. ')[0]}`;
    
    if (secondary) {
      const secondaryScore = scores[secondary];
      const secondaryIntensity = secondaryScore >= 80 ? 'strong ' : secondaryScore >= 70 ? 'moderate ' : '';
      return `${baseDescription}, with ${secondaryIntensity}${descriptions[secondary].toLowerCase().split('. ')[0]} as an important secondary language.`;
    }
    
    return `${baseDescription}.`;
  };
  
  // Determine color based on primary type
  const getColor = (primary: LoveLanguageType): string => {
    const colors = {
      WA: 'bg-gradient-to-r from-blue-600 to-indigo-700', // Blue for words
      AS: 'bg-gradient-to-r from-green-600 to-emerald-700', // Green for service
      RG: 'bg-gradient-to-r from-purple-600 to-pink-600', // Purple for gifts
      QT: 'bg-gradient-to-r from-yellow-500 to-amber-600', // Yellow for time
      PT: 'bg-gradient-to-r from-red-600 to-orange-600' // Red for touch
    };
    return colors[primary];
  };

  return {
    scores,
    profile,
    descriptions,
    expressions,
    needs,
    communicationTips,
    partnerTips,
    commonMisunderstandings,
    overallStyle: profileName,
    overallDescription: getOverallDescription(),
    color: getColor(profile.primary),
    profileName
  };
};