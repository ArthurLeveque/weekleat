import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert, FlatList } from 'react-native';
import Modal from "react-native-modal";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const gs = require ('../../globals/styles/GlobalStyle');
import CustomButton from '../../globals/components/CustomButton';
import CustomCheckbox from '../../globals/components/CustomCheckbox';
import { auth } from '../../../firebase';
import { apiUrl } from '../../../apiConfig';
import RecipeCard from '../../globals/components/RecipeCard';
import { ScrollView } from 'react-native-gesture-handler';
import EmptyRecipeCard from '../../globals/components/EmptyRecipeCard';

const GenerateWeeklist = ({navigation}) => {
  const {control, handleSubmit} = useForm();

  const [loading, setLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [modalOptions, setModalOptions] = useState(false);
  const [recipes, setRecipes] = useState();

  const onOptionsPress = () => {
    setModalOptions(!modalOptions)
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

  }

  useEffect(() => {
    let isMounted = true;

    navigation.addListener('focus', async () => {
      await AsyncStorage.getItem(`weekleat-weeklist-tempo-${auth.currentUser.uid}`)
      .then(async savedRecipes => {
        if(savedRecipes !== null && isMounted) {
          const parsedRecipes = await JSON.parse(savedRecipes);
          setRecipes(parsedRecipes);
          setIsGenerated(true);
        }
      });
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
                  />
                ) : (
                  <EmptyRecipeCard />
                )}
                {recipes[1] ? (
                  <RecipeCard
                    data={recipes[1].data}
                    id={recipes[1].id}
                    indexList={1}
                    deleteFromList={deleteFromList}
                  />
                ) : (
                  <EmptyRecipeCard />
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
                  />
                ) : (
                  <EmptyRecipeCard />
                )}
                {recipes[3] ? (
                  <RecipeCard
                    data={recipes[3].data}
                    id={recipes[3].id}
                    indexList={3}
                    deleteFromList={deleteFromList}
                  />
                ) : (
                  <EmptyRecipeCard />
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
                  />
                ) : (
                  <EmptyRecipeCard />
                )}
                {recipes[5] ? (
                  <RecipeCard
                    data={recipes[5].data}
                    id={recipes[5].id}
                    indexList={5}
                    deleteFromList={deleteFromList}
                  />
                ) : (
                  <EmptyRecipeCard />
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
                  />
                ) : (
                  <EmptyRecipeCard />
                )}
                {recipes[7] ? (
                  <RecipeCard
                    data={recipes[7].data}
                    id={recipes[7].id}
                    indexList={7}
                    deleteFromList={deleteFromList}
                  />
                ) : (
                  <EmptyRecipeCard />
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
                  />
                ) : (
                  <EmptyRecipeCard />
                )}
                {recipes[9] ? (
                  <RecipeCard
                    data={recipes[9].data}
                    id={recipes[9].id}
                    indexList={9}
                    deleteFromList={deleteFromList}
                  />
                ) : (
                  <EmptyRecipeCard />
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
                  />
                ) : (
                  <EmptyRecipeCard />
                )}
                {recipes[11] ? (
                  <RecipeCard
                    data={recipes[11].data}
                    id={recipes[11].id}
                    indexList={11}
                    deleteFromList={deleteFromList}
                  />
                ) : (
                  <EmptyRecipeCard />
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
                  />
                ) : (
                  <EmptyRecipeCard />
                )}
                {recipes[13] ? (
                  <RecipeCard
                    data={recipes[13].data}
                    id={recipes[13].id}
                    indexList={13}
                    deleteFromList={deleteFromList}
                  />
                ) : (
                  <EmptyRecipeCard />
                )}
              </View>

              <CustomButton 
                label="Confirmer"
                onPress={onConfirmPress}
                type="primary"
              />
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