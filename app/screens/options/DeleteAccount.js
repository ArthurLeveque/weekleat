import React, {useState} from 'react';
import { View, ScrollView, Alert, Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomButton from '../../globals/components/CustomButton';
import { auth } from '../../../firebase';
import { apiUrl } from '../../../apiConfig';

const gs = require ('../../globals/styles/GlobalStyle');

const DeleteAccount = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  const OnConfirmPress = async () => {
    Alert.alert(
      "Supprimer le compte",
      "Voulez-vous vraiment supprimer votre compte ?",
      [
        {
          text: "Annuler"
        },
        { text: "Oui", onPress: async() => {
          setLoading(true);
           // get user token for authentificated API route
          const authToken = await auth.currentUser.getIdTokenResult();
          const headers = {headers: {"auth-token": authToken.token}};
          await axios.delete(`${apiUrl}/users`, headers)
          .then(async () => {
            setLoading(false);
            await auth.signOut();
            await AsyncStorage.multiRemove(['weekleat-recipes', 'weekleat-weeklist', 'weekleat-favorites']);        
          })
          .catch((e) => {
            setLoading(false);
            console.log(e);
            Alert.alert(
              "Quelque chose s'est mal passé...",
              "Une erreur est survenue, veuillez réessayer plus tard.",
              [
                {
                  text: "Ok"
                }
              ]
            );
          })
        }}
      ]
    );
  }

  return (
    <ScrollView>
      <View style={gs.container}>
        <Text style={gs.title}>Supprimer mon compte</Text>
        <Text style={{marginBottom: 30}}>Vous êtes sur le point de supprimer votre compte. Cette action est irréversible et entraînera la suppression de vos recettes favorites ainsi que de votre Weekliste.</Text>
        
        <CustomButton 
          label="Confirmer"
          onPress={OnConfirmPress}
          type="primary"
          disabled={loading}
        />

        <CustomButton 
          label="Annuler"
          onPress={() => navigation.navigate("IndexOptions")}
          type="tertiary"
        />
      </View>
    </ScrollView>
  );
}

export default DeleteAccount;