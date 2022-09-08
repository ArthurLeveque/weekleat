import React, {useState} from 'react';
import { View, ScrollView, Text, Alert, ActivityIndicator } from 'react-native';
import { useForm } from 'react-hook-form';

import CustomInputWithLabel from '../../globals/components/CustomInputWithLabel';
import CustomButton from '../../globals/components/CustomButton';
import { auth, firebase } from '../../../firebase';

const gs = require ('../../globals/styles/GlobalStyle');

const ChangePassword = ({navigation}) => {
  const {control, handleSubmit, watch} = useForm();
  const passwordValue = watch("newPassword");

  const [loading, setLoading] = useState(false);

  const OnChangePasswordPress = async (data) => {
    setLoading(true);
    let user = auth.currentUser;
    let cred = firebase.auth.EmailAuthProvider.credential(user.email, data.password);
    // reauthenticateWithCredential to avoid problems if user is connected for too long (according to firebase's doc)
    await user.reauthenticateWithCredential(cred)
    .then(async () => {
      user.updatePassword(data.newPassword)
      .then(() => {
        setLoading(false);
        navigation.navigate("IndexOptions");
      }).catch((e) => { 
        console.log(e);
        Alert.alert(
          "Quelque chose s'est mal passé...",
          "Il y a un problème avec votre connexion ou nos serveurs, veuillez réessayer plus tard.",
          [
            {
              text: "Ok"
            }
          ]
        );
        setLoading(false);
      });
    })
    .catch((e) => {
      console.log(e.code)
      if(e.code == "auth/wrong-password") {
        Alert.alert(
          "Quelque chose s'est mal passé...",
          "Le mot de passe renseigné n'est pas le bon.",
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
      setLoading(false);
    })
  }

  return (
    <ScrollView>
      {!loading ? (
        <View style={gs.container}>
          <Text style={gs.title}>Changer mon mot de passe</Text>

          <CustomInputWithLabel
            name="password"
            label="Votre mot de passe actuel *"
            hidden
            control={control}
            rules={{
              required: "Ce champ est obligatoire"
            }}
          />

          <CustomInputWithLabel
            name="newPassword"
            label="Votre nouveau mot de passe *"
            hidden
            control={control}
            rules={{
              required: "Ce champ est obligatoire",
              minLength: {value: 5, message: "Le mot de passe doit faire 5 caractères minimum"},
            }}
          />

          <CustomInputWithLabel
            name="confirmNewPassword"
            label="Confirmer votre nouveau mot de passe *"
            hidden
            control={control}
            rules={{
              required: "Ce champ est obligatoire",
              validate: value => value === passwordValue || "Ce champ doit être identique au nouveau mot de passe"
            }}
          />

          <CustomButton 
            label="Confirmer"
            onPress={handleSubmit(OnChangePasswordPress)}
            type="primary"
            disabled={loading}
          />

          <CustomButton 
            label="Annuler"
            onPress={() => navigation.navigate("IndexOptions")}
            type="tertiary"
          />
        </View>
      ) : (
        <ActivityIndicator size="large" color="#DA4167" style={gs.loading} />
      )}
    </ScrollView>
  );
}

export default ChangePassword;