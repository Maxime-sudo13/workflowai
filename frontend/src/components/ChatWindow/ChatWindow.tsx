// frontend/src/components/ChatWindow/ChatWindow.tsx
import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/chatStore'; // Import du hook (valeur)
import type { Message } from '../../store/chatStore'; // Import du type Message (type uniquement)

const ChatWindow: React.FC = () => {
  // Récupérer l'état et les actions depuis le store Zustand
  const messages = useChatStore((state) => state.messages);
  const inputText = useChatStore((state) => state.inputText);
  const isAiTyping = useChatStore((state) => state.isAiTyping);
  const setInputText = useChatStore((state) => state.setInputText);
  const addMessage = useChatStore((state) => state.addMessage);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    addMessage({
      text: inputText,
      sender: 'user',
    });
    setInputText('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-250px)] w-full max-w-3xl mx-auto bg-slate-700 shadow-2xl rounded-lg overflow-hidden">
      <div className="flex-grow p-6 space-y-4 overflow-y-auto bg-slate-750 custom-scrollbar">
        {messages.map((msg: Message) => ( // L'annotation de type ici utilise 'Message'
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-xl shadow-md break-words ${
                msg.sender === 'user'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-600 text-slate-50'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isAiTyping && (
          <div className="flex justify-start">
            <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-xl shadow-md bg-slate-600 text-slate-50">
              <span className="italic">L'IA écrit...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-600 bg-slate-700">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Décrivez votre besoin ici..."
            className="flex-grow p-3 border border-slate-500 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none bg-slate-800 text-slate-100 placeholder-slate-400 transition-shadow duration-150 focus:shadow-lg"
            disabled={isAiTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isAiTyping}
            className="px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;