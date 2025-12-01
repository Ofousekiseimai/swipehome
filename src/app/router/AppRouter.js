import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from '../../components/LoginSignup';
import Home from '../../components/Home';
import PropertyForm from '../../components/PropertyForm';
import SeekerProfile from '../../components/SeekerProfile';
import OwnerProfile from '../../components/OwnerProfile';
import Notifications from '../../components/Notifications';
import CreateProfile from '../../components/CreateProfile';
import ProfileForm from '../../components/ProfileForm';
import ChatScreen from '../../components/ChatScreen';
import AdminDashboard from '../../components/AdminDashboard';
import AdminLayout from '../../components/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from './AppLayout';
import { useAuth } from '../../context/AuthContext';

const ProfileWrapper = () => {
  const { currentUser } = useAuth();

  if (currentUser?.type === 'seeker') {
    return <SeekerProfile />;
  }

  if (currentUser?.type === 'owner') {
    return <OwnerProfile />;
  }

  return <div>Loading...</div>;
};

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginSignup />} />
      <Route
        path="/home"
        element={(
          <ProtectedRoute allowedTypes={['seeker', 'owner']}>
            <AppLayout>
              <Home />
            </AppLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/list-property"
        element={(
          <ProtectedRoute allowedTypes={['seeker', 'owner']}>
            <AppLayout>
              <PropertyForm />
            </AppLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/profile/:id"
        element={(
          <ProtectedRoute allowedTypes={['seeker', 'owner']}>
            <AppLayout>
              <ProfileWrapper />
            </AppLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/notifications"
        element={(
          <ProtectedRoute allowedTypes={['seeker', 'owner']}>
            <AppLayout>
              <Notifications />
            </AppLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/edit-profile"
        element={(
          <ProtectedRoute allowedTypes={['seeker', 'owner']}>
            <AppLayout>
              <ProfileForm />
            </AppLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/create-profile/:id"
        element={(
          <ProtectedRoute allowedTypes={['seeker', 'owner']}>
            <AppLayout>
              <CreateProfile />
            </AppLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/chat/:matchId"
        element={(
          <ProtectedRoute allowedTypes={['seeker', 'owner']}>
            <AppLayout>
              <ChatScreen />
            </AppLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/admin"
        element={(
          <ProtectedRoute allowedTypes={['admin']}>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        )}
      />
    </Routes>
  </Router>
);

export default AppRouter;
