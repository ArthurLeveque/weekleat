import React from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';


const CustomInputWithLabel = ({value, setValue, label, hidden}) => {
  return ( 
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
      <TextInput 
        value={value}
        onChangeText={setValue}
        style={styles.input}
        secureTextEntry={hidden}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8
  },
  input: {
    backgroundColor: "white",
    width: "100%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 5
  },
  text: {
    color: "#0B090A",
    fontWeight: "bold"
  }
});

export default CustomInputWithLabel;