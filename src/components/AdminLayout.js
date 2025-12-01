import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AD';

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-brand">
          <div className="admin-pill">Admin</div>
          <div>
            <div className="admin-title">SwipeHome</div>
            <div className="admin-subtitle">Πίνακας Διαχείρισης</div>
          </div>
        </div>

        <div className="admin-actions">
          <div className="admin-user-chip">
            <div className="admin-avatar">{initials}</div>
            <div className="admin-user-meta">
              <strong>{currentUser?.name}</strong>
              <span>{currentUser?.email}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Αποσύνδεση
          </button>
        </div>
      </header>

      <main className="admin-content">{children}</main>
    </div>
  );
};

export default AdminLayout;
