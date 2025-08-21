'use client';

import { ChatCompo } from '@/components/chatWindow/ChatCompo';
import { GameCompo } from '@/components/gameWindow/GameCompo';
import { UsernameForm } from '@/components/chatWindow/UsernameForm';
import { useGame } from './GameContext';

export function GameUI() {
  const {
    inputUsername,
    setInputUsername,
    currentUsername,
    setCurrentUsername,
    allUsernames,
    socket,
  } = useGame();

  const disabled = currentUsername === inputUsername;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUsername = inputUsername.trim();
    if (socket && newUsername && !disabled) {
      setCurrentUsername(newUsername);
      socket.emit('change_username', { username: newUsername });
      sessionStorage.setItem('username', newUsername);
    }
  };

  return (
    <div className="flex p-6 h-screen">
      <div className="w-1/4 flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-white">
          {/* Jeu du Dictionnaire 📚 */}
          Jeu du Dictionnaire
        </h1>

        <UsernameForm
          inputUsername={inputUsername}
          setInputUsername={setInputUsername}
          handleSubmit={handleSubmit}
          disabled={disabled}
        />

        <div>{`Connectés : ${Object.values(allUsernames).join(', ')}`}</div>

        <ChatCompo roomId={'23'} username={inputUsername} socket={socket} />
      </div>
      <div className="w-3/4 flex flex-1 ">{socket && <GameCompo />}</div>
    </div>
  );
}
