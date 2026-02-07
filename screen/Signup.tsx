import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Text } from 'react-native';
import Container from '../components/reusable/Container';
import MyTextInput from '../components/reusable/MyTextInput';
import Card from '../components/reusable/Card';
import Button from '../components/reusable/Button';
import Loader from '../components/reusable/Loader';
import LinkButton from '../components/reusable/LinkButton';
import { useNavigation, StackActions } from '@react-navigation/native';
import { useSignup } from '../hooks/useSignup';

export function Signup() {
    const navigation = useNavigation();
    const {
        username,
        setUsername,
        password,
        setPassword,
        name,
        setName,
        email,
        setEmail,
        isLoading,
        handleSignup
    } = useSignup();

    return (
        <Container>
            <Loader visible={isLoading} message='Signing up ...' />
            
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
                    value={email} 
                    onChangeText={setEmail} 
                    label="Email" 
                    placeholder="Enter your Email   " 
                />
                <MyTextInput 
                    value={name} 
                    onChangeText={setName} 
                    label="Name" 
                    placeholder="Enter your name" 
                />
                <MyTextInput 
                    value={password} 
                    onChangeText={setPassword} 
                    label="Password" 
                    placeholder="Enter your password" 
                    secureTextEntry 
                />
                
                <Button title="Sign Up" onPress={handleSignup} loading={isLoading} />
                
                <LinkButton
                    title="Already have an account? Login"
                    onPress={() => navigation.dispatch(StackActions.replace("Login"))}
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