import React, {useState} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { auth, firebase } from '../../firebase';
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
            firebase.storage().ref().child("https://firebasestorage.googleapis.com/v0/b/weekleat.appspot.com/o/145555b1c0123758b6e522c7c2360906.jpg?alt=media&token=2aa7c800-39a6-4bd0-8bec-7222841ef8bb").delete();
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

        <CustomButton 
          label="Suppression image"
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