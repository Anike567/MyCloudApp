import React from 'react';
import { View, StyleSheet, Modal, ActivityIndicator, Text } from 'react-native';

interface LoaderProps {
    visible: boolean;
    message?: string;
}

const Loader = ({ visible, message = "Loading..." }: LoaderProps) => {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#eb85d1" />
                    {message ? <Text style={styles.text}>{message}</Text> : null}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dimmed background
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: 150,
        padding: 25,
        backgroundColor: '#fff',
        borderRadius: 15,
        alignItems: 'center',
        // Shadow for iOS/Android
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    text: {
        marginTop: 15,
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
});

export default Loader;