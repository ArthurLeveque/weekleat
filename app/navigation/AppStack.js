import React from 'react';
import { Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from '../screens/Home';
import AddRecipe from '../screens/recipes/AddRecipe';
import MyRecipes from '../screens/recipes/MyRecipes';
import EditRecipe from '../screens/recipes/EditRecipe';
import MyWeeklist from '../screens/weeklist/MyWeeklist';
import GenerateWeeklist from '../screens/weeklist/GenerateWeeklist';
import PremiumPresentation from '../screens/premium/PremiumPresentation';
import PremiumPayment from '../screens/premium/PremiumPayment';
import MyFavorites from '../screens/favorites/MyFavorites';
import IndexOptions from '../screens/options/IndexOptions';
import ChangePassword from '../screens/options/ChangePassword';
import DeleteAccount from '../screens/options/DeleteAccount';

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
        { text: "Oui", onPress: async() => {
          await auth.signOut();
          await AsyncStorage.multiRemove(['weekleat-recipes', 'weekleat-weeklist', 'weekleat-favorites']);
        }}
      ]
    );
  }

  function Recipes() {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="MyRecipes" component={MyRecipes} />
        <Stack.Screen name="AddRecipe" component={AddRecipe} />
        <Stack.Screen name="EditRecipe" component={EditRecipe} />
      </Stack.Navigator>
    );
  }

  function Weeklist() {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="MyWeeklist" component={MyWeeklist} />
        <Stack.Screen name="GenerateWeeklist" component={GenerateWeeklist} />
      </Stack.Navigator>
    );
  }

  function Premium() {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="PremiumPresentation" component={PremiumPresentation} />
        <Stack.Screen name="PremiumPayment" component={PremiumPayment} />
      </Stack.Navigator>
    );
  }

  function Favorites() {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="MyFavorites" component={MyFavorites} />
      </Stack.Navigator>
    );
  }

  function Options() {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="IndexOptions" component={IndexOptions} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
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
      <Drawer.Screen name="Weeklist" component={Weeklist} options={{title: "Ma weekliste"}} />
      <Drawer.Screen name="Recipes" component={Recipes} options={{title: "Mes recettes"}} />
      <Drawer.Screen name="Favorites" component={Favorites} options={{title: "Mes favorites"}} />
      <Drawer.Screen name="Premium" component={Premium} options={{title: "Weekleat premium"}} />
      <Drawer.Screen name="Options" component={Options} options={{title: "Options"}} />
    </Drawer.Navigator>
  );
}

export default AppStack;