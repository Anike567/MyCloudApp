import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../../hooks/useAuth';
import Auth from './Auth';
import App from './App';



const Stack = createStackNavigator();

export default function StackRouter() {
    const { isLoggedIn } = useAuth();

    return isLoggedIn ? <App /> : <Auth/>;
}