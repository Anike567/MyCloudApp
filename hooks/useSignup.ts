import { useState } from 'react';
import { Alert } from 'react-native';
import apiClient from '../api_call/apiClient';
import validatePayload from '../utility/validatePayload';
import { SignupResponse } from '../types/api';
import axios from 'axios';
import { useNavigation, CommonActions } from '@react-navigation/native';

export const useSignup = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async () => {
        const payload = { username, password, email, name };

        if (!validatePayload(payload, ["username", "password", "email", "name"])) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await apiClient.post<SignupResponse>('/auth/signup', payload);
            
            // Check status code 201 (Created) or 200 (OK)
            if (response.status === 201 || response.status === 200) {
                Alert.alert('Success', 'Account created! Please login.', [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'Login' }],
                                })
                            );
                        }
                    }
                ]);
            }
        } catch (error) {
            console.log(error);
            let errorMessage = 'An error occurred during signup.';

            if (axios.isAxiosError(error)) {
                // If backend sends { error: "Email already exists" }
                errorMessage = error.response?.data?.error || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            Alert.alert('Signup Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        username, setUsername,
        password, setPassword,
        name, setName,
        email, setEmail,
        isLoading,
        handleSignup
    };
};