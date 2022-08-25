import React, {useState, useEffect} from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, ActivityIndicator, FlatList, Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const gs = require ('../../globals/styles/GlobalStyle');
import { apiUrl } from '../../../apiConfig';
import { auth } from '../../../firebase';

import CustomButton from '../../globals/components/CustomButton';

const MyWeekList = ({navigation}) => {
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

  const onAddWeeklistPress = () => {
    navigation.navigate("GenerateWeeklist");
  }

  useEffect(() => {
    let isMounted = true;
    if(isMounted) {
      const unsubscribe = navigation.addListener('focus', () => {
        getUserWeeklist() 
      });
      return unsubscribe;
    }
    
    return () => {
      isMounted = false;
    };
  }, [navigation]);

  return (
    <View style={{flex: 1}}>
      {!loading ? (
        <View style={[gs.container, styles.container]}>
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
                  <Text style={styles.text}>C'est good</Text>
                  
                </>
              }
            </>
          )}
        </View>
      ) : (
          <ActivityIndicator size="large" color="#DA4167" style={gs.loading} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    textAlign: "center"
  }
});

export default MyWeekList;