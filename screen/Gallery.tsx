import React, { useState, useEffect } from 'react';
import { View, Image, Dimensions} from 'react-native'; // Removed SafeAreaView
import { StatusBar } from 'expo-status-bar';
import * as MediaLibrary from 'expo-media-library';
import { FlashList } from "@shopify/flash-list";

import Loader from '../components/reusable/Loader';
import apiClient from '../api_call/apiClient';
import { useAuth } from '../hooks/useAuth';
import getWideVineID from '../utility/getWideVineID';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const IMAGE_SIZE = width / COLUMN_COUNT;

// ... existing imports

export default function GalleryScreen() {
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]); 
    const { token } = useAuth();

    const getImages = async () => {
        try {
            // ✅ Await the ID and use it in the body
            const deviceId = await getWideVineID();
            const response = await apiClient.post('/upload/images',
                { deviceId },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            setImages(response.data.images);
        }
        catch (err) {
            console.log("Fetch Error:", err);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const init = async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
                await getImages();
            }
        };
        init();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar style="dark" />
            <Loader visible={loading} message="Loading your Cloud Index..." />

            <FlashList
                data={images} // ✅ Use the array of URIs from backend
                numColumns={COLUMN_COUNT}
                keyExtractor={(item, index) => index.toString()}
                estimatedItemSize={IMAGE_SIZE}
                renderItem={({ item }) => (
                    <Image
                        source={{ uri: item }} 
                        style={{
                            width: IMAGE_SIZE,
                            height: IMAGE_SIZE,
                            borderWidth: 1,
                            borderColor: '#fff'
                        }}
                    />
                )}
            />
        </View>
    );
}