package expo.modules.deviceid

import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class DeviceIdModule : Module() {
  override fun definition() = ModuleDefinition {
    // 1. This NAME must match what you call in requireNativeModule
    Name("DeviceId")

    // 2. Use Function for synchronous calls
    Function("getAndroidId") {
      // Get the content resolver from the current activity/context
      val contentResolver = appContext.reactContext?.contentResolver
      return@Function Settings.Secure.getString(
        contentResolver,
        Settings.Secure.ANDROID_ID
      ) ?: "unknown"
    }
  }
}