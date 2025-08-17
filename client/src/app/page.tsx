'use client';
import { useEffect, useState } from 'react';

import { ChatCompo } from '@/components/chatWindow/ChatCompo';
import { GameCompo } from '@/components/gameWindow/GameCompo';
import { useSocket } from '@/socket/hook';
import { UsernameForm } from '@/components/chatWindow/UsernameForm';

export default function Home() {
  const socket = useSocket();
  const [inputUsername, setInputUsername] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [allUsernames, setAllUsernames] = useState<Record<string, string>>({});

  const disabled = currentUsername === inputUsername;

  const onConnectionAccepted = ({ myState }: any) => {
    const username = myState.username;
    setInputUsername(username);
    setCurrentUsername(username);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUsername = inputUsername.trim();
    if (socket && newUsername && !disabled) {
      setCurrentUsername(newUsername);
      socket.emit('change_username', { username: newUsername });
      sessionStorage.setItem('username', newUsername);
    }
  };

  const onUpdateUsernames = ({ allUsernames }: any) => {
    setAllUsernames(allUsernames);
  };

  const onStoreSession = ({ sessionId, userId, username, score }: any) => {
    if (!socket) return;
    // attach the session ID to the next reconnection attempts
    socket.auth = { sessionId, username, score };
    // store it in the localStorage
    sessionStorage.setItem('sessionId', sessionId);
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('score', score);
    // save the ID of the user
    socket.userId = userId;
    socket.username = username;
    socket.score = score;
  };

  useEffect(() => {
    if (socket) {
      const sessionId = sessionStorage.getItem('sessionId');
      const username = sessionStorage.getItem('username');
      const score = sessionStorage.getItem('score');
      socket.auth = { sessionId, username, score };
      socket.on('connection_accepted', onConnectionAccepted);
      socket.on('update_usernames', onUpdateUsernames);
      socket.on('store_session', onStoreSession);

      return () => {
        socket.off('connection_accepted', onConnectionAccepted);
        socket.off('update_usernames', onUpdateUsernames);
        socket.off('store_session', onStoreSession);
      };
    }
  }, [socket]);

  return (
    <div className="flex p-6">
      <div className="w-1/4 flex flex-col gap-4 h-full max-h-screen">
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
      <div className="w-3/4 ">
        {socket && <GameCompo socket={socket} allUsernames={allUsernames} />}
      </div>
    </div>
  );
}
