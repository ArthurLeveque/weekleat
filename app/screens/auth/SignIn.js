import React, {useState} from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CustomInput from '../../globals/components/CustomInput';
import CustomButton from '../../globals/components/CustomButton';

const gs = require ('../../globals/styles/GlobalStyle');

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const onSignInPress = () => {
    // TODO
  }

  const onForgotPasswordPress = () => {
    navigation.navigate("ForgotPassword");
  }

  const onSignUpPress = () => {
    navigation.navigate("SignUp");
  }

  return (
    <ScrollView>
      <View style={gs.container}>
        <CustomInput 
          value={username}
          setValue={setUsername}
          placeholder="Adresse e-mail"
        />

        <CustomInput 
          value={password}
          setValue={setPassword}
          placeholder="Mot de passe"
          hidden={true}
        />

        <CustomButton 
          label="Se connecter"
          onPress={onSignInPress}
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

});

export default SignIn;