import React, { ReactNode } from "react";
import { StyleSheet, View, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from "react-native";

interface ContainerProps {
    children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    {children}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",   
        alignItems: "center",

        backgroundColor: "#f5f5f5", 
    }
});