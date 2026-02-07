import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';


interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

const MyTextInput = ({ label, error, style, ...props }: CustomInputProps) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor="#999"
        {...props} 
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    marginLeft: 4,
  },
  input: {
    height: 50,
    backgroundColor: '#F9F9F9',
    borderWidth: 2,
    borderColor: '#b4acac',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
  },
  inputError: {
    borderColor: '#FF3B30', // Red border on error
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default MyTextInput;