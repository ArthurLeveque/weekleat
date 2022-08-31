import React, {useState, useEffect} from 'react';
import { View, Alert, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const gs = require ('../../globals/styles/GlobalStyle');
import { apiUrl } from '../../../apiConfig';

import RecipeCard from '../../globals/components/RecipeCard';
import { auth } from '../../../firebase';

const MyFavorites = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState();

  const getUserFavorites = async () => {
    await AsyncStorage.getItem("weekleat-favorites")
    .then(async localFavorites => {
      if(localFavorites !== null && favorites === undefined) {
        const parsedFavorites = await JSON.parse(localFavorites)
        setFavorites(parsedFavorites)
      } else if (localFavorites === null && favorites === undefined) {
        console.log("CALL API")
        const uid = auth.currentUser.uid;
        
        await axios.get(`${apiUrl}/favorites/user/${uid}`)
        .then(async (userFavorites) => {
          await AsyncStorage.setItem("weekleat-favorites", JSON.stringify(userFavorites.data));
          setFavorites(userFavorites.data)
        })
        .catch(async (e) => {
          // if error status is not the good one (402) show error message, else create a weeklist for the user
          if(e.response.status !== 402) {
            Alert.alert(
              "Quelque chose s'est mal passé...",
              "Echec de la récupération de vos favoris, Vérifiez votre connexion ou réessayez plus tard.",
              [
                {
                  text: "Ok"
                }
              ]
            );
          } else {
            console.log("CREATE FAVORITES");
            // get user token for authentificated API route
            const authToken = await auth.currentUser.getIdTokenResult();
            const headers = {headers: {"auth-token": authToken.token}};
            await axios.post(`${apiUrl}/lists`, {}, headers)
            .then(async (response) => {
              const responseData = {
                id: response.data,
                data: {
                  recipes: []
                }
              }
              await AsyncStorage.setItem("weekleat-favorites", JSON.stringify(responseData));
              setFavorites(responseData);
            })
            .catch((e) => {
              console.log(e);
              Alert.alert(
                "Quelque chose s'est mal passé...",
                "Echec de l'initialisation de votre weekliste, Vérifiez votre connexion ou réessayez plus tard.",
                [
                  {
                    text: "Ok"
                  }
                ]
              );
            })
          }
        });
      }
    })
  }

  const deleteFromFavorites = async (id) => {
    setLoading(true);

    let tempoFavorites = favorites;
    const filteredrecipes = tempoFavorites.data.recipes.filter(recipe => {
      return recipe.id !== id;
    });
    tempoFavorites.data.recipes = filteredrecipes;

    const authToken = await auth.currentUser.getIdTokenResult();
    const headers = {headers: {"auth-token": authToken.token}};
    await axios.put(`${apiUrl}/favorites/${favorites.id}`, tempoFavorites.data, headers)
    .then(async () => {
      await AsyncStorage.setItem("weekleat-favorites", JSON.stringify(tempoFavorites));
      setFavorites(tempoFavorites);
      setLoading(false);
    })
    .catch((e) => {
      console.log(e.response);
      setLoading(false);
    })
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      getUserFavorites();
      setLoading(false);
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <RecipeCard 
      data={item.data}
      id={item.id}
      deleteFromFavorites={deleteFromFavorites}
      favorites={favorites.data?.recipes}
    />
  );

  return (
    <View style={{flex: 1}}>
      {!loading ? (
        <View style={gs.container}>
          {favorites &&
            <FlatList 
              data={favorites.data?.recipes}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          }
        </View>
      ) : (
        <ActivityIndicator size="large" color="#DA4167" style={gs.loading} />
      )}
    </View>
  );
}

export default MyFavorites;