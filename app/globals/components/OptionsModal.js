import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import Modal from "react-native-modal";
import { useNavigation } from '@react-navigation/native';

const OptionsModal = ({showModalOptions = false, onHideOptionsPress, data, id, onDeleteConfirm}) => {
  const mounted = useRef(false);
  const navigation = useNavigation();

  useEffect(() => {
      mounted.current = true;

      return () => {
        mounted.current = false;
      };
  }, []);

  const onDeletePress = () => {
    Alert.alert(
      "Suppression",
      `Voulez-vous vraiment supprimer la recette ${data.name} ?`,
      [
        { text: "Annuler" },
        { text: "Oui", onPress: () => onDeleteConfirm(id, data) }
      ]
    );
  }

  const onEditPress = () => {
    onHideOptionsPress();
    navigation.navigate('EditRecipe', {data: data, recipeId: id});
  }

  return ( 
    <Modal isVisible={showModalOptions} onBackdropPress={onHideOptionsPress} propagateSwipe >
      <View style={styles.container}>
        
        <TouchableOpacity onPress={onEditPress}>
          <Text style={[styles.text, styles.bold, styles.update]}>Modifier</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDeletePress}>
          <Text style={[styles.text, styles.bold, styles.delete]}>Supprimer</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onHideOptionsPress}>
          <Text style={[styles.text, styles.cancel]}>Annuler</Text>
        </TouchableOpacity>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    alignItems: "center"
  },
  text: {
    fontSize: 20,
    marginVertical: 10
  },
  bold: {
    fontWeight: "bold"
  },
  update: {
    color: "#437C90"
  },
  delete: {
    color: "red"
  },
  cancel: {
    marginTop: 30
  }
});

export default OptionsModal;