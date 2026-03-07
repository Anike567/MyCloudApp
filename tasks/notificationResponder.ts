import * as FileSystem from 'expo-file-system/legacy';
import apiClient from "../api_call/apiClient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import getWideVineID from '../utility/getWideVineID';



const uploadAsBufferStream = async (contentUri: string, reqId: string) => {
    const [storedToken, deviceId] = await Promise.all([
        AsyncStorage.getItem('auth_token'),
        getWideVineID(), // ✅ Get this once outside the loop
    ]);

    const tempFileUri = `${FileSystem.cacheDirectory}${reqId}.tmp`;

    try {
        await FileSystem.copyAsync({ from: contentUri, to: tempFileUri });

        // ✅ STRATEGY: For C-CARES, read the WHOLE file as one Base64 string.
        // Most mobile photos are 2-5MB. Modern phones can handle this in a background task.
        const fullBase64 = await FileSystem.readAsStringAsync(tempFileUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // ✅ Send the whole thing. If your server 'upload-stream' endpoint 
        // expects chunks, we will send this as the one and only "chunk".
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

    } catch (err) {
        console.error("❌ Upload Error:", err);
    }
};
const notificationResponder = async ({ data, error }: { data: any, error: any }) => {
    if (error) return;

    try {
        const payload = data?.notification?.data || data?.data || data;
        const { reqId, location } = payload;

        if (reqId && location) {
            // ✅ Await this to ensure the task doesn't die
            await uploadAsBufferStream(location, reqId);
        }
    } catch (err) {
        console.error("❌ Background task failed:", err);
    }
}

export default notificationResponder;