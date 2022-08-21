import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { auth, firebase } from '../../../firebase';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiUrl } from '../../../apiConfig';
import CustomButton from '../../globals/components/CustomButton';
import CustomInputWithLabel from '../../globals/components/CustomInputWithLabel';
import CustomCheckbox from '../../globals/components/CustomCheckbox';
import IngredientsInputRepeater from '../../globals/components/IngredientsInputRepeater';
import UploadImage from '../../globals/components/UploadImage';
const gs = require ('../../globals/styles/GlobalStyle');

const EditRecipe = ({route, navigation}) => {
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [ingredientsErrors, setIngredientsErrors] = useState("");
  const [isSendDisabled, setIsSendDisabled] = useState(false);
  const [imageHasChanged, setImageHasChanged] = useState(true);

  const { data, recipeId } = route.params;
  const {control, handleSubmit, setValue} = useForm();

  setValue("name", data.name);
  setValue("summary", data.summary);
  setValue("steps", data.steps);
  setValue("isVegan", data.isVegan);
  setValue("isVegetarian", data.isVegetarian);
  setValue("withoutGluten", data.withoutGluten);

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
        setImageHasChanged(true);
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
        setImageHasChanged(true);
        setImage(_image.uri);
      }
    });
  }

  const onEditPress = async (newData) => {
    setIsSendDisabled(true);
    // filter ingredients where the name and/or quantity is not defined
    const filteredIngredients = ingredients?.filter(ingredient => {
      return (ingredient.name != "" || ingredient.quantity != "") && (ingredient.name != "" && ingredient.quantity != "");
    });
    // check if there is ingredients, if no show error message else continue
    if (filteredIngredients == undefined || filteredIngredients.length === 0) {
      setIngredientsErrors("Veuillez mettre au moins un ingrédient")
    } else {
      setIngredientsErrors("");
      // add ingredients to data
      newData.ingredients = filteredIngredients;
      // fix undefined checkboxes if not touched
      if(newData.isVegan === undefined) newData.isVegan = false;
      if(newData.isVegetarian === undefined) newData.isVegetarian = false;
      if(newData.withoutGluten === undefined) newData.withoutGluten = false;
      // Image uploading
      if(image) {
        const response = await fetch(image);
        const blob = await response.blob();
        // Generate an unique ID for the filename
        const fileName = (new Date()).getTime() + '-' +  Math.random().toString(16).slice(2);
        var uploadRef = firebase.storage().ref().child(fileName);
        await uploadRef.put(blob)
        // Get and stock image URL to access it easily
        await uploadRef.getDownloadURL()
        .then(dlURL => {
          const image = {};
          image.imageURL = dlURL;
          image.imageName = fileName;
          newData.image = image;
        })
        .catch(e => {
          console.log(e);
        });
      }

      // get user token for authentificated API route
      const authToken = await auth.currentUser.getIdTokenResult();

      const headers = {headers: {"auth-token": authToken.token}};
      await axios.put(`${apiUrl}/recipes/${recipeId}`, newData, headers)
      .then(async () => {
         // If there is a new image, delete the previous one
         if(imageHasChanged && data.image) {
          await firebase.storage().ref().child(data.image.imageName).delete();
        }
        // Get weekleat recipes storage and put the new edited recipe in it
        await AsyncStorage.getItem("weekleat-recipes")
        .then(async recipes => {
          var parsedRecipes = JSON.parse(recipes) || [];
          // filter the recipes to exclude the edited recipe thanks to the ID to replace it
          const filteredrecipes = parsedRecipes?.filter(recipe => {
            return recipe.id !== recipeId;
          });
          filteredrecipes.push({id: recipeId, data: newData});
          await AsyncStorage.setItem("weekleat-recipes", JSON.stringify(filteredrecipes));   
        })
        .catch(err => {
          console.log(err)
        })

        navigation.navigate("MyRecipes");
      })
      .catch(error => {
        console.log(error);
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
    setIsSendDisabled(false);
  }

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setIngredients(data.ingredients);
      if(data.image) setImage(data.image.imageURL);
    }
    
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ScrollView>
      <View style={gs.container}>
        <Text style={gs.title}>Modifier {data.name}</Text>

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

        <Text style={styles.ingredientsLabel}>Ingrédients *</Text>

        <IngredientsInputRepeater 
          ingredients={ingredients}
          setIngredients={setIngredients}
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
          label="Modifier"
          onPress={handleSubmit(onEditPress)}
          type="primary"
          disabled={isSendDisabled}
        />
        
        <CustomButton 
          label="Annuler"
          onPress={onCancelPress}
          type="secondary"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ingredientsErrors: {
    color: "red",
  },
  ingredientsLabel: {
    color: "#0B090A",
    fontWeight: "bold",
    marginVertical: 8
  }
});

export default EditRecipe;