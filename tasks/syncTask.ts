import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';
import * as FileSystem from 'expo-file-system/legacy'; // ✅ FIXED
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GalleryScanner from '../modules/gallery-scanner';
import getWideVineID from '../utility/getWideVineID';
import generatePreview from '../utility/generatePreview';


export const MY_SYNC_TASK = 'BACKGROUND_SYNC_HELLO';
const PROGRESS_NOTIFICATION_ID = 'SYNC_PROGRESS';

/**
 * 🔹 Universal upload type resolver
 * Works for Expo SDK 49 → latest
 */
const MULTIPART_UPLOAD_TYPE =
    // New Expo versions
    (FileSystem as any).FileSystemUploadType?.MULTIPART ??
    // Very old Expo fallback
    2;

// ... (imports remain the same)

TaskManager.defineTask(MY_SYNC_TASK, async () => {
    try {
        const [storedToken, deviceId] = await Promise.all([
            AsyncStorage.getItem('auth_token'),
            getWideVineID(),
        ]);

        if (!storedToken) {
            console.log('[Sync] No token found. Aborting.');
            return BackgroundTask.BackgroundTaskResult.Failed;
        }

        console.log("scanning images");
        const photos = await GalleryScanner.scanGallery();

        if (!photos || photos.length === 0) {
            console.log('[Sync] Gallery empty.');
            return BackgroundTask.BackgroundTaskResult.Success;
        }

        console.log("generating hashes");
        const hashesOnly = photos
            .map((p: any) => p?.hash)
            .filter((h: string) => h && h !== 'error');

        if (hashesOnly.length === 0) {
            console.log('[Sync] No valid hashes.');
            return BackgroundTask.BackgroundTaskResult.Success;
        }

        // 1. Fixed Sync Call with Headers
        const syncResponse = await axios.post(
            'http://anikets-machine.local:3000/upload/sync',
            { deviceId: deviceId, images: hashesOnly },
            {
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'x-device-id': deviceId, // ✅ Manually added header
                },
                timeout: 60000,
            }
        );

        const { missingImages } = syncResponse.data ?? {};

        if (!missingImages || missingImages.length === 0) {
            console.log('[Sync] Nothing to upload.');
            return BackgroundTask.BackgroundTaskResult.Success;
        }

        const missingSet = new Set(missingImages);
        const toUpload = photos.filter((p: any) => missingSet.has(p.hash));
        const total = toUpload.length;

        for (let i = 0; i < total; i++) {
            const item = toUpload[i];
            const current = i + 1;

            if (!item || !item.path) {
                console.error(`[Sync] Skipping item ${i}: Path is missing`);
                continue;
            }

            try {
                console.log(item.path);
                const previewPath = await generatePreview(item.path);
                const base64Image = await FileSystem.readAsStringAsync(previewPath, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                const body = {
                    deviceId: deviceId,
                    checksum: item.hash,
                    imageLocation: item.path,
                    preview: base64Image,
                };

                // 2. Added Headers to the individual Upload call
                await axios.post("http://anikets-machine.local:3000/upload/upload", body, {
                    headers: { 
                        'Authorization': `Bearer ${storedToken}`,
                        'x-device-id': deviceId, // ✅ Manually added header
                    }
                });

                await Notifications.scheduleNotificationAsync({
                    identifier: PROGRESS_NOTIFICATION_ID,
                    content: {
                        title: 'Uploading to MyCloud... ☁️',
                        body: `Syncing ${current} of ${total} images`,
                        android: {
                            channelId: 'default',
                            progress: { max: total, current, indeterminate: false },
                            sticky: true,
                        },
                    } as any,
                    trigger: null,
                });

            } catch (err) {
                console.error(`[Sync] Failed at item ${current} (${item.hash}):`, err);
            }
        }
        
        await Notifications.dismissNotificationAsync(PROGRESS_NOTIFICATION_ID);

        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Sync Finished! ✅',
                body: `${missingImages.length} images backed up successfully.`,
                android: { channelId: 'default' },
            } as any,
            trigger: null,
        });

        return BackgroundTask.BackgroundTaskResult.Success;
    } catch (error: any) {
        console.error('[Sync] Critical error:', error?.message || error);
        await Notifications.dismissNotificationAsync(PROGRESS_NOTIFICATION_ID);
        return BackgroundTask.BackgroundTaskResult.Failed;
    }
});