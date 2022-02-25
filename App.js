import React, { useEffect, useState } from 'react';
import { Platform, View, Text } from 'react-native'

import { Provider } from 'react-redux';
import store from './redux/store'
import HomeScreen from './Screens/HomeScreen';
import RestaurantScreen from './Screens/RestaurantScreen';
import AddToMenu from './Screens/AddToMenu';
import RestaurantMenu from './Screens/RestaurantMenu';
import RatingRestaurant from './Screens/RatingRestaurant';
import FoodScreen from './Screens/FoodScreen';
import UploadPicture from './Screens/UploadPicture';
import CameraScreen from './Screens/CameraScreen';
import AddRestaurant from './Screens/Restaurants/AddRestaurant';
import CreateMenu from './Screens/Restaurants/CreateMenu';
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
        // EditMenu: {
        //   path: 'edit-menu/',
        // },
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
        }
      }
      /* configuration for matching screens with paths */
    },
  };


  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <View><Text style={{ color: 'red', fontSize: 10 }}> Unstable Indev v2.2\\ Login with google added trying to fix categories</Text></View>
      <Provider store={store}>
        <Stack.Navigator initialRouteName="Home">
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
            name="CreateMenu"
            component={CreateMenu}
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
            name="EditMenu"
            component={AddToMenu}
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