import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

import CustomInputWithLabel from '../../globals/components/CustomInputWithLabel';
import CustomButton from '../../globals/components/CustomButton';
import { auth } from '../../../firebase';


const gs = require ('../../globals/styles/GlobalStyle');

const EMAIL_REGEX = /^([a-z0-9])(([\-.]|[_]+)?([a-z0-9]+))*(@)([a-z0-9])((([-]+)?([a-z0-9]+))?)*((.[a-z]{2,3})?(.[a-z]{2,6}))$/i;

const SignUp = () => {
  const navigation = useNavigation();
  const {control, handleSubmit, watch} = useForm();
  const passwordValue = watch("password");

  const onSignUpPress = (data) => {
    auth
    .createUserWithEmailAndPassword(data.email, data.password)
    .catch(error => alert(error.message))
  }

  const onTermsOfUsePress = () => {
    // TODO
  }
  
  const onPrivacyPolicyPress = () => {
    // TODO
  }

  const onReturnToSignInPress = () => {
    navigation.navigate("SignIn");
  }

  return (
    <ScrollView>
      <View style={[gs.container, styles.container]}>
        <Text style={gs.title}>Inscription</Text>
        
        <CustomInputWithLabel
           name="email"
           label="Adresse e-mail *"
           control={control}
           rules={{
            required: "Ce champ est obligatoire",
            pattern: {value: EMAIL_REGEX, message: "L'adresse mail est invalide"}
          }}
        />

        <CustomInputWithLabel
           name="password"
           label="Mot de passe *"
           hidden
           control={control}
           rules={{
            required: "Ce champ est obligatoire", 
            minLength: {value: 5, message: "Le mot de passe doit faire 5 caractères minimum"}
          }}
        />

        <CustomInputWithLabel
           name="confirmPassword"
           label="Confirmer votre mot de passe *"
           hidden
           control={control}
           rules={{
            required: "Ce champ est obligatoire",
            validate: value => value === passwordValue || "Ce champ doit être identique au mot de passe"
          }}
        />

        <CustomButton 
          label="S'inscrire"
          onPress={handleSubmit(onSignUpPress)}
          type="primary"
        />

        <Text style={styles.privacy}>En vous inscrivant, vous confirmez avoir lu, compris et accepter les <Text style={styles.link} onPress={onTermsOfUsePress}>Conditions d'utilisation</Text> et la <Text style={styles.link} onPress={onPrivacyPolicyPress}>Politique de confidentialité</Text></Text>

        <CustomButton 
          label="Retour à la connexion"
          onPress={onReturnToSignInPress}
          type="tertiary"
        />
      </View>
    </ScrollView>
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
  privacy: {
    color: "#0B090A",
    marginVertical: 10
  },
  link: {
    color: "#437C90"
  }
});

export default SignUp;