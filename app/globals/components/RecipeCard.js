import React, {useState} from 'react';
import { StyleSheet, Text, TouchableOpacity, ImageBackground, View } from 'react-native';
import { Entypo, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

import RecipeModal from './RecipeModal';
import OptionsModal from './OptionsModal';

const RecipeCard = ({data, id, reload, deleteFromList, indexList, onDeleteConfirm, addToFavorites, deleteFromFavorites, favorites}) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalOptions, setShowModalOptions] = useState(false);

  const route = useRoute();

  const onModalPress = () => {
    setShowModal(!showModal);
  }

  const onHideModalPress = () => {
    setShowModal(false);
  }

  const onModalOptionsPress = () => {
    setShowModalOptions(!showModalOptions);
  }

  const onHideOptionsPress = () => {
    setShowModalOptions(false);
  }

  const onDeletePress = () => {
    deleteFromList(indexList);
  }

  const onAddToFavoritesPress = () => {
    addToFavorites({id: id, data: data});
  }

  const onDeleteFromFavoritesPress = () => {
    deleteFromFavorites(id);
  }

  return ( 
    <View>
      <TouchableOpacity style={styles.card} onPress={onModalPress}>
        {route.name === "MyRecipes" &&
          <TouchableOpacity style={styles.optionsBtn} onPress={onModalOptionsPress}>
            <Entypo name="dots-three-vertical" size={18} color="white" style={styles.optionsIcon} />
          </TouchableOpacity>
        }
        {route.name === "GenerateWeeklist" &&
          <TouchableOpacity style={styles.optionsBtn} onPress={onDeletePress}>
            <Entypo name="cross" size={18} color="white" style={styles.optionsIcon} />
          </TouchableOpacity>
        }
        {(route.name === "GenerateWeeklist" || route.name === "MyWeeklist" || route.name === "MyFavorites") &&
        <>
          {favorites?.some(recipe => recipe.id === id) ? (
            <TouchableOpacity style={styles.optionsBtnBottom} onPress={onDeleteFromFavoritesPress}>
              <AntDesign name="heart" size={18} color="white" style={styles.optionsIcon} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.optionsBtnBottom} onPress={onAddToFavoritesPress}>
              <AntDesign name="hearto" size={18} color="white" style={styles.optionsIcon} />
            </TouchableOpacity>
          )}
        </>
        }

        {data.image ? (
          <ImageBackground 
            style={[styles.container, styles.bg]} 
            resizeMode="cover" 
            source={{uri: data.image.imageURL}}
            imageStyle={{opacity: 0.6}}
          >
            <Text style={styles.text}>{data.name}</Text>
            <View style={styles.iconsRow}>
              {data.isVegetarian === true ? (
                <MaterialCommunityIcons name="food-drumstick-off" size={20} color="white" style={styles.icons} />
              ) : (
                <MaterialCommunityIcons name="food-drumstick" size={20} color="white" style={styles.icons} />
              )}
              {data.isVegan === true ? (
                <MaterialCommunityIcons name="cheese-off" size={20} color="white" style={styles.icons} />
              ) : (
                <MaterialCommunityIcons name="cheese" size={20} color="white" style={styles.icons} />
              )}
              {data.withoutGluten === true ? (
                <MaterialCommunityIcons name="corn-off" size={20} color="white" style={styles.icons} />
              ) : (
                <MaterialCommunityIcons name="corn" size={20} color="white" style={styles.icons} />
              )}
            </View>
          </ImageBackground>
          ) : (
            <View style={styles.container} >
              <Text style={styles.text}>{data.name}</Text>
              <View style={styles.iconsRow}>
                {data.isVegetarian === true ? (
                  <MaterialCommunityIcons name="food-drumstick-off" size={20} color="white" style={styles.icons} />
                ) : (
                  <MaterialCommunityIcons name="food-drumstick" size={20} color="white" style={styles.icons} />
                )}
                {data.isVegan === true ? (
                  <MaterialCommunityIcons name="cheese-off" size={20} color="white" style={styles.icons} />
                ) : (
                  <MaterialCommunityIcons name="cheese" size={20} color="white" style={styles.icons} />
                )}
                {data.withoutGluten === true ? (
                  <MaterialCommunityIcons name="corn-off" size={20} color="white" style={styles.icons} />
                ) : (
                  <MaterialCommunityIcons name="corn" size={20} color="white" style={styles.icons} />
                )}
              </View>
            </View>
          )
        }
      </TouchableOpacity>
      <RecipeModal showModal={showModal} onHidePress={onHideModalPress} data={data} />
      <OptionsModal showModalOptions={showModalOptions} onHideOptionsPress={onHideOptionsPress} data={data} id={id} reload={reload} onDeleteConfirm={onDeleteConfirm} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginVertical: 5,
    minHeight: 105,
    maxHeight: 105
  },
  container: {
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
  optionsBtn: {
    position: "absolute",
    top: 15,
    right: 0,
    zIndex: 1,
    width: 30,
    alignItems: "center"
  },
  optionsBtnBottom: {
    position: "absolute",
    bottom: 15,
    left: 15,
    zIndex: 1,
    width: 30,
    alignItems: "center"
  }
});

export default RecipeCard;