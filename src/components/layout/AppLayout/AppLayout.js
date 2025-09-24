import React from 'react';
import './AppLayout.css';

const AppLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <div className="app-container">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;