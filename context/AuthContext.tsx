import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "../types/user";
import apiClient from "../api_call/apiClient";
import getWideVineID from "../utility/getWideVineID";

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  androidID: string | null; 
  setUser: (user: User | null) => Promise<void>;
  token: string | null;
  setToken: (token: string | null) => Promise<void>;
  isLoading: boolean;
  logout: () => Promise<void>;
}

interface ChildrenProps {
  children: ReactNode;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: ChildrenProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [androidID, setAndroidId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem('auth_token'),
          AsyncStorage.getItem('auth_user')
        ]);

        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));

  
        const id = await getWideVineID();
        setAndroidId(id);

      } catch (e) {
        console.error("Failed to load auth data from storage", e);
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

  const logout = async () => {
    try {
      if (token) {
        try {
          await apiClient.post('/logout', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        } catch (apiErr) {
          console.warn("Server logout failed, clearing local data anyway.");
        }
      }
      
      setToken(null);
      setUser(null);
      await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
    } catch (e) {
      console.error("Error during logout process", e);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn: !!token, 
        user, 
        androidID, 
        setUser: saveUser, 
        token, 
        setToken: saveToken, 
        isLoading, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};