import React from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { NotificationProvider } from '../../context/NotificationContext';
import { ActivePageProvider } from '../../context/ActivePageContext';
import { MatchProvider } from '../../context/MatchContext';
import { FavoriteProvider } from '../../context/FavoriteContext';

const AppProviders = ({ children }) => (
  <AuthProvider>
    <NotificationProvider>
      <ActivePageProvider>
        <MatchProvider>
          <FavoriteProvider>{children}</FavoriteProvider>
        </MatchProvider>
      </ActivePageProvider>
    </NotificationProvider>
  </AuthProvider>
);

export default AppProviders;
