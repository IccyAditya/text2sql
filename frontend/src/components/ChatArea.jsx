import React, { useState, useEffect, useRef } from 'react';
import Ibutton from './Ibutton';
import { useChatContext } from './ChatContext';
import NewMessage from './NewMessage';
import InstructionsHeader from './Instruction';

const ChatScreen = () => {
  const { inputText, apiResponse } = useChatContext();
  const [messageContent, setMessageContent] = useState([]);
  
  // Reference for the last message in the chat
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (inputText.trim() !== '') {
      const userMessage = {
        type: 'user',
        content: { text: inputText },
      };
  
      setMessageContent((prevContent) => [
        ...prevContent,
        userMessage,
      ]);
    }
  }, [inputText]);

  useEffect(() => {
    if (apiResponse && Object.keys(apiResponse).length > 0) {
      const responseMessage = {
        type: 'response',
        content: apiResponse,
      };
      setMessageContent((prevContent) => [
        ...prevContent,
        responseMessage,
      ]);
    }
  }, [apiResponse]);

  // Auto-scroll to the last message whenever messageContent changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messageContent]);

  return (
    <div className="chat-container">
      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <InstructionsHeader />
      </div>
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        <Ibutton />
      </div>
      <div className="chat-screen" style={{marginTop:"100px"}}>
        {messageContent.map((item, index) => (
          <NewMessage key={index} content={item.content} type={item.type} />
        ))}
        <div ref={messagesEndRef} /> {/* Empty div to scroll to */}
      </div>
    </div>
  );
};

export default ChatScreen;
