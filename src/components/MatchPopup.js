import React from 'react';
import { useNavigate } from 'react-router-dom';

const MatchPopup = ({ match, onClose }) => {
  const navigate = useNavigate();
  
  const startChat = () => {
    navigate(`/chat/${match.id}`);
    onClose();
  };

  return (
    <div className="match-popup">
      <div className="match-content">
        <h2>It's a Match! 🎉</h2>
        <p>Συγχαρητήρια! Έχετε βρει κοινή συμφωνία με αυτόν τον χρήστη.</p>
        <div className="match-actions">
          <button className="continue-btn" onClick={onClose}>
            Συνέχεια
          </button>
          <button className="chat-btn" onClick={startChat}>
            Ξεκινήστε Συνομιλία
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchPopup;