import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';

import SignIn from './app/screens/auth/SignIn';
import SignUp from './app/screens/auth/SignUp';
import SignUpConfirm from './app/screens/auth/SignUpConfirm';
import ForgotPassword from './app/screens/auth/ForgotPassword';

export default function App() {
  return (
    <SafeAreaView style={styles.root}>
      {/* <SignIn /> */}
      {/* <SignUp /> */}
      {/* <SignUpConfirm /> */}
      <ForgotPassword />
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
