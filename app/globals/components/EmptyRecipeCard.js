import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

const EmptyRecipeCard = ({indexList, reload, onShowModalAddRecipePress}) => {
  const route = useRoute();

  const showAddModal = () => {
    onShowModalAddRecipePress(indexList);
  }

  return ( 
    <View style={styles.card}>
      {route.name === "GenerateWeeklist"  &&
        <TouchableOpacity onPress={showAddModal}>
          <Entypo name="add-to-list" color="#FBFBFB" size={25} />
        </TouchableOpacity>
      }
      <MaterialCommunityIcons name="silverware-fork-knife" size={40} color="#FBFBFB" style={styles.icons} />
      {route.name === "GenerateWeeklist"  &&
        <TouchableOpacity onPress={() => reload(indexList)}>
          <Ionicons name="reload" color="#FBFBFB" size={25} />
        </TouchableOpacity>
      }
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
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row"
  }
});

export default EmptyRecipeCard;