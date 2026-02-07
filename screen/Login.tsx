import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Text } from 'react-native';
import Container from '../components/reusable/Container';
import MyTextInput from '../components/reusable/MyTextInput';
import Card from '../components/reusable/Card';
import Button from '../components/reusable/Button';
import Loader from '../components/reusable/Loader';
import LinkButton from '../components/reusable/LinkButton';
import { useLogin } from '../hooks/useLogin';
import { useNavigation, StackActions } from '@react-navigation/native';

export function Login() {
    const navigation = useNavigation();
    const {
        username,
        setUsername,
        password,
        setPassword,
        isLoading,
        handleLogin
    } = useLogin();

    return (
        <Container>
            <Loader visible={isLoading} message='Signing in ...' />
            
            <View style={styles.header}>
                <Ionicons name="cloud" size={100} color="#eb85d1" />
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Please login to your account</Text>
            </View>

            <Card>
                <MyTextInput 
                    value={username} 
                    onChangeText={setUsername} 
                    label="Username" 
                    placeholder="Enter your username" 
                />
                <MyTextInput 
                    value={password} 
                    onChangeText={setPassword} 
                    label="Password" 
                    placeholder="Enter your password" 
                    secureTextEntry 
                />
                
                <Button title="Login" onPress={handleLogin} loading={isLoading} />
                
                <LinkButton
                    title="Don't have an account? Sign Up"
                    /* Using dispatch with StackActions.replace is the most 
                       reliable way to ensure the stack is swapped.
                    */
                    onPress={() => navigation.dispatch(StackActions.replace("SignUp"))}
                    containerStyle={{ marginTop: 10 }}
                />
            </Card>
        </Container>
    )
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
      
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 10 
    },
    subtitle: { 
        fontSize: 16, 
        color: '#666', 
        marginBottom: 30 
    }
});