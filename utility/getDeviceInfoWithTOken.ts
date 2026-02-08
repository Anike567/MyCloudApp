import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

interface AuthDeviceInfo {
    token: string | null;
    deviceName: string;
    osVersion: string | number;
    platform: string;
}

export default async function getDeviceInfoWithToken(): Promise<AuthDeviceInfo | null> {
    try {
        
        if (!Constants.isDevice) {
            console.warn('Must use physical device for Push Notifications');
            return null;
        }

        // 2. Handle Permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.warn('Failed to get push token!');
            return null;
        }

        // 3. Android Channels (Crucial for visibility)
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        // 4. Get the Native FCM Token
        const tokenData = await Notifications.getDevicePushTokenAsync();
        const token = tokenData.data;

        // 5. Gather Device Info using expo-constants
        // On Android, deviceName often returns the model (e.g. SM-G991U)
        const deviceName = Constants.deviceName ?? "Unknown Device";
        const osVersion = Platform.Version; // Android API Level (e.g., 34)
        const platform = Platform.OS;

        console.log('FCM Token & Device Info retrieved successfully');

        return {
            token,
            deviceName,
            osVersion,
            platform
        };

    } catch (error) {
        console.error('Error getting device info/token:', error);
        return null;
    }
}