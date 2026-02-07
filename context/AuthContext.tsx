import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "../types/user";

interface AuthContextType {
  isLoggedIn: boolean; 
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  isLoading: boolean;
  logout: () => Promise<void>; // 1. Add logout to the interface
}

interface ChildrenProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: ChildrenProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('auth_token');
        const storedUser = await AsyncStorage.getItem('auth_user');

        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to load auth data", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const saveToken = async (newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      await AsyncStorage.setItem('auth_token', newToken);
    } else {
      await AsyncStorage.removeItem('auth_token');
    }
  };

  const saveUser = async (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      await AsyncStorage.setItem('auth_user', JSON.stringify(newUser));
    } else {
      await AsyncStorage.removeItem('auth_user');
    }
  };

  // 2. Define the logout function
  const logout = async () => {
    try {
      // Clear State
      setToken(null);
      setUser(null);
      // Clear Storage
      await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
    } catch (e) {
      console.error("Error during logout", e);
    }
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        user, 
        setUser: saveUser, 
        token, 
        setToken: saveToken,
        isLoading,
        logout // 3. Pass it into the provider value
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};