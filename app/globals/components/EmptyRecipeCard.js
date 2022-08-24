import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const EmptyRecipeCard = ({onPress, label, type, disabled = false}) => {
  return ( 
    <View style={styles.card}>
      <MaterialCommunityIcons name="silverware-fork-knife" size={40} color="#FBFBFB" style={styles.icons} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginVertical: 5,
    minHeight: 105,
    maxHeight: 105,
    backgroundColor: "#DA4167",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default EmptyRecipeCard;