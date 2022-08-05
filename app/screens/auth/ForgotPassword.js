import React, {useState} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CustomButton from '../../globals/components/CustomButton';
import CustomInput from '../../globals/components/CustomInput';

const gs = require ('../../globals/styles/GlobalStyle');

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const navigation = useNavigation();

  const onSendResetPasswordPress = () => {
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
           value={email}
           setValue={setEmail}
           placeholder="Adresse e-mail"
        />

      <CustomButton 
        label="Envoyer"
        onPress={onSendResetPasswordPress}
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