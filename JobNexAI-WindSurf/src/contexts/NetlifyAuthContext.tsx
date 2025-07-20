import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import netlifyIdentity, { User } from 'netlify-identity-widget';

interface NetlifyAuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  signup: () => void;
  authReady: boolean;
}

const NetlifyAuthContext = createContext<NetlifyAuthContextType | undefined>(undefined);

export const NetlifyAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Event listener for login
    netlifyIdentity.on('login', (user) => {
      setUser(user);
      netlifyIdentity.close(); // Close the modal on login
    });

    // Event listener for logout
    netlifyIdentity.on('logout', () => {
      setUser(null);
    });
    
    // Event listener for init. This will check if a user is already logged in
    netlifyIdentity.on('init', (user) => {
        setUser(user);
        setAuthReady(true);
    });

    // Initialize Netlify Identity
    netlifyIdentity.init();

    // Cleanup listeners on unmount
    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
      netlifyIdentity.off('init');
    };
  }, []);

  const login = () => {
    netlifyIdentity.open('login');
  };

  const signup = () => {
    netlifyIdentity.open('signup');
  };

  const logout = () => {
    netlifyIdentity.logout();
  };

  const contextValue = {
    user,
    login,
    logout,
    signup,
    authReady,
  };

  return (
    <NetlifyAuthContext.Provider value={contextValue}>
      {children}
    </NetlifyAuthContext.Provider>
  );
};

export const useNetlifyAuth = () => {
  const context = useContext(NetlifyAuthContext);
  if (context === undefined) {
    throw new Error('useNetlifyAuth must be used within a NetlifyAuthProvider');
  }
  return context;
};
