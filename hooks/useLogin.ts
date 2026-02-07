import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';
import apiClient from '../api_call/apiClient';
import validatePayload from '../utility/validatePayload';
import { LoginResponse } from '../types/api';
import axios, { AxiosError } from 'axios'; 

export const useLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setToken, setUser } = useAuth();

    const handleLogin = async () => {
        const payload = { username, password };

        if (!validatePayload(payload, ["username", "password"])) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }   

        try {
            setIsLoading(true);
            const response = await apiClient.post<LoginResponse>('/auth/signin', payload);
            
            // 2. Success Logic
            setToken(response.data.token);
            setUser(response.data.user);

        } catch (error) {
            console.log(error);
            let errorMessage = 'An error occurred during login. Please try again.';

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.error || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            Alert.alert('Login Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        isLoading,
        handleLogin
    };
};