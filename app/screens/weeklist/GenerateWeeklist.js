import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import Modal from "react-native-modal";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { auth } from '../../../firebase';
import { apiUrl } from '../../../apiConfig';

const gs = require ('../../globals/styles/GlobalStyle');
import CustomButton from '../../globals/components/CustomButton';
import CustomCheckbox from '../../globals/components/CustomCheckbox';
import RecipeCard from '../../globals/components/RecipeCard';
import EmptyRecipeCard from '../../globals/components/EmptyRecipeCard';
import PremiumModal from '../../globals/components/PremiumModal';
import AddRecipeModal from '../../globals/components/AddRecipeModal';

const GenerateWeeklist = ({navigation}) => {
  const {control, handleSubmit} = useForm();

  const [loading, setLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [modalOptions, setModalOptions] = useState(false);
  const [recipes, setRecipes] = useState();
  const [myRecipes, setMyRecipes] = useState();
  const [showModalPremium, setShowModalPremium] = useState(false);
  const [showModalAddRecipe, setShowModalAddRecipe] = useState(false);
  const [favorites, setFavorites] = useState();
  const [tempoIndex, setTempoIndex] = useState();

  const onOptionsPress = () => {
    setModalOptions(!modalOptions)
  }

  const onHidePremiumPress = () => {
    setShowModalPremium(!showModalPremium)
  }

  const onGeneratePress = async (data) => {
    setLoading(true);
    // fix undefined checkboxes if not touched
    if(data.isVegan === undefined) data.isVegan = false;
    if(data.isVegetarian === undefined) data.isVegetarian = false;
    if(data.withoutGluten === undefined) data.withoutGluten = false;

    // get user token for authentificated API route
    const authToken = await auth.currentUser.getIdTokenResult();

    const headers = {headers: {"auth-token": authToken.token}};
    const response = await axios.post(`${apiUrl}/lists/generate`, data, headers)
    .catch(e => {
      console.log(e);
      Alert.alert(
        "Quelque chose s'est mal passé...",
        "Echec de la récupération des recettes, Vérifiez votre connexion ou réessayez plus tard.",
        [
          {
            text: "Ok"
          }
        ]
      );
    });
    setRecipes(response.data);
    await AsyncStorage.setItem(`weekleat-weeklist-tempo-${auth.currentUser.uid}`, JSON.stringify(response.data));

    setLoading(false);
    setIsGenerated(true);
  }

  const deleteFromList = (indexList) => {
    Alert.alert(
      "Suppression",
      `Voulez-vous vraiment supprimer la recette ${recipes[indexList].data.name} de votre liste ? Vous ne pourrez la remplacer que si vous êtes un membre premium.`,
      [
        { text: "Annuler" },
        { text: "Oui", onPress: () => onDeleteConfirm(indexList) }
      ]
    );
  }

  const onDeleteConfirm = async (indexList) => {
    setLoading(true);
    let tempoRecipes = recipes;
    tempoRecipes[indexList] = null;
    await AsyncStorage.setItem(`weekleat-weeklist-tempo-${auth.currentUser.uid}`, JSON.stringify(tempoRecipes));
    setRecipes(tempoRecipes);
    setLoading(false);
  }

  const onConfirmPress = async () => {
    let data = {};

    let date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    data.startDate = `${year}/${month}/${day}`;

    date.setDate(date.getDate() + 6);
    const endDay = date.getDate();
    const endMonth = date.getMonth() + 1;
    const endYear = date.getFullYear();
    data.endDate = `${endYear}/${endMonth}/${endDay}`;

    data.recipes = recipes;
    // Get weeklist id to edit it
    const storageWeeklist = await AsyncStorage.getItem("weekleat-weeklist");
    const parsedStorageWeeklist = await JSON.parse(storageWeeklist)
    const weeklistID = parsedStorageWeeklist.id;

    const authToken = await auth.currentUser.getIdTokenResult();
    const headers = {headers: {"auth-token": authToken.token}};
    await axios.put(`${apiUrl}/lists/${weeklistID}`, data, headers)
    .then(async (response) => {
      await AsyncStorage.removeItem(`weekleat-weeklist-tempo-${auth.currentUser.uid}`);
      await AsyncStorage.setItem(`weekleat-weeklist`, JSON.stringify({id: response.id, data: data}));
      navigation.navigate("MyWeeklist");
    })
    .catch((e) => {
      console.log(e);
      Alert.alert(
        "Quelque chose s'est mal passé...",
        "Echec de la modification de votre weekliste, Vérifiez votre connexion ou réessayez plus tard.",
        [
          {
            text: "Ok"
          }
        ]
      );
    })
  }

  const checkUserSubscription = async () => {
    let isSubscribed = false;
    // get user token for authentificated API route
    const authToken = await auth.currentUser.getIdTokenResult();
    const headers = {headers: {"auth-token": authToken.token}};
    const response = await axios.get(`${apiUrl}/subscriptions/isSubscribed`, headers);
    
    if(response.data !== false) {
      isSubscribed = true;
    } 
    return isSubscribed;
  }

  const onReloadPress = async (indexList) => {
    // Check if user is subscribed
    const isSubscribed = await checkUserSubscription();
    // If not subscribed, show the premium modal, else reload the recipe
    if(!isSubscribed) {
      setShowModalPremium(true);
    } else {
      setLoading(true);
      // get user token for authentificated API route
      const authToken = await auth.currentUser.getIdTokenResult();
      const headers = {headers: {"auth-token": authToken.token}};
      await axios.get(`${apiUrl}/recipes/random`, headers)
      .then(async (newRecipe) => {
        if(newRecipe.data) {
          let tempoRecipes = recipes;
          tempoRecipes[indexList] = newRecipe.data;
          await AsyncStorage.setItem(`weekleat-weeklist-tempo-${auth.currentUser.uid}`, JSON.stringify(tempoRecipes));
          setRecipes(tempoRecipes);
        }
      })
      .catch((e) => {
        console.log(e.response)
      });

      setLoading(false);
    }
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
            await axios.post(`${apiUrl}/favorites`, {}, headers)
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

  const getUserRecipes = async () => {
    await AsyncStorage.getItem("weekleat-recipes")
    .then(async localRecipes => {
      if(localRecipes !== null && myRecipes === undefined) {
        const parsedRecipes = await JSON.parse(localRecipes)
        setMyRecipes(parsedRecipes)
      } else if (localRecipes === null && myRecipes === undefined) {
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
        setMyRecipes(userRecipes.data)
      }
    })
  }

  const onShowModalAddRecipePress = async (index) => {
     // Check if user is subscribed
     const isSubscribed = await checkUserSubscription();
     // If not subscribed, show the premium modal, else reload the recipe
     if(!isSubscribed) {
       setShowModalPremium(true);
     } else {
      setShowModalAddRecipe(!showModalAddRecipe);
      setTempoIndex(index);
     }
  }

  const onHideAddModalPress = () => {
    setShowModalAddRecipe(false);
  }

  const onAddPress = async (id, data) => {
     // Check if user is subscribed
    const isSubscribed = await checkUserSubscription();
    // If not subscribed, show the premium modal, else reload the recipe
    if(!isSubscribed) {
      setShowModalPremium(true);
    } else {
      setLoading(true);
      let tempoRecipes = recipes;
      tempoRecipes[id] = data;
      await AsyncStorage.setItem(`weekleat-weeklist-tempo-${auth.currentUser.uid}`, JSON.stringify(tempoRecipes));
      setRecipes(tempoRecipes);
      setLoading(false);
    } 
  }

  useEffect(() => {
    let isMounted = true;

    navigation.addListener('focus', async () => {
      setLoading(true);
      await getUserFavorites();
      await getUserRecipes();
      await AsyncStorage.getItem(`weekleat-weeklist-tempo-${auth.currentUser.uid}`)
      .then(async savedRecipes => {
        if(savedRecipes !== null && isMounted) {
          const parsedRecipes = await JSON.parse(savedRecipes);
          setRecipes(parsedRecipes);
          setIsGenerated(true);
        }  
      });
      setLoading(false);
    });
    
    return () => {
      isMounted = false;
    };
  }, [navigation]);

  return (
    <ScrollView>
      <View style={{flex: 1}}>
        {!loading ? (
          <View style={gs.container}>
          {!isGenerated ? (
            <>
              <View style={styles.container}>
                <CustomButton 
                  label="Options"
                  onPress={onOptionsPress}
                  type="tertiary"
                />
                <View style={styles.generateBtnContainer}>
                  <TouchableOpacity onPress={handleSubmit(onGeneratePress)} style={styles.generateBtn}>
                    <Text style={styles.generateBtnTxt}>C'est parti !</Text>
                  </TouchableOpacity>
                  <View style={styles.generateBtnShadow}/>
                </View>
              
              </View>

              <Modal isVisible={modalOptions} onBackdropPress={onOptionsPress} propagateSwipe >
                <View style={styles.modalContainer}>
                  <Text style={styles.textModal}>Je veux que ma liste convienne aux :</Text>
                  <CustomCheckbox
                    name="isVegan"
                    label="Vegans"
                    control={control}
                  />
                  <CustomCheckbox
                    name="isVegetarian"
                    label="Végétariens"
                    control={control}
                  />
                  <CustomCheckbox
                    name="withoutGluten"
                    label="Intolérants au gluten"
                    control={control}
                  />
                  <View style={styles.spacingButton}>
                    <CustomButton 
                      label="Fermer"
                      onPress={onOptionsPress}
                      type="secondary"
                    />
                  </View>
                </View>
              </Modal>
            </>
          ) : (
            <>
              <Text style={gs.title}>Ma semaine</Text>
              
              <View style={styles.day}>
                <Text style={styles.dayTxt}>Jour 1</Text>
                {recipes[0] ? (
                  <RecipeCard
                    data={recipes[0].data}
                    id={recipes[0].id}
                    indexList={0}
                    deleteFromList={deleteFromList}
                    addToFavorites={addToFavorites}
                    deleteFromFavorites={deleteFromFavorites}
                    favorites={favorites.data.recipes}
                  />
                ) : (
                  <EmptyRecipeCard indexList={0} reload={onReloadPress} onShowModalAddRecipePress={onShowModalAddRecipePress} />
                )}
                {recipes[1] ? (
                  <RecipeCard
                    data={recipes[1].data}
                    id={recipes[1].id}
                    indexList={1}
                    deleteFromList={deleteFromList}
                    addToFavorites={addToFavorites}
                    deleteFromFavorites={deleteFromFavorites}
                    favorites={favorites.data.recipes}
                  />
                ) : (
                  <EmptyRecipeCard indexList={1} reload={onReloadPress} onShowModalAddRecipePress={onShowModalAddRecipePress}  />
                )}
              </View>

              <View style={styles.day}>
                <Text style={styles.dayTxt}>Jour 2</Text>
                {recipes[2] ? (
                  <RecipeCard
                    data={recipes[2].data}
                    id={recipes[2].id}
                    indexList={2}
                    deleteFromList={deleteFromList}
                    addToFavorites={addToFavorites}
                    deleteFromFavorites={deleteFromFavorites}
                    favorites={favorites.data.recipes}
                  />
                ) : (
                  <EmptyRecipeCard indexList={2} reload={onReloadPress} onShowModalAddRecipePress={onShowModalAddRecipePress} />
                )}
                {recipes[3] ? (
                  <RecipeCard
                    data={recipes[3].data}
                    id={recipes[3].id}
                    indexList={3}
                    deleteFromList={deleteFromList}
                    addToFavorites={addToFavorites}
                    deleteFromFavorites={deleteFromFavorites}
                    favorites={favorites.data.recipes}
                  />
                ) : (
                  <EmptyRecipeCard indexList={3} reload={onReloadPress} onShowModalAddRecipePress={onShowModalAddRecipePress} />
                )}
              </View>

              <View style={styles.day}>
                <Text style={styles.dayTxt}>Jour 3</Text>
                {recipes[4] ? (
                  <RecipeCard
                    data={recipes[4].data}
                    id={recipes[4].id}
                    indexList={4}
                    deleteFromList={deleteFromList}
                    addToFavorites={addToFavorites}
                    deleteFromFavorites={deleteFromFavorites}
                    favorites={favorites.data.recipes}
                  />
                ) : (
                  <EmptyRecipeCard indexList={4} reload={onReloadPress} onShowModalAddRecipePress={onShowModalAddRecipePress} />
                )}
                {recipes[5] ? (
                  <RecipeCard
                    data={recipes[5].data}
                    id={recipes[5].id}
                    indexList={5}
                    deleteFromList={deleteFromList}
                    addToFavorites={addToFavorites}
                    deleteFromFavorites={deleteFromFavorites}
                    favorites={favorites.data.recipes}
                  />
                ) : (
                  <EmptyRecipeCard indexList={5} reload={onReloadPress} onShowModalAddRecipePress={onShowModalAddRecipePress} />
                )}
              </View>

              <View style={styles.day}>
                <Text style={styles.dayTxt}>Jour 4</Text>
                {recipes[6] ? (
                  <RecipeCard
                    data={recipes[6].data}
                    id={recipes[6].id}
                    indexList={6}
                    deleteFromList={deleteFromList}
                    addToFavorites={addToFavorites}
                    deleteFromFavorites={deleteFromFavorites}
                    favorites={favorites.data.recipes}
                  />
                ) : (
                  <EmptyRecipeCard indexList={6} reload={onReloadPress} onShowModalAddRecipePress={onShowModalAddRecipePress} />
                )}
                {recipes[7] ? (
                  <RecipeCard
                    data={recipes[7].data}
                    id={recipes[7].id}
                    indexList={7}
                    deleteFromList={deleteFromList}
                    addToFavorites={addToFavorites}
                    deleteFromFavorites={deleteFromFavorites}
                    favorites={favorites.data.recipes}
                  />
                ) : (
                  <EmptyRecipeCard indexList={7} reload={onReloadPress} onShowModalAddRecipePress={onShowModalAddRecipePress} />
                )}
              </View>

              <View style={styles.day}>
                <Text style={styles.dayTxt}>Jour 5</Text>
                {recipes[8] ? (
                  <RecipeCard
                    data={recipes[8].data}
                    id={recipes[8].id}
                    indexList={8}
                    deleteFromList={deleteFromList}
                    addToFavorites={addToFavorites}
                    deleteFromFavorites={deleteFromFavorites}
                    favorites={favorites.data.recipes}
                  />
                ) : (
                  <EmptyRecipeCard indexList={8} reload={onReloadPress} onShowModalAddRecipePress={onShowModalAddRecipePress} />
                )}
                {recipes[9] ? (
                  <RecipeCard
                    data={recipes[9].data}
                    id={recipes[9].id}
                    indexList={9}
                    deleteFromList={deleteFromList}
                    addToFavorites={addToFavorites}
                    deleteFromFavorites={deleteFromFavorites}
                    favorites={favorites.data.recipes}
                  />
                ) : (
                  <EmptyRecipeCard indexList={9} reload={onReloadPress} onShowModalAddRecipePress={onShowModalAddRecipePress} />
                )}
              </View>

              <View style={styles.day}>
                <Text style={styles.dayTxt}>Jour 6</Text>
                {recipes[10] ? (
                  <RecipeCard
                    data={recipes[10].data}
                    id={recipes[10].id}
                    indexList={10}
                    deleteFromList={deleteFromList}
                    addToFavorites={addToFavorites}
                    deleteFromFavorites={deleteFromFavorites}
                    favorites={favorites.data.recipes}
                  />
                ) : (
                  <EmptyRecipeCard indexList={10} reload={onReloadPress} onShowModalAddRecipePress={onShowModalAddRecipePress} />
                )}
                {recipes[11] ? (
                  <RecipeCard
                    data={recipes[11].data}
                    id={recipes[11].id}
                    indexList={11}
                    deleteFromList={deleteFromList}
                    addToFavorites={addToFavorites}
                    deleteFromFavorites={deleteFromFavorites}
                    favorites={favorites.data.recipes}
                  />
                ) : (
                  <EmptyRecipeCard indexList={11} reload={onReloadPress} onShowModalAddRecipePress={onShowModalAddRecipePress} />
                )}
              </View>

              <View style={styles.day}>
                <Text style={styles.dayTxt}>Jour 7</Text>
                {recipes[12] ? (
                  <RecipeCard
                    data={recipes[12].data}
                    id={recipes[12].id}
                    indexList={12}
                    deleteFromList={deleteFromList}
                    addToFavorites={addToFavorites}
                    deleteFromFavorites={deleteFromFavorites}
                    favorites={favorites.data.recipes}
                  />
                ) : (
                  <EmptyRecipeCard indexList={12} reload={onReloadPress} onShowModalAddRecipePress={onShowModalAddRecipePress} />
                )}
                {recipes[13] ? (
                  <RecipeCard
                    data={recipes[13].data}
                    id={recipes[13].id}
                    indexList={13}
                    deleteFromList={deleteFromList}
                    addToFavorites={addToFavorites}
                    deleteFromFavorites={deleteFromFavorites}
                    favorites={favorites.data.recipes}
                  />
                ) : (
                  <EmptyRecipeCard indexList={13} reload={onReloadPress} onShowModalAddRecipePress={onShowModalAddRecipePress} />
                )}
              </View>

              <CustomButton 
                label="Confirmer"
                onPress={onConfirmPress}
                type="primary"
              />
            </>
          )}
          <PremiumModal showModalPremium={showModalPremium} onHidePremiumPress={onHidePremiumPress} />
          <AddRecipeModal 
            showModalAddRecipes={showModalAddRecipe} 
            onHideAddModalPress={onHideAddModalPress} 
            myRecipes={myRecipes?.data} 
            favorites={favorites?.data.recipes} 
            add={onAddPress}
            indexList={tempoIndex}
          />
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    alignItems: "center"
  },
  textModal: {
    marginBottom: 20
  },
  spacingButton: {
    marginTop: 20,
    width: "100%"
  },
  generateBtn: {
    backgroundColor: "#DA4167",
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    position: "relative"
  },
  generateBtnShadow: {
    width: 200,
    height: 200,
    position: "absolute",
    bottom: -7,
    backgroundColor: "#aa2244",
    opacity: 0.5,
    borderRadius: 100,
    zIndex: -1
  },
  generateBtnTxt: {
    fontWeight: "bold",
    color: "white",
    fontSize: 20
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
  }
});

export default GenerateWeeklist;