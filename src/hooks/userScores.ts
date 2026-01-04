// hooks/userScores.ts
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface QuizScore {
  id: string;
  user_id: string;
  quiz_id: string;
  quiz_name: string;
  category: string;
  score: number;
  max_score: number;
  percentage: number;
  time_taken?: number;
  completed_at: string;
  profiles?: {
    display_name: string;
    username: string;
  };
}

export function userScores() {
  const [saving, setSaving] = useState(false);

  const saveScore = async (scoreData: {
    quiz_id: string;
    quiz_name: string;
    category: string;
    score: number;
    max_score: number;
    time_taken?: number;
  }) => {
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const percentage = (scoreData.score / scoreData.max_score) * 100;

      const { data, error } = await supabase
        .from('quiz_scores')
        .insert({
          user_id: userData.user.id,
          ...scoreData,
          percentage,
        })
        .select(`
          *,
          profiles (
            display_name,
            username
          )
        `)
        .single();

      if (error) throw error;

      // Update leaderboard
      await updateLeaderboard(userData.user.id);
      
      return data;
    } catch (error) {
      console.error('Error saving score:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const updateLeaderboard = async (userId: string) => {
    // Calculate total stats for leaderboard
    const { data: userStats } = await supabase
      .from('quiz_scores')
      .select('score, percentage')
      .eq('user_id', userId);

    if (!userStats) return;

    const totalScore = userStats.reduce((sum, stat) => sum + stat.score, 0);
    const quizzesPlayed = userStats.length;
    const averagePercentage = userStats.reduce((sum, stat) => sum + stat.percentage, 0) / quizzesPlayed;

    await supabase
      .from('leaderboard_entries')
      .upsert({
        user_id: userId,
        total_score: totalScore,
        quizzes_played: quizzesPlayed,
        average_percentage: averagePercentage,
        last_played: new Date().toISOString(),
      });
  };

  const getLeaderboard = async (limit = 50) => {
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select(`
        total_score,
        quizzes_played,
        average_percentage,
        last_played,
        profiles (
          display_name,
          username
        )
      `)
      .order('total_score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  };

  const getUserScores = async (userId?: string) => {
    const query = supabase
      .from('quiz_scores')
      .select(`
        *,
        profiles (
          display_name,
          username
        )
      `)
      .order('completed_at', { ascending: false });

    if (userId) {
      query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  };

  return { saveScore, getLeaderboard, getUserScores, saving };
}