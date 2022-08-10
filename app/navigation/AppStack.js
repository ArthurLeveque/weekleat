import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from '../../firebase';

import Home from '../screens/Home';
import AddRecipe from '../screens/recipes/AddRecipe';
import MyRecipes from '../screens/recipes/MyRecipes';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const AppStack = () => {
  const onDisconnectPress = () => {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        {
          text: "Annuler"
        },
        { text: "Oui", onPress: () => auth.signOut() } //TODO : PURGER DONNEES STORAGE
        // AsyncStorage.clear() ?
      ]
    );
  }

  function Recipes() {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="MyRecipes" component={MyRecipes} />
        <Stack.Screen name="AddRecipe" component={AddRecipe} />
      </Stack.Navigator>
    );
  }

  return (
    <Drawer.Navigator 
      useLegacyImplementation={true} 
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        drawerActiveBackgroundColor: "#DA4167",
        drawerActiveTintColor: "#FBFBFB",
        drawerInactiveTintColor: "#0B090A",
        drawerStyle: {
          backgroundColor: "#FBFBFB",
        }
      }}
      drawerContent={props => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItem label={auth.currentUser?.email} />
            <DrawerItemList {...props} />
            <DrawerItem label="Déconnexion" onPress={() => onDisconnectPress()} />
          </DrawerContentScrollView>
        )
      }}
    >
      <Drawer.Screen name="Home" component={Home} options={{title: "Accueil"}} />
      <Drawer.Screen name="Recipes" component={Recipes} options={{title: "Mes recettes"}} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({

});

export default AppStack;