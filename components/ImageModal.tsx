import React, { useState, useEffect, useCallback } from 'react';
import { View, Image, Modal, StyleSheet, Pressable, ActivityIndicator, Text, Dimensions } from 'react-native';
import apiClient from '../api_call/apiClient';
import { useAuth } from '../hooks/useAuth';
import getWideVineID from '../utility/getWideVineID';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ✅ Fixed the interface to match what the parent sends
export interface ImageModalProps {
    selectedImage: {
        image_location: string;
        device_id: string;
    } | null;
    onClose: () => void;
}



export default function ImageModal({ selectedImage, onClose }: ImageModalProps) {
    const [loading, setLoading] = useState(false);
    const [fullImage, setFullImage] = useState<string | null>(null);
    const [reqId, setReqId] = useState<string | null>(null);
    const { token, androidID } = useAuth();

    const startFetchJob = useCallback(async () => {
        if (!selectedImage) return;

        try {
            setLoading(true);
            const res = await apiClient.post(`/fetch/images`, {
                deviceId: selectedImage.device_id,
                fileLocation: selectedImage.image_location
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data && res.data.requestId) {
                setReqId(res.data.requestId);
            } else {
                setLoading(false);
            }
        } catch (err) {
            console.error("Fetch Job Error:", err);
            setLoading(false);
        }
    }, [selectedImage, token]);

    useEffect(() => {
        if (selectedImage) {   // ✅ Check if image belongs to the current phone
            if (selectedImage.device_id === androidID) {
                console.log("Local Image detected, skipping fetch...");
                setFullImage(selectedImage.image_location);
                setLoading(false); 
            } else {
                startFetchJob();
            }
        }
        return () => {
            setFullImage(null);
            setReqId(null);
            setLoading(false);
        };
    }, [selectedImage, startFetchJob, androidID]); 

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        // Only poll if we have a reqId and NO image yet
        if (reqId && !fullImage) {
            intervalId = setInterval(async () => {
                try {
                    // We can use x-device-id from interceptor now, but keeping this 
                    // explicit for clarity
                    const dId = await getWideVineID();
                    const statusRes = await apiClient.post(`/fetch/callback/`,
                        { reqId: reqId, deviceId: dId },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    if (statusRes.status === 200 && statusRes.data.status === "completed") {
                        let base64Data = statusRes.data.data;
                        if (base64Data && !base64Data.startsWith('data:image')) {
                            base64Data = `data:image/jpeg;base64,${base64Data}`;
                        }
                        setFullImage(base64Data);
                        setLoading(false); // 👈 Stop loading when remote image arrives
                        clearInterval(intervalId);
                    }
                } catch (err) {
                    console.log("Polling error:", err);
                }
            }, 2000);
        }
        return () => { if (intervalId) clearInterval(intervalId); };
    }, [reqId, fullImage, token]);

    return (
        <Modal
            visible={!!selectedImage}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <Pressable style={styles.overlay} onPress={onClose} />
                <View style={styles.content}>
                    {/* ✅ Logic Fix: Only show loader if we are actually 
                      waiting for a remote fetch 
                    */}
                    {loading && !fullImage ? (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color="red" />
                            <Text style={styles.loaderText}>Retrieving high-res image...</Text>
                        </View>
                    ) : (
                        fullImage && (
                            <Image
                                source={{ uri: fullImage }}
                                style={styles.fullImage}
                                resizeMode="contain"
                            />
                        )
                    )}
                </View>
            </View>
        </Modal>
    );
}

// ... (styles remain same)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center' },
    overlay: { ...StyleSheet.absoluteFillObject },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    fullImage: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.8 },
    loaderContainer: { alignItems: 'center' },
    loaderText: { color: 'white', marginTop: 15, fontWeight: '600' }
});