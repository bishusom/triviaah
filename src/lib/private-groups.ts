import { supabase } from '@/lib/supabase';

export type GroupPeriod = 'weekly' | 'monthly' | 'all-time';
export type PrivateGroup = { id: string; name: string; alias: string; isOwner: boolean };
export type GroupBoard = {
  id: string;
  name: string;
  inviteCode: string;
  isOwner: boolean;
  members: { rank: number; name: string; isYou: boolean; score: number; games: number }[];
};

function membershipSecret() {
  const key = 'trivia_private_groups_secret';
  let secret = localStorage.getItem(key);
  if (!secret || !/^[a-f0-9]{64}$/.test(secret)) {
    secret = Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => byte.toString(16).padStart(2, '0')).join('');
    localStorage.setItem(key, secret);
  }
  return secret;
}

export async function groupAction<T>(
  action: 'list' | 'create' | 'join' | 'board' | 'leave' | 'rotate' | 'delete',
  args: { p_group_id?: string; p_name?: string; p_alias?: string; p_invite?: string; p_timeframe?: GroupPeriod } = {},
): Promise<T> {
  const { data, error } = await supabase.rpc('private_group_action', {
    p_action: action, p_secret: membershipSecret(), ...args,
  });
  if (error) {
    if (error.code === 'P0001') throw new Error(error.message);
    throw new Error('Group leaderboards are unavailable right now. Please try again later.');
  }
  return data as T;
}
