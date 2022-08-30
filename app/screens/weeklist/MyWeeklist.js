import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Alert, ActivityIndicator,Text, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const gs = require ('../../globals/styles/GlobalStyle');
import { apiUrl } from '../../../apiConfig';
import { auth } from '../../../firebase';

import CustomButton from '../../globals/components/CustomButton';
import RecipeCard from '../../globals/components/RecipeCard';
import EmptyRecipeCard from '../../globals/components/EmptyRecipeCard';

const MyWeekList = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [weeklist, setWeeklist] = useState();
  const [currentDate, setCurrentDate] = useState();
  const [favorites, setFavorites] = useState();

  const getUserWeeklist = async () => {
    setLoading(true);
    await AsyncStorage.getItem("weekleat-weeklist")
    .then(async localWeeklist => {
      if(localWeeklist !== null && weeklist === undefined) {
        const parsedWeeklist = await JSON.parse(localWeeklist)
        setWeeklist(parsedWeeklist.data)
      } else if (localWeeklist === null && weeklist === undefined) {
        console.log("CALL API")
        const uid = auth.currentUser.uid;
        
        await axios.get(`${apiUrl}/lists/user/${uid}`)
        .then(async (userWeeklist) => {
          await AsyncStorage.setItem("weekleat-weeklist", JSON.stringify(userWeeklist.data));
          setWeeklist(userWeeklist.data.data)
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
    setLoading(false);
  }

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

  const onAddWeeklistPress = () => {
    navigation.navigate("GenerateWeeklist");
  }

  const addToFavorites = async (data) => {
    setLoading(true);

    let tempoFavorites = favorites;
    if(tempoFavorites.data.recipes) {
      tempoFavorites.data.recipes.push(data);
    } else {
      tempoFavorites.data = {};
      tempoFavorites.data.recipes = [];
      tempoFavorites.data.recipes.push(data);
    }

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
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      await getUserFavorites();
      await getUserWeeklist();
      setLoading(false);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView>
      <View style={{flex: 1}}>
        {!loading ? (
          <View style={gs.container}>
            {!weeklist ? (
              <Text style={styles.text}>Nous n'avons pas pu retrouvé votre weekliste ! Veuillez quitter cet écran et revenir plus tard.</Text>
            ) : (
              <>
                {weeklist.endDate === "unknown" &&
                  <>
                    <Text style={styles.text}>Vous n'avez pas encore généré votre weekliste !</Text>
                    <CustomButton 
                      label="Générer ma première Weekliste"
                      onPress={onAddWeeklistPress}
                      type="primary"
                    />
                  </>
                }
                {Date.parse(weeklist.endDate) < Date.parse(currentDate) &&
                  <>
                    <Text style={styles.text}>Votre weekliste a expirée, Créez-en une autre !</Text>
                    <CustomButton 
                      label="Générer une autre Weekliste"
                      onPress={onAddWeeklistPress}
                      type="primary"
                    />
                  </>
                }
                {Date.parse(weeklist.endDate) >= Date.parse(currentDate) &&
                  <>
                    <Text style={styles.dates}>{weeklist.startDate} - {weeklist.endDate}</Text>
                
                    <View style={styles.day}>
                      <Text style={styles.dayTxt}>Jour 1</Text>
                      {weeklist.recipes[0] ? (
                        <RecipeCard
                          data={weeklist.recipes[0].data}
                          id={weeklist.recipes[0].id}
                          favorites={favorites.data.recipes}
                          deleteFromFavorites={deleteFromFavorites}
                          addToFavorites={addToFavorites}
                        />
                      ) : (
                        <EmptyRecipeCard />
                      )}
                      {weeklist.recipes[1] ? (
                        <RecipeCard
                          data={weeklist.recipes[1].data}
                          id={weeklist.recipes[1].id}
                          favorites={favorites.data.recipes}
                          deleteFromFavorites={deleteFromFavorites}
                          addToFavorites={addToFavorites}
                        />
                      ) : (
                        <EmptyRecipeCard />
                      )}
                    </View>

                    <View style={styles.day}>
                      <Text style={styles.dayTxt}>Jour 2</Text>
                      {weeklist.recipes[2] ? (
                        <RecipeCard
                          data={weeklist.recipes[2].data}
                          id={weeklist.recipes[2].id}
                          favorites={favorites.data.recipes}
                          deleteFromFavorites={deleteFromFavorites}
                          addToFavorites={addToFavorites}
                        />
                      ) : (
                        <EmptyRecipeCard />
                      )}
                      {weeklist.recipes[3] ? (
                        <RecipeCard
                          data={weeklist.recipes[3].data}
                          id={weeklist.recipes[3].id}
                          favorites={favorites.data.recipes}
                          deleteFromFavorites={deleteFromFavorites}
                          addToFavorites={addToFavorites}
                        />
                      ) : (
                        <EmptyRecipeCard />
                      )}
                    </View>

                    <View style={styles.day}>
                      <Text style={styles.dayTxt}>Jour 3</Text>
                      {weeklist.recipes[4] ? (
                        <RecipeCard
                          data={weeklist.recipes[4].data}
                          id={weeklist.recipes[4].id}
                          favorites={favorites.data.recipes}
                          deleteFromFavorites={deleteFromFavorites}
                          addToFavorites={addToFavorites}
                        />
                      ) : (
                        <EmptyRecipeCard />
                      )}
                      {weeklist.recipes[5] ? (
                        <RecipeCard
                          data={weeklist.recipes[5].data}
                          id={weeklist.recipes[5].id}
                          favorites={favorites.data.recipes}
                          deleteFromFavorites={deleteFromFavorites}
                          addToFavorites={addToFavorites}
                        />
                      ) : (
                        <EmptyRecipeCard />
                      )}
                    </View>

                    <View style={styles.day}>
                      <Text style={styles.dayTxt}>Jour 4</Text>
                      {weeklist.recipes[6] ? (
                        <RecipeCard
                          data={weeklist.recipes[6].data}
                          id={weeklist.recipes[6].id}
                          favorites={favorites.data.recipes}
                          deleteFromFavorites={deleteFromFavorites}
                          addToFavorites={addToFavorites}
                        />
                      ) : (
                        <EmptyRecipeCard />
                      )}
                      {weeklist.recipes[7] ? (
                        <RecipeCard
                          data={weeklist.recipes[7].data}
                          id={weeklist.recipes[7].id}
                          favorites={favorites.data.recipes}
                          deleteFromFavorites={deleteFromFavorites}
                          addToFavorites={addToFavorites}
                        />
                      ) : (
                        <EmptyRecipeCard />
                      )}
                    </View>

                    <View style={styles.day}>
                      <Text style={styles.dayTxt}>Jour 5</Text>
                      {weeklist.recipes[8] ? (
                        <RecipeCard
                          data={weeklist.recipes[8].data}
                          id={weeklist.recipes[8].id}
                          favorites={favorites.data.recipes}
                          deleteFromFavorites={deleteFromFavorites}
                          addToFavorites={addToFavorites}
                        />
                      ) : (
                        <EmptyRecipeCard />
                      )}
                      {weeklist.recipes[9] ? (
                        <RecipeCard
                          data={weeklist.recipes[9].data}
                          id={weeklist.recipes[9].id}
                          favorites={favorites.data.recipes}
                          deleteFromFavorites={deleteFromFavorites}
                          addToFavorites={addToFavorites}
                        />
                      ) : (
                        <EmptyRecipeCard />
                      )}
                    </View>

                    <View style={styles.day}>
                      <Text style={styles.dayTxt}>Jour 6</Text>
                      {weeklist.recipes[10] ? (
                        <RecipeCard
                          data={weeklist.recipes[10].data}
                          id={weeklist.recipes[10].id}
                          favorites={favorites.data.recipes}
                          deleteFromFavorites={deleteFromFavorites}
                          addToFavorites={addToFavorites}
                        />
                      ) : (
                        <EmptyRecipeCard />
                      )}
                      {weeklist.recipes[11] ? (
                        <RecipeCard
                          data={weeklist.recipes[11].data}
                          id={weeklist.recipes[11].id}
                          favorites={favorites.data.recipes}
                          deleteFromFavorites={deleteFromFavorites}
                          addToFavorites={addToFavorites}
                        />
                      ) : (
                        <EmptyRecipeCard />
                      )}
                    </View>

                    <View style={styles.day}>
                      <Text style={styles.dayTxt}>Jour 7</Text>
                      {weeklist.recipes[12] ? (
                        <RecipeCard
                          data={weeklist.recipes[12].data}
                          id={weeklist.recipes[12].id}
                          favorites={favorites.data.recipes}
                          deleteFromFavorites={deleteFromFavorites}
                          addToFavorites={addToFavorites}
                        />
                      ) : (
                        <EmptyRecipeCard />
                      )}
                      {weeklist.recipes[13] ? (
                        <RecipeCard
                          data={weeklist.recipes[13].data}
                          id={weeklist.recipes[13].id}
                          favorites={favorites.data.recipes}
                          deleteFromFavorites={deleteFromFavorites}
                          addToFavorites={addToFavorites}
                        />
                      ) : (
                        <EmptyRecipeCard />
                      )}
                    </View>
                    
                  </>
                }
              </>
            )}
          </View>
        ) : (
          <ActivityIndicator size="large" color="#DA4167" style={gs.loading} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    textAlign: "center"
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

export default MyWeekList;