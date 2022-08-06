import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import SignIn from '../screens/auth/SignIn';
import SignUp from '../screens/auth/SignUp';
import SignUpConfirm from '../screens/auth/SignUpConfirm';
import ForgotPassword from '../screens/auth/ForgotPassword';
import ForgotPasswordConfirm from '../screens/auth/ForgotPasswordConfirm';

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignUpConfirm" component={SignUpConfirm} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ForgotPasswordConfirm" component={ForgotPasswordConfirm} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({

});

export default AuthStack;