package expo.modules.galleryscanner

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.provider.MediaStore
import android.content.ContentUris
import android.net.Uri
import java.security.MessageDigest

class GalleryScannerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("GalleryScanner")

    AsyncFunction("scanGallery") {
      val imageList = mutableListOf<Map<String, String>>()
      
      // ✅ Use appContext.hostingContext to ensure we have the Activity/App context
      val context = appContext.reactContext ?: return@AsyncFunction emptyList<Map<String, String>>()
      val contentResolver = context.contentResolver

      // ✅ Use the Official MediaStore URI
      val collection = MediaStore.Images.Media.EXTERNAL_CONTENT_URI

      val projection = arrayOf(
        MediaStore.Images.Media._ID
      )

      contentResolver.query(
        collection,
        projection,
        null,
        null,
        null
      )?.use { cursor ->
        val idIndex = cursor.getColumnIndexOrThrow(MediaStore.Images.Media._ID)
        
        while (cursor.moveToNext()) {
          val id = cursor.getLong(idIndex)
          
          // ✅ EXPLICIT BUILDING: This forces the content:// provider format
          val contentUri: Uri = ContentUris.withAppendedId(
            MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
            id
          )

          val uriString = contentUri.toString() 
          
          // ✅ Use our improved hash function
          val fileHash = getFileHash(contentUri)
          
          if (fileHash != "error") {
            imageList.add(mapOf(
              "path" to uriString, 
              "hash" to fileHash
            ))
          }
        }
      }
      return@AsyncFunction imageList
    }
  }

  // ✅ Updated to accept the URI object directly to avoid re-parsing
  private fun getFileHash(uri: Uri): String {
    return try {
      val digest = MessageDigest.getInstance("MD5")
      val contentResolver = appContext.reactContext?.contentResolver
      
      // ✅ Open the stream via the Content URI
      val inputStream = contentResolver?.openInputStream(uri)
      
      val buffer = ByteArray(8192)
      var read: Int
      
      inputStream?.use { input ->
        while (input.read(buffer).also { read = it } != -1) {
          digest.update(buffer, 0, read)
        }
      }
      
      val md5sum = digest.digest()
      md5sum.joinToString("") { "%02x".format(it) }
    } catch (e: Exception) {
      android.util.Log.e("GalleryScanner", "Hash Error: ${e.message}")
      "error"
    }
  }
}