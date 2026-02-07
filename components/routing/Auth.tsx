import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Signup } from '../../screen/Signup';
import { Login } from '../../screen/Login';

const Stack = createStackNavigator();

export default function StackRouter() {


    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerTitle: "Login",
                    headerTitleAlign: "center",
                }}
            />
            <Stack.Screen
                name="SignUp"
                component={Signup}
                options={{
                    headerTitle: "SignUp",
                    headerTitleAlign: "center",
                }}
            />
        </Stack.Navigator>
    );
}