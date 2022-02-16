
import React from 'react';
import { TextInput, RefreshControl, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, Input } from 'react-native-elements'

import { useDispatch } from 'react-redux';

import { db } from '../firebase-config'
import { collection, getDocs } from 'firebase/firestore'
import { setSearchedRestaurant, setFoodItemImage, } from '../redux/action'
import { useFonts } from "@use-expo/font";
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Link } from '@react-navigation/native';
import HomeScreenWeb from './web/HomeScreenWeb';
import LottieView from 'lottie-react-native';
import { useLinkTo } from '@react-navigation/native';


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


function HomeScreen({ navigation }) {
  const linkTo = useLinkTo();

  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [restaurantsId, setRestaurantsId] = useState("")
  const [text, onChangeText] = useState("")
  const restCollectionRef = collection(db, "restaurants")

  const [restaurants, setRestaurants] = useState([])
  const [filtered, setFiltered] = useState([]);
  const [searching, setSearching] = useState(false);
  const [clicked, setClicked] = useState(false);

  // const [selectedRestaurants, setSelectedRestaurants] = useState("")
  const getRest = async () => {
    setRefreshing(true);
    const data = await getDocs(restCollectionRef);
    setRestaurants(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    setFiltered(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    setRefreshing(false);
  }

  useEffect(() => {
    console.log(process.env.API_KEY)
    getRest()
    dispatch(setFoodItemImage("null"))

  }, [])


  const ItemView = ({ item }) => {

    return (
      <TouchableOpacity
        onPress={() => {
          setRestaurantsId(item.restaurant_id)
          dispatch(setSearchedRestaurant(item.restaurant_name, item.restaurant_desc, item.restaurant_address, item.restaurant_phone, item.restaurant_id, item.restaurant_color)),
            onChangeText(item.restaurant_name),
            linkTo(`/RestaurantMenu/${item.restaurant_id}`)
            // navigation.navigate("RestaurantMenu")

        }
        }>
        <View style={{ backgroundColor: 'white' }}>
          <Text style={{ fontSize: 16, padding: 5, fontWeight: '500' }}>
            {item.restaurant_name.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  const ItemSeparatorView = () => {
    return (
      <View style={{ height: 0.5, width: '100%', backgroundColor: '#c8c8c8' }} />
    )
  }

  const searchFilter = (text) => {
    setSearching(true);

    if (text) {
      const newData = restaurants.filter((item) => {
        const itemData = item.restaurant_name ?
          item.restaurant_name.toUpperCase()
          : ' '.toUpperCase()
        const textData = text.toUpperCase();

        return itemData.indexOf(textData) > -1;
      });
      setFiltered(newData);
      onChangeText(text);
    } else {
      setFiltered(restaurants);
      onChangeText(text);
    }
  }

  const pullup = () => {
    setSearching(true);
  }
  const pullout = () => {
    onChangeText("")
    setSearching(false);
  }

  return (
    <KeyboardAwareScrollView refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={getRest} />} enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{
        alignContent: 'flex-start',
        flex: 1,
        justifyContent: "center",
        padding: 20,
        alignItems: 'center',
        paddingHorizontal: Platform.OS === 'ios' ? "10%" : "30%",
        paddingTop: "10%"
      }}>
        {/* <LottieView
            style={{ width: 200, height: 200 }}
            source={require("../lf20_05ctr4vr.json")}
            autoPlay
          /> */}
          <Text>
            {process.env.API_KEY}
          </Text>
        <Image
          style={[styles.shadowProp, {
            width: 125, height: 125, shadowColor: '#171717',
            marginTop: Platform.OS === 'ios' ? "30%" : "10%",
            shadowOffset: { width: -1, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 3,
          }]}
          source={require('../assets/logos/white_taco.png')}
        />

        <View style={{ alignContent: 'center' }}>
          <Text style={{ fontSize: 30, fontWeight: "bold", margin: 10, textAlign: 'center' }}>Rate My Food</Text>

          <Text style={{ fontSize: 15, textAlign: "center", width: windowWidth - 30 }}>get rankings of the best mexican foods in your area:</Text>
        </View>
        {/*GET LOCATION OF USER */}
        <Text style={{ fontSize: 15, textAlign: "center", width: windowWidth - 30 }}>Phoenix, AZ</Text>
        <Text style={{ fontSize: 20, margin: 30, textAlign: "center", width: windowWidth - 20 }} >Enter a restaurant to get started</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.inputContainer, { marginHorizontal: 2, paddingBottom: Platform.OS === 'ios' ? "0%" : 6 }]}>
            <Input
              inputContainerStyle={styles.input}
              onChangeText={(text) => searchFilter(text)}
              value={text}
              placeholder="Taco Bell..."
              onSubmitEditing={pullout}
              onPressOut={pullup}
              leftIcon={{ type: 'material-community', name: "taco" }}
            />
          </View>
          <TouchableOpacity onPress={() => (onChangeText(""), setSearching(false))}>
            <Text style={{ fontSize: 16, fontWeight: '400', color: 'grey', marginHorizontal: 10 }}>
              x
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          {searching ?
            <View style={styles.search}>
              <FlatList
                data={filtered}
                keyExtractor={(item, index) => index}
                ItemSeparatorComponent={ItemSeparatorView}
                renderItem={ItemView}
                refreshing={false}
                onRefresh={getRest}
              />
            </View>
            : <View />}

          <Text
            onPress={() => { navigation.navigate("SignUp") }}
            style={{ fontSize: 15, marginTop: 20, textAlign: "center", fontWeight: 'bold' }}
          >
            Restaurant Login
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}


const styles = StyleSheet.create({
  search: {
    margin: -10,
    maxHeight: 150,
    width: windowWidth,
    alignItems: 'center'

  },
  inputContainer: {
    borderRadius: 20,
    marginHorizontal: 45,
    borderWidth: 1,
    borderColor: "white",
    width: '100%',
    backgroundColor: "white",
    shadowRadius: 2,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    marginVertical: 15,
    justifyContent: 'center'

  },
  input: {
    borderBottomWidth: 0,
    marginBottom: -20,

  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },

});



export default HomeScreen