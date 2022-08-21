import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Controller } from 'react-hook-form';
import Checkbox from 'expo-checkbox';

const CustomCheckbox = ({control, name, rules = {}, label, showError = true}) => {
  return ( 
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
          <>
            <Checkbox
              disabled={false}
              value={value}
              onValueChange={onChange}
              onBlur={onBlur}
              color={value ? "#DA4167" : false}
            />
            {error && showError &&
              <Text style={styles.errorText}>{error.message || ""}</Text>
            }
          </>
        )}
      />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
    flexDirection: "row"
  },
  text: {
    color: "#0B090A",
    fontWeight: "bold",
    marginLeft: 8
  },
  errorText: {
    color: "red",
    alignSelf: "stretch"
  }
});

export default CustomCheckbox;