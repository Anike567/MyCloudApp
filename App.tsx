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
import notificationResponder from './tasks/notificationResponder';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND_NOTIFICATION_TASK';

// ✅ Must stay in global scope
TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  notificationResponder
);

export default function App() {
  useEffect(() => {
    const configureNotifications = async () => {
      await Notifications.requestPermissionsAsync();

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
        const isNotifRegistered =
          await TaskManager.isTaskRegisteredAsync(
            BACKGROUND_NOTIFICATION_TASK
          );

        if (!isNotifRegistered) {
          await Notifications.registerTaskAsync(
            BACKGROUND_NOTIFICATION_TASK
          );
          console.log('✅ Notification task registered');
        }
       

        const isSyncRegistered =
          await TaskManager.isTaskRegisteredAsync(MY_SYNC_TASK);

        if (!isSyncRegistered) {
          await BackgroundTask.registerTaskAsync(MY_SYNC_TASK, {
            minimumInterval: 15 * 60, // 15 minutes
          });
          console.log('✅ Sync task registered');
        }
        else{
          console.log('sync task is already registered');
        }
      } catch (error) {
        console.error('❌ Registration error:', error);
      }
    };

    const prepareApp = async () => {
      await Promise.all([
        configureNotifications(),
        setupTasks(),
      ]);
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