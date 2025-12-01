import React from 'react';

const SwipeButtons = ({ onSwipe }) => {
  return (
    <div className="actions">
      <button className="dislike" onClick={() => onSwipe('left')}>✕</button>
      <button className="like" onClick={() => onSwipe('right')}>✓</button>
    </div>
  );
};

export default SwipeButtons;