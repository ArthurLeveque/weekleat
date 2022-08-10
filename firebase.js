// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage"
import AsyncStorage from '@react-native-async-storage/async-storage';
import {initializeAuth} from 'firebase/auth';
import {getReactNativePersistence} from 'firebase/auth/react-native';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9GvHLGewSRgDfrqL-dxEn6Uj6D5ziE1E",
  authDomain: "weekleat.firebaseapp.com",
  projectId: "weekleat",
  storageBucket: "weekleat.appspot.com",
  messagingSenderId: "906088272642",
  appId: "1:906088272642:web:d1158a7d43aa6208e2e81b"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
  initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = firebase.app()
}

const auth = firebase.auth();

export {auth, firebase};