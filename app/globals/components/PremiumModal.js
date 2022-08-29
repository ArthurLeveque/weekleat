import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import Modal from "react-native-modal";
import { useNavigation } from '@react-navigation/native';

const gs = require ('../../globals/styles/GlobalStyle');
import CustomButton from './CustomButton';

const PremiumModal = ({showModalPremium = false, onHidePremiumPress}) => {
  const mounted = useRef(false);
  const navigation = useNavigation();

  useEffect(() => {
      mounted.current = true;

      return () => {
        mounted.current = false;
      };
  }, []);

  return ( 
    <Modal isVisible={showModalPremium} onBackdropPress={onHidePremiumPress}>
      <View style={styles.container}>
        
        <Text style={{textAlign: "center", fontWeight: "bold"}}>Hop là ! Vous essayez d'accéder à une fonctionnalité premium !</Text>
        <Text style={{textAlign: "center", marginVertical: 10}}>Pour relancer une recette, ajouter votre recette ou ajouter une de vos recettes favorites, vous devez être un membre Weekleat Premium.</Text>

        <CustomButton 
          label="En savoir plus"
          onPress={() => {
            onHidePremiumPress();
            navigation.navigate("Premium", {screen: "PremiumPresentation"});
          }}
          type="primary"
        />
        <CustomButton 
          label="Fermer"
          onPress={onHidePremiumPress}
          type="secondary"
        />

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5
  }
});

export default PremiumModal;