import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CustomButton from '../../globals/components/CustomButton';

const gs = require ('../../globals/styles/GlobalStyle');

const ForgotPasswordConfirm = () => {
  const navigation = useNavigation();

  const onReturnToSignInPress = () => {
    navigation.navigate("SignIn");
  }

  return (
    <View style={gs.container}>
      <Text style={gs.title}>Réinitialisation de mot de passe</Text>

      <Text style={[styles.text, gs.text]}>Votre demande de réinitialisation a bien été effectuée ! Nous vous invitons à vous rendre sur votre adresse mail afin de cliquer sur le lien qui vous a été envoyé afin de réinitialiser votre mot de passe.</Text>

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

export default ForgotPasswordConfirm;