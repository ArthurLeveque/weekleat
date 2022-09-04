import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ImageBackground, View, FlatList } from 'react-native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";

const AddRecipeModal = ({showModalAddRecipes = false, onHideAddModalPress, myRecipes, favorites, indexList, add}) => {

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => {
      add(indexList, item);
      onHideAddModalPress();
    }}>
      {item.data.image ? (
        <ImageBackground 
          style={[styles.cardContainer, styles.bg]} 
          resizeMode="cover" 
          source={{uri: item.data.image.imageURL}}
          imageStyle={{opacity: 0.6}}
        >
          <Text style={styles.text}>{item.data.name}</Text>
          <View style={styles.iconsRow}>
            {item.data.isVegetarian === true ? (
              <MaterialCommunityIcons name="food-drumstick-off" size={20} color="white" style={styles.icons} />
            ) : (
              <MaterialCommunityIcons name="food-drumstick" size={20} color="white" style={styles.icons} />
            )}
            {item.data.isVegan === true ? (
              <MaterialCommunityIcons name="cheese-off" size={20} color="white" style={styles.icons} />
            ) : (
              <MaterialCommunityIcons name="cheese" size={20} color="white" style={styles.icons} />
            )}
            {item.data.withoutGluten === true ? (
              <MaterialCommunityIcons name="corn-off" size={20} color="white" style={styles.icons} />
            ) : (
              <MaterialCommunityIcons name="corn" size={20} color="white" style={styles.icons} />
            )}
          </View>
        </ImageBackground>
        ) : (
          <View style={styles.cardContainer} >
            <Text style={styles.text}>{item.data.name}</Text>
            <View style={styles.iconsRow}>
              {item.data.isVegetarian === true ? (
                <MaterialCommunityIcons name="food-drumstick-off" size={20} color="white" style={styles.icons} />
              ) : (
                <MaterialCommunityIcons name="food-drumstick" size={20} color="white" style={styles.icons} />
              )}
              {item.data.isVegan === true ? (
                <MaterialCommunityIcons name="cheese-off" size={20} color="white" style={styles.icons} />
              ) : (
                <MaterialCommunityIcons name="cheese" size={20} color="white" style={styles.icons} />
              )}
              {item.data.withoutGluten === true ? (
                <MaterialCommunityIcons name="corn-off" size={20} color="white" style={styles.icons} />
              ) : (
                <MaterialCommunityIcons name="corn" size={20} color="white" style={styles.icons} />
              )}
            </View>
          </View>
        )
      }
    </TouchableOpacity>
  );

  return ( 
    <Modal isVisible={showModalAddRecipes} onBackdropPress={onHideAddModalPress} propagateSwipe >
      <TouchableOpacity style={styles.closeBtn} onPress={onHideAddModalPress}>
        <Entypo name="cross" size={30} color="#DA4167" />
      </TouchableOpacity>

      <View style={styles.container}>
          <Text style={styles.textCategory}>Mes favorites</Text>
          <View style={styles.listContainer}>
            <FlatList 
              data={favorites}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>

          <Text style={styles.textCategory}>Mes recettes</Text>
          <View style={styles.listContainer}>
            <FlatList 
              data={myRecipes}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    alignItems: "center"
  },
  textCategory: {
    fontWeight: "bold",
    textAlign: "center"
  },
  listContainer: {
    width: "100%",
    height: "45%"
  },
  card: {
    width: "100%",
    marginVertical: 5,
    minHeight: 105,
    maxHeight: 105
  },
  cardContainer: {
    padding: 15,
    flex: 1,
    backgroundColor: "#DA4167",
    justifyContent: "space-between"
  },
  bg: {
    backgroundColor: "black"
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    width: "90%"
  },
  iconsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  icons: {
    marginLeft: 15
  },
  closeBtn: {
    position: "absolute",
    right: 5,
    top: 20,
    zIndex: 1,
    elevation: 1,
  }
});

export default AddRecipeModal;