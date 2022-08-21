import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';


const CustomButton = ({onPress, label, type, disabled = false}) => {
  return ( 
    <TouchableOpacity style={[styles.button, styles[`button_${type}`]]} onPress={onPress} disabled={disabled}>
      <Text style={[styles.text, styles[`text_${type}`]]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 5,
    padding: 15,
    marginVertical: 5,
    alignItems: "center"
  },
  button_primary: {
    backgroundColor: "#DA4167"
  },
  button_secondary: {
    borderWidth: 2,
    borderColor: "#DA4167"
  },
  text: {
    fontWeight: "bold"
  },
  text_primary: {
    color: "white",
  },
  text_secondary: {
    color: "#221C1F"
  },
  text_tertiary: {
    color: "#221C1F"
  },
});

export default CustomButton;