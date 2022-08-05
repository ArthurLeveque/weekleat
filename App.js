import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import SignIn from './app/screens/auth/SignIn';
import SignUp from './app/screens/auth/SignUp';
import SignUpConfirm from './app/screens/auth/SignUpConfirm';
import ForgotPassword from './app/screens/auth/ForgotPassword';
import ForgotPasswordConfirm from './app/screens/auth/ForgotPasswordConfirm';

export default function App() {
  return (
    <SafeAreaView style={styles.root}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="SignUpConfirm" component={SignUpConfirm} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="ForgotPasswordConfirm" component={ForgotPasswordConfirm} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    justifyContent: 'center',
  },
});
