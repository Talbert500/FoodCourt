import React, { useEffect,useState } from 'react';
import { Platform } from 'react-native'

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
import Welcome from './Screens/Restaurants/Welcome';
import SignUp from './Screens/Restaurants/Signup';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Updates from 'expo-updates';
import HomeScreenWeb from './Screens/web/HomeScreenWeb';
import Settings from './Screens/Restaurants/Settings'


import { useFonts } from "@use-expo/font";

const Stack = createNativeStackNavigator();

export default function App() {

  const [isLoaded] = useFonts({
    "SourceSans-ExtraLight": require("./assets/fonts/AktivGrotesk-Regular.ttf"),
  });

  const reactToUpdates = async () => {
    Updates.addListener((event) => {
      if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
        alert('An Update is available. Restart your app to see it.')
      }
    })
  }

  const linking = {
    config: {
      // screens: {
      //   RestaurantMenu: {
      //     path: 'restaurant/:restaurant_id',
      //   },
      // }
      /* configuration for matching screens with paths */
    },
  };


  return (
    //Platform.OS === 'ios' ?
    // <NavigationContainer>
    //   <Provider store={store}>
    //     <Stack.Navigator initialRouteName='HomeScreenWeb'>
    //       <Stack.Screen
    //         name="HomeScreenWeb"
    //         component={HomeScreenWeb}
    //         options={{
    //           headerShown: false,

    //         }}
    //       />
    //       <Stack.Screen
    //         name="RestaurantMenu"
    //         component={RestaurantMenu}
    //         options={{
    //           headerShown: false,

    //         }}
    //       />
    //     </Stack.Navigator>
    //   </Provider>
    // </NavigationContainer>
    //:
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <Provider store={store}>
        <Stack.Navigator initialRouteName="Home">
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
            name="WelcomeScreen"
            component={Welcome}
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
            name="Restaurant"
            component={RestaurantScreen}
            options={{
              headerShown: false,

            }}
          />
          <Stack.Screen
            name="AddToMenu"
            component={AddToMenu}
            options={{
              headerShown: false,

            }}
          />
          <Stack.Screen
            name="RestaurantMenu"
            component={RestaurantMenu}
            options={{
              headerShown: false,

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