// lib/guestId.ts
const ADJ = [
  'Crafty','Slow','Happy','Clever','Brave','Sneaky',
  'Witty','Lucky','Noisy','Fancy','Swift','Curious'
];
const ANIM = [
  'Fox','Koala','Panda','Lion','Otter','Eagle',
  'Seal','Shark','Mouse','Tiger','Wolf','Hippo'
];

export function getPersistentGuestId(): string {
  const key = 'trivia_guest_alias';
  if (typeof window === 'undefined') return 'Guest'; // SSR guard
  let alias = localStorage.getItem(key);
  if (!alias) {
    alias = `${ADJ[Math.floor(Math.random() * ADJ.length)]}${
            ANIM[Math.floor(Math.random() * ANIM.length)]}${
            Math.floor(Math.random() * 99)}`;
    localStorage.setItem(key, alias);
  }
  return alias;
}

export function rerollGuestId(): string {
  const key = 'trivia_guest_alias';
  const alias = `${ADJ[Math.floor(Math.random() * ADJ.length)]}${
          ANIM[Math.floor(Math.random() * ANIM.length)]}${
          Math.floor(Math.random() * 99)}`;
  localStorage.setItem(key, alias);
  return alias;
}