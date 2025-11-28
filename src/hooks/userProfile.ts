// hooks/useProfile.ts
'use client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export function userProfile(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      console.log('🚫 No user provided to useProfile');
      setProfile(null);
      setLoading(false);
      return;
    }

    const handleProfile = async () => {
      try {
        console.log('🔍 Starting profile process for user:', user.id, user.email);
        
        // STEP 1: Try to fetch existing profile
        console.log('📋 Attempting to fetch profile...');
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        console.log('📋 Fetch result:', { 
          hasData: !!existingProfile, 
          error: fetchError,
          errorCode: fetchError?.code
        });

        // STEP 2: If profile exists, use it
        if (existingProfile) {
          console.log('✅ Profile found:', existingProfile);
          setProfile(existingProfile);
          setLoading(false);
          return;
        }

        // STEP 3: If profile doesn't exist (PGRST116 = no rows returned), create it
        if (fetchError && fetchError.code === 'PGRST116') {
          console.log('🆕 No profile found, creating new profile...');
          
          const displayName = user.user_metadata?.full_name || 
                            user.user_metadata?.name || 
                            user.email?.split('@')[0] || 
                            'Quizzer';

          const username = generateUsername(user);

          console.log('🎯 Creating profile with:', { 
            id: user.id,
            username, 
            displayName
          });

          // Use upsert to handle any race conditions
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              username,
              display_name: displayName,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'id', // This prevents duplicate key errors
              ignoreDuplicates: false
            })
            .select()
            .single();

          console.log('🎯 Create result:', { 
            newProfile, 
            createError: createError ? {
              code: createError.code,
              message: createError.message,
              details: createError.details
            } : null
          });

          if (createError) {
            // If there's still an error, it might be a race condition
            // Try fetching one more time in case another process created it
            console.log('🔄 Creation failed, checking if profile was created by another process...');
            
            const { data: finalProfile, error: finalError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();

            if (finalError) {
              console.error('💥 Final fetch failed:', finalError);
              setError('Failed to create or fetch profile');
              setProfile(null);
            } else {
              console.log('✅ Profile found after retry:', finalProfile);
              setProfile(finalProfile);
            }
          } else {
            console.log('✅ Profile created successfully!', newProfile);
            setProfile(newProfile);
          }
        } 
        // STEP 4: Handle other fetch errors
        else if (fetchError) {
          console.error('❌ Profile fetch error:', fetchError);
          setError(fetchError.message);
          setProfile(null);
        }

      } catch (error: any) {
        console.error('💥 Unexpected error in profile handling:', error);
        setError(error?.message || 'Unexpected error');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    handleProfile();
  }, [user]);

  // Simple username generator
  const generateUsername = (user: User): string => {
    const baseName = user.user_metadata?.full_name?.replace(/\s+/g, '').toLowerCase() ||
                    user.user_metadata?.name?.replace(/\s+/g, '').toLowerCase() ||
                    user.email?.split('@')[0] ||
                    'user';
    
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `${baseName}${randomSuffix}`.toLowerCase().substring(0, 50);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return { profile, loading, error, updateProfile };
}