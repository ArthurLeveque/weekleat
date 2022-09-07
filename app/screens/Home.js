import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { auth } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import CustomButton from '../globals/components/CustomButton';
import RecipeCard from '../globals/components/RecipeCard';
import EmptyRecipeCard from '../globals/components/EmptyRecipeCard';
import { apiUrl } from '../../apiConfig';

const gs = require ('../globals/styles/GlobalStyle');

const Home = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [weeklist, setWeeklist] = useState();
  const [currentDate, setCurrentDate] = useState();

  const getUserWeeklist = async () => {
    await AsyncStorage.getItem("weekleat-weeklist")
    .then(async localWeeklist => {
      if(localWeeklist !== null && weeklist === undefined) {
        const parsedWeeklist = await JSON.parse(localWeeklist)
        setWeeklist(parsedWeeklist)
      } else if (localWeeklist === null && weeklist === undefined) {
        console.log("CALL API WEEKLIST")
        const uid = auth.currentUser.uid;
        
        await axios.get(`${apiUrl}/lists/user/${uid}`)
        .then(async (userWeeklist) => {
          await AsyncStorage.setItem("weekleat-weeklist", JSON.stringify(userWeeklist.data));
          setWeeklist(userWeeklist.data)
        })
        .catch(async (e) => {
          // if error status is not the good one (402) show error message, else create a weeklist for the user
          if(e.response.status !== 402) {
            Alert.alert(
              "Quelque chose s'est mal passé...",
              "Echec de la récupération de votre weekliste, Vérifiez votre connexion ou réessayez plus tard.",
              [
                {
                  text: "Ok"
                }
              ]
            );
          } else {
            console.log("CREATE WEEKLIST");
            // get user token for authentificated API route
            const authToken = await auth.currentUser.getIdTokenResult();
            const data = {
              startDate: "unknown",
              endDate: "unknown"
            }
            const headers = {headers: {"auth-token": authToken.token}};
            await axios.post(`${apiUrl}/lists`, data, headers)
            .then(async (response) => {
              const responseData = {
                id: response.data,
                data: data
              }
              await AsyncStorage.setItem("weekleat-weeklist", JSON.stringify(responseData));
              setWeeklist(responseData);
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
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    setCurrentDate(`${year}/${month}/${day}`);
  }

  const initRecipes = async () => {
    // init user's recipes to localStorage
    await AsyncStorage.getItem("weekleat-recipes")
    .then(async localRecipes => {
      if(localRecipes === null) {
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
      }
    })
  }

  const initFavorites = async () => {
    await AsyncStorage.getItem("weekleat-favorites")
    .then(async localFavorites => {
      if(localFavorites === null) {
        console.log("CALL API FAVORITES")
        const uid = auth.currentUser.uid;
        
        await axios.get(`${apiUrl}/favorites/user/${uid}`)
        .then(async (userFavorites) => {
          await AsyncStorage.setItem("weekleat-favorites", JSON.stringify(userFavorites.data));
        })
        .catch(async (e) => {
          // if error status is not the good one (402) show error message, else create a weeklist for the user
          if(e.response.status !== 402) {
            console.log(e.response);
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
            await axios.post(`${apiUrl}/favorites`, {}, headers)
            .then(async (response) => {
              const responseData = {
                id: response.data,
                data: {
                  recipes: []
                }
              }
              await AsyncStorage.setItem("weekleat-favorites", JSON.stringify(responseData));
            })
            .catch((e) => {
              console.log(e);
              Alert.alert(
                "Quelque chose s'est mal passé...",
                "Echec de l'initialisation de vos favoris, Vérifiez votre connexion ou réessayez plus tard.",
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

  useEffect(() => {
    let isMounted = true;
    if(isMounted) {
      navigation.addListener('focus', async () => {
        setLoading(true);
        await getUserWeeklist();
        await initRecipes();
        await initFavorites();
        setLoading(false);
      });
    }
    
    return () => {
      isMounted = false;
    };
  }, [navigation]);

  return (
    <ScrollView>
      {!loading ? (
        <View style={gs.container}>
          {weeklist &&
            <>
              {Date.parse(weeklist.data.endDate) < Date.parse(currentDate) || weeklist.data.endDate === "unknown" ? (
                <>
                  <Text style={styles.text}>Vous n'avez pas encore de Weekliste cette semaine !</Text>
                  <CustomButton 
                    label="Générer une weekliste"
                    onPress={() => { navigation.navigate("Weeklist", {screen: "GenerateWeeklist"})}}
                    type="primary"
                  />
                </>
              ) : (
                <>
                  <Text style={gs.title}>Mon menu aujourd'hui</Text>

                  <View style={styles.day}>
                    <Text style={styles.dayTxt}>Jour {(Date.parse(currentDate) - Date.parse(weeklist.data.startDate)) / (1000 * 60 * 60 * 24) + 1}</Text>
                    {weeklist.data.recipes?.map((recipe, index) => {
                      if(
                        index === ((Date.parse(currentDate) - Date.parse(weeklist.data.startDate)) / (1000 * 60 * 60 * 24)) * 2
                        || index === ((Date.parse(currentDate) - Date.parse(weeklist.data.startDate)) / (1000 * 60 * 60 * 24)) * 2 + 1
                      ) {
                        if(weeklist.data.recipes[index]) {
                          return(
                            <RecipeCard
                              data={recipe.data}
                              id={recipe.id}
                              key={index}
                            />
                          )
                        } else {
                          return (
                            <EmptyRecipeCard key={index} />
                          )
                        }
                      }
                    })}
                  </View>
                </>
              )}
            </>
          }
        </View>
      ) : (
        <ActivityIndicator size="large" color="#DA4167" style={gs.loading} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    marginBottom: 10
  },
  day: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "center",
    marginVertical: 5
  },
  dayTxt: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 18
  },
  dates: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 18
  }
});

export default Home;