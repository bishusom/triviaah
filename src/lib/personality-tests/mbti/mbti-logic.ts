// src/lib/personality/mbti-logic.ts
import { MBTIQuestion, MBTIResult, MBTIScore } from '@/lib/personality-tests/mbti/mbti-types';

export const questions: MBTIQuestion[] = [
  // === E/I – Extraversion / Introversion (15 questions) ===
  { id: '1', text: 'You regularly make new friends', dimension: 'EI', reverse: false },
  { id: '2', text: 'You enjoy vibrant social events with lots of people', dimension: 'EI', reverse: false },
  { id: '3', text: 'You feel energized after spending time alone', dimension: 'EI', reverse: true },
  { id: '4', text: 'You prefer working in teams rather than alone', dimension: 'EI', reverse: false },
  { id: '5', text: 'You need time alone to recharge after socializing', dimension: 'EI', reverse: true },
  { id: '6', text: 'You are often the life of the party', dimension: 'EI', reverse: false },
  { id: '7', text: 'You speak easily and at length with strangers', dimension: 'EI', reverse: false },
  { id: '8', text: 'You prefer to spend weekends with people rather than alone', dimension: 'EI', reverse: false },
  { id: '9', text: 'You find small talk natural and enjoyable', dimension: 'EI', reverse: false },
  { id: '10', text: 'You feel drained after long social interactions', dimension: 'EI', reverse: true },
  { id: '11', text: 'You tend to think out loud', dimension: 'EI', reverse: false },
  { id: '12', text: 'You prefer reading or quiet hobbies over parties', dimension: 'EI', reverse: true },
  { id: '13', text: 'You have a large circle of friends', dimension: 'EI', reverse: false },
  { id: '14', text: 'You prefer one-on-one conversations to group activities', dimension: 'EI', reverse: true },
  { id: '15', text: 'You initiate conversations easily', dimension: 'EI', reverse: false },

  // === S/N – Sensing / Intuition (15 questions) ===
  { id: '16', text: 'You prefer concrete facts over abstract ideas', dimension: 'SN', reverse: false },
  { id: '17', text: 'You focus on the present rather than the future', dimension: 'SN', reverse: false },
  { id: '18', text: 'You often think about future possibilities', dimension: 'SN', reverse: true },
  { id: '19', text: 'You trust experience first and theories second', dimension: 'SN', reverse: false },
  { id: '20', text: 'You enjoy brainstorming and exploring new ideas', dimension: 'SN', reverse: true },
  { id: '21', text: 'You pay more attention to details than the big picture', dimension: 'SN', reverse: false },
  { id: '22', text: 'You like metaphors and symbolism', dimension: 'SN', reverse: true },
  { id: '23', text: 'You are more interested in what is real than what could be', dimension: 'SN', reverse: false },
  { id: '24', text: 'You often daydream or imagine hypothetical scenarios', dimension: 'SN', reverse: true },
  { id: '25', text: 'You remember facts and details easily', dimension: 'SN', reverse: false },
  { id: '26', text: 'You prefer practical, hands-on learning', dimension: 'SN', reverse: false },
  { id: '27', text: 'You enjoy philosophical discussions', dimension: 'SN', reverse: true },
  { id: '28', text: 'You notice when things have changed in your environment', dimension: 'SN', reverse: false },
  { id: '29', text: 'You like to work with abstract concepts', dimension: 'SN', reverse: true },
  { id: '30', text: 'You trust your five senses more than hunches', dimension: 'SN', reverse: false },

  // === T/F – Thinking / Feeling (15 questions) ===
  { id: '31', text: 'You make decisions based on logic and objective analysis', dimension: 'TF', reverse: false },
  { id: '32', text: 'You prioritize truth and justice over mercy', dimension: 'TF', reverse: false },
  { id: '33', text: 'You consider people’s feelings when making decisions', dimension: 'TF', reverse: true },
  { id: '34', text: 'You value harmony more than being right', dimension: 'TF', reverse: true },
  { id: '35', text: 'You are comfortable critiquing others directly', dimension: 'TF', reverse: false },
  { id: '36', text: 'You often put others’ needs before your own', dimension: 'TF', reverse: true },
  { id: '37', text: 'You remain calm and objective in conflicts', dimension: 'TF', reverse: false },
  { id: '38', text: 'You easily empathize with how others feel', dimension: 'TF', reverse: true },
  { id: '39', text: 'You believe rules should always be enforced', dimension: 'TF', reverse: false },
  { id: '40', text: 'You find it hard to say no to people', dimension: 'TF', reverse: true },
  { id: '41', text: 'You prefer debating ideas over avoiding conflict', dimension: 'TF', reverse: false },
  { id: '42', text: 'You are deeply affected by praise or criticism', dimension: 'TF', reverse: true },
  { id: '43', text: 'You analyze pros and cons before deciding', dimension: 'TF', reverse: false },
  { id: '44', text: 'You strive to keep everyone happy', dimension: 'TF', reverse: true },
  { id: '45', text: 'You are seen as tough-minded', dimension: 'TF', reverse: false },

  // === J/P – Judging / Perceiving (15 questions) ===
  { id: '46', text: 'You like to have a plan for the day', dimension: 'JP', reverse: false },
  { id: '47', text: 'You prefer to keep your options open', dimension: 'JP', reverse: true },
  { id: '48', text: 'You finish projects well before the deadline', dimension: 'JP', reverse: false },
  { id: '49', text: 'You work best under pressure at the last minute', dimension: 'JP', reverse: true },
  { id: '50', text: 'Your room/workspace is usually neat and organized', dimension: 'JP', reverse: false },
  { id: '51', text: 'You enjoy spontaneity and surprises', dimension: 'JP', reverse: true },
  { id: '52', text: 'You make to-do lists and follow them', dimension: 'JP', reverse: false },
  { id: '53', text: 'You dislike strict schedules', dimension: 'JP', reverse: true },
  { id: '54', text: 'You prefer closure over open-endedness', dimension: 'JP', reverse: false },
  { id: '55', text: 'You often change plans at the last moment', dimension: 'JP', reverse: true },
  { id: '56', text: 'You feel uncomfortable leaving things unfinished', dimension: 'JP', reverse: false },
  { id: '57', text: 'You adapt easily to changing situations', dimension: 'JP', reverse: true },
  { id: '58', text: 'You like routines and predictability', dimension: 'JP', reverse: false },
  { id: '59', text: 'You tend to procrastinate on big tasks', dimension: 'JP', reverse: true },
  { id: '60', text: 'You set long-term goals and work toward them', dimension: 'JP', reverse: false },
];

export const calculateMBTIType = (score: MBTIScore): string => {
  return (
    (score.EI >= 0 ? 'E' : 'I') +
    (score.SN >= 0 ? 'S' : 'N') +
    (score.TF >= 0 ? 'T' : 'F') +
    (score.JP >= 0 ? 'J' : 'P')
  );
};

export const getResultDescription = (type: string): MBTIResult => {
  const results: Record<string, MBTIResult> = {
    INTJ: { type: 'INTJ', name: 'The Architect', description: 'Strategic masterminds driven by logic and long-term vision. Independent and decisive.', strengths: ['Strategic', 'Independent', 'Analytical', 'Determined'], weaknesses: ['Arrogant', 'Perfectionist', 'Emotionally distant'], careers: ['Scientist', 'Strategist', 'CEO', 'Software Developer'], famousPeople: ['Elon Musk', 'Isaac Newton', 'Ayn Rand', 'Hillary Clinton'], percentage: 2.1, color: 'bg-gradient-to-r from-indigo-600 to-purple-600' },
    INTP: { type: 'INTP', name: 'The Logician', description: 'Innovative thinkers obsessed with understanding how things work. Love theoretical systems.', strengths: ['Analytical', 'Original', 'Open-minded', 'Objective'], weaknesses: ['Insensitive', 'Dissatisfied', 'Procrastinating'], careers: ['Philosopher', 'Programmer', 'Researcher', 'Inventor'], famousPeople: ['Albert Einstein', 'Bill Gates', 'Marie Curie'], percentage: 3.3, color: 'bg-gradient-to-r from-blue-500 to-indigo-500' },
    ENTJ: { type: 'ENTJ', name: 'The Commander', description: 'Bold, imaginative and strong-willed leaders who find a way or make one.', strengths: ['Efficient', 'Strategic', 'Charismatic', 'Ambitious'], weaknesses: ['Intolerant', 'Impatient', 'Arrogant'], careers: ['Executive', 'Lawyer', 'Entrepreneur', 'Consultant'], famousPeople: ['Napoleon', 'Margaret Thatcher', 'Gordon Ramsay'], percentage: 1.8, color: 'bg-gradient-to-r from-red-600 to-pink-600' },
    ENTP: { type: 'ENTP', name: 'The Debater', description: 'Quick-witted innovators who love intellectual challenges and verbal sparring.', strengths: ['Clever', 'Charismatic', 'Original', 'Energetic'], weaknesses: ['Insensitive', 'Argumentative', 'Intolerant'], careers: ['Lawyer', 'Marketer', 'Entrepreneur', 'Journalist'], famousPeople: ['Steve Jobs', 'Socrates', 'Leonardo da Vinci'], percentage: 3.2, color: 'bg-gradient-to-r from-purple-500 to-blue-500' },
    INFJ: { type: 'INFJ', name: 'The Advocate', description: 'Quiet visionaries with a strong sense of morality and desire to help others.', strengths: ['Insightful', 'Principled', 'Altruistic', 'Creative'], weaknesses: ['Perfectionistic', 'Overly private', 'Burns out easily'], careers: ['Counselor', 'Writer', 'Teacher', 'Activist'], famousPeople: ['Martin Luther King Jr.', 'Nelson Mandela', 'Taylor Swift'], percentage: 1.5, color: 'bg-gradient-to-r from-teal-500 to-green-500' },
    INFP: { type: 'INFP', name: 'The Healer', description: 'Idealistic dreamers guided by values. Deeply empathetic and creative.', strengths: ['Empathetic', 'Creative', 'Idealistic', 'Authentic'], weaknesses: ['Overly sensitive', 'Impractical', 'Self-critical'], careers: ['Writer', 'Artist', 'Counselor', 'Social Worker'], famousPeople: ['J.R.R. Tolkien', 'William Shakespeare', 'Johnny Depp'], percentage: 4.4, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    ENFJ: { type: 'ENFJ', name: 'The Protagonist', description: 'Charismatic leaders who inspire and organize people to achieve collective goals.', strengths: ['Charismatic', 'Altruistic', 'Inspiring', 'Organized'], weaknesses: ['Overly idealistic', 'Too selfless', 'Manipulative'], careers: ['Teacher', 'Coach', 'HR Manager', 'Politician'], famousPeople: ['Oprah Winfrey', 'Barack Obama', 'Nelson Mandela'], percentage: 2.5, color: 'bg-gradient-to-r from-green-500 to-teal-500' },
    ENFP: { type: 'ENFP', name: 'The Campaigner', description: 'Enthusiastic free spirits who love possibilities and connecting with people.', strengths: ['Enthusiastic', 'Creative', 'Sociable', 'Empathetic'], weaknesses: ['Unfocused', 'Disorganized', 'Overly emotional'], careers: ['Journalist', 'Actor', 'Teacher', 'Marketer'], famousPeople: ['Robin Williams', 'Quentin Tarantino', 'Alicia Keys'], percentage: 8.1, color: 'bg-gradient-to-r from-orange-500 to-pink-500' },
    ISTJ: { type: 'ISTJ', name: 'The Inspector', description: 'Practical, fact-minded individuals who value order, duty, and tradition.', strengths: ['Reliable', 'Detail-oriented', 'Organized', 'Loyal'], weaknesses: ['Stubborn', 'Inflexible', 'Judgmental'], careers: ['Accountant', 'Auditor', 'Manager', 'Police Officer'], famousPeople: ['Warren Buffett', 'Queen Elizabeth II', 'Jeff Bezos'], percentage: 11.6, color: 'bg-gradient-to-r from-blue-500 to-indigo-500' },
    ISFJ: { type: 'ISFJ', name: 'The Defender', description: 'Warm protectors who are dedicated to caring for others and upholding traditions.', strengths: ['Loyal', 'Compassionate', 'Observant', 'Practical'], weaknesses: ['Overly selfless', 'Reluctant to change', 'Takes things personally'], careers: ['Nurse', 'Teacher', 'Administrator', 'Librarian'], famousPeople: ['Mother Teresa', 'Kate Middleton', 'Beyoncé'], percentage: 13.8, color: 'bg-gradient-to-r from-green-400 to-blue-400' },
    ESTJ: { type: 'ESTJ', name: 'The Executive', description: 'Excellent administrators who excel at managing things and people.', strengths: ['Practical', 'Organized', 'Decisive', 'Leader'], weaknesses: ['Inflexible', 'Stubborn', 'Judgmental'], careers: ['Manager', 'Military Officer', 'Judge', 'Financial Officer'], famousPeople: ['Judge Judy', 'Frank Sinatra', 'Sonia Sotomayor'], percentage: 8.7, color: 'bg-gradient-to-r from-gray-600 to-blue-700' },
    ESFJ: { type: 'ESFJ', name: 'The Consul', description: 'Popular and caring hosts who love helping others and bringing people together.', strengths: ['Empathetic', 'Sociable', 'Organized', 'Loyal'], weaknesses: ['Needy', 'Approval-seeking', 'Sensitive to criticism'], careers: ['Teacher', 'Nurse', 'Event Planner', 'HR'], famousPeople: ['Taylor Swift', 'Bill Clinton', 'Jennifer Garner'], percentage: 12.3, color: 'bg-gradient-to-r from-pink-500 to-rose-500' },
    ISTP: { type: 'ISTP', name: 'The Virtuoso', description: 'Bold and practical experimenters, masters of tools and hands-on work.', strengths: ['Logical', 'Practical', 'Relaxed', 'Adaptable'], weaknesses: ['Insensitive', 'Risk-prone', 'Easily bored'], careers: ['Engineer', 'Mechanic', 'Pilot', 'Forensic Scientist'], famousPeople: ['Tom Cruise', 'Michael Jordan', 'Bear Grylls'], percentage: 5.4, color: 'bg-gradient-to-r from-gray-500 to-cyan-600' },
    ISFP: { type: 'ISFP', name: 'The Adventurer', description: 'Flexible and charming artists who live for the moment and enjoy creating beauty.', strengths: ['Sensitive', 'Artistic', 'Flexible', 'Charming'], weaknesses: ['Unpredictable', 'Easily stressed', 'Competitive'], careers: ['Artist', 'Designer', 'Chef', 'Veterinarian'], famousPeople: ['Lady Gaga', 'Bob Dylan', 'Brad Pitt'], percentage: 8.8, color: 'bg-gradient-to-r from-emerald-500 to-teal-500' },
    ESTP: { type: 'ESTP', name: 'The Entrepreneur', description: 'Energetic thrill-seekers who love action and living in the moment.', strengths: ['Bold', 'Perceptive', 'Direct', 'Sociable'], weaknesses: ['Impulsive', 'Risk-taking', 'Insensitive'], careers: ['Salesperson', 'Paramedic', 'Athlete', 'Entrepreneur'], famousPeople: ['Donald Trump', 'Madonna', 'Ernest Hemingway'], percentage: 4.3, color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
    ESFP: { type: 'ESFP', name: 'The Entertainer', description: 'Spontaneous, energetic performers who love being the center of attention.', strengths: ['Fun-loving', 'Sociable', 'Spontaneous', 'Practical'], weaknesses: ['Impulsive', 'Sensitive to criticism', 'Easily bored'], careers: ['Actor', 'Salesperson', 'Tour Guide', 'Event Planner'], famousPeople: ['Marilyn Monroe', 'Adele', 'Will Smith'], percentage: 8.5, color: 'bg-gradient-to-r from-rose-500 to-pink-500' },
  };

  return results[type] ?? results['INFP']; // fallback
};