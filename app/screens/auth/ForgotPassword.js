import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

import CustomButton from '../../globals/components/CustomButton';
import CustomInput from '../../globals/components/CustomInput';

const gs = require ('../../globals/styles/GlobalStyle');

const EMAIL_REGEX = /^([a-z0-9])(([\-.]|[_]+)?([a-z0-9]+))*(@)([a-z0-9])((([-]+)?([a-z0-9]+))?)*((.[a-z]{2,3})?(.[a-z]{2,6}))$/i;

const ForgotPassword = () => {
  const navigation = useNavigation();
  const {control, handleSubmit} = useForm();

  const onSendResetPasswordPress = (data) => {
    // TODO
    navigation.navigate("ForgotPasswordConfirm");
  }

  const onReturnToSignInPress = () => {
    navigation.navigate("SignIn");
  }

  return (
    <View style={gs.container}>
      <Text style={gs.title}>Mot de passe oublié</Text>

      <Text style={gs.text}>Veuillez rentrer votre adresse mail afin de réinitialiser votre mot de passe.</Text>

      <CustomInput 
        name="email"
        placeholder="Adresse e-mail"
        control={control}
        rules={{
          required: "Ce champ est obligatoire",
          pattern: {value: EMAIL_REGEX, message: "L'adresse mail est invalide"}
        }}
      />

      <CustomButton 
        label="Envoyer"
        onPress={handleSubmit(onSendResetPasswordPress)}
        type="primary"
      />

      <CustomButton 
        label="Retour à la connexion"
        onPress={onReturnToSignInPress}
        type="tertiary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  
});

export default ForgotPassword;