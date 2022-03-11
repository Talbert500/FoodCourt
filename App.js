import React, { useEffect, useState } from 'react';
import { Platform, View, Text } from 'react-native'

import { Provider } from 'react-redux';
import store from './redux/store'
import HomeScreen from './Screens/HomeScreen';
import RestaurantScreen from './Screens/RestaurantScreen';
import FoodAdd from './Screens/FoodAdd';
import RestaurantMenu from './Screens/RestaurantMenu';
import RatingRestaurant from './Screens/RatingRestaurant';
import FoodScreen from './Screens/FoodScreen';
import UploadPicture from './Screens/UploadPicture';
import CameraScreen from './Screens/CameraScreen';
import AddRestaurant from './Screens/Restaurants/AddRestaurant';
import AddCategories from './Screens/Restaurants/AddCategories';
import RatingFood from './Screens/RatingFood';
import Login from './Screens/Restaurants/Login';
import SignUp from './Screens/Restaurants/Signup';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Updates from 'expo-updates';
import MenuWeb from './Screens/web/MenuWeb';
import Settings from './Screens/Restaurants/Settings'
import RestaurantHome from './Screens/Restaurants/RestaurantHome';
import AddAddress from './Screens/Restaurants/AddAddress';
import AddMenus from './Screens/Restaurants/AddMenus';
import MenuEdit from './Screens/Restaurants/MenuEdit';
import QRMenus from './Screens/QRMenus'
import Billing from './Screens/web/Billing';
import FoodEdit from './Screens/Restaurants/FoodEdit';

const Stack = createNativeStackNavigator();

export default function App() {



  const reactToUpdates = async () => {
    Updates.addListener((event) => {
      if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
        alert('An Update is available. Restart your app to see it.')
      }
    })
  }

  const linking = {
    config: {
      screens: {
        QRMenus:{
          path:'QR-Menus-Activation'
        },
        RestaurantWeb: {
          path: 'restaurant-menu-web/'
        },
        AddAddress: {
          path: 'restaurant-address/'
        },
        RestaurantHome: {
          path: 'restaurant-home/'
        },
        Home: {
          path: 'home/',
        },
        RestaurantMenuApp: {
          path: 'restaurant-menu-app/',
        },
        AddRestaurant: {
          path: 'new-restaurant/',
        },
        RestaurantAdmin: {
          path: 'restaurant-admin/',
        },
        Food: {
          path: 'food/',
        },
        Upload: {
          path: 'upload/',
        },
        Camera: {
          path: 'camera/',
        },
        RatingFood: {
          path: 'rate-my-food/',
        },
        Login: {
          path: 'login/',
        },
        RatingRestaurant: {
          path: 'rate-my-restaurant/',
        },
        Settings: {
          path: 'settings/',
        },
        SignUp: {
          path: 'sign-up'
        },
        CreateMenu: {
          path: 'create-menu'
        },
        AddMenus: {
          path: 'add-menu/'
        },
        MenuEdit:{
          path: 'menu-edit'
        },
        Billing:{
          path: 'billing-edit'
        },
      }
      /* configuration for matching screens with paths */
    },
  };


  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <View><Text style={{ color: 'red', fontSize: 10 }}> Unstable Alpha v4.1\\Added reviews can now showcase images</Text></View>
      <Provider store={store}>
        <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
            name="FoodEdit"
            component={FoodEdit}
            options={{
              headerShown: false,

            }}
          />
        <Stack.Screen
            name="Billing"
            component={Billing}
            options={{
              headerShown: false,

            }}
          />
        <Stack.Screen
            name="QRMenus"
            component={QRMenus}
            options={{
              headerShown: false,

            }}
          />
          <Stack.Screen
            name="AddMenus"
            component={AddMenus}
            options={{
              headerShown: false,

            }}
          />
          <Stack.Screen
            name="MenuEdit"
            component={MenuEdit}
            options={{
              headerShown: false,

            }}
          />
          <Stack.Screen
            name="RestaurantWeb"
            component={MenuWeb}
            options={{
              headerShown: false,

            }}
          />
          <Stack.Screen
            name="AddAddress"
            component={AddAddress}
            options={{
              headerShown: false,

            }}
          />
          <Stack.Screen
            name="RestaurantHome"
            component={RestaurantHome}
            options={{
              headerShown: false,

            }}
          />
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{
              headerShown: false,

            }}
          />
          <Stack.Screen
            name="RatingRestaurant"
            component={RatingRestaurant}
            options={{
              headerShown: false,

            }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{
              headerShown: false,

            }}
          />
          <Stack.Screen
            name="AddCategories"
            component={AddCategories}
            options={{
              headerShown: false,

            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,

            }}
          />
          <Stack.Screen
            name="RatingFood"
            component={RatingFood}
            options={{
              headerShown: false,

            }}
          />
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="Upload"
            component={UploadPicture}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="Food"
            component={FoodScreen}
            options={{
              headerShown: false,

            }}
          />
          <Stack.Screen
            name="RestaurantAdmin"
            component={RestaurantScreen}
            options={{
              headerShown: false,

            }}
          />
          <Stack.Screen
            name="FoodAdd"
            component={FoodAdd}
            options={{
              headerShown: false,

            }}
          />
          <Stack.Screen
            name="RestaurantMenuApp"
            component={RestaurantMenu}
            options={{
              headerShown: false,
            }}
            initialParams={{
              restId: null
            }}
          />
          <Stack.Screen
            name="AddRestaurant"
            component={AddRestaurant}
            options={{
              headerShown: false,

            }}
          />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>

  );
}

// AppRegistry.registerComponent('App', () => App);
// AppRegistry.runApplication('App', { rootTag: document.getElementById('react-root') });