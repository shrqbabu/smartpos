import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  // Check demo mode auth
  const demoUser = localStorage.getItem('smartpos-demo-user');
  
  if (!demoUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const user = JSON.parse(demoUser);
    if (!requiredRole.includes(user.role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

// Hook to get current demo user
export const useDemoUser = () => {
  const stored = localStorage.getItem('smartpos-demo-user');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};
