import * as DeviceId from 'device-id';

/**
 * Fetches the unique hardware-bound Widevine ID.
 * returns {string}  Base64 encoded ID.
 */
export default function getWideVineID():string{

    const myId = DeviceId.getAndroidId();
    console.log("📱 Unique Android ID:", myId);
    return myId;
}