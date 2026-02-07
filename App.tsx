import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackRouter from './components/routing/StackRouter';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    // Only ONE NavigationContainer is allowed here
    <NavigationContainer>
      <AuthProvider>
        <StackRouter/>
      </AuthProvider>
    </NavigationContainer>
  );
}