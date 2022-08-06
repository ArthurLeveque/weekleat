import React, {useState} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { auth } from '../../firebase';

const gs = require ('../globals/styles/GlobalStyle');

const Home = () => {

  return (
    <View style={gs.container}>
      <Text>{auth.currentUser?.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({

});

export default Home;