import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [inputText, setInputText] = useState('');
  const [apiResponse,setapiResponse] = useState({});

  const updateInputText = (text) => {
    setInputText(text);
  };

  const updateapiResponse = (res) => {
    setapiResponse(res)
  };

  return (
    <ChatContext.Provider value={{ inputText, updateInputText , updateapiResponse, apiResponse }}>
      {children}
    </ChatContext.Provider>
  );
};
