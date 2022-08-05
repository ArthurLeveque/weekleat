import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import CustomButton from '../../globals/components/CustomButton';

const gs = require ('../../globals/styles/GlobalStyle');

const SignUpConfirm = () => {
  const onReturnToSignInPress = () => {
    // TODO
  }

  return (
    <View style={gs.container}>
      <View style={gs.alignCenter}>
        <Text style={gs.title}>Bienvenue sur Weekleat !</Text>
      </View>

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
    color: "#0B090A",
    marginBottom: 30
  }
});

export default SignUpConfirm;