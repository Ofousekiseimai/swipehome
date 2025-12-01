import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useActivePage } from '../context/ActivePageContext'; // New import
import { useMatch } from '../context/MatchContext';

const Header = () => {
  const { currentUser } = useAuth();
  const { notifications } = useMatch();
  const { activePage, setActivePage } = useActivePage(); // Get from context
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = useMemo(() => {
    if (!currentUser) {
      return 0;
    }

    return notifications.filter(notification =>
      String(notification.userId) === String(currentUser.id) && !notification.read
    ).length;
  }, [notifications, currentUser]);

  const toggleProfile = () => {
    if (location.pathname.includes('/profile')) {
      navigate('/home');
      setActivePage(null);
    } else {
      navigate(`/profile/${currentUser?.id}`);
      setActivePage('profile');
    }
  };

  const toggleNotifications = () => {
    if (location.pathname === '/notifications') {
      navigate('/home');
      setActivePage(null);
    } else {
      navigate('/notifications');
      setActivePage('notifications');
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo" onClick={() => {
          navigate('/home');
          setActivePage(null);
        }}>
          SwipeHome
        </div>
      </div>
      
      <div className="header-right">
        <div 
          className={`notifications-link ${activePage === 'notifications' ? 'active' : ''}`}
          onClick={toggleNotifications}
        >
          <span className="notification-icon">🔔</span>
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </div>
        
        <div 
          className={`profile-link ${activePage === 'profile' ? 'active' : ''}`}
          onClick={toggleProfile}
        >
          <span className="user-avatar">
            {currentUser?.name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
