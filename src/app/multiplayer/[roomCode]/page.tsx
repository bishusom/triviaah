import type { Metadata } from 'next';

import { MultiplayerRoomClient } from '@/components/multiplayer/MultiplayerRoomClient';

type PageProps = {
  params: Promise<{ roomCode: string }>;
};

export const metadata: Metadata = {
  title: 'Multiplayer Trivia Room | Triviaah',
  description: 'Join a private Triviaah multiplayer trivia room.',
  robots: { index: false, follow: false },
};

export default async function MultiplayerRoomPage({ params }: PageProps) {
  const { roomCode } = await params;
  return <MultiplayerRoomClient roomCode={roomCode} />;
}
