import React, {useState} from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { auth } from '../../../firebase';
import * as ImagePicker from 'expo-image-picker';

import CustomInputWithLabel from '../../globals/components/CustomInputWithLabel';
import CustomButton from '../../globals/components/CustomButton';
import UploadImage from '../../globals/components/UploadImage';
import CustomCheckbox from '../../globals/components/CustomCheckbox';
import IngredientsInputRepeater from '../../globals/components/IngredientsInputRepeater';

const gs = require ('../../globals/styles/GlobalStyle');

const AddRecipe = () => {
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState();

  const navigation = useNavigation();
  const {control, handleSubmit} = useForm();

  const onAddPress = (data) => {
    //TODO
    data.ingredients = ingredients;
    console.log(data)
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
        />
        
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({

});

export default AddRecipe;