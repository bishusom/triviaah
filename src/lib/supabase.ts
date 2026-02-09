// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export type Question = {
  id: string;
  question: string;
  correct: string;
  options: string[];
  difficulty?: string;
  category: string;
  subcategory?: string;
  titbits?: string;
  image_url?: string;
  date?: string; // For "today-in-history" questions
  year?: string; // For "today-in-history" questions
};

// Define database question type
interface DbQuestion {
  id: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  difficulty?: string;
  category: string;
  subcategory?: string;
  titbits?: string;
  image_url?: string;
  times_used?: number;
  last_used?: string;
  random_index?: number;
}

interface HistoryQuestionRow {
  id: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  difficulty?: string;
  subcategory?: string;
  titbits?: string;
  image_url?: string;
}

// Helper function to get client-side date string
function getClientDateString(customDate?: Date): string {
  const date = customDate || new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getCategoriesWithMinQuestions(minQuestions: number = 50): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('trivia_categories_view')
      .select('category, question_count')
      .gte('question_count', minQuestions)
      .order('question_count', { ascending: false });

    if (error) throw error;

    return (data || []).map(item => item.category);
  } catch (error) {
    console.error('Error in getCategoriesWithMinQuestions:', error);
    return [];
  }
}

export async function getCategoryQuestions(category: string, count: number): Promise<Question[]> {
  try {
    const randomSeed = Math.random();
    // Use the random_index to get a random set
    const { data: questions, error } = await supabase
      .from('trivia_questions')
      .select('*')
      .eq('category', category)
      .gt('random_index', randomSeed)
      .order('random_index', { ascending: true })
      .limit(count * 3); // Get more for distribution
      
    if (error) throw error;
    if (!questions || questions.length === 0) return [];

    // Categorize questions by difficulty
    const questionsByDifficulty = {
      easy: [] as DbQuestion[],
      medium: [] as DbQuestion[],
      hard: [] as DbQuestion[]
    };

    questions.forEach((question: DbQuestion) => {
      const difficulty = question.difficulty?.toLowerCase() || 'medium';
      if (difficulty === 'easy') {
        questionsByDifficulty.easy.push(question);
      } else if (difficulty === 'hard') {
        questionsByDifficulty.hard.push(question);
      } else {
        questionsByDifficulty.medium.push(question);
      }
    });

    // Calculate how many questions to take from each difficulty
    const easyCount = Math.min(
      Math.ceil(count * 0.4), // 40% easy
      questionsByDifficulty.easy.length
    );
    const hardCount = Math.min(
      Math.ceil(count * 0.3), // 30% hard
      questionsByDifficulty.hard.length
    );
    const mediumCount = Math.min(
      count - easyCount - hardCount, // Remaining 30%
      questionsByDifficulty.medium.length
    );

    // Select random questions from each difficulty
    const getRandomQuestions = (pool: DbQuestion[], num: number) => {
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, num);
    };

    const selectedQuestions = [
      ...getRandomQuestions(questionsByDifficulty.easy, easyCount),
      ...getRandomQuestions(questionsByDifficulty.medium, mediumCount),
      ...getRandomQuestions(questionsByDifficulty.hard, hardCount)
    ];

    // Transform to Question format and shuffle
    return shuffleArray(selectedQuestions.map(q => ({
      id: q.id,
      question: q.question,
      correct: q.correct_answer,
      options: shuffleArray([...q.incorrect_answers, q.correct_answer]),
      difficulty: q.difficulty,
      category: q.category,
      ...(q.subcategory && { subcategory: q.subcategory }),
      ...(q.titbits && { titbits: q.titbits }),
      ...(q.image_url && { image_url: q.image_url })
    })));

  } catch (error) {
    console.error('Error in getCategoryQuestions:', error);
    return [];
  }
}

export async function getMoreQuestions(
  category: string, 
  offset: number = 0, 
  limitCount: number = 10
): Promise<{ questions: Question[], nextOffset: number }> {
  try {
    const { data: questions, error } = await supabase
      .from('trivia_questions')
      .select('*')
      .eq('category', category)
      .order('random_index', { ascending: true })
      .range(offset, offset + limitCount - 1);

    if (error) throw error;

    const transformedQuestions: Question[] = (questions || []).map((q: DbQuestion) => ({
      id: q.id,
      question: q.question,
      correct: q.correct_answer,
      options: shuffleArray([...q.incorrect_answers, q.correct_answer]),
      difficulty: q.difficulty,
      category: q.category,
      ...(q.subcategory && { subcategory: q.subcategory }),
      ...(q.titbits && { titbits: q.titbits }),
      ...(q.image_url && { image_url: q.image_url })
    }));

    return {
      questions: transformedQuestions,
      nextOffset: offset + limitCount
    };
  } catch (error) {
    console.error('Error in getMoreQuestions:', error);
    return { questions: [], nextOffset: offset };
  }
}

// Add to lib/supabase.ts

export interface Subcategory {
  subcategory: string;
  question_count: number;
}

export async function getSubcategoriesWithMinQuestions(
  category: string, 
  minQuestions: number = 30
): Promise<Subcategory[]> {
  try {
    const { data, error } = await supabase
      .from('trivia_subcategories_view')
      .select('subcategory, question_count')
      .eq('category', category)
      .gte('question_count', minQuestions)
      .order('question_count', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error in getSubcategoriesWithMinQuestions:', error);
    return [];
  }
}

export async function getSubcategoryQuestions(
  category: string,
  subcategory: string,
  count: number
): Promise<Question[]> {
  try {
    const randomSeed = Math.random();
    
    const { data: questions, error } = await supabase
      .from('trivia_questions')
      .select('*')
      .eq('category', category)
      .eq('subcategory', subcategory)
      // Use the random_index to get a random set
      .gt('random_index', randomSeed)
      .order('random_index', { ascending: true })
      .limit(count * 3); // Get more for distribution

    if (error) throw error;
    if (!questions || questions.length === 0) return [];

    // Apply the same difficulty distribution logic as getCategoryQuestions
    const questionsByDifficulty = {
      easy: [] as DbQuestion[],
      medium: [] as DbQuestion[],
      hard: [] as DbQuestion[]
    };

    questions.forEach((question: DbQuestion) => {
      const difficulty = question.difficulty?.toLowerCase() || 'medium';
      if (difficulty === 'easy') {
        questionsByDifficulty.easy.push(question);
      } else if (difficulty === 'hard') {
        questionsByDifficulty.hard.push(question);
      } else {
        questionsByDifficulty.medium.push(question);
      }
    });

    // Calculate distribution
    const easyCount = Math.min(
      Math.ceil(count * 0.4),
      questionsByDifficulty.easy.length
    );
    const hardCount = Math.min(
      Math.ceil(count * 0.3),
      questionsByDifficulty.hard.length
    );
    const mediumCount = Math.min(
      count - easyCount - hardCount,
      questionsByDifficulty.medium.length
    );

    // Select random questions from each difficulty
    const getRandomQuestions = (pool: DbQuestion[], num: number) => {
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, num);
    };

    const selectedQuestions = [
      ...getRandomQuestions(questionsByDifficulty.easy, easyCount),
      ...getRandomQuestions(questionsByDifficulty.medium, mediumCount),
      ...getRandomQuestions(questionsByDifficulty.hard, hardCount)
    ];

    // Transform and shuffle
    return shuffleArray(selectedQuestions.map(q => ({
      id: q.id,
      question: q.question,
      correct: q.correct_answer,
      options: shuffleArray([...q.incorrect_answers, q.correct_answer]),
      difficulty: q.difficulty,
      category: q.category,
      subcategory: q.subcategory,
      ...(q.titbits && { titbits: q.titbits }),
      ...(q.image_url && { image_url: q.image_url })
    })));

  } catch (error) {
    console.error('Error in getSubcategoryQuestions:', error);
    return [];
  }
}

export async function getDailyQuizQuestions(category: string, customDate?: Date): Promise<Question[]> {
  try {
    const dateString = getClientDateString(customDate);
    
    console.log('Fetching daily quiz for category:', category, 'date:', dateString);

    // First, check if we have a daily set for this date and category
    const { data: dailySets, error } = await supabase
      .from('daily_trivia_sets')
      .select('*')
      .eq('date', dateString)
      .eq('category', category);

    if (error) throw error;

    if (!dailySets || dailySets.length === 0) {
      console.log('No daily quiz found for category:', category, 'date:', dateString);
      
      // Create a new daily set if none exists
      const randomQuestions = await getRandomQuestions(10, ['easy', 'medium', 'hard']);
      
      if (randomQuestions.length > 0) {
        // Store the new daily set
        const { error: insertError } = await supabase
          .from('daily_trivia_sets')
          .insert({
            date: dateString,
            category: category,
            questions: randomQuestions.map(q => q.id),
            created_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error creating daily set:', insertError);
        }
      }
      
      return randomQuestions.slice(0, 7); // Return first 7 questions
    }

    // Get the questions from the daily set
    const dailySet = dailySets[0];
    const { data: questions, error: questionsError } = await supabase
      .from('trivia_questions')
      .select('*')
      .in('id', dailySet.questions);

    if (questionsError) throw questionsError;

    console.log('Found', questions?.length, 'daily quiz questions for', category);

    return (questions || []).map((q: DbQuestion) => ({
      id: q.id,
      question: q.question,
      correct: q.correct_answer,
      options: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
      difficulty: q.difficulty?.toLowerCase() || 'medium',
      category: q.category,
      ...(q.subcategory && { subcategory: q.subcategory }),
      ...(q.titbits && { titbits: q.titbits }),
      ...(q.image_url && { image_url: q.image_url })
    }));

  } catch (error) {
    console.error('Error in getDailyQuizQuestions:', error);
    return [];
  }
}

export async function getRandomQuestions(
  qlimit: number = 7,
  difficulties: string[] = ['easy', 'medium', 'hard']
): Promise<Question[]> {
  try {
    // Use PostgreSQL's random() function for true randomness
    const { data: questions, error } = await supabase
      .from('random_trivia_questions')
      .select('*')
      .in('difficulty', difficulties)
      .limit(qlimit);

    if (error) throw error;

    return (questions || []).map((q: DbQuestion) => ({
      id: q.id,
      question: q.question,
      correct: q.correct_answer,
      options: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
      difficulty: q.difficulty,
      category: q.category,
      ...(q.subcategory && { subcategory: q.subcategory }),
      ...(q.titbits && { titbits: q.titbits }),
      ...(q.image_url && { image_url: q.image_url })
    }));

  } catch (error) {
    console.error('Error in getRandomQuestions:', error);
    return [];
  }
}

export async function getTodaysHistoryQuestions(count: number, userDate?: Date): Promise<Question[]> {
  try {
    const targetDate = userDate || new Date();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    const monthDay = `${month}-${day}`;
    
    console.log('Fetching today in history for date:', monthDay);

    // First try to get date-specific history questions
    const { data: historyQuestions, error } = await supabase
      .from('daily_history_trivia')
      .select('*')
      .eq('date', monthDay)
      .limit(count);

    if (error) throw error;

    if (!historyQuestions || historyQuestions.length === 0) {
      console.log('No specific history questions found for date:', monthDay, '- using general history');
      // Fallback to general history questions
      return getCategoryQuestions('history', count);
    }

    return (historyQuestions as HistoryQuestionRow[]).map((q): Question => ({
        id: q.id,
        question: q.question,
        correct: q.correct_answer,
        options: shuffleArray([...q.incorrect_answers, q.correct_answer]),
        difficulty: q.difficulty || 'medium',
        category: 'today-in-history',
        subcategory: q.subcategory,
        ...(q.titbits && { titbits: q.titbits }),
        ...(q.image_url && { image_url: q.image_url }),
        date: monthDay,
        year: q.subcategory?.match(/\d{4}/)?.[0]
    }));

  } catch (error) {
    console.error('Error in getTodaysHistoryQuestions:', error);
    return [];
  }
}

export async function getHolidaySpecialQuiz(category: string, count: number): Promise<Question[]> {
  try {
    const randomSeed = Math.random();
    // Use the random_index to get a random set
    const { data: questions, error } = await supabase
      .from('holiday_special_trivias')
      .select('*')
      .eq('category', category);
      
    if (error) throw error;
    if (!questions || questions.length === 0) return [];

    // Categorize questions by difficulty
    const questionsByDifficulty = {
      easy: [] as DbQuestion[],
      medium: [] as DbQuestion[],
      hard: [] as DbQuestion[]
    };

    questions.forEach((question: DbQuestion) => {
      const difficulty = question.difficulty?.toLowerCase() || 'medium';
      if (difficulty === 'easy') {
        questionsByDifficulty.easy.push(question);
      } else if (difficulty === 'hard') {
        questionsByDifficulty.hard.push(question);
      } else {
        questionsByDifficulty.medium.push(question);
      }
    });

    // Calculate how many questions to take from each difficulty
    const easyCount = Math.min(
      Math.ceil(count * 0.4), // 40% easy
      questionsByDifficulty.easy.length
    );
    const hardCount = Math.min(
      Math.ceil(count * 0.3), // 30% hard
      questionsByDifficulty.hard.length
    );
    const mediumCount = Math.min(
      count - easyCount - hardCount, // Remaining 30%
      questionsByDifficulty.medium.length
    );

    // Select random questions from each difficulty
    const getRandomQuestions = (pool: DbQuestion[], num: number) => {
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, num);
    };

    const selectedQuestions = [
      ...getRandomQuestions(questionsByDifficulty.easy, easyCount),
      ...getRandomQuestions(questionsByDifficulty.medium, mediumCount),
      ...getRandomQuestions(questionsByDifficulty.hard, hardCount)
    ];

    // Transform to Question format and shuffle
    return shuffleArray(selectedQuestions.map(q => ({
      id: q.id,
      question: q.question,
      correct: q.correct_answer,
      options: shuffleArray([...q.incorrect_answers, q.correct_answer]),
      difficulty: q.difficulty,
      category: q.category,
      ...(q.subcategory && { subcategory: q.subcategory }),
      ...(q.titbits && { titbits: q.titbits }),
      ...(q.image_url && { image_url: q.image_url })
    })));

  } catch (error) {
    console.error('Error in getCategoryQuestions:', error);
    return [];
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export type HighScore = {
  id?: string;
  name: string;
  score: number;
  category: string;
  subcategory?: string | null;
  difficulty?: string;
  correct_answers: number;
  total_questions: number;
  time_used: number; 
  timestamp?: Date;
};

export async function getHighScores(
  category: string, 
  limitCount: number = 5
): Promise<HighScore[]> {
  try {
    const { data: scores, error } = await supabase
      .from('trivia_scores')
      .select('*')
      .eq('category', category)
      .order('score', { ascending: false })
      .limit(limitCount);

    if (error) throw error;

    console.log("Fetched records for category", category);
    interface ScoreRecord {
      id: string;
      name: string;
      score: number;
      category: string;
      difficulty?: string;
      correct_answers: number;
      total_questions: number;
      time_used: number;
      created_at: string;
    }

    return (scores || []).map((score: ScoreRecord): HighScore => ({
      id: score.id,
      name: score.name,
      score: score.score,
      category: score.category,
      difficulty: score.difficulty,
      correct_answers: score.correct_answers,
      total_questions: score.total_questions,
      time_used: score.time_used,
      timestamp: new Date(score.created_at)
    }));

  } catch (error) {
    console.error('Error in getHighScores:', error);
    return [];
  }
}

export async function getGlobalHighScore(
  category: string
): Promise<HighScore | null> {
  try {
    const { data: scores, error } = await supabase
      .from('trivia_scores')
      .select('*')
      .eq('category', category)
      .order('score', { ascending: false })
      .limit(1);

    if (error) throw error;

    if (!scores || scores.length === 0) return null;

    const score = scores[0];
    return {
      id: score.id,
      name: score.name,
      score: score.score,
      category: score.category,
      difficulty: score.difficulty,
      correct_answers: score.correct_answers,
      total_questions: score.total_questions,
      time_used: score.time_used,
      timestamp: new Date(score.created_at)
    };

  } catch (error) {
    console.error('Error in getGlobalHighScore:', error);
    return null;
  }
}

export async function addHighScore(scoreData: Omit<HighScore, 'id'>): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('trivia_scores')
      .insert([{
        name: scoreData.name,
        score: scoreData.score,
        category: scoreData.category,
        subcategory: scoreData.category|| null,
        difficulty: scoreData.difficulty,
        correct_answers: scoreData.correct_answers,
        total_questions: scoreData.total_questions,
        time_used: scoreData.time_used,      
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    return data.id;
  } catch (error) {
    console.error('Error in addHighScore:', error);
    throw error;
  }
}

// Define interface for database feedback row
interface DatabaseFeedbackRow {
  id: string;
  rating: number;
  comment?: string;
  category: string;
  game_type: string;
  metadata: Record<string, unknown>;
  user_id?: string;
  user_agent?: string;
  created_at: string;
}

export type Feedback = {
  id?: string;
  rating: number;
  comment?: string;
  category: string;
  gameType: string;
  metadata: Record<string, unknown>;
  timestamp?: Date;
  userId?: string;
  userAgent?: string;
};

export async function addFeedback(feedbackData: Omit<Feedback, 'id'>): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .insert([{
        rating: feedbackData.rating,
        comment: feedbackData.comment || null,
        category: feedbackData.category,
        game_type: feedbackData.gameType,
        metadata: feedbackData.metadata,
        user_id: feedbackData.userId,
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error in addFeedback:', error);
    throw error;
  }
}

export async function getFeedback(
  limitCount: number = 50, 
  gameType?: string | null,
  minRating?: string | null,
  hasComments?: string | null
): Promise<Feedback[]> {
  try {
    let query = supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limitCount);

    if (gameType) {
      query = query.eq('game_type', gameType);
    }

    if (minRating) {
      query = query.gte('rating', parseInt(minRating));
    }

    if (hasComments === 'true') {
      query = query.not('comment', 'is', null).not('comment', 'eq', '');
    } else if (hasComments === 'false') {
      query = query.or('comment.is.null,comment.eq.');
    }

    const { data: feedback, error } = await query;

    if (error) throw error;

    return (feedback || []).map((item: DatabaseFeedbackRow) => ({
      id: item.id,
      rating: item.rating,
      comment: item.comment || undefined,
      category: item.category,
      gameType: item.game_type,
      metadata: item.metadata || {},
      userId: item.user_id,
      userAgent: item.user_agent,
      timestamp: new Date(item.created_at)
    }));
  } catch (error) {
    console.error('Error in getFeedback:', error);
    return [];
  }
}

export async function updateQuestionUsage(questionIds: string[]): Promise<void> {
  try {
    // Fetch current times_used values
    const { data: questions, error: fetchError } = await supabase
      .from('trivia_questions')
      .select('id, times_used')
      .in('id', questionIds);

    if (fetchError) throw fetchError;

    if (!questions) return;

    // Update each question individually
    for (const question of questions) {
      const { error: updateError } = await supabase
        .from('trivia_questions')
        .update({
          last_used: new Date().toISOString(),
          random_index: Math.random(),
          times_used: (question.times_used || 0) + 1
        })
        .eq('id', question.id);

      if (updateError) throw updateError;
    }
  } catch (error) {
    console.error('Error updating question usage:', error);
  }
}

export async function getQuestionCountByCategory(category: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('trivia_questions')
      .select('*', { count: 'exact', head: true })
      .eq('category', category);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting question count:', error);
    return 0;
  }
}