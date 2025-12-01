import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useMatch } from '../context/MatchContext';
import { useAuth } from '../context/AuthContext';

const ChatScreen = () => {
  const { matchId } = useParams();
  const { chats, addChatMessage, markNotificationRead, notifications } = useMatch();
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  // Filter messages for this match
  const matchMessages = chats.filter(msg => msg.matchId === parseInt(matchId));
  
  // Mark notifications as read
  useEffect(() => {
    const numericMatchId = parseInt(matchId, 10);
    const relatedNotifications = notifications.filter(notification =>
      notification.context?.matchId === numericMatchId
    );

    relatedNotifications.forEach(notification => {
      markNotificationRead(notification.id);
    });
  }, [matchId, markNotificationRead, notifications]);
  
  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [matchMessages]);
  
  const handleSend = () => {
    if (message.trim()) {
      addChatMessage(parseInt(matchId), currentUser.id, message);
      setMessage('');
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="chat-screen">
      <div className="chat-messages">
        {matchMessages.map(msg => (
          <div 
            key={msg.id}
            className={`message ${msg.senderId === currentUser.id ? 'sent' : 'received'}`}
          >
            <div className="message-content">
              {msg.content}
            </div>
            <div className="message-time">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Γράψτε το μήνυμά σας..."
        />
        <button onClick={handleSend}>Αποστολή</button>
      </div>
    </div>
  );
};

export default ChatScreen;
