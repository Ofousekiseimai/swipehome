import React from 'react';
import { useSwipeable } from 'react-swipeable';

const SeekerCard = ({ seeker, onSwipe }) => {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => onSwipe('left'),
    onSwipedRight: () => onSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <div {...swipeHandlers} className="seeker-card">
      <div className="seeker-header">
        <div className="seeker-icon">👤</div>
        <h2>Πιθανός Ενοικιαστής</h2>
      </div>
      
      <div className="seeker-details">
        <div className="detail-item">
          <span className="detail-label">Οικογενειακή Κατάσταση:</span>
          <span className="detail-value">
            {seeker.hasChildren ? `Έχει ${seeker.childrenCount} παιδί/α` : 'Χωρίς παιδιά'}
          </span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Κατοικίδια:</span>
          <span className="detail-value">
            {seeker.hasPets ? seeker.petsType : 'Χωρίς κατοικίδια'}
          </span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Επιθυμητό Μέγεθος:</span>
          <span className="detail-value">
            {seeker.desiredSize || 'Δεν έχει οριστεί'} τ.μ.
          </span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Μέγιστο Βάθος:</span>
          <span className="detail-value">
            {seeker.maxBudget || 'Δεν έχει οριστεί'} €/μήνα
          </span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Προτίμηση Περιοχής:</span>
          <span className="detail-value">
            {seeker.preferredLocation || 'Οποιαδήποτε περιοχή'}
          </span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Επάγγελμα:</span>
          <span className="detail-value">
            {seeker.profession || '-'}
          </span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Ώρες Εργασίας:</span>
          <span className="detail-value">
            {seeker.workHours || '-'}
          </span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Επιπλέον Πληροφορίες:</span>
          <span className="detail-value">
            {seeker.additionalInfo || '-'}
          </span>
        </div>
      </div>
      
      <div className="swipe-hint">
        <div className="swipe-left">✕ Απόρριψη</div>
        <div className="swipe-right">✓ Αποδοχή</div>
      </div>
    </div>
  );
};

export default SeekerCard;