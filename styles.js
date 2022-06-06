import { Dimensions, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useFonts } from '@use-expo/font';
//const restaurantColor = "#754FAD";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
export default function Fonts() {
  let [fontsLoaded] = useFonts({
    'Primary': require('./assets/fonts/proxima_nova_reg.ttf'),
    'Bold': require('./assets/fonts/proxima_nova_bold.ttf')
  });

}

export const styles = StyleSheet.create({
  selectedTextStyle: {
      fontSize: 16
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#7A7A7A"
  },
  dropdown: {
      width: "180px",
      height: "40px",
      borderColor: '#C3C3C3',
      backgroundColor: "white",
      borderRadius: "5px",
      paddingLeft: "10px",
      paddingRight: "10px",
      marginTop: "5px",
      borderWidth: 1,
  },
  containerColor: {
      backgroundColor: 'white'
    },
  categories: {
      flex: 1,
      alignItems: "center",
      backgroundColor: 'white',
      padding: 20,
      margin: 10,
      width: windowWidth / 3,
      borderRadius: 25,
      shadowColor: '#171717',
      shadowOffset: { width: -2, height: 2 },
      shadowOpacity: 0.19,
      shadowRadius: 5,

    },
    cards: {
      backgroundColor: '#F2F2F2',
      flex: 1,
      borderRadius: 25,
      shadowColor: '#171717',
      shadowOffset: { width: -1, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 3,
    },
    shadowProp: {
      shadowColor: '#171717',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    buttonTitle: {
      fontWeight: "bold",
      fontSize: 14,
      color: "white"
    },
    headerText: {
      fontWeight: "bold",
      fontSize: 50,

    },
    subHeaderText: {
      fontWeight: "bold",
      fontSize: 40,
    },
    bottomContainer: {

    },
    search: {
      maxHeight: 200,

    },
    menuItemContaner: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "white",
      backgroundColor: "white",
      shadowRadius: 2,
      shadowOpacity: 0.4,
      shadowOffset: {
        width: 0,
        height: 1
      },
      elevation: 2,
      justifyContent: 'center',
      margin: 10,
      marginHorizontal: 20

    },

    container: {
      flex: 1,
    },
    footerText: {
      fontSize:14,
      marginTop:5,
      color:'white'
    },
    search: {
      maxHeight: 200,
    },
    search: {
      maxHeight: 200,

    },
    input: {
      borderWidth: 1,
      borderColor: 'white',
      backgroundColor: 'white',
      padding: 2,
      height: 40,
      margin: 10,
      marginHorizontal: 10,
      borderRadius: 10,
      borderBottomWidth: 0,
      marginBottom: -20
    },
    search: {
      margin: -10,
      maxHeight: 150,
      width: windowWidth,
      alignItems: 'center'

    },
    oldInputContainer: {
      borderRadius: 10,
      width: '100%',
      backgroundColor: "white",
      shadowRadius: 2,
      shadowOpacity: 0.4,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
      marginVertical: 15,
      justifyContent: 'center'
    },
    inputContainer: {
      backgroundColor: '#F0F0F0',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 5,
      marginTop: 5,
    },
    input: {
      borderBottomWidth: 0,
      marginBottom: -20,

    },
    container: {
      flex: 1,
      backgroundColor: 'white'
    },
    buttonContainer: {
      width: '60%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
    },
    button: {
      backgroundColor: "#F6AE2D",
      shadowColor: '#171717',
      shadowOffset: { width: 1, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      borderRadius: "10px",
      height: "40px",
      width: "200px",
      margin: 10,
      padding: 5,
      textAlign: "center",
  },
    buttonOutline: {
      backgroundColor: 'white',
      borderColor: '#f6ae2d',
      borderWidth: 2,
    },
    buttonOutlineText: {
      color: '#f6ae2d',
      fontWeight: "700",
      fontSize: 16,
    },

  });