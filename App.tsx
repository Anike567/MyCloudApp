import 'react-native-gesture-handler';
import './tasks/syncTask'; // Ensure MY_SYNC_TASK is defined here

import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackRouter from './components/routing/StackRouter';
import { AuthProvider } from './context/AuthContext';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { MY_SYNC_TASK } from './tasks/syncTask';
import notificationResponder from './tasks/notificationResponder';

// 1. Define the Task Name
const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND_NOTIFICATION_TASK';

// 2. Define the task in the GLOBAL SCOPE (Mandatory)
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, notificationResponder);

export default function App() {
  useEffect(() => {
    const configureNotifications = async () => {
      // Request Permission
      await Notifications.requestPermissionsAsync();

      // Create the Android Channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    };

    const setupTasks = async () => {
      try {
        // A. Register Notification Task
        const isNotifRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);
        if (!isNotifRegistered) {
          await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
          console.log("✅ Notification task registered");
        }

        // B. Register Periodic Sync Task
        const isSyncRegistered = await TaskManager.isTaskRegisteredAsync(MY_SYNC_TASK);
        if (!isSyncRegistered) {
          // FIX: Removed 'stopOnTerminate' and 'startOnBoot' to satisfy TypeScript
          await BackgroundTask.registerTaskAsync(MY_SYNC_TASK, {
            minimumInterval: 15 * 60, // 15 minutes
          });
          console.log("✅ Sync task registered");
        }
      } catch (error) {
        console.error("❌ Registration error:", error);
      }
    };

    const prepareApp = async () => {
      await configureNotifications();
      await setupTasks();
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