import React from 'react';
import { ImageBackground, KeyboardAvoidingView, Dimensions, FlatList, ScrollView, View, TouchableOpacity, Image, StyleSheet, Text, Platform, Linking, Keyboard, BackHandler } from 'react-native';
import { Button, Input } from 'react-native-elements'
import { database } from '../firebase-config'
import { ref, onValue, orderByValue, equalTo, query, limitToLast } from 'firebase/database'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styles } from '../styles'
import { setFoodItemId, setSearchedRestaurantImage, setSearchedRestaurant, setUserProps } from '../redux/action'
import { storage } from '../firebase-config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { uploadBytes, getDownloadURL, ref as tef } from 'firebase/storage';
import Card from '../Components/Card'
import { db, provider, auth } from '../firebase-config'
import { setDoc, getDoc, doc } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { useFonts } from '@use-expo/font';
import Icon from 'react-native-vector-icons/MaterialIcons'

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const RestaurantMenu = ({ route, navigation }) => {

  let [fontsLoaded] = useFonts({
    'Primary': require('../assets/fonts/proxima_nova_reg.ttf'),
    'Bold': require('../assets/fonts/proxima_nova_bold.ttf'),
    'Black': require('../assets/fonts/proxima_nova_black.otf')
  });

  const { restId } = route.params;

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [restaurant_city, setrestaurant_city] = useState("");
  const [restaurant_state, setrestaurant_state] = useState("");
  const [restaurant_zip, setrestaurant_zip] = useState("");
  const [searchedRestaurant, setRestaurantName] = useState([])
  const [restaurantDesc, setRestaurantDesc] = useState([]);
  const [restaurantId, setRestaurantId] = useState([]);
  const [restaurantImage, setRestaurantImage] = useState([]);
  const [restaurantColor, setRestaurantColor] = useState([]);
  const [restaurantPhone, setRestaurantPhone] = useState([]);
  const [restaurant_address, setRestaurantAddress] = useState("");
  const [restaurant_website, setWebsite] = useState('')
  const [rating, setRating] = useState([]);
  const [menuIndex, setMenuIndex] = useState(0);

  const [loginSession, setLoginSession] = useState('')
  const [accessToken, setAccessToken] = useState('')

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  // const searchedRestaurant = useSelector(state => state.searchedRestaurant)
  // const restaurantDesc = useSelector(state => state.restaurantDesc)
  // const restaurantPhone = useSelector(state => state.restaurantPhone)
  // const restaurantAddress = useSelector(state => state.restaurantAddress)
  // const restaurantId = useSelector(state => state.restaurantId)
  // const restaurantImage = useSelector(state => state.restaurantImage)

  const dispatch = useDispatch();
  const [menuData, setMenuItem] = useState([]);
  const [text, onChangeText] = useState("")
  const [filtered, setFiltered] = useState([]);
  const [catfilter, setCatFilter] = useState([]);
  const [loggedin, setloggedin] = useState(false);
  const [isRestaurant, setIsRestaurant] = useState(false)
  const [userPhoto, setUserPhoto] = useState('')
  const [setCate, setSetCate] = useState('');
  const [setMenu, setSetMenu] = useState('');
  const [overall, setOverall] = useState()
  const [foodItem, setFoodItem] = useState([])
  const [overallArray, setOverallArray] = useState('')
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [menusDesc, setmenusDesc] = useState('')
  const [filterCatgory, setFilteredCategory] = useState('')

  function googleSignOut() {
    signOut(auth).then(() => {
      setloggedin(false);
    }).catch(error => {
      console.log(error)
    })

  }
  function googleSignIn() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user)
        setloggedin(true);
        setUserPhoto(user.photoURL)
        dispatch(setUserProps(user.email, user.displayName, user.photoURL))
        //Storing user data
        setDoc(doc(db, "users", user.email), {
          userEmail: user.email,
          userName: user.displayName,
          userId: user.uid,
          user_date_add: user.metadata.creationTime,
          last_seen: user.metadata.lastSignInTime,
          userPhone: user.phoneNumber,
        }).catch((error) => {
          const errorCode = error.code;
          console.log("ERROR", errorCode)
        })
        //Also storing but tracked user data in realtime
        set(ref(database, "user/" + user.uid), {
          userEmail: user.email,
          userName: user.displayName,
          userId: user.uid,
          user_date_add: user.metadata.creationTime,
          last_seen: user.metadata.lastSignInTime,
          userPhone: user.phoneNumber,
          hasRestaurant: "false",
          userPhoto: user.photoURL
        });


      }).catch((error) => {
        const errorCode = error.code;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromResult(error);
        console.log(credential, errorCode)
      })
  }
  const getMenus = async () => {
    console.log("Getting Menu")
    const menus = ref(database, "restaurants/" + restId + "/menus")
    onValue(menus, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {

        console.log(data)
        setSelectedMenus("")
        Object.values(data).map((foodData) => {
          setSelectedMenus((food) => [...food, foodData]);
        })
        console.log("Menus COLLECTED")
        getCategories();
      }

    })
  };

  const getCategories = async () => {
    console.log("Getting Category")
    const categories = ref(database, "restaurants/" + restId + "/menus/" + menuIndex + "/categories/")
    onValue(categories, (snapshot) => {
      const data = snapshot.val();
      console.log(data)
      if (data !== null) {
        setSelectedCategory("")
        setSelectedCategory(data)
        setFilteredCategory(data)
        getFullMenu();

      }

    })

    const getRestRatings = ref(database, "restaurants/" + restId + "/restaurantRatings");
    onValue(getRestRatings, (snapshot) => {
      const data = snapshot.val();

      if (data !== null) {
        setRating("")
        Object.values(data).map((ratingData) => {
          setRating((food) => [...food, ratingData]);
        })
      }
    })
  };

  function getFullMenu() {
    const getMenu = ref(database, 'restaurants/' + restId + '/foods/')
    onValue(getMenu, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        console.log(data)
        setFoodItem("")
        setFiltered("")
        setMenuItem("")
        Object.values(data).map((foodData) => {
          setFoodItem((oldArray) => [...oldArray, foodData]);
          setMenuItem((oldArray) => [...oldArray, foodData]);
          //setFiltered((oldArray) => [...oldArray, foodData]);
        })
        //setSetMenu("Breakfast")

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
  const getRestaurant = async () => {
    console.log("Getting Restaurant")
    const docRef = doc(db, "restaurants", restId);
    const snapshot = await getDoc(docRef)
    if (snapshot.exists()) {
      setRestaurantId(snapshot.data().restaurant_id)
      setRestaurantPhone(snapshot.data().restaurant_phone)
      setRestaurantAddress(snapshot.data().restaurant_address)
      setRestaurantDesc(snapshot.data().restaurant_desc)
      setRestaurantName(snapshot.data().restaurant_name)
      setRestaurantColor(snapshot.data().restaurant_color)
      setWebsite(snapshot.data().restaurant_website)

      setrestaurant_city(snapshot.data().restaurant_city)
      setrestaurant_state(snapshot.data().restaurant_state)
      setrestaurant_zip(snapshot.data().restaurant_zip)

      dispatch(setSearchedRestaurant(searchedRestaurant, restaurantDesc, restaurant_address, restaurantPhone, restaurantId, restaurantColor))
      getMenus();
      getImage();
    } else {
      console.log("No souch document!")
    }
  }

  useEffect(() => {
    console.log("Mounting")
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setloggedin(true)
        setLoginSession(user.uid)
        setAccessToken(user.accessToken)
        console.log(user)

        const userRef = ref(database, "user/" + user.uid)
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            console.log(data)
            setIsRestaurant(data.hasRestaurant)
          }

        });


      } else {
        setloggedin(false)
      }
    })


    getRestaurant();


  }, [])

  //(item.name==selectedCategory)?"white":"black"
  const renderItem = ({ item, index }) => {

    return (
      <TouchableOpacity onPress={() => (setFiltered(menuData), onCategoryClick(item))}>
        <View style={[styles.shadowProp, { margin: 15, borderRadius: 10, borderWidth: 1, backgroundColor: (item === setCate) ? "#F2F2F2" : "white", borderColor: 'white' }]}>
          {/* <Text style={{ padding: 20, }}>{selectedCategory[`${item.index}`]} </Text> */}
          <Text style={{ padding: 20, }}>{item} </Text>
        </View>
      </TouchableOpacity>
    )

  }
  const renderMenus = ({ item, index }) => {

    return (
      <TouchableOpacity onPress={() => (setMenuItem(foodItem), setFiltered(menuData), onMenuClick(index, item.desc, item.time), setMenuIndex(index))}>
        <View style={[styles.shadowProp, { paddingHorizontal: 50, margin: 5, borderRadius: 20, backgroundColor: (item.desc === setMenu) ? restaurantColor : "white", borderColor: 'white' }]}>
          <Text style={{ padding: 10, color: (item.desc === setMenu) ? "white" : "black" }}>{item.desc} </Text>
        </View>
      </TouchableOpacity >

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
      setSetCate(null)
    } else {
      setFiltered(menuData);
      onChangeText(text);

    }
  }
  function onMenuClick(index, clicked, description) {
    setmenusDesc(description)
    // setSetCate(clicked)
    if (setMenu != clicked) {

      //setting categories
      setSelectedCategory(selectedMenus[index].categories)

      // Object.values(foodItem.categories).map((food) => {
      //     setSelectedMenus((food) => [...food, foodData]);
      // })

      //setting food
      setSetMenu(clicked)
      const newData = foodItem.filter((item) => {
        const cateDate = item.menus ?
          item.menus.toUpperCase() : ''.toUpperCase()
        const cate = clicked.toUpperCase();

        return cateDate.indexOf(cate) > -1;
      });
      setFiltered(newData);

    } else {
      setSetMenu("")
      setMenuItem(foodItem)
      setmenusDesc("")

    }


  }

  function onCategoryClick(clicked) {
    // setSetCate(clicked)

    if (setCate != clicked) {
      setSetCate(clicked)
      const newData = menuData.filter((item) => {
        const cateDate = item.category ?
          item.category.toUpperCase() : ''.toUpperCase()
        const cate = clicked.toUpperCase();

        return cateDate.indexOf(cate) > -1;
      });
      setFiltered(newData);
    } else {
      setSetCate("")
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
                <></>
                :
                <Icon style={{ paddingTop: 30, margin: 10 }}
                  color="black" size={35}
                  name="arrow-left"
                  onPress={() => { navigation.goBack() }} />
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
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={selectedMenus}

              renderItem={renderMenus}
              initialNumToRender={10}

            />

            <Divider style={{ margin: 10 }} />
            {menusDesc === " " ?
              <Text style={{ textAlign: "center" }}> Pick a Menu</Text>
              :
              <Text style={{ textAlign: "center" }}>{menusDesc}</Text>
            }
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