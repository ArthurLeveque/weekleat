import React from 'react';
import { View, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

import CustomButton from '../../globals/components/CustomButton';
import CustomInput from '../../globals/components/CustomInput';
import { auth } from '../../../firebase';

const gs = require ('../../globals/styles/GlobalStyle');

const EMAIL_REGEX = /^([a-z0-9])(([\-.]|[_]+)?([a-z0-9]+))*(@)([a-z0-9])((([-]+)?([a-z0-9]+))?)*((.[a-z]{2,3})?(.[a-z]{2,6}))$/i;

const ForgotPassword = () => {
  const navigation = useNavigation();
  const {control, handleSubmit} = useForm();

  const onSendResetPasswordPress = async (data) => {
    await auth.sendPasswordResetEmail(data.email)
    .then(() => navigation.navigate("ForgotPasswordConfirm"))
    .catch((e) => {
      console.log(e.code)
      if(e.code == "auth/user-not-found") {
        Alert.alert(
          "Quelque chose s'est mal passé...",
          "L'adresse renseignée ne correspond à aucun compte.",
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

export default ForgotPassword;