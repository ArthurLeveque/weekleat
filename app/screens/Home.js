import React, {useState} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { auth } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomButton from '../globals/components/CustomButton';

const gs = require ('../globals/styles/GlobalStyle');

const Home = () => {

  return (
    <View style={gs.container}>
        <CustomButton 
          label="Storage"
          onPress={async () => {
            await AsyncStorage.getItem("weekleat-recipes")
            .then(pouet => {
              const currentUser = JSON.parse(pouet);
              console.log(currentUser);
            })
          }}
          type="primary"
        />

        <CustomButton 
          label="Add storage"
          onPress={async () => {
            const value = {
              name: "Innocent"
            };
            await AsyncStorage.getItem("weekleat-recipes")
            .then(async pouet => {
              var euh = JSON.parse(pouet) || []
              euh.push(value)
              await AsyncStorage.setItem("weekleat-recipes", JSON.stringify(euh))
              .catch(err => {
                console.log(err)
              })
            })
            
          }}
          type="primary"
        />

        <CustomButton 
          label="Create storage"
          onPress={async () => {
            const value = [];
            await AsyncStorage.setItem("weekleat-recipes", JSON.stringify(value))
            .catch(err => {
              console.log(err)
            })
          }}
          type="primary"
        />

        <CustomButton 
          label="Vider storage"
          onPress={async () => {
            await AsyncStorage.removeItem("weekleat-recipes")
          }}
          type="primary"
        />
    </View>
  );
}

const styles = StyleSheet.create({

});

export default Home;