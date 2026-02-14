package expo.modules.galleryscanner

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.provider.MediaStore
import java.io.FileInputStream
import java.security.MessageDigest

class GalleryScannerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("GalleryScanner")

    // Remove the "_: Unit ->" or any arguments inside the curly braces
    AsyncFunction("scanGallery") {
      val imageList = mutableListOf<Map<String, String>>()
      val contentResolver = appContext.reactContext?.contentResolver 
        ?: return@AsyncFunction emptyList<Map<String, String>>()

      val projection = arrayOf(
        MediaStore.Images.Media.DATA
      )

      contentResolver.query(
        MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
        projection,
        null,
        null,
        null
      )?.use { cursor ->
        val dataIndex = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA)
        
        while (cursor.moveToNext()) {
          val path = cursor.getString(dataIndex)
          if (path != null) {
              val fileHash = getFileHash(path)
              imageList.add(mapOf(
                "path" to path,
                "hash" to fileHash
              ))
          }
        }
      }
      return@AsyncFunction imageList
    }
  }

  private fun getFileHash(filePath: String): String {
    return try {
      val digest = MessageDigest.getInstance("MD5")
      val fis = FileInputStream(filePath)
      val buffer = ByteArray(8192)
      var read: Int
      while (fis.read(buffer).also { read = it } != -1) {
        digest.update(buffer, 0, read)
      }
      fis.close()
      val md5sum = digest.digest()
      md5sum.joinToString("") { "%02x".format(it) }
    } catch (e: Exception) {
      "error"
    }
  }
}