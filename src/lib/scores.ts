// lib/scores.ts
import { supabase } from '@/lib/supabase';

export interface QuizResult {
  id?: string;
  user_id: string;
  category: string;
  subcategory?: string | null;
  score: number;
  correct_answers: number;
  total_questions: number;
  time_used: number;
  is_timed_mode: boolean;
  help_used: number;
  created_at?: string;
}

// Save quiz result - now only accepts user_id from authenticated session
export async function saveQuizResult(result: Omit<QuizResult, 'id' | 'created_at' | 'user_id'>, userId: string) {
  try {
    console.log('💾 Saving quiz result for user:', userId, result);
    
    // Validate required fields
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!result.category || result.score === undefined) {
      throw new Error('Missing required quiz result fields');
    }

    // Prepare data with all required fields for your table
    const insertData = {
      user_id: userId,
      name: 'Quiz Player', // Required field from your table schema
      category: result.category,
      subcategory: result.subcategory || null,
      score: result.score,
      correct_answers: result.correct_answers,
      total_questions: result.total_questions,
      time_used: result.time_used,
      is_timed_mode: result.is_timed_mode !== undefined ? result.is_timed_mode : true,
      help_used: result.help_used || 0,
      difficulty: 'medium', // Add a default difficulty if your table requires it
      created_at: new Date().toISOString()
    };

    console.log('📝 Inserting data:', insertData);

    const { data, error } = await supabase
      .from('trivia_scores')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('❌ Database error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error
      });
      
      // Check if it's a foreign key constraint error
      if (error.code === '23503') {
        console.error('🔑 Foreign key violation - user might not exist in profiles table');
      }
      
      // Check if it's a null constraint error
      if (error.code === '23502') {
        console.error('🚫 Null constraint violation - missing required field');
      }
      
      throw error;
    }
    
    console.log('✅ Quiz result saved successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error saving quiz result:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

// Get user's quiz history
export async function getUserQuizHistory(userId: string, limit = 50) {
  try {
    const { data, error } = await supabase
      .from('trivia_scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user quiz history:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching user quiz history:', error);
    throw error;
  }
}

// Get user stats
export async function getUserStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from('trivia_scores')
      .select('score, correct_answers, total_questions, category, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        accuracy: 0,
        recentQuizzes: [],
        favoriteCategory: 'None'
      };
    }

    const totalQuizzes = data.length;
    const totalScore = data.reduce((sum, quiz) => sum + quiz.score, 0);
    const bestScore = Math.max(...data.map(quiz => quiz.score));
    const totalCorrect = data.reduce((sum, quiz) => sum + quiz.correct_answers, 0);
    const totalQuestions = data.reduce((sum, quiz) => sum + quiz.total_questions, 0);
    const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

    // Get favorite category
    const categoryCount = data.reduce((acc: Record<string, number>, quiz) => {
      acc[quiz.category] = (acc[quiz.category] || 0) + 1;
      return acc;
    }, {});
    
    const favoriteCategory = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    return {
      totalQuizzes,
      averageScore: Math.round(totalScore / totalQuizzes),
      bestScore,
      totalCorrect,
      totalQuestions,
      accuracy: Math.round(accuracy),
      recentQuizzes: data.slice(0, 5),
      favoriteCategory
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
}

// Test database connection
export async function testScoresConnection() {
  try {
    const { data, error } = await supabase
      .from('trivia_scores')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Scores table connection test failed:', error);
      return false;
    }

    console.log('✅ Scores table connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Unexpected error in connection test:', error);
    return false;
  }
}