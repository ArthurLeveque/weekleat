import React, {useState} from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';

const gs = require ('../../globals/styles/GlobalStyle');
import CustomButton from '../../globals/components/CustomButton';

const PremiumPresentation = ({navigation}) => {

  return (
    <ScrollView>
      <View style={gs.container}>
        <Text style={gs.title}>Qu'est-ce que c'est ?</Text>

        <Text style={styles.text}>Envie de plus de liberté pour votre weekliste ? Abonnez-vous à <Text style={{fontWeight: "bold"}}>Weekleat premium</Text> ! Pour 3,99€ par mois vous pouvez :</Text>

        <View style={styles.funcContainer}>
          <Entypo name="add-to-list" color="#DA4167" size={50} />
          <Text style={styles.funcText}>Ajouter vos propres recettes ou vos recettes favorites à la place de celles que vous n'aimez pas ou dont vous êtes allergique</Text>
        </View>

        <View style={styles.funcContainer}>
          <Ionicons name="reload" color="#DA4167" size={50} />
          <Text style={styles.funcText}>Envie de plus de folie ? Vous pouvez remplacer aléatoirement une des recettes proposées par ce qui sera peut-être votre prochaine recette favorite</Text>
        </View>

        <CustomButton 
          label="S'abonner"
          onPress={() => navigation.navigate("PremiumPayment")}
          type="primary"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: "center"
  },
  funcContainer: {
    alignItems: 'center',
    justifyContent: "center",
    padding: 20,
    borderRadius: 5,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgb(227, 227, 227)",
    marginVertical: 15
  },
  funcText: {
    textAlign: "center",
    marginTop: 10
  }
});

export default PremiumPresentation;