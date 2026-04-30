const ADJ = [
  'Crafty','Slow','Happy','Clever','Brave','Sneaky',
  'Witty','Lucky','Noisy','Fancy','Swift','Curious'
];
const ANIM = [
  'Fox','Koala','Panda','Lion','Otter','Eagle',
  'Seal','Shark','Mouse','Tiger','Wolf','Hippo'
];

const GUEST_ALIAS_KEY = 'trivia_guest_alias';
const GUEST_ALIAS_RESERVED_KEY = 'trivia_guest_alias_reserved';

function generateGuestAlias(): string {
  return `${ADJ[Math.floor(Math.random() * ADJ.length)]}${
    ANIM[Math.floor(Math.random() * ANIM.length)]}${
    Math.floor(Math.random() * 99)}`;
}

export function getPersistentGuestId(): string {
  if (typeof window === 'undefined') return 'Guest'; // SSR guard
  let alias = localStorage.getItem(GUEST_ALIAS_KEY);
  if (!alias) {
    alias = generateGuestAlias();
    localStorage.setItem(GUEST_ALIAS_KEY, alias);
    localStorage.removeItem(GUEST_ALIAS_RESERVED_KEY);
  }
  return alias;
}

export async function getUniquePersistentGuestId(): Promise<string> {
  if (typeof window === 'undefined') return 'Guest';

  const currentAlias = getPersistentGuestId();
  if (localStorage.getItem(GUEST_ALIAS_RESERVED_KEY) === 'true') {
    return currentAlias;
  }

  const response = await fetch('/api/guest-aliases', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ preferredAlias: currentAlias }),
  });

  if (!response.ok) {
    throw new Error('Could not reserve a unique guest alias');
  }

  const data = await response.json() as { alias?: string };
  const reservedAlias = data.alias || currentAlias;
  localStorage.setItem(GUEST_ALIAS_KEY, reservedAlias);
  localStorage.setItem(GUEST_ALIAS_RESERVED_KEY, 'true');
  return reservedAlias;
}

export function rerollGuestId(): string {
  const alias = generateGuestAlias();
  localStorage.setItem(GUEST_ALIAS_KEY, alias);
  localStorage.removeItem(GUEST_ALIAS_RESERVED_KEY);
  return alias;
}
