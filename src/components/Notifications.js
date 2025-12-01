import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMatch } from '../context/MatchContext';

const Notifications = () => {
  const { currentUser } = useAuth();
  const { notifications, markNotificationRead, loading } = useMatch();

  const items = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return notifications
      .filter(notification => String(notification.userId) === String(currentUser.id))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [notifications, currentUser]);

  const unreadCount = items.filter(notification => !notification.read).length;

  const markAllAsRead = () => {
    items
      .filter(notification => !notification.read)
      .forEach(notification => markNotificationRead(notification.id));
  };

  if (loading) {
    return <div className="loading">Φόρτωση...</div>;
  }

  return (
    <div className="notifications-page">
      <h1>Ειδοποιήσεις</h1>

      <div className="notification-summary">
        {unreadCount > 0 ? (
          <>
            <p>Έχετε {unreadCount} μη αναγνωσμένες ειδοποιήσεις</p>
            <button onClick={markAllAsRead}>Σημείωση όλων ως αναγνωσμένων</button>
          </>
        ) : (
          <p>Δεν έχετε νέες ειδοποιήσεις</p>
        )}
      </div>

      <div className="notification-list">
        {items.map(notification => (
          <div
            key={notification.id}
            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
          >
            <div className="notification-message">{notification.message}</div>
            <div className="notification-meta">
              <span>{new Date(notification.createdAt).toLocaleString()}</span>
              {!notification.read && (
                <button onClick={() => markNotificationRead(notification.id)}>
                  Σήμανση ως αναγνωσμένη
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
