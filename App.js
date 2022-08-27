import React, {useEffect, useState} from 'react';
import { StyleSheet, SafeAreaView, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AuthStack from './app/navigation/AuthStack';
import AppStack from './app/navigation/AppStack';
import { auth } from './firebase';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification of Stripe

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.root}>
        <NavigationContainer>
            {!user ? (
              <AuthStack />
            ) : (
              <AppStack />
            )}
        </NavigationContainer>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    justifyContent: 'center',
  },
});
