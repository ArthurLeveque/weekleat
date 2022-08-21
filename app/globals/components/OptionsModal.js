import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import Modal from "react-native-modal";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { apiUrl } from '../../../apiConfig';
import { auth, firebase } from '../../../firebase';
const gs = require ('../../globals/styles/GlobalStyle');

const OptionsModal = ({showModalOptions = false, onHideOptionsPress, data, id, reload}) => {
  const mounted = useRef(false);
  const navigation = useNavigation();

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

  const onDeletePress = () => {
    Alert.alert(
      "Suppression",
      `Voulez-vous vraiment supprimer la recette ${data.name} ?`,
      [
        { text: "Annuler" },
        { text: "Oui", onPress: () => onDeleteConfirm() }
      ]
    );
  }

  const onDeleteConfirm = async () => {
    // get user token for authentificated API route
    const authToken = await auth.currentUser.getIdTokenResult();

    const headers = {headers: {"auth-token": authToken.token}};
    await axios.delete(`${apiUrl}/recipes/${id}`, headers)
    .then(async () => {
      if(data.image && data.image.imageName) {
        await firebase.storage().ref().child(data.image.imageName).delete();
      }
      // Get weekleat recipes and delete the corresponding recipe
      await AsyncStorage.getItem("weekleat-recipes")
      .then(async recipes => {
        var parsedRecipes = JSON.parse(recipes) || [];
        // filter the recipes to exclude the deleted recipe thanks to the ID
        const filteredrecipes = parsedRecipes?.filter(recipe => {
          return recipe.id !== id;
        });
        await AsyncStorage.setItem("weekleat-recipes", JSON.stringify(filteredrecipes));
      })
      .catch(err => {
        if (axios.isCancel(err)) {
          console.log(err);
          return false;
        }
      })

      onHideOptionsPress();
      reload();
    })
    .catch(error => {
      console.log(error)
      Alert.alert(
        "Quelque chose s'est mal passé...",
        "Echec de l'envoi de la recette, Vérifiez votre connexion ou réessayez plus tard.",
        [
          {
            text: "Ok"
          }
        ]
      );
    })
  }

  const onEditPress = () => {
    onHideOptionsPress();
    navigation.navigate('EditRecipe', {data: data, recipeId: id});
  }

  return ( 
    <Modal isVisible={showModalOptions} onBackdropPress={onHideOptionsPress} propagateSwipe >
      <View style={styles.container}>
        
        <TouchableOpacity onPress={onEditPress}>
          <Text style={[styles.text, styles.bold, styles.update]}>Modifier</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDeletePress}>
          <Text style={[styles.text, styles.bold, styles.delete]}>Supprimer</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onHideOptionsPress}>
          <Text style={[styles.text, styles.cancel]}>Annuler</Text>
        </TouchableOpacity>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    alignItems: "center"
  },
  text: {
    fontSize: 20,
    marginVertical: 10
  },
  bold: {
    fontWeight: "bold"
  },
  update: {
    color: "#437C90"
  },
  delete: {
    color: "red"
  },
  cancel: {
    marginTop: 30
  }
});

export default OptionsModal;