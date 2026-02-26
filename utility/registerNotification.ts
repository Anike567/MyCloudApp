import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';


async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log('Must use physical device for Push Notifications');
    return;
  }

  // 1. Android Channel is still required
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get permissions!');
    return;
  }

  try {
    // 2. IMPORTANT: Use getDevicePushTokenAsync for Firebase
    // This returns the native FCM token (Android) or APNs token (iOS)
    const deviceToken = (await Notifications.getDevicePushTokenAsync()).data;
    
    console.log("🔥 Native FCM Token:", deviceToken);
    return deviceToken;
  } catch (e) {
    console.error("❌ FCM Token Error:", e);
  }
}

export default registerForPushNotificationsAsync
