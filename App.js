// App.js
import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
