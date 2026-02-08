import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';


import Gallery from '../../screen/Gallery';
import Profile from '../../screen/Profile';

const Tab = createBottomTabNavigator();

export default function TabRouter() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Gallery') {
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#eb85d1',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerTitleAlign: 'center',
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
        },
      })}
    >
      {/* <Tab.Screen name="Home" component={Home} /> */}
      <Tab.Screen name="Gallery" component={Gallery} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}