import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const generatePreview = async (uri: string) => {
  try {
    const result = await manipulateAsync(
      uri,
      [{ resize: { width: 50, height: 50 } }],
      {
        compress: 0.5, // slightly more compression for smaller size
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