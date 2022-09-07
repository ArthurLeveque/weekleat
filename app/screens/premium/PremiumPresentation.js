import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const gs = require ('../../globals/styles/GlobalStyle');
import CustomButton from '../../globals/components/CustomButton';
import { auth } from '../../../firebase';
import { apiUrl } from '../../../apiConfig';

const PremiumPresentation = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [subscriptionDatas, setSubscriptionDatas] = useState();
  const [dateStart, setDateStart] = useState();
  const [dateEnd, setDateEnd] = useState();
  const [status, setStatus] = useState();

  const checkUserSubscription = async () => {
    setLoading(true);
    // get user token for authentificated API route
    const authToken = await auth.currentUser.getIdTokenResult();
    const headers = {headers: {"auth-token": authToken.token}};
    // If user is subscribed, show his subscription infos
    await axios.get(`${apiUrl}/subscriptions/isSubscribed`, headers)
    .then((response) => {
      if(response) {
        setSubscriptionDatas(response.data);
        if(response.data && response.data !== false) {
          const dataDateStart = new Date(response.data.current_period_start * 1000);
          const dayStart = dataDateStart.getDate();
          const monthStart = dataDateStart.getMonth() + 1;
          const yearStart = dataDateStart.getFullYear();
          setDateStart(`${dayStart}/${monthStart}/${yearStart}`);

          const dataDateEnd = new Date(response.data.current_period_end * 1000);
          const dayEnd = dataDateEnd.getDate();
          const monthEnd = dataDateEnd.getMonth() + 1;
          const yearEnd = dataDateEnd.getFullYear();
          setDateEnd(`${dayEnd}/${monthEnd}/${yearEnd}`);

          setStatus(response.data.status);
        }
      }
      setLoading(false);
    })
    .catch((e) => {
      console.log(e)
      setLoading(false);
    }) 
  }

  const onCancelSubPress = () => {
    Alert.alert(
      "Annuler l'abonnement",
      "Voulez-vous vraiment annuler votre abonnement ? Cela annulera le renouvellement automatique de celui-ci. Vous pourrez toujours profiter de vos avantages jusqu'à la fin de votre abonnement.",
      [
        {
          text: "Annuler"
        },
        { text: "Oui", onPress: async() => {
          setLoading(true);
           // get user token for authentificated API route
          const authToken = await auth.currentUser.getIdTokenResult();
          const headers = {headers: {"auth-token": authToken.token}};
          await axios.post(`${apiUrl}/subscriptions/cancel`, {"subscriptionID": subscriptionDatas?.id}, headers)
          .then((response) => {
            setStatus(response.data.status);
            setLoading(false);
          })
          .catch((e) => {
            console.log(e);
            Alert.alert(
              "Quelque chose s'est mal passé...",
              "Une erreur est survenue, veuillez réessayer plus tard.",
              [
                {
                  text: "Ok"
                }
              ]
            );
          })
        }}
      ]
    );
  }

  useEffect(() => {
    let isMounted = true;
    if(isMounted){
      navigation.addListener('focus', async () => {
        await checkUserSubscription();
      });
    }
    return () => {
      isMounted = false;
    };
  }, [navigation]);

  return (
    <>
    {!loading ? (
    <ScrollView>
      <View style={gs.container}>
        {subscriptionDatas === false || !subscriptionDatas ? (
        <>
          <Text style={gs.title}>Qu'est-ce que c'est ?</Text>

          <Text style={styles.text}>Envie de plus de liberté pour votre weekliste ? Abonnez-vous à <Text style={{fontWeight: "bold"}}>Weekleat premium</Text> ! Pour 3,99€ par mois vous pouvez :</Text>

          <View style={styles.funcContainer}>
            <Entypo name="add-to-list" color="#DA4167" size={50} />
            <Text style={styles.funcText}>Ajouter vos propres recettes ou vos recettes favorites à la place de celles que vous n'aimez pas ou dont vous êtes allergique</Text>
          </View>

          <View style={styles.funcContainer}>
            <Ionicons name="reload" color="#DA4167" size={50} />
            <Text style={styles.funcText}>Envie de plus de folie ? Vous pouvez remplacer aléatoirement une des recettes proposées par ce qui sera peut-être votre prochaine recette favorite</Text>
          </View>

          <CustomButton 
            label="S'abonner"
            onPress={() => navigation.navigate("PremiumPayment")}
            type="primary"
          />
        </>
        ) : (
          <>
            <Text style={gs.title}>Votre abonnement</Text>

            <Text style={[gs.text, styles.textInfos]}><Text style={{fontWeight: "bold"}}>Début de votre abonnement :</Text> {dateStart}</Text>
            <Text style={[gs.text, styles.textInfos]}><Text style={{fontWeight: "bold"}}>Fin de votre abonnement :</Text> {dateEnd}</Text>
            <Text style={[gs.text, styles.textInfos]}><Text style={{fontWeight: "bold"}}>Renouvellement automatique :</Text> {status === "active" ? "oui" : "non"}</Text>

            {status === "active" &&
              <CustomButton 
                label="Annuler mon abonnement"
                onPress={onCancelSubPress}
                type="secondary"
              />
            }
            
          </>
        )}
      </View>
    </ScrollView>
    ) : (
      <ActivityIndicator size="large" color="#DA4167" style={gs.loading} />
    )}
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: "center"
  },
  funcContainer: {
    alignItems: 'center',
    justifyContent: "center",
    padding: 20,
    borderRadius: 5,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgb(227, 227, 227)",
    marginVertical: 15
  },
  funcText: {
    textAlign: "center",
    marginTop: 10
  },
  textInfos: {
    marginVertical: 5
  }
});

export default PremiumPresentation;