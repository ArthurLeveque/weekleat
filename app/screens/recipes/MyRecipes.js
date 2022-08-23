import React, {useState, useEffect} from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const gs = require ('../../globals/styles/GlobalStyle');
import { apiUrl } from '../../../apiConfig';

import CustomButton from '../../globals/components/CustomButton';
import RecipeCard from '../../globals/components/RecipeCard';
import { auth } from '../../../firebase';

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
        console.log("CALL API")
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

  // useEffect(() => {
  //   let isMounted = true;
  //   if (isFocused && isMounted) {
  //     getUserRecipes() 
  //   }
    
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [recipes, isFocused]);
  useEffect(() => {
    let isMounted = true;
    if(isMounted) {
      const unsubscribe = navigation.addListener('focus', () => {
        getUserRecipes() 
      });
      return unsubscribe;
    }
    
    return () => {
      isMounted = false;
    };

  }, [navigation]);

  const renderItem = ({ item }) => (
    <RecipeCard 
      data={item.data}
      id={item.id}
      reload={onReloadPress}
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