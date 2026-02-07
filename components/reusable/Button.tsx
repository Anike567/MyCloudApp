import React from 'react';
import {
    Text,
    StyleSheet,
    Pressable,
    ActivityIndicator,
    ViewStyle,
    TextStyle
} from 'react-native';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    // Added 'outline-danger' to the variant list
    variant?: 'primary' | 'secondary' | 'danger' | 'outline-danger';
}

const CustomButton = ({
    title,
    onPress,
    loading,
    disabled,
    style,
    textStyle,
    variant = 'primary'
}: CustomButtonProps) => {

    const getButtonStyle = (pressed: boolean): ViewStyle[] => [
        styles.button,
        styles[variant], 
        pressed ? styles.pressed : {},
        (disabled || loading) ? styles.disabled : {},
        style as ViewStyle,
    ];

    // Help set the text color based on the variant
    const getTextColor = (): TextStyle => {
        if (variant === 'secondary') return { color: '#333' };
        if (variant === 'outline-danger') return { color: '#FF3B30' };
        return { color: '#FFFFFF' };
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={({ pressed }) => getButtonStyle(pressed)}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline-danger' ? "#FF3B30" : "#FFFFFF"} />
            ) : (
                <Text style={[styles.text, getTextColor(), textStyle]}>{title}</Text>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 52,
        marginHorizontal: "auto",
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        width: '80%',
        maxWidth: 300,
    },
    primary: {
        backgroundColor: '#007AFF',
    },
    secondary: {
        backgroundColor: '#E5E5EA',
        borderWidth: 1,
        borderColor: '#D1D1D6',
    },
    danger: {
        backgroundColor: '#FF3B30', // Solid Red
    },
    // New variant: Red border and transparent background
    'outline-danger': {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#FF3B30',
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
    },
    pressed: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
    },
    disabled: {
        backgroundColor: '#D1D1D6',
        borderColor: '#A1A1A1',
        opacity: 0.5,
    },
});

export default CustomButton;