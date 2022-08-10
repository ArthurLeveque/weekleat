import React, {useState} from 'react';
import { StyleSheet, ScrollView, View, Text, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { auth, firebase } from '../../../firebase';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { apiUrl } from '../../../apiConfig';
import CustomInputWithLabel from '../../globals/components/CustomInputWithLabel';
import CustomButton from '../../globals/components/CustomButton';
import UploadImage from '../../globals/components/UploadImage';
import CustomCheckbox from '../../globals/components/CustomCheckbox';
import IngredientsInputRepeater from '../../globals/components/IngredientsInputRepeater';

const gs = require ('../../globals/styles/GlobalStyle');

const AddRecipe = () => {
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState();
  const [ingredientsErrors, setIngredientsErrors] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const {control, handleSubmit} = useForm();

  const onAddPress = async (data) => {
    setLoading(true);
    // filter ingredients where the name and/or quantity is not defined
    const filteredIngredients = ingredients?.filter(ingredient => {
      return (ingredient.name != "" || ingredient.quantity != "") && (ingredient.name != "" && ingredient.quantity != "");
    });
    // check if there is ingredients, if no show error message else continue
    if (filteredIngredients == undefined || filteredIngredients.length === 0) {
      setIngredientsErrors("Veuillez mettre au moins un ingrédient")
    } else {
      setIngredientsErrors("")
      // add ingredients to data
      data.ingredients = filteredIngredients;
      // fix undefined checkboxes if not touched
      if(data.isVegan === undefined) data.isVegan = false;
      if(data.isVegetarian === undefined) data.isVegetarian = false;
      if(data.withoutGluten === undefined) data.withoutGluten = false;
      // Image uploading
      if(image) {
        const response = await fetch(image);
        const blob = await response.blob();
        // Generate an unique ID for the filename
        const fileName = (new Date()).getTime() + '-' +  Math.random().toString(16).slice(2);
        var uploadRef = firebase.storage().ref().child(fileName);
        uploadRef.put(blob)
        .then(function() {
          // Get and stock image url to access it easily
          uploadRef.getDownloadURL().then((url) => {
            data.imageURL = url;
          });
        })
        .catch(e => {
          console.log(e);
        });
      }

      // get user token for authentificated API route
      const authToken = await auth.currentUser.getIdTokenResult();

      const headers = {headers: {"auth-token": authToken.token}};
      await axios.post(`${apiUrl}/recipes`, data, headers)
      .then(async response => {
        // Get weekleat recipes (or create it if it does not exist) storage and put the new recipe in it
        await AsyncStorage.getItem("weekleat-recipes")
        .then(async recipes => {
          var parsedRecipes = JSON.parse(recipes) || [];
          parsedRecipes.push({id: response.data, data: data});
          await AsyncStorage.setItem("weekleat-recipes", JSON.stringify(parsedRecipes));   
        })
        .catch(err => {
          console.log(err)
        })

        navigation.navigate("MyRecipes");
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

      setLoading(false);
    } 
  }

  const onCancelPress = () => {
    navigation.navigate("MyRecipes");
  }

  const addImage = async () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    }).then((_image) => {
      if (!_image.cancelled) {
        setImage(_image.uri);
      }
    });
  }

  const addPhoto = async () => {
    ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    }).then((_image) => {
      if (!_image.cancelled) {
        setImage(_image.uri);
      }
    });
  }

  return (
    <ScrollView>
      <View style={[gs.container, styles.container]}>
        <Text style={gs.title}>Ajouter une recette</Text>

        <CustomInputWithLabel
           name="name"
           label="Nom de la recette *"
           control={control}
           rules={{required: "Ce champ est obligatoire"}}
        />

        <UploadImage addImage={addImage} addPhoto={addPhoto} image={image} />

        <CustomInputWithLabel
           name="summary"
           label="Texte de présentation"
           multiline
           lines={5}
           control={control}
        />

        <IngredientsInputRepeater 
          setIngredients={setIngredients}
          ingredientsErrors={ingredientsErrors}
        />

        <Text style={styles.ingredientsErrors}>{ingredientsErrors}</Text>
        
        <CustomInputWithLabel
           name="steps"
           label="Etapes de la recette *"
           multiline
           lines={5}
           control={control}
           rules={{required: "Ce champ est obligatoire"}}
        />

        <CustomCheckbox
          name="isVegan"
          label="Convient aux vegans"
          control={control}
        />

        <CustomCheckbox
          name="isVegetarian"
          label="Convient aux végétariens"
          control={control}
        />

        <CustomCheckbox
          name="withoutGluten"
          label="Sans gluten"
          control={control}
        />

        <CustomButton 
          label="Ajouter"
          onPress={handleSubmit(onAddPress)}
          type="primary"
        />

        <CustomButton 
          label="Annuler"
          onPress={onCancelPress}
          type="secondary"
        />
      </View>
      {loading && 
        <ActivityIndicator size="large" color="#DA4167" style={styles.loading} />
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ingredientsErrors: {
    color: "red"
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
    backgroundColor: 'black',
  }
});

export default AddRecipe;