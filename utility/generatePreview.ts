import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const generatePreview = async (uri: string) => {
  try {
    const result = await manipulateAsync(
      uri,
      [{ resize: { width: 200, } }],
      {
        compress: 0.7,
        format: SaveFormat.JPEG,
      }
    );

    console.log("Preview URI:", result.uri);
    return result.uri; 
  } catch (error) {
    console.log("Error generating preview:", error);
    throw error;
  }
};

export default generatePreview;