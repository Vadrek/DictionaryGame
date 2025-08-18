import React, { useEffect, useState, useRef } from 'react';
import { Button } from '../buttons/buttons';

interface IMsgDataTypes {
  user: string;
  msg: string;
}

interface ChatProps {
  username: string;
  roomId: string;
  socket: any;
}

export const ChatCompo = ({ username, roomId, socket }: ChatProps) => {
  const [currentMsg, setCurrentMsg] = useState('');
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMsg.trim() === '') return;
    const msgData: IMsgDataTypes = { user: username, msg: currentMsg };
    socket.emit('send_msg', msgData);
    setCurrentMsg('');
  };

  const onReceiveMsg = (data: IMsgDataTypes) => {
    setChat((prev) => [...prev, data]);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  useEffect(() => {
    if (!socket) return;
    socket.on('receive_msg', onReceiveMsg);
    return () => socket.off('receive_msg', onReceiveMsg);
  }, [socket]);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-gradient-to-b from-gray-900 to-black rounded-lg p-4 shadow-lg w-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {chat.map(({ user, msg }, idx) => (
          <div
            key={idx}
            className={`flex items-end ${
              user === username ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`px-3 py-1 rounded-xl max-w-[70%] break-words ${
                user === username
                  ? 'bg-purple-600 text-white'
                  : 'bg-blue-600 text-white'
              }`}
            >
              <p className="text-sm font-bold">{user}</p>
              <p className="text-sm">{msg}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input area */}
      <form className="flex gap-2" onSubmit={sendData}>
        <input
          type="text"
          placeholder="Votre message..."
          value={currentMsg}
          onChange={(e) => setCurrentMsg(e.target.value)}
          className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Button variant="secondary" type="submit" size="small">
          Envoyer
        </Button>
      </form>
    </div>
  );
};
