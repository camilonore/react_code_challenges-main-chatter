import React, { useState, createContext, useCallback, useEffect } from 'react';
import initialMessages from './constants/initialMessages';

const LatestMessagesContext = createContext({});

export default LatestMessagesContext;

export function LatestMessages({ children }) {
  const [messages, setMessages] = useState([
    {
      user: 'bot',
      message: initialMessages.bot,
    },
  ]);

  const setLatestMessage = useCallback(
    (userId, message) => {
      return setMessages((prev) => {
        return [
          ...prev,
          {
            user: userId,
            message,
          },
        ];
      });
    },
    [messages]
  );

  return (
    <LatestMessagesContext.Provider value={{ messages, setLatestMessage }}>
      {children}
    </LatestMessagesContext.Provider>
  );
}
