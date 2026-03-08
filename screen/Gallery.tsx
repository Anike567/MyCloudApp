import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Dimensions, Text, RefreshControl, ActivityIndicator, Pressable, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as MediaLibrary from 'expo-media-library';
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";

import Loader from '../components/reusable/Loader';
import apiClient from '../api_call/apiClient';
import { useAuth } from '../hooks/useAuth';
import getWideVineID from '../utility/getWideVineID';
import ImageType from '../types/image'
import { ImageModalProps } from '../components/ImageModal';
import ImageModal from '../components/ImageModal';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const IMAGE_SIZE = width / COLUMN_COUNT;

export default function GalleryScreen() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [images, setImages] = useState<ImageType[]>([]);
    const { token } = useAuth();
    const [nextId, setNextId] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false); 
    const [selectedImage, setSelectedImage] = useState<{
        image_location: string;
        device_id: string;
    } | null>(null);

    const getImages = async (isRefreshing = false) => {
        
        if (isFetching || (!hasMore && !isRefreshing)) return;
        
        if (isRefreshing) {
            setRefreshing(true);
        } else {
            setIsFetching(true);
        }

        try {
            const deviceId = await getWideVineID();
            
            // If refreshing, reset to 0, otherwise use the nextId cursor
            const lastIdTo_Send = isRefreshing ? 0 : nextId;

            const response = await apiClient.post('/upload/images',
                { deviceId, lastId: lastIdTo_Send },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const result = response.data;
            if (result && result.images) {
                const fetchedImages = result.images;

                setImages((prev) => {
                    
                    return isRefreshing ? fetchedImages : [...prev, ...fetchedImages];
                });

                setNextId(result.nextId);
                setHasMore(result.hasMore);
            }

        } catch (err) {
            console.log("Fetch Error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setIsFetching(false);
        }
    }

    useEffect(() => {
        const init = async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
                await getImages(true);
            } else {
                setLoading(false);
            }
        };
        init();
    }, []);

    const renderItem = ({ item }: { item: ImageType }) => {
        // Guard against undefined items
        if (!item) return null;
        return (
            <Pressable
                onPress={() => setSelectedImage({
                    image_location: item.image_location,
                    device_id: item.device_id, 
                })}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
                <Image
                    source={{ uri: `data:image/jpeg;base64,${item.preview}` }}
                    style={{
                        width: IMAGE_SIZE,
                        height: IMAGE_SIZE,
                        borderWidth: 1,
                        borderColor: '#fff'
                    }}
                />
            </Pressable>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar style="dark" />
            <Loader visible={loading && !refreshing} message="Loading your Cloud Index..." />

            <FlashList
                data={images}
                numColumns={COLUMN_COUNT}
                keyExtractor={(item) => item.id.toString()}
                estimatedItemSize={IMAGE_SIZE}
                renderItem={renderItem}
                onEndReached={() => getImages(false)}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => getImages(true)}
                        tintColor="red"
                    />
                }
                ListFooterComponent={() => (
                    isFetching && !refreshing ? <ActivityIndicator size="small" color="red" style={{ margin: 10 }} /> : null
                )}
            />

            {selectedImage && (
                <ImageModal
                    selectedImage={selectedImage}
                    onClose={()=>{setSelectedImage(null)}}
                />
            )}
        </View>
    );
}