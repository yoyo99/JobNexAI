import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Module Communauté/forum MVP pour JobNexAI.
 * Permet de poster des messages, de répondre et de liker (stockage local pour MVP, à brancher sur Supabase ensuite).
 */

interface Message {
  id: number;
  author: string;
  content: string;
  likes: number;
  replies: Message[];
}

const initialMessages: Message[] = [
  {
    id: 1,
    author: 'Alice',
    content: 'Bienvenue sur la communauté JobNexAI ! Présentez-vous ici.',
    likes: 2,
    replies: [
      { id: 2, author: 'Bob', content: 'Bonjour à tous !', likes: 1, replies: [] },
    ],
  },
];

const Community: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handlePost = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now(), author: 'Vous', content: newMessage, likes: 0, replies: [] },
    ]);
    setNewMessage('');
  };

  const handleLike = (id: number) => {
    setMessages(messages.map(msg =>
      msg.id === id ? { ...msg, likes: msg.likes + 1 } : msg
    ));
  };

  return (
    <div className="prose mx-auto p-8 bg-background text-white rounded-lg max-w-3xl">
      <h1>Communauté JobNexAI</h1>
      <div className="mb-6">
        <textarea
          className="w-full rounded-lg p-2 text-black"
          placeholder="Écrivez un message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
        />
        <button className="btn-primary mt-2" onClick={handlePost}>
          Poster
        </button>
      </div>
      <ul className="space-y-4">
        {messages.map(msg => (
          <li key={msg.id} className="bg-white/10 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{msg.author}</span>
              <button className="text-primary-400" onClick={() => handleLike(msg.id)}>
                👍 {msg.likes}
              </button>
            </div>
            <div className="mt-2">{msg.content}</div>
            {msg.replies.length > 0 && (
              <ul className="ml-6 mt-2 space-y-2">
                {msg.replies.map(reply => (
                  <li key={reply.id} className="bg-white/5 p-2 rounded">
                    <span className="font-semibold">{reply.author}:</span> {reply.content}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {/* TODO: Brancher sur Supabase pour persistance réelle + ajouter réponses dynamiques */}
    </div>
  );
};

export default Community;
