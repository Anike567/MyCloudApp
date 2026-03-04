import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "../types/user";
import apiClient from "../api_call/apiClient";
import getWideVineID from "../utility/getWideVineID";
import registerForPushNotificationsAsync from "../utility/registerNotification";

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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [androidID, setAndroidId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = async () => {
    try {
      
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem('auth_token'),
        AsyncStorage.getItem('auth_user')
      ]);

      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const deviceId = getWideVineID();

      
      if (storedToken) setToken(storedToken);
      if (parsedUser) setUser(parsedUser);
      setAndroidId(deviceId);

      // Sync with Backend ONLY if we have a user and token
      if (storedToken && parsedUser?.id) {
        try {
          const fcmToken = await registerForPushNotificationsAsync();
          console.log(fcmToken);
          const body = {
            androidId: deviceId,
            userId: parsedUser.id,
            fcmToken: fcmToken,
          };

          await apiClient.post('/sync/sync-token', body, {
            headers: { Authorization: `Bearer ${storedToken}` } 
          });
          console.log("✅ Device sync completed on startup");
        }
        catch(err){
          console.log(err);
        }
      }
    } catch (e) {
      console.error("❌ Failed to initialize auth/sync:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, [token]);

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
      // if (token) {
      //   await apiClient.post('/logout', {}, {
      //     headers: { 'Authorization': `Bearer ${token}` }
      //   }).catch(() => console.warn("Server logout failed, clearing local."));
      // }
      setToken(null);
      setUser(null);
      await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
    } catch (e) {
      console.error("Error during logout", e);
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