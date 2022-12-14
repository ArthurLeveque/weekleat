import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    container: {
      padding: 15,
      flex: 1
    },
    title: {
      fontSize: 30,
      color: "#DA4167",
      fontWeight: "bold",
      alignItems: "center",
      marginVertical: 30,
      textAlign: "center"
    },
    secondaryTitle: {
      fontSize: 25,
      color: "#DA4167",
      fontWeight: "bold",
      marginVertical: 20,
    },
    text: {
      color: "#0B090A"
    },
    loading: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0.5,
      backgroundColor: 'black',
    }
});