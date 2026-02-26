import { requireNativeModule } from 'expo-modules-core';

// This name "DeviceId" MUST match the Name("DeviceId") in your Kotlin file
const DeviceId = requireNativeModule('DeviceId');

export function getAndroidId(): string {
  // Check if DeviceId exists to prevent the 'undefined' crash
  if (!DeviceId || !DeviceId.getAndroidId) {
    console.warn("⚠️ DeviceId native module is not linked yet.");
    return "unknown";
  }
  return DeviceId.getAndroidId();
}