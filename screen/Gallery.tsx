import React, { useState, useEffect } from 'react';
import { View, Image, Dimensions, Text, RefreshControl } from 'react-native'; // Removed SafeAreaView
import { StatusBar } from 'expo-status-bar';
import * as MediaLibrary from 'expo-media-library';
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";

import Loader from '../components/reusable/Loader';
import apiClient from '../api_call/apiClient';
import { useAuth } from '../hooks/useAuth';
import getWideVineID from '../utility/getWideVineID';


const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const IMAGE_SIZE = width / COLUMN_COUNT;



export default function GalleryScreen() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [images, setImages] = useState([]);
    const { token } = useAuth();

    const getImages = async (isRefreshing = false) => {
        if (isRefreshing) setRefreshing(true);
        else setLoading(true);

        try {
            const deviceId = await getWideVineID();
            const response = await apiClient.post('/upload/images',
                { deviceId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setImages(response.data.images);
        } catch (err) {
            console.log("Fetch Error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }


    const renderItem = ({ item }: { item: string }) => (
        <Image
            // ✅ Add the data:image/jpeg;base64, prefix before the string
            source={{ uri: `data:image/jpeg;base64,${item}` }}
            style={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                borderWidth: 1,
                borderColor: '#fff'
            }}
        />
    );
    useEffect(() => {
        const init = async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
                await getImages();
            } else {
                setLoading(false);
            }
        };
        init();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar style="dark" />

            {/* Full screen loader only on first mount */}
            <Loader visible={loading && !refreshing} message="Loading your Cloud Index..." />

            <FlashList
                data={images}
                numColumns={COLUMN_COUNT}
                keyExtractor={(item, index) => index.toString()}

                estimatedItemSize={IMAGE_SIZE}
                contentContainerStyle={{ flexGrow: 1 }}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => getImages(true)}
                        tintColor="red"
                        colors={["red"]}
                    />
                }
                ListEmptyComponent={
                    !loading ? (
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ color: "red", fontWeight: '600' }}>No Image Available</Text>
                            <Text style={{ color: "gray", marginTop: 4 }}>Pull down to retry</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
}