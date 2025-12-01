import React from 'react';
import Header from '../../components/Header';

const AppLayout = ({ children }) => (
  <div className="app-layout">
    <Header />
    <main className="main-content">{children}</main>
  </div>
);

export default AppLayout;
