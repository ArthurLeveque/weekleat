import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { auth, firebase } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import CustomButton from '../globals/components/CustomButton';

const gs = require ('../globals/styles/GlobalStyle');

const Home = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [weeklist, setWeeklist] = useState();
  const [currentDate, setCurrentDate] = useState();

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
          console.log(e.response);
          // if error status is not the good one (400) show error message, else create a weeklist for the user
          if(e.response.status !== 400) {
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
            setWeeklist(data);
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

  useEffect(() => {
    // let isMounted = true;
    // if(isMounted) {
      const unsubscribe = navigation.addListener('focus', () => {
        getUserWeeklist() 
      });
      return unsubscribe;
    // }
    
    // return () => {
    //   isMounted = false;
    // };
  }, [navigation]);

  return (
    <ScrollView>
      <View style={gs.container}>
        {weeklist &&
          <>
            {Date.parse(weeklist.endDate) < Date.parse(currentDate) || weeklist.endDate === "unknown" ? (
              <>
                <Text style={styles.text}>Vous n'avez pas encore de Weekliste cette semaine !</Text>
                <CustomButton 
                  label="Générer une weekliste"
                  onPress={() => { navigation.navigate("GenerateWeeklist"); }}
                  type="primary"
                />
              </>
            ) : (
              <></>
            )}
          </>
        }

          <CustomButton 
            label="Storage"
            onPress={async () => {
              await AsyncStorage.getItem("weekleat-recipes")
              .then(pouet => {
                const currentUser = JSON.parse(pouet);
                console.log(currentUser);
              })
            }}
            type="primary"
          />

          <CustomButton 
            label="Add storage"
            onPress={async () => {
              const value = {
                name: "Innocent"
              };
              await AsyncStorage.getItem("weekleat-recipes")
              .then(async pouet => {
                var euh = JSON.parse(pouet) || []
                euh.push(value)
                await AsyncStorage.setItem("weekleat-recipes", JSON.stringify(euh))
                .catch(err => {
                  console.log(err)
                })
              })
              
            }}
            type="primary"
          />

          <CustomButton 
            label="Create storage"
            onPress={async () => {
              firebase.storage().ref().child("https://firebasestorage.googleapis.com/v0/b/weekleat.appspot.com/o/145555b1c0123758b6e522c7c2360906.jpg?alt=media&token=2aa7c800-39a6-4bd0-8bec-7222841ef8bb").delete();
            }}
            type="primary"
          />

          <CustomButton 
            label="Vider storage"
            onPress={async () => {
              await AsyncStorage.removeItem("weekleat-recipes")
            }}
            type="primary"
          />

          <CustomButton 
            label="Vider storage weekliste"
            onPress={async () => {
              await AsyncStorage.removeItem("weekleat-weeklist")
            }}
            type="primary"
          />
          <CustomButton 
            label="Storage weekliste"
            onPress={async () => {
              await AsyncStorage.getItem("weekleat-weeklist")
              .then(pouet => {
                const currentUser = JSON.parse(pouet);
                console.log(currentUser);
              })
            }}
            type="primary"
          />

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    marginBottom: 10
  }
});

export default Home;