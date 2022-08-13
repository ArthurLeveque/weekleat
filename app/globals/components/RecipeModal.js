import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import Modal from "react-native-modal";
import { Entypo } from '@expo/vector-icons';

const gs = require ('../../globals/styles/GlobalStyle');

const RecipeModal = ({showModal = false, onHidePress, data}) => {
  return ( 
    <Modal isVisible={showModal} onBackdropPress={onHidePress} propagateSwipe >
      <View style={styles.container}>
        
        <TouchableOpacity style={styles.closeBtn} onPress={onHidePress}>
          <Entypo name="cross" size={30} color="#DA4167" />
        </TouchableOpacity>

        <ScrollView>
          <Text style={gs.title}>{data.name}</Text>

          {data.image && 
            <Image style={styles.image} source={{uri: data.image.imageURL}}  />
          }

          {data.summary &&
            <Text style={[gs.text, styles.summary]}>{data.summary}</Text>
          }
          
          <Text style={gs.secondaryTitle}>Ingrédients</Text>

          {data.ingredients?.map((ingredient, key) => {
            return(
              <View key={key} style={styles.ingredientItem}>
                <Text style={gs.text}>{ingredient.quantity}{ingredient.mesurement === "unit" ? "" : " " + ingredient.mesurement} {ingredient.ingredientName}</Text>
              </View>
            )
          })}

          <Text style={gs.secondaryTitle}>Étapes de la recette</Text>

          {data.steps &&
            <Text style={[gs.text, styles.stepsText]}>{data.steps}</Text>
          }

        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    flex:1
  },
  closeBtn: {
    position: "absolute",
    right: 5,
    top: 10,
    zIndex: 1,
    elevation: 1,
  },
  image: {
    height: 200
  },
  summary: {
    marginTop: 10
  },
  ingredientItem: {
    marginVertical: 3
  },
  stepsText: {
    alignItems: "center",
    textAlign: "center"
  }
});

export default RecipeModal;