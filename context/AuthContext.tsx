import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "../types/user";
import getDeviceInfoWithToken from "../utility/getDeviceInfoWithTOken";
import apiClient from "../api_call/apiClient";

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  setUser: (user: User | null) => Promise<void>;
  token: string | null;
  setToken: (token: string | null) => Promise<void>;
  isLoading: boolean;
  logout: () => Promise<void>;
}

interface ChildrenProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: ChildrenProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Syncs the FCM token and device details with your backend.
   * This is called on App Load and on Login.
   */
  async function updateDeviceInfoOnServer(authToken: string): Promise<void> {
    try {
      const deviceData = await getDeviceInfoWithToken();
      
      // If we are on a simulator or permission is denied, deviceData might be null
      if (!deviceData || !deviceData.token) {
        console.warn("Skipping device sync: No FCM token available.");
        return;
      }

      await apiClient.post('/update-device-info', 
        {
          fcmToken: deviceData.token, 
          deviceInfo: {
            name: deviceData.deviceName,
            os: deviceData.osVersion,
            platform: deviceData.platform
          }
        }, 
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      console.log("Device info synced with server successfully.");
    } catch (error) {
      
      console.error("Error updating device info on server:", error);
    }
  }

  /**
   * Loads the token and user data from storage when the app starts.
   */
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem('auth_token'),
          AsyncStorage.getItem('auth_user')
        ]);

        if (storedToken) {
          setToken(storedToken);
          // Sync device info in the background
          updateDeviceInfoOnServer(storedToken);
        }
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to load auth data from storage", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadStorageData();
  }, []);

  /**
   * Saves or removes the Auth Token and triggers device sync.
   */
  const saveToken = async (newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      await AsyncStorage.setItem('auth_token', newToken);
      await updateDeviceInfoOnServer(newToken); 
    } else {
      await AsyncStorage.removeItem('auth_token');
    }
  };

  /**
   * Saves or removes user profile data to persistent storage.
   */
  const saveUser = async (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      await AsyncStorage.setItem('auth_user', JSON.stringify(newUser));
    } else {
      await AsyncStorage.removeItem('auth_user');
    }
  };

  /**
   * Clears all local data and notifies the server to stop push notifications.
   */
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
      
      console.log("User logged out successfully.");
    } catch (e) {
      console.error("Error during logout process", e);
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
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};