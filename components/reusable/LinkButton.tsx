import React from 'react';
import {
    Text,
    StyleSheet,
    Pressable,
    TextStyle,
    ViewStyle,
    ActivityIndicator
} from 'react-native';

interface LinkButtonProps {
    title: string;
    onPress: () => void;
    color?: string;
    fontSize?: number;
    loading?: boolean;
    disabled?: boolean;
    align?: 'center' | 'left' | 'right';
    containerStyle?: ViewStyle;
}

const LinkButton = ({
    title,
    onPress,
    color = '#007AFF',
    fontSize = 14,
    loading,
    disabled,
    align = 'center',
    containerStyle
}: LinkButtonProps) => {

    const getAlignment = () => {
        if (align === 'left') return 'flex-start';
        if (align === 'right') return 'flex-end';
        return 'center';
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={({ pressed }) => [
                styles.container,
                { alignItems: getAlignment() },
                pressed && styles.pressed,
                containerStyle
            ]}
        >
            {loading ? (
                <ActivityIndicator size="small" color={color} />
            ) : (
                <Text style={[
                    styles.text,
                    { color, fontSize },
                    (disabled || loading) && styles.disabledText
                ]}>
                    {title}
                </Text>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        justifyContent: 'center',
    },
    text: {
        fontWeight: '600',
    },
    pressed: {
        opacity: 0.6,
    },
    disabledText: {
        color: '#A1A1A1',
    },
});

export default LinkButton;