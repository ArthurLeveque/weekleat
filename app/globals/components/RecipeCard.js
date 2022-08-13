import React, {useState} from 'react';
import { StyleSheet, Text, TouchableOpacity, ImageBackground, View } from 'react-native';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

import RecipeModal from './RecipeModal';
import OptionsModal from './OptionsModal';

const RecipeCard = ({data, id, reload}) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalOptions, setShowModalOptions] = useState(false);

  const route = useRoute();

  const onModalPress = () => {
    setShowModal(!showModal)
  }

  const onHideModalPress = () => {
    setShowModal(false)
  }

  const onModalOptionsPress = () => {
    setShowModalOptions(!showModalOptions)
  }

  const onHideOptionsPress = () => {
    setShowModalOptions(false)
  }

  return ( 
    <View>
      <TouchableOpacity style={styles.card} onPress={onModalPress}>
        {route.name === "MyRecipes" &&
          <TouchableOpacity style={styles.optionsBtn} onPress={onModalOptionsPress}>
            <Entypo name="dots-three-vertical" size={18} color="white" style={styles.optionsIcon} />
          </TouchableOpacity>
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
                {data.isVegetarian === false &&
                  <FontAwesome5 name="fish" size={18} color="white" style={styles.icons} />
                }
                {data.isVegan === false &&
                  <FontAwesome5 name="cheese" size={18} color="white" style={styles.icons} />
                }
                {data.withoutGluten === false &&
                  <FontAwesome5 name="bread-slice" size={18} color="white" style={styles.icons} />
                }
            </View>
          </ImageBackground>
          ) : (
            <View style={styles.container} >
              <Text style={styles.text}>{data.name}</Text>
              <View style={styles.iconsRow}>
                {data.isVegetarian === false &&
                  <FontAwesome5 name="fish" size={18} color="white" style={styles.icons} />
                }
                {data.isVegan === false &&
                  <FontAwesome5 name="cheese" size={18} color="white" style={styles.icons} />
                }
                {data.withoutGluten === false &&
                  <FontAwesome5 name="bread-slice" size={18} color="white" style={styles.icons} />
                }
              </View>
            </View>
          )
        }
      </TouchableOpacity>
      <RecipeModal showModal={showModal} onHidePress={onHideModalPress} data={data} />
      <OptionsModal showModalOptions={showModalOptions} onHideOptionsPress={onHideOptionsPress} data={data} id={id} reload={reload} />
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
  }
});

export default RecipeCard;