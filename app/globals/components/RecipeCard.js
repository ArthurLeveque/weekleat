import React, {useState} from 'react';
import { StyleSheet, Text, TouchableOpacity, ImageBackground, View } from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';

import RecipeModal from './RecipeModal';

const RecipeCard = ({data, onPress, navigation}) => {
  const [showModal, setShowModal] = useState(false);

  const onModalPress = () => {
    setShowModal(!showModal)
  }

  const onHideModalPress = () => {
    setShowModal(false)
  }

  return ( 
    <View>
      <TouchableOpacity style={styles.card} onPress={onModalPress}>
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
  }
});

export default RecipeCard;