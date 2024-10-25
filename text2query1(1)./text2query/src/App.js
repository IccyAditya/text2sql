import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import imgurl from './a.png'; 


const ChatInterface = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [messages, setMessages] = useState([
    { 
      sender: isOnline ? 'Jim Geiro' : 'Support offline', 
      text: isOnline ? 'Hello, Jim here. What can I help you with?' : 'Hello, our live chat is offline at the moment. We will get back to you ASAP.'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  const randomResponses = [
    'Thank you for reaching out!',
    'I will look into this for you.',
    'Can you provide more details?',
    'Please hold on for a moment.',
    'Im here to assist you.',
    'Could you clarify your request?',
    'We appreciate your patience.',
    'Let me check that for you.',
    'I will get back to you shortly.',
    'Is there anything else I can help with?',
  ];

  const getRandomResponse = () => {
    const randomIndex = Math.floor(Math.random() * randomResponses.length);
    return randomResponses[randomIndex];
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: 'You', text: newMessage }]);
      setNewMessage('');

      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: isOnline ? 'Jim Geiro' : 'Support offline', text: getRandomResponse() },
        ]);
      }, 1000);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
		<div className="container">
			<div className='Sidebar'>
				<div className="history-messages">
				{messages.map((msg, index) => (
					<div key={index} className="history-message">
					<span className="history-sender">{msg.sender}</span>
					<div className="history-text">{msg.text.substring(0, 30)}...</div>
					</div>
				))}
				</div>
			</div>
			
			<div className='chat-container'>
				<div className="chat-header">
				<div className="chat-title">
					Chatting with {isOnline ? 'Jim Geiro' : 'Support offline'}
				</div>
				<div className="chat-status">
					<span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}></span>
					{isOnline ? 'Livechat online' : 'Livechat offline'}
				</div>
				</div>
				
				<div className="chat-messages">
					{messages.map((msg, index) => (
						<div key={index} className={`message ${msg.sender === 'You' ? 'sent' : 'received'}`}>
						<span className="sender">{msg.sender}: </span>
						{msg.text}
						</div>
					))}
					<div ref={chatEndRef} />
				</div>
				
				<div className="chat-input">
					<input
						type="text"
						placeholder="Write text here for query generation"
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
					/>

					<img 
						src={imgurl} 
						alt="Send"
						onClick={handleSendMessage}
						className="send-button"
					/>
				</div>
			</div>
		</div>
    </>
  );
};

export default ChatInterface;