import React, { useState } from 'react'; // Add this
import { Ionicons } from '@expo/vector-icons';
import Container from '../components/reusable/Container';
import MyTextInput from '../components/reusable/MyTextInput'; 
import { Text } from 'react-native';
import Card from '../components/reusable/Card';
import Button from '../components/reusable/Button';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/reusable/Loader';


export default function Profile() {
    const { logout } = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(false); 
    async function handloeLogout() {
        setIsLoading(true);
        await logout();
        setIsLoading(false);
    }
    return (
        <Container>
            {isLoading && <Loader visible = {isLoading} message='Logging out..'/>}
           <Text>Welcome to Home Screen!</Text>
           <Button 
                title="Logout" 
                variant="danger" 
                onPress={handloeLogout} 
            />
        </Container>
    );
}