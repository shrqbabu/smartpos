// Authentication Context Provider - supports both Firebase and Demo mode
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'cashier' | 'manager';
  storeId?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: any;
  lastLogin?: any;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isManager: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  isAdmin: false,
  isManager: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo mode: load user from localStorage
    const loadUser = () => {
      try {
        const stored = localStorage.getItem('smartpos-demo-user');
        if (stored) {
          setUserProfile(JSON.parse(stored));
        }
      } catch {
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Listen for storage changes (login/logout)
    const handleStorage = () => loadUser();
    window.addEventListener('storage', handleStorage);
    
    // Also listen for custom auth events
    window.addEventListener('smartpos-auth', handleStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('smartpos-auth', handleStorage);
    };
  }, []);

  const value: AuthContextType = {
    currentUser: userProfile,
    userProfile,
    loading,
    isAdmin: userProfile?.role === 'admin',
    isManager: userProfile?.role === 'admin' || userProfile?.role === 'manager'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
