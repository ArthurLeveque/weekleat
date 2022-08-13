import React from 'react';
import { Image, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const UploadImage = ({addImage, addPhoto, image}) => {

return (
  <View style={imageUploaderStyles.container}>
    {image  &&
      <Image source={{ uri: image }} style={imageUploaderStyles.image} />
    }

    <View style={imageUploaderStyles.uploadBtnContainer}>
      <TouchableOpacity onPress={addImage} style={imageUploaderStyles.uploadBtn} >
        <AntDesign name="folder1" size={20} color="white" />
        <Text style={imageUploaderStyles.btnText}>Ajouter une photo</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={addPhoto} style={imageUploaderStyles.uploadBtn} >
        <AntDesign name="camera" size={20} color="white" />
        <Text style={imageUploaderStyles.btnText}>Prendre une photo</Text>
      </TouchableOpacity>
    </View>
  </View>
 );
}

const imageUploaderStyles=StyleSheet.create({
  container:{
    marginVertical: 8
   },
  uploadBtnContainer:{
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
   },
  uploadBtn:{
    padding: 15,
    borderRadius: 5,
    width: '48%',
    backgroundColor: '#DA4167', 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center"
   },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16
  },
  btnText: {
    color: 'white',
    marginLeft: 9,
    fontWeight: "bold"
  }
})

export default UploadImage;