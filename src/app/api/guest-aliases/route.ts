import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const ADJ = [
  'Crafty','Slow','Happy','Clever','Brave','Sneaky',
  'Witty','Lucky','Noisy','Fancy','Swift','Curious'
];
const ANIM = [
  'Fox','Koala','Panda','Lion','Otter','Eagle',
  'Seal','Shark','Mouse','Tiger','Wolf','Hippo'
];

type AliasRequest = {
  preferredAlias?: string;
};

function generateGuestAlias(): string {
  return `${ADJ[Math.floor(Math.random() * ADJ.length)]}${
    ANIM[Math.floor(Math.random() * ANIM.length)]}${
    Math.floor(Math.random() * 99)}`;
}

function normalizeAlias(alias: string) {
  return alias.trim().replace(/\s+/g, '').slice(0, 40);
}

function isUniqueViolation(error: { code?: string } | null) {
  return error?.code === '23505';
}

export async function POST(request: Request) {
  const body = await request.json().catch((): AliasRequest => ({}));
  const preferredAlias = typeof body.preferredAlias === 'string'
    ? normalizeAlias(body.preferredAlias)
    : '';

  const candidates = [
    preferredAlias,
    ...Array.from({ length: 40 }, generateGuestAlias),
  ].filter(Boolean);

  for (const alias of candidates) {
    const { error } = await supabase
      .from('guest_aliases')
      .insert({ alias });

    if (!error) {
      return NextResponse.json({ alias });
    }

    if (!isUniqueViolation(error)) {
      console.error('Failed to reserve guest alias:', error);
      return NextResponse.json(
        { error: 'Failed to reserve guest alias' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: 'Could not generate a unique guest alias' },
    { status: 409 }
  );
}
