import React, {useState} from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CustomInputWithLabel from '../../globals/components/CustomInputWithLabel';
import CustomButton from '../../globals/components/CustomButton';

const gs = require ('../../globals/styles/GlobalStyle');

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigation = useNavigation();

  const onSignUpPress = () => {
    // TODO
    navigation.navigate("SignUpConfirm");
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
           value={email}
           setValue={setEmail}
           label="Adresse e-mail"
        />

        <CustomInputWithLabel
           value={password}
           setValue={setPassword}
           label="Mot de passe"
           hidden={true}
        />

        <CustomInputWithLabel
           value={confirmPassword}
           setValue={setConfirmPassword}
           label="Confirmer votre mot de passe"
           hidden={true}
        />

        <CustomButton 
          label="S'inscrire"
          onPress={onSignUpPress}
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