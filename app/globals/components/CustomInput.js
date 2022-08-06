import React from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import { Controller } from 'react-hook-form';

const CustomInput = ({control, name, rules = {}, placeholder, hidden, showError = true}) => {
  return ( 
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
        <>
          <View style={[styles.container, {borderColor: error ? "red" : "#e8e8e8"}]}>
            <TextInput 
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder} 
              style={styles.input}
              secureTextEntry={hidden}
            />
          </View>
          {error && showError &&
            <Text style={styles.errorText}>{error.message || ""}</Text>
          }
      </>
    )}
    />
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
  },
  errorText: {
    color: "red",
    alignSelf: "stretch"
  }
});

export default CustomInput;