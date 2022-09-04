import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import CustomButton from './CustomButton';

const IngredientsInputRepeater = ({setIngredients, ingredients}) => {

  const addHandler = () => {
    const addinputs = [...ingredients];
    addinputs.push({ key: '', ingredientName: '', mesurement: 'unit', quantity: '' });
    setIngredients(addinputs)
  };
  const deleteHandler = (key) => {
    const _inputs = ingredients.filter((input, index) => index != key);
    setIngredients(_inputs)
  };
  const ingredientHandler = (text, key) => {
    const _inputs = [...ingredients];
    _inputs[key].ingredientName = text;
    _inputs[key].key = key;
    setIngredients(_inputs)
  };
  const quantityHandler = (text, key) => {
    const _inputs = [...ingredients];
    _inputs[key].quantity = text;
    _inputs[key].key = key;
    setIngredients(_inputs)
  };
  const mesurementHandler = (text, key) => {
    const _inputs = [...ingredients];
    _inputs[key].mesurement = text;
    _inputs[key].key = key;
    setIngredients(_inputs)
  };

  return (
    <View style={styles.container}>
        <View>
          {ingredients.map((input, key) => (
            <View key={key} style={styles.singleIngredient}>
              <View style={styles.line}>
                <TextInput
                  style={styles.inputQuantity}
                  value={input.quantity}
                  placeholder="Quantité"
                  onChangeText={(text) => quantityHandler(text, key)}
                  keyboardType="numeric"
                  maxLength={10}
                />
                <View style={styles.inputPicker}>
                <Picker  selectedValue={input.mesurement} onValueChange={(text) => mesurementHandler(text, key)} itemStyle={{fontWeight: "bold"}}>
                  <Picker.Item label="Unité" value="unit" />
                  <Picker.Item label="Cuillères à soupe" value="cuillère(s) à soupe" />
                  <Picker.Item label="Grammes" value="gr" />
                  <Picker.Item label="Kilogrammes" value="kg" />
                  <Picker.Item label="Centilitres" value="cl" />
                  <Picker.Item label="Litres" value="L" />
                </Picker>
                </View>
                
              </View>
              <View style={styles.line}>
                <TextInput
                  style={styles.input}
                  placeholder="Nom de l'ingrédient"
                  value={input.ingredientName}
                  onChangeText={(text) => ingredientHandler(text, key)}
                />

                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteHandler(key)}>
                  <Text style={styles.deleteButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <CustomButton 
            label="Ajouter un ingrédient"
            onPress={addHandler}
            type="primary"
          />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  singleIngredient: {
    borderTopWidth: 2,
    borderColor: "#e8e8e8",
    paddingTop: 8
  },
  input: {
    backgroundColor: "white",
    width: "86%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginVertical: 8
  },
  inputQuantity: {
    backgroundColor: "white",
    width: "49%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16
  },
  inputPicker: {
    backgroundColor: "white",
    width: "49%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  deleteButton: {
    borderWidth: 2,
    borderColor: "#DA4167",
    padding: 5,
    borderRadius: 100,
    width: "9%"
  },
  deleteButtonText: {
    color: "#DA4167",
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default IngredientsInputRepeater;