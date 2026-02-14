import { NativeModules } from "react-native";

/**
 * Fetches the unique hardware-bound Widevine ID.
 * returns {Promise<string>} A promise that resolves to the Base64 encoded ID.
 */
export default async function getWideVineID(): Promise<string> {
    const { DeviceIdentity } = NativeModules;

    if (!DeviceIdentity) {
        throw new Error("DeviceIdentity native module is not linked correctly.");
    }

    try {
        const id: string = await DeviceIdentity.getWidevineId();
        return id;
    } catch (error) {
        console.error("Failed to get Widevine ID:", error);
        throw error;
    }
}