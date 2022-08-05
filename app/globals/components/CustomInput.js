import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';


const CustomInput = ({value, setValue, placeholder, hidden}) => {
  return ( 
    <View style={styles.container}>
      <TextInput 
        value={value}
        onChangeText={setValue}
        placeholder={placeholder} 
        style={styles.input} 
        secureTextEntry={hidden}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginVertical: 8
  }
});

export default CustomInput;