import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../../hooks/useAuth';
import Auth from './Auth';
import App from '../../screen/Main';
import Container from '../reusable/Container';
import Loader from '../reusable/Loader';



const Stack = createStackNavigator();

export default function StackRouter() {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) {
        return <Container>
            <Loader visible={isLoading} message="Checking authentication..." />
        </Container>
    }
    return isLoggedIn ? <App /> : <Auth />;
}