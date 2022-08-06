import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

import CustomInput from '../../globals/components/CustomInput';
import CustomButton from '../../globals/components/CustomButton';

const gs = require ('../../globals/styles/GlobalStyle');

const SignIn = () => {
  const navigation = useNavigation();
  const {control, handleSubmit} = useForm();

  const onSignInPress = (data) => {
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

});

export default SignIn;