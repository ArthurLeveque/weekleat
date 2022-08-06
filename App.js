import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import AuthStack from './app/navigation/AuthStack';

export default function App() {
  return (
    <SafeAreaView style={styles.root}>
      <NavigationContainer>
        <AuthStack />
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
