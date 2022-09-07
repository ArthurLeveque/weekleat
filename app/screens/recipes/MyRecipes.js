import React, {useState, useEffect} from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const gs = require ('../../globals/styles/GlobalStyle');
import { apiUrl } from '../../../apiConfig';

import CustomButton from '../../globals/components/CustomButton';
import RecipeCard from '../../globals/components/RecipeCard';
import { auth, firebase } from '../../../firebase';

const MyRecipes = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState();

  const onAddRecipePress = () => {
    navigation.navigate("AddRecipe");
  }

  const getUserRecipes = async () => {
    setLoading(true);
    await AsyncStorage.getItem("weekleat-recipes")
    .then(async localRecipes => {
      if(localRecipes !== null && recipes === undefined) {
        const parsedRecipes = await JSON.parse(localRecipes)
        setRecipes(parsedRecipes)
      } else if (localRecipes === null && recipes === undefined) {
        console.log("CALL API RECIPES")
        const uid = auth.currentUser.uid;
        const userRecipes = await axios.get(`${apiUrl}/recipes/user/${uid}`)
        .catch(e => {
          console.log(e);
          Alert.alert(
            "Quelque chose s'est mal passé...",
            "Echec de la récupération de vos recettes, Vérifiez votre connexion ou réessayez plus tard.",
            [
              {
                text: "Ok"
              }
            ]
          );
        });
        await AsyncStorage.setItem("weekleat-recipes", JSON.stringify(userRecipes.data));
        setRecipes(userRecipes.data)
      }
    })
    setLoading(false);
  }

  const onReloadPress = async () => {
    setLoading(true);
    await AsyncStorage.getItem("weekleat-recipes")
    .then(async localRecipes => {
      if(localRecipes !== null) {
        const parsedRecipes = await JSON.parse(localRecipes)
        setRecipes(parsedRecipes)
      }
    })
    .catch(e => {console.log(e)})
    setLoading(false)
  }

  const onDeleteConfirm = async (id, dataRecipe) => {
    setLoading(true);
    // get user token for authentificated API route
    const authToken = await auth.currentUser.getIdTokenResult();

    const headers = {headers: {"auth-token": authToken.token}};
    await axios.delete(`${apiUrl}/recipes/${id}`, headers)
    .then(async () => {
      if(dataRecipe.image && dataRecipe.image.imageName) {
        await firebase.storage().ref().child(dataRecipe.image.imageName).delete();
      }
      // Get weekleat recipes and delete the corresponding recipe
      await AsyncStorage.getItem("weekleat-recipes")
      .then(async recipesStorage => {
        var parsedRecipes = JSON.parse(recipesStorage) || [];
        // filter the recipes to exclude the deleted recipe thanks to the ID
        const filteredrecipes = parsedRecipes?.filter(recipe => {
          return recipe.id !== id;
        });
        await AsyncStorage.setItem("weekleat-recipes", JSON.stringify(filteredrecipes));
        setRecipes(filteredrecipes);
      })
      .catch(err => {
        if (axios.isCancel(err)) {
          console.log(err);
          return false;
        }
      })
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUserRecipes();
      if(recipes) onReloadPress(); // Fix when sometimes the recipes list don't update after an update or a create
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <RecipeCard 
      data={item.data}
      id={item.id}
      onDeleteConfirm={onDeleteConfirm}
    />
  );

  return (
    <View style={{flex: 1}}>
      {!loading ? (
        <View style={gs.container}>
          <CustomButton 
            label="Ajouter une recette"
            onPress={onAddRecipePress}
            type="primary"
          />

          <TouchableOpacity style={styles.reloadBtn} onPress={onReloadPress}>
            <Ionicons name="reload" size={20} color="black"  />
          </TouchableOpacity>

          <FlatList 
            data={recipes}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      ) : (
        <ActivityIndicator size="large" color="#DA4167" style={gs.loading} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  reloadBtn: {
    alignSelf: "center",
    marginVertical: 5,
    width: 30
  }
});

export default MyRecipes;