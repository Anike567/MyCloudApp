import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';
import GalleryScanner from '../modules/gallery-scanner';
import axios from 'axios';

export const MY_SYNC_TASK = 'BACKGROUND_SYNC_HELLO';

TaskManager.defineTask(MY_SYNC_TASK, async () => {
    try {
        console.log("[Background] Starting Native Scan...");

        const photos = await GalleryScanner.scanGallery();

        console.log(`[Background] Found ${photos?.length || 0} images.`);
        const body = {
            images : photos
        }
        const response = await axios.post("http://anikets-machine.local:3000/upload/sync",body);

        const {message, imagesNeedToBeUploaded} = response.data;

        await Notifications.scheduleNotificationAsync({
            content: {
                title: `${message}📸`,
                body: `Native scanner found ${imagesNeedToBeUploaded || 0} images.`,
                android: {
                    channelId: 'default',
                },
            } as any,
            trigger: null,
        });

        

        return BackgroundTask.BackgroundTaskResult.Success;
    } catch (error: any) {
        console.error("[Background] Task Error:", error);

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Sync Error! ❌",
                body: error.message || "Unknown error occurred",
                android: { channelId: 'default' },
            } as any,
            trigger: null,
        });

        return BackgroundTask.BackgroundTaskResult.Failed;
    }
});