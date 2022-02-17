import React from 'react';
import { TouchableWithoutFeedback, KeyboardAvoidingView, Dimensions, FlatList, ScrollView, View, TouchableOpacity, Image, StyleSheet, Text, Platform, SafeAreaView, Keyboard } from 'react-native';
import { Button, Input } from 'react-native-elements'
import { database } from '../firebase-config'
import { ref, onValue, orderByValue, equalTo, query, limitToLast } from 'firebase/database'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styles } from '../styles'
import { setFoodItemId, setSearchedRestaurantImage, setSearchedRestaurant } from '../redux/action'
import { storage } from '../firebase-config';
import Icon from 'react-native-vector-icons/Feather'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { uploadBytes, getDownloadURL, ref as tef } from 'firebase/storage';
import ImagePicker from 'react-native-image-picker';
import { Link } from '@react-navigation/native';
import Card from '../Components/Card'
import { db } from '../firebase-config'
import { collection, getDoc, doc } from 'firebase/firestore'
import { useLinkTo } from '@react-navigation/native';

const RestaurantMenu = ({ route, navigation }) => {
  const linkTo = useLinkTo();
  const { restId } = route.params;
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [cate, setCate] = useState("");
  const [searchedRestaurant, setRestaurantName] = useState([])
  const [restaurantDesc, setRestaurantDesc] = useState([]);
  const [restaurantId, setRestaurantId] = useState([]);
  const [restaurantImage, setRestaurantImage] = useState([]);
  const [restaurantColor, setRestaurantColor] = useState([]);
  const [restaurantAddress, setRestaurantAddress] = useState([]);
  const [restaurantPhone, setRestaurantPhone] = useState([]);
  const [selectedRestSectionName, setRestSectionName] = useState([
    {
      "id": `1`,
      "section_name": "Breakfast",
      "icon": require("../assets/catergories/salad.png")
    },
    {
      "id": "2",
      "section_name": "Burritos",
      "icon": require("../assets/catergories/burrito.png")
    },
    {
      "id": "3",
      "section_name": "Tacos",
      "icon": require("../assets/catergories/taco.png")
    },
    {
      "id": "4",
      "section_name": "Salads",
      "icon": require("../assets/catergories/salad.png")
    },
    {
      "id": "5",
      "section_name": "Enchiladas",
      "icon": require("../assets/catergories/burrito.png")

    },
    {
      "id": "6",
      "section_name": "Tortas",
      "icon": require("../assets/catergories/nacho.png")
    },
    {
      "id": "7",
      "section_name": "Quesadillas",
      "icon": require("../assets/catergories/burrito.png")

    },
    {
      "id": "8",
      "section_name": "Tostadas",
      "icon": require("../assets/catergories/nacho.png")
    },
    {
      "id": "9",
      "section_name": "Kids",
      "icon": require("../assets/catergories/taco.png")
    },
    {
      "id": '10',
      "section_name": "Other",
      "icon": require("../assets/catergories/salad.png")
    }

  ])

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  // const searchedRestaurant = useSelector(state => state.searchedRestaurant)
  // const restaurantDesc = useSelector(state => state.restaurantDesc)
  // const restaurantPhone = useSelector(state => state.restaurantPhone)
  // const restaurantAddress = useSelector(state => state.restaurantAddress)
  // const restaurantId = useSelector(state => state.restaurantId)
  //const restaurantImage = useSelector(state => state.restaurantImage)
  // const restaurantColor = useSelector(state => state.restaurantColor)

  const dispatch = useDispatch();
  const [menuData, setMenuItem] = useState([]);
  const [text, onChangeText] = useState("")
  const [filtered, setFiltered] = useState([]);



  const getCategories = async () => {
    const categories = ref(database, "restaurants/" + restId + "/categories")
    onValue(categories, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        getFullMenu();
        console.log(data)
        setSelectedCategory("")
        Object.values(data).map((foodData) => {
          setSelectedCategory((food) => [...food, foodData]);
        })
      }

    })
  };

  function getFullMenu() {
    console.log(menuData.food_id)
    const getMenu = ref(database, 'restaurants/' + restId + '/menus/')
    onValue(getMenu, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        console.log(data)
        setFiltered("")
        setMenuItem("")
        Object.values(data).map((foodData) => {
          setMenuItem((oldArray) => [...oldArray, foodData]);
          setFiltered((oldArray) => [...oldArray, foodData]);
        })
      }
    })
  }

  const getImage = async () => {
    const imageRef = tef(storage, 'imagesRestaurant/' + restId);
    await getDownloadURL(imageRef).then((url) => {
      dispatch(setSearchedRestaurantImage(url))
      setRestaurantImage(url)
    })
  }

  useEffect(() => {
    const getRestaurant = async () => {
      //const restId = auth.currentUser.uid;
      const docRef = doc(db, "restaurants", restId);
      const snapshot = await getDoc(docRef)
      if (snapshot.exists()) {
        setRestaurantId(snapshot.data().restaurant_id)
        setRestaurantPhone(snapshot.data().restaurant_phone)
        setRestaurantAddress(snapshot.data().restaurant_address)
        setRestaurantDesc(snapshot.data().restaurant_desc)
        setRestaurantName(snapshot.data().restaurant_name)
        setRestaurantColor(snapshot.data().restaurant_color)
        dispatch(setSearchedRestaurant(searchedRestaurant, restaurantDesc, restaurantAddress, restaurantPhone, restaurantId, restaurantColor))
        getCategories();
        getImage();
      } else {
        console.log("No souch document!")
      }
    }
    getRestaurant();


  }, [])


  const renderItem = (item) => {
    return (
      <TouchableOpacity onPress={() => (setFiltered(menuData), onCategoryClick(selectedCategory[`${item.index}`]))}>
        <View style={[styles.shadowProp, { margin: 15, borderRadius: 10, borderWidth: 1, backgroundColor: "white", borderColor: 'white' }]}>
          <Text style={{ padding: 20 }}>{selectedCategory[`${item.index}`]} </Text>
        </View>
      </TouchableOpacity>
    )
  }

  const searchFilter = (text) => {
    if (text) {
      const newData = menuData.filter((item) => {
        const itemData = item.food ?
          item.food.toUpperCase()
          : ' '.toUpperCase()
        const textData = text.toUpperCase();

        return itemData.indexOf(textData) > -1;
      });
      setFiltered(newData);
      onChangeText(text);
    } else {
      setFiltered(menuData);
      onChangeText(text);
    }
  }

  function onCategoryClick(clicked) {
    setFiltered("")
    setFiltered(filtered.filter((item) => item.category === clicked))
    if (filtered == "") {
      setFiltered(menuData)
    }

  }

  return (
    <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ backgroundColor: 'white' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ backgroundColor: '#F2F2F2', borderBottomEndRadius: 50, shadowColor: 'black', shadowOffset: { width: -1, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 }}>
            {/* Header */}
            <View style={{ marginHorizontal: 10 }}>
              {Platform.OS === 'web' ?
                <Icon 
                style={{ paddingTop: 10, margin: 10 }}
                  color="black" size={35}
                  name="home"
                  onPress={() => { navigation.navigate("Home") }}
                      />
                :
                <Icon style={{ paddingTop: 30, margin: 10 }}
                  color="black" size={35}
                  name="arrow-left"
                  onPress={() => { navigation.navigate("Home") }} />
                }

            </View>

            {/*THIS IS THE HEADER AND SEARCH */}

            <View style={{ marginHorizontal: 20, marginVertical: 5 }}>
              <Text style={styles.headerText}>
                {searchedRestaurant}
              </Text>
              <View style={{ flexDirection: 'row', }}>
                <Button title="Rate Us" buttonStyle={[styles.button, { padding: 10, backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} onPress={() => { navigation.navigate("RatingRestaurant") }} />
              </View>
            </View>

            {/*THIS IS THE ABOUT US */}
            <View>
              <View style={{ marginHorizontal: 20, flexDirection: 'row', margin: 10 }}>
                <View style={{ maxWidth: '66%' }}>
                  <Text style={styles.subHeaderText}>About Us</Text>
                  <Text>{restaurantDesc} </Text>
                </View>
                <View style={{ flex: 1, marginHorizontal: 15, marginBottom: 10 }}>

                  <Image
                    style={{ borderRadius: 20, alignSelf: 'flex-end', marginBottom: 13, width: 100, height: 100, shadowColor: '#171717', shadowOffset: { width: -1, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, }}
                    source={{ uri: restaurantImage }}
                  />

                </View>
              </View>
            </View >
          </View>

          {/*THIS IS THE CATEGORIES */}
          <View>
            <Text style={[styles.headerText, { margin: 10 }]}>
              Menu
            </Text>
            <View>
              <Text style={[styles.subHeaderText, { fontSize: 20, margin: 10 }]}>Categories</Text>
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                data={selectedCategory}
                keyExtractor={item => item.id}
                renderItem={renderItem}
              />
            </View>
          </View>
          <View style={[styles.menuItemContaner, { marginVertical: 20 }]}>
            <Input
              inputContainerStyle={{ borderBottomWidth: 0, marginBottom: Platform.OS === 'web' ? -15 : -20 }}
              onChangeText={(text) => searchFilter(text)}
              value={text}
              placeholder="Chicken Tacos..."
              leftIcon={{ type: 'material-community', name: "taco" }}
            />

          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) =>
              <Card
                onPress={() => {
                  dispatch(setFoodItemId(item.food_id, item.food, item.price, item.description, item.upvotes, item.restaurant)), navigation.navigate("Food", {
                    restId: restId,
                    foodId: item.food_id,
                    restName: item.restaurant,
                  })
                }}
                restaurant={item.restaurant}
                ranking={index + item.upvotes}
                food={item.food}
                percent={item.ratingCount > 0 ? (item.eatagain * 100 / item.ratingCount).toFixed(0) : (item.eatagain)}
                upvotes={item.upvotes}
                upvoteColor={restaurantColor}
              />
            }
          />

        </ScrollView>

      </View>
    </KeyboardAwareScrollView>
  );
};

export default RestaurantMenu