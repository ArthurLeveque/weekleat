import React, {useState} from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import { useForm } from 'react-hook-form';
import axios from 'axios';

const gs = require ('../../globals/styles/GlobalStyle');
import CustomButton from '../../globals/components/CustomButton';
import CustomCheckbox from '../../globals/components/CustomCheckbox';
import { auth } from '../../../firebase';
import { apiUrl } from '../../../apiConfig';

const GenerateWeeklist = () => {
  const {control, handleSubmit} = useForm();

  const [loading, setLoading] = useState(false);
  const [modalOptions, setModalOptions] = useState(false);

  const onOptionsPress = () => {
    setModalOptions(!modalOptions)
  }

  const onGeneratePress = async (data) => {
    // fix undefined checkboxes if not touched
    if(data.isVegan === undefined) data.isVegan = false;
    if(data.isVegetarian === undefined) data.isVegetarian = false;
    if(data.withoutGluten === undefined) data.withoutGluten = false;

    // get user token for authentificated API route
    const authToken = await auth.currentUser.getIdTokenResult();

    const headers = {headers: {"auth-token": authToken.token}};
    await axios.get(`${apiUrl}/lists/generate`, data, headers)
  }

  return (
    <View style={gs.container}>
      <View style={styles.container}>
        <CustomButton 
          label="Options"
          onPress={onOptionsPress}
          type="tertiary"
        />
        <View style={styles.generateBtnContainer}>
          <TouchableOpacity onPress={handleSubmit(onGeneratePress)} style={styles.generateBtn}>
            <Text style={styles.generateBtnTxt}>C'est parti !</Text>
          </TouchableOpacity>
          <View style={styles.generateBtnShadow}/>
        </View>
       
      </View>

      <Modal isVisible={modalOptions} onBackdropPress={onOptionsPress} propagateSwipe >
        <View style={styles.modalContainer}>
          <Text style={styles.textModal}>Je veux que ma liste convienne aux :</Text>
          <CustomCheckbox
            name="isVegan"
            label="Vegans"
            control={control}
          />
          <CustomCheckbox
            name="isVegetarian"
            label="Végétariens"
            control={control}
          />
          <CustomCheckbox
            name="withoutGluten"
            label="Intolérants au gluten"
            control={control}
          />
          <View style={styles.spacingButton}>
            <CustomButton 
              label="Fermer"
              onPress={onOptionsPress}
              type="secondary"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    alignItems: "center"
  },
  textModal: {
    marginBottom: 20
  },
  spacingButton: {
    marginTop: 20,
    width: "100%"
  },
  generateBtn: {
    backgroundColor: "#DA4167",
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    position: "relative"
  },
  generateBtnShadow: {
    width: 200,
    height: 200,
    position: "absolute",
    bottom: -6,
    backgroundColor: "#aa2244",
    opacity: 0.5,
    borderRadius: 100,
    zIndex: -1
  },
  generateBtnTxt: {
    fontWeight: "bold",
    color: "white",
    fontSize: 20
  }
});

export default GenerateWeeklist;