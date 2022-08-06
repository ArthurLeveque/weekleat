import React from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import { Controller } from 'react-hook-form';

const CustomInputWithLabel = ({control, name, rules = {}, label, hidden, showError = true}) => {
  return ( 
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
          <>
            <TextInput 
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={[styles.input, {borderColor: error ? "red" : "#e8e8e8"}]}
              secureTextEntry={hidden}
            />
            {error && showError &&
              <Text style={styles.errorText}>{error.message || ""}</Text>
            }
          </>
        )}
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
  },
  errorText: {
    color: "red",
    alignSelf: "stretch"
  }
});

export default CustomInputWithLabel;