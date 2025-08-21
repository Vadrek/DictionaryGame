'use client';

import { GameProvider } from './GameContext';
import { GameUI } from './GameUI';

export default function Home() {
  return (
    <GameProvider>
      <GameUI />
    </GameProvider>
  );
}
