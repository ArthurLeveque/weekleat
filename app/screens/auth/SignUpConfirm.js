import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CustomButton from '../../globals/components/CustomButton';

const gs = require ('../../globals/styles/GlobalStyle');

const SignUpConfirm = () => {
  const navigation = useNavigation();

  const onReturnToSignInPress = () => {
    navigation.navigate("SignIn");
  }

  return (
    <View style={gs.container}>
      <Text style={gs.title}>Bienvenue sur Weekleat !</Text>

      <Text style={[styles.text, gs.text]}>Votre compte a bien été crée ! Cependant avant de pouvoir vous connecter, vous devez confirmer votre inscription en cliquant sur le lien envoyé à l'adresse mail que vous avez renseigné.</Text>

      <CustomButton 
        label="Retourner à la connexion"
        onPress={onReturnToSignInPress}
        type="primary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  title: {
    fontSize: 30,
    color: "#DA4167",
    fontWeight: "bold",
    alignItems: "center",
    marginVertical: 30
  },
  text: {
    marginBottom: 30
  }
});

export default SignUpConfirm;