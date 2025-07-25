// AppNavigator.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from './src/context/AuthContext';

// Auth Screens
import LoginScreen from './src/auth/LoginScreen';
import RegisterScreen from './src/auth/RegisterScreen';

// Common Screens
import ProfileScreen from './src/screens/ProfileScreen';
import ChatScreen from './src/screens/ChatScreen';

// User Screens
import HomeScreen from './src/screens/HomeScreen';
import PhotographerScreen from './src/screens/PhotographerScreen';
import BookingScreen from './src/screens/BookingScreen';
import UserBookingsScreen from './src/screens/UserBookingsScreen';

// Photographer Screens
import AvailabilityScreen from './src/screens/AvailabilityScreen';
import PortfolioScreen from './src/screens/PortfolioScreen';
import PhotographerBookingsScreen from './src/screens/PhotographerBookingsScreen';

// Components
import RatingStars from './src/components/RatingStars';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, role, loading } = useAuth();

  if (loading) return null; // Show splash or loader

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : role === 'user' ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="PhotographerScreen" component={PhotographerScreen} />
            <Stack.Screen name="BookingScreen" component={BookingScreen} />
            <Stack.Screen name="UserBookingsScreen" component={UserBookingsScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          </>
        ) : role === 'photographer' ? (
          <>
            <Stack.Screen name="PhotographerBookings" component={PhotographerBookingsScreen} />
            <Stack.Screen name="Availability" component={AvailabilityScreen} />
            <Stack.Screen name="Portfolio" component={PortfolioScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
