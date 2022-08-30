import React from 'react';
import { View, ScrollView } from 'react-native';

import CustomButton from '../../globals/components/CustomButton';

const gs = require ('../../globals/styles/GlobalStyle');

const IndexOptions = ({navigation}) => {

  return (
    <ScrollView>
      <View style={[gs.container, {paddingTop: 50}]}>
        <CustomButton 
          label="Changer mon mot de passe"
          onPress={() => navigation.navigate("ChangePassword")}
          type="primary"
        />

        <CustomButton 
          label="Supprimer mon compte"
          onPress={() => navigation.navigate("DeleteAccount")}
          type="primary"
        />
      </View>
    </ScrollView>
  );
}

export default IndexOptions;