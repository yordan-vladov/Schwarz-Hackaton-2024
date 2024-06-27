import React from "react";
import { StyleProp, StyleSheet, TextInput, TextStyle, View } from "react-native";

interface IconInputFieldProps {
    value?: string,
    onChangeText?: (text: string) => void,
    placeholder?: string,
    style?: StyleProp<TextStyle>,
    leftSide?: React.ReactNode,
    rightSide?: React.ReactNode,
    secureTextEntry?: boolean
}

export default function IconInputField({
    value,
    onChangeText,
    placeholder,
    style,
    leftSide,
    rightSide,
    secureTextEntry
}: IconInputFieldProps) {
    return (
        <View style={styles.container}>
            {leftSide && (
                <View style={styles.leftSide}>{leftSide}</View>
            )}
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                style={[styles.input, style]}
                secureTextEntry={secureTextEntry}
                placeholderTextColor="#d1d1cf"
            />
            {rightSide && (
                <View style={styles.rightSide}>{rightSide}</View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
    },
    leftSide: {
        position: "absolute",
        backgroundColor: "transparent",
        top: "50%",
        transform: [{ translateY: -12 }],
        left: 10,
    },
    rightSide: {
        position: "absolute",
        backgroundColor: "transparent",
        top: "50%",
        transform: [{ translateY: -15 }],
        right: 10,
    },
    input: {
        flex: 1,
        paddingHorizontal: 40, // Adjust based on your default padding requirement
    },
});
