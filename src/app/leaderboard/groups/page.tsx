import type { Metadata } from 'next';
import PrivateGroups from '@/components/leaderboard/PrivateGroups';

export const metadata: Metadata = {
  title: 'Private Group Leaderboards | Triviaah',
  description: 'Create a private trivia leaderboard for friends, family, or your classroom.',
  alternates: { canonical: 'https://triviaah.com/leaderboard/groups' },
  robots: { index: false, follow: true },
  referrer: 'no-referrer',
};

export default function GroupsPage() {
  return <PrivateGroups />;
}
