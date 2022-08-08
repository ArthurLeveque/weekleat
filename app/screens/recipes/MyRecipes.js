import React, {useState} from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const gs = require ('../../globals/styles/GlobalStyle');

import CustomButton from '../../globals/components/CustomButton';

const MyRecipes = () => {
  const navigation = useNavigation();

  const onAddRecipePress = () => {
    navigation.navigate("AddRecipe");
  }

  return (
    <ScrollView>
      <View style={gs.container}>
        <CustomButton 
            label="Ajouter une recette"
            onPress={onAddRecipePress}
            type="primary"
          />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

});

export default MyRecipes;