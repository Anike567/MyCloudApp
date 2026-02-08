import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';


import Home from '../../screen/Profile';


const Stack = createStackNavigator();

export default function App() {


    return (
        <Stack.Navigator>

            <Stack.Screen
                name="Login"
                component={Home}
                options={{
                    headerTitle: "Home",
                    headerTitleAlign: "center",
                }}
            />
        </Stack.Navigator>
    );
}