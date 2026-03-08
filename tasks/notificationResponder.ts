import * as FileSystem from 'expo-file-system/legacy';
import apiClient from "../api_call/apiClient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import getWideVineID from '../utility/getWideVineID';
import * as Notifications from 'expo-notifications'; // ✅ Added

const uploadAsBufferStream = async (contentUri: string, reqId: string) => {
    const [storedToken, deviceId] = await Promise.all([
        AsyncStorage.getItem('auth_token'),
        getWideVineID(),
    ]);

    const tempFileUri = `${FileSystem.cacheDirectory}${reqId}.tmp`;

    try {
        await FileSystem.copyAsync({ from: contentUri, to: tempFileUri });

        const fullBase64 = await FileSystem.readAsStringAsync(tempFileUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        await apiClient.post('/upload/upload-stream', {
            deviceId: deviceId,
            reqId,
            chunk: fullBase64,
            isFinal: true
        }, {
            headers: {
                'Authorization': `Bearer ${storedToken}`,
                'x-device-id': deviceId,
            }
        });

        await FileSystem.deleteAsync(tempFileUri, { idempotent: true });
        console.log("✅ Upload complete for reqId:", reqId);

    } catch (err: any) {
        console.error("❌ Upload Error:", err);

        // ✅ Report Error via Notification instead of Alert
        const errorMessage = err?.response?.data?.message || err.message || "Unknown Upload Error";

        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Error during uploading image to another device',
                body: errorMessage,
                android: { channelId: 'default' },
            } as any,
            trigger: null,
        });
    }
};

const notificationResponder = async ({ data, error }: { data: any, error: any }) => {
    if (error) {
        // Handle incoming push notification errors
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Cloud Sync Error",
                body: "Failed to receive sync request from server.",
            },
            trigger: null,
        });
        return;
    }

    try {
        const payload = data?.notification?.data || data?.data || data;
        const { reqId, location } = payload;

        if (reqId && location) {
            await uploadAsBufferStream(location, reqId);
        }
    } catch (err) {
        console.error("❌ Background task failed:", err);
    }
}

export default notificationResponder;