import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email, password, metadata) => {
    // Mock signup: check if user exists, then save
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      throw new Error("User already exists");
    }
    
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password, // In a real app we'd hash this, but this is a prototype
      user_metadata: metadata
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { data: { user: newUser }, error: null };
  };

  const signIn = async (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error("Invalid email or password");
    }
    
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return { data: { user }, error: null };
  };

  const signOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
