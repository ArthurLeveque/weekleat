import React, {useState} from 'react';
import { StyleSheet, View, Text } from 'react-native';

import CustomButton from '../../globals/components/CustomButton';
import CustomInput from '../../globals/components/CustomInput';

const gs = require ('../../globals/styles/GlobalStyle');

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const onSendResetPasswordPress = () => {
    // TODO
  }

  const onReturnToSignInPress = () => {
    // TODO
  }

  return (
    <View style={gs.container}>
      <View style={gs.alignCenter}>
        <Text style={gs.title}>Mot de passe oublié</Text>
      </View>

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