import React, { useState, useEffect } from 'react';
import { View, Image, Dimensions, ActivityIndicator } from 'react-native'; // Removed SafeAreaView
import { StatusBar } from 'expo-status-bar';
import * as MediaLibrary from 'expo-media-library';
import { FlashList } from "@shopify/flash-list";

import Loader from '../components/reusable/Loader';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const IMAGE_SIZE = width / COLUMN_COUNT;

export default function GalleryScreen() {
   
    const [loading, setLoading] = useState(true); 
    const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    useEffect(() => {
        const initGallery = async () => {
            try {
                const { status: existingStatus, canAskAgain } = await MediaLibrary.getPermissionsAsync();
                let finalStatus = existingStatus;

                if (existingStatus !== 'granted' && canAskAgain) {
                    const { status } = await MediaLibrary.requestPermissionsAsync();
                    finalStatus = status;
                }

                if (finalStatus === 'granted') {
                    await loadInitialPhotos();
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        initGallery();
    }, []);

    const loadInitialPhotos = async () => {
        const result = await MediaLibrary.getAssetsAsync({
            first: 50,
            mediaType: ['photo'],
            sortBy: ['creationTime'],
        });
        setAssets(result.assets);
        setHasNextPage(result.hasNextPage);
        setEndCursor(result.endCursor);
    };

    const loadMorePhotos = async () => {
        if (!hasNextPage || isFetchingMore) return;

        setIsFetchingMore(true);
        const result = await MediaLibrary.getAssetsAsync({
            first: 50,
            after: endCursor,
            mediaType: ['photo'],
            sortBy: ['creationTime'],
        });

        setAssets(prev => [...prev, ...result.assets]);
        setHasNextPage(result.hasNextPage);
        setEndCursor(result.endCursor);
        setIsFetchingMore(false);
    };

    return (
        <View style={{ 
            flex: 1, 
        }}>
            <StatusBar style="dark" backgroundColor="white" />
            
            <Loader visible={loading} message="Accessing Gallery..." />
            
            <FlashList
                data={assets}
                numColumns={COLUMN_COUNT}
                keyExtractor={(item) => item.id}
                estimatedItemSize={IMAGE_SIZE}
                onEndReached={loadMorePhotos}
                onEndReachedThreshold={0.5}
                renderItem={({ item }) => (
                    <Image
                        source={{ uri: item.uri }}
                        style={{ 
                            width: IMAGE_SIZE, 
                            height: IMAGE_SIZE, 
                            borderWidth: 1, 
                            borderColor: '#fff' 
                        }}
                    />
                )}
                ListFooterComponent={isFetchingMore ? (
                    <ActivityIndicator size="small" color="#eb85d1" style={{ margin: 20 }} />
                ) : null}
            />
        </View>
    );
}   