// context/AuthContext.tsx
'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { userAuth } from '@/hooks/userAuth';
import { userProfile } from '@/hooks/userProfile';

interface AuthContextType {
  user: ReturnType<typeof userAuth>['user'];
  session: ReturnType<typeof userAuth>['session'];
  loading: boolean;
  profile: ReturnType<typeof userProfile>['profile'];
  profileLoading: ReturnType<typeof userProfile>['loading'];
  isPremium: boolean;
  signOut: () => Promise<void>;
  updateProfile: ReturnType<typeof userProfile>['updateProfile']; // Add this line
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, session, loading, signOut } = userAuth();
  const { profile, loading: profileLoading, updateProfile } = userProfile(user); // Add updateProfile here

  // Determine if user is premium - you can customize this logic based on your premium system
  const isPremium = profile?.id ? checkPremiumStatus(profile) : false;

  const value = {
    user,
    session,
    loading,
    profile,
    profileLoading,
    isPremium,
    signOut,
    updateProfile // Add this to the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Helper function to determine premium status - customize this based on your business logic
function checkPremiumStatus(profile: any): boolean {
  console.log('🔍 Checking premium status for profile:', profile);
  
  // ALL registered users are premium during initial growth phase
  // This will be changed later when we have substantial daily traffic
  const isPremium = !!profile?.id; // Any user with a profile is premium
  
  console.log('🎯 Premium status:', { 
    hasProfile: !!profile, 
    userId: profile?.id,
    isPremium 
  });
  
  return isPremium;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}