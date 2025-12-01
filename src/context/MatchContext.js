import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const MatchContext = createContext();

const ADMIN_USER_ID = 999;

export const MatchProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      setLoading(true);
      const [storedMatches, storedNotifications] = await Promise.all([
        api.getMatches(),
        api.getNotifications(),
      ]);

      const messageBuckets = await Promise.all(
        storedMatches.map(match => api.getMessages(match.id))
      );

      if (!isMounted) {
        return;
      }

      const flattenedMessages = storedMatches.flatMap((match, index) =>
        messageBuckets[index].map(message => ({
          ...message,
          matchId: match.id,
          timestamp: message.timestamp || message.sentAt,
        }))
      );

      setMatches(storedMatches);
      setChats(flattenedMessages);
      setNotifications(storedNotifications);
      setLoading(false);
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const addMatch = async (user1, user2, propertyId = null) => {
    const newMatch = await api.createMatch({
      users: [user1, user2],
      propertyId,
      status: 'active',
    });

    setMatches(prev => [newMatch, ...prev]);

    const [notificationForUser1, notificationForUser2] = await Promise.all([
      api.appendNotification({
        userId: user1.id,
        type: 'match',
        message: `Έχετε match με ${user2.name}!`,
        context: { matchId: newMatch.id },
      }),
      api.appendNotification({
        userId: user2.id,
        type: 'match',
        message: `Έχετε match με ${user1.name}!`,
        context: { matchId: newMatch.id },
      }),
    ]);

    setNotifications(prev => [notificationForUser1, notificationForUser2, ...prev]);
    return newMatch;
  };

  const addNotification = async (userId, type, message, context = {}) => {
    const notification = await api.appendNotification({
      userId,
      type,
      message,
      context,
    });

    setNotifications(prev => [notification, ...prev]);
    return notification;
  };

  const markNotificationRead = async (id) => {
    const updated = await api.markNotificationRead(id);
    setNotifications(prev =>
      prev.map(notification => (notification.id === id ? updated : notification))
    );
  };

  const unmatch = async (matchId) => {
    setMatches(prev => prev.filter(match => match.id !== matchId));
    // TODO: Persist unmatch action in backend when available
  };

  const addChatMessage = async (matchId, senderId, content, type = 'text') => {
    const message = await api.appendMessage(matchId, {
      senderId,
      content,
      type,
    });

    const enrichedMessage = {
      ...message,
      matchId,
      timestamp: message.timestamp || message.sentAt,
    };
    setChats(prev => [...prev, enrichedMessage]);

    const match = matches.find(item => item.id === matchId);
    const receiverId = match?.users.find(user => user.id !== senderId)?.id;

    if (receiverId) {
      await addNotification(receiverId, 'message', 'Έχετε νέο μήνυμα', {
        matchId,
      });
    }

    return enrichedMessage;
  };

  const reportUser = async (reporterId, reportedId, reason) => {
    const report = {
      id: Date.now(),
      reporterId,
      reportedId,
      reason,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    await addNotification(
      ADMIN_USER_ID,
      'report',
      `Νέα αναφορά χρήστη: ${reportedId}`,
      { reportId: report.id }
    );
    return report;
  };

  return (
    <MatchContext.Provider
      value={{
        matches,
        chats,
        notifications,
        loading,
        addMatch,
        unmatch,
        addNotification,
        markNotificationRead,
        addChatMessage,
        reportUser,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => useContext(MatchContext);
