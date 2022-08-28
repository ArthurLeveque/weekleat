import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { StripeProvider, CardField, useConfirmPayment, createPaymentMethod } from '@stripe/stripe-react-native';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const gs = require ('../../globals/styles/GlobalStyle');
import { StripePublishableKey } from '../../../StripeConfig';
import CustomButton from '../../globals/components/CustomButton';
import CustomInputWithLabel from '../../globals/components/CustomInputWithLabel';
import { auth } from '../../../firebase';
import { apiUrl } from '../../../apiConfig';

const PremiumPayment = ({navigation}) => {
  const [publishableKey, setPublishableKey] = useState("");
  const [cardDetails, setCardDetails] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { confirmPayment, loading } = useConfirmPayment();
  const {control, handleSubmit} = useForm();

  const init = () => {
    setPublishableKey(StripePublishableKey);
  }

  const onSubmitPress = async (formData) => {
    if(!cardDetails?.complete) {
      setErrorMessage("Veuillez remplir tous les champs.");
    } else {
      setIsLoading(true);
      setErrorMessage("");

      const billingDetails = {
        email: auth.currentUser?.email,
        name: formData.name
      }
      // Start the payment
      const result = await createPaymentMethod({
        type: "Card",
        billingDetails: billingDetails,
        card: cardDetails
      });

      // get user token for authentificated API route
      const authToken = await auth.currentUser.getIdTokenResult();
      const headers = {headers: {"auth-token": authToken.token}};
      // Call this route to find/create the customer and create the subscription
      const res = await axios.post(`${apiUrl}/subscriptions`, {"payment_method": result.paymentMethod.id, "name": formData.name}, headers);
      // Confirm the payment
      await confirmPayment(res.data.clientSecret, {
        type: "Card",
        billingDetails: billingDetails
      })
      .then(() => {
        navigation.navigate("Home");
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
      });

      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      init();
    }
    return () => {
      isMounted = false;
    };
  })

  return (
    <StripeProvider publishableKey={publishableKey}>
      <ScrollView>
        <View style={gs.container}>
          <CustomInputWithLabel
              name="name"
              label="Votre nom et prénom *"
              control={control}
              rules={{required: "Ce champ est obligatoire"}}
          />

          <CardField
            postalCodeEnabled={true}
            onCardChange={(cardDetails) => {
              setErrorMessage("");
              setCardDetails(cardDetails);
            }}
            style={styles.cardForm}
          />

          <Text style={styles.errorMessage}>{errorMessage}</Text>

          <CustomButton 
            label="Confirmer"
            onPress={handleSubmit(onSubmitPress)}
            type="primary"
            disabled={isLoading}
          />

          {isLoading && 
            <ActivityIndicator size="large" color="#DA4167"/>
          }
        </View>
      </ScrollView>
    </StripeProvider>
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
  cardForm: {
    width: "100%",
    height: 50,
  },
  errorMessage: {
    color: "red",
    marginVertical: 5
  }
});

export default PremiumPayment;