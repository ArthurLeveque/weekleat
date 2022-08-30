import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CustomButton from '../../globals/components/CustomButton';

const gs = require ('../../globals/styles/GlobalStyle');

const PrivacyPolicy = () => {
  const navigation = useNavigation();

  return (
    <View style={gs.container}>
      <Text style={gs.title}>Politique de confidentialité</Text>

      <Text style={[styles.text, gs.text]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque et condimentum lacus. Morbi condimentum dapibus mauris, bibendum placerat orci semper semper. Etiam vestibulum mollis elit. Curabitur sagittis justo eu arcu eleifend, consectetur varius nulla egestas. Mauris eu tempus nisl. Fusce non turpis ut purus scelerisque viverra. Duis aliquet, lacus efficitur finibus laoreet, felis ante aliquet magna, nec viverra ipsum sem ultricies nisi. Ut malesuada orci ut eleifend rutrum. Nam mollis justo orci, mollis venenatis enim vestibulum non. Quisque accumsan rutrum ultrices. Vestibulum nulla nisi, porta a sollicitudin eget, laoreet id sem. Donec a lorem quis quam convallis aliquet. Maecenas suscipit laoreet mauris, ut tempor purus. Donec sed auctor sem, non placerat lacus. Duis suscipit, est in laoreet laoreet, erat arcu posuere justo, vel laoreet erat enim et lorem.</Text>

      <CustomButton 
        label="Retourner à l'inscription'"
        onPress={() => navigation.navigate("SignUp")}
        type="primary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    marginBottom: 30
  }
});

export default PrivacyPolicy;