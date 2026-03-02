import * as FileSystem from 'expo-file-system/legacy';
import apiClient from "../api_call/apiClient";
import AsyncStorage from '@react-native-async-storage/async-storage';



const uploadAsBufferStream = async (contentUri: string, reqId: string) => {
    const [storedToken] = await Promise.all([
        AsyncStorage.getItem('auth_token'),
    ]);

    // 1. Create a temporary local path in the cache
    const tempFileUri = `${FileSystem.cacheDirectory}${reqId}.tmp`;

    try {
        // 2. ✅ Copy the content:// URI to a readable file:// path
        await FileSystem.copyAsync({
            from: contentUri,
            to: tempFileUri
        });

        const fileInfo = await FileSystem.getInfoAsync(tempFileUri);
        if (!fileInfo.exists) return;

        const fileSize = fileInfo.size;
        const CHUNK_SIZE = 1024 * 128;
        let offset = 0;

        while (offset < fileSize) {
            const chunk = await FileSystem.readAsStringAsync(tempFileUri, {
                encoding: FileSystem.EncodingType.Base64,
                length: CHUNK_SIZE,
                position: offset,
            });

            // ✅ Remove any hidden newlines or carriage returns
            const cleanChunk = chunk.replace(/(\r\n|\n|\r)/gm, "");
            const isFinal = (offset + CHUNK_SIZE) >= fileSize;

            await apiClient.post('/upload/upload-stream', {
                reqId,
                chunk,
                isFinal
            }, {
                headers: { Authorization: `Bearer ${storedToken}` }
            });

            offset += CHUNK_SIZE;
        }

        // 3. ✅ Cleanup: Delete the temp file after upload
        await FileSystem.deleteAsync(tempFileUri, { idempotent: true });

    } catch (err) {
        console.error("❌ Streaming Error:", err);
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