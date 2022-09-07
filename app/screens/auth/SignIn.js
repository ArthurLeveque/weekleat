import React from 'react';
import { StyleSheet, View, ScrollView, Alert, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

import CustomInput from '../../globals/components/CustomInput';
import CustomButton from '../../globals/components/CustomButton';
import { auth } from '../../../firebase';

const gs = require ('../../globals/styles/GlobalStyle');

const SignIn = () => {
  const navigation = useNavigation();
  const {control, handleSubmit} = useForm();

  const onSignInPress = (data) => {
    auth
    .signInWithEmailAndPassword(data.email, data.password)
    .catch(error => {
      console.log(error.code)
      if(error.code == "auth/user-not-found" || error.code == "auth/wrong-password") {
        Alert.alert(
          "Quelque chose s'est mal passé...",
          "Les identifiants sont incorrects.",
          [
            {
              text: "Ok"
            }
          ]
        );
      } else {
        Alert.alert(
          "Quelque chose s'est mal passé...",
          "Il y a un problème avec votre connexion ou nos serveurs, veuillez réessayer plus tard.",
          [
            {
              text: "Ok"
            }
          ]
        );
      }
    })
  }

  const onForgotPasswordPress = () => {
    navigation.navigate("ForgotPassword");
  }

  const onSignUpPress = () => {
    navigation.navigate("SignUp");
  }

  return (
    <ScrollView>
      <View style={[gs.container, {paddingTop: 50}]}>
        <View style={{alignItems: "center"}}>
          <Image style={styles.logo} source={require('../../../assets/logo-weekleat.png')} />
          <Text style={styles.title}>Weekleat</Text>
        </View>

        <CustomInput 
          name="email"
          placeholder="Adresse e-mail"
          control={control}
          rules={{required: true}}
          showError = {false}
        />

        <CustomInput 
          name="password"
          placeholder="Mot de passe"
          hidden
          control={control}
          rules={{required: true}}
          showError = {false}
        />

        <CustomButton 
          label="Se connecter"
          onPress={handleSubmit(onSignInPress)}
          type="primary"
        />

        <CustomButton 
          label="Mot de passe oublié ?"
          onPress={onForgotPasswordPress}
          type="tertiary"
        />

        <CustomButton 
          label="S'inscrire"
          onPress={onSignUpPress}
          type="secondary"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    color: "#DA4167",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30
  },
  logo: {
    width: "70%",
    maxWidth: 160,
    height: 100,
    marginBottom: -10
  }
});

export default SignIn;