import 'react-native-gesture-handler';
import './tasks/syncTask';

import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackRouter from './components/routing/StackRouter';
import { AuthProvider } from './context/AuthContext';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { MY_SYNC_TASK } from './tasks/syncTask';


export default function App() {

  useEffect(() => {
    const configureNotifications = async () => {
      // 1. Request Permission
      await Notifications.requestPermissionsAsync();

      // 2. Create the Android Channel (Required for background visibility)
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    };

    const setupBackgroundSync = async () => {
      try {
        const isRegistered = await TaskManager.isTaskRegisteredAsync(MY_SYNC_TASK);
        if (!isRegistered) {
          console.log("⚙️ Registering background task...");
          // ✅ Simplified options to satisfy TypeScript
          await BackgroundTask.registerTaskAsync(MY_SYNC_TASK, {
            minimumInterval: 15 * 60,
          });
          console.log("✅ Task registered successfully!");
        } else {
          console.log("ℹ️ Background task already exists.");
        }
      } catch (error) {
        console.error("❌ Registration error:", error);
      }
    };

    const prepareApp = async () => {
      await Notifications.requestPermissionsAsync();
      await setupBackgroundSync();
    };

    prepareApp();
  }, []);

  return (
    <NavigationContainer>
      <AuthProvider>
        <StackRouter />
      </AuthProvider>
    </NavigationContainer>
  );
}