
import { Image, ScrollView, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, TextInput, Text, View, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { database } from '../firebase-config'
import { ref, set, update, push, onValue } from 'firebase/database'
import { useSelector, useDispatch } from 'react-redux';
import { styles } from '../styles'
import { uid } from 'uid'
import { Divider, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Feather'
import { uploadBytes, getDownloadURL, ref as tef } from 'firebase/storage';
import { storage } from '../firebase-config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { setFoodItemImage } from '../redux/action';
import { Link } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


function FoodAdd({ route, navigation }) {
  const { userId } = route.params;
  const dispatch = useDispatch();

  const restaurant = useSelector(state => state.searchedRestaurant)
  const tookPicture = useSelector(state => state.foodImage);
  const restaurantId = useSelector(state => state.restaurantId)
  const restaurantColor = useSelector(state => state.restaurantColor)

  //Item
  const [selectedMenus, setSelectedMenu] = useState([]);
  const [menuname, setMenuName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [cate, setCate] = useState("");
  const [image, setImage] = useState("");
  const [inputItem, setInputItem] = useState("")
  const [inputItemPrice, setInputItemPrice] = useState("")
  const [inputItemDesc, setInputItemDesc] = useState("")
  const [menuIndex, setMenuIndex] = useState(0);
  const [menuItem, setMenuItem] = useState("")
  const [setMenu, setSetMenu] = useState('');

  useEffect(() => {
    console.log(userId)
    console.log("restaurant: ", restaurant)
    getMenus();
    getCategories();
  }, [])


  const getMenus = async () => {
    const menus = ref(database, "restaurants/" + userId + "/menus")
    onValue(menus, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        console.log(data)
        setSelectedMenu("")
        Object.values(data).map((foodData) => {
          setSelectedMenu((food) => [...food, foodData]);
        })
      }

    })
  };
  function onMenuClick(index, clicked, description) {

    if (setMenu != clicked) {
      //setting categories
      setSelectedCategory(selectedMenus[index].categories)
      setSetMenu(clicked)
    } else {
      setSetMenu("")
      setMenuName("")
    }
  }


  const getCategories = async () => {
    const categories = ref(database, "restaurants/" + userId + "/menus/" + menuIndex + "/categories/")
    onValue(categories, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        console.log("categories:", data)
        setSelectedCategory("")
        Object.values(data).map((foodData) => {
          setSelectedCategory((food) => [...food, foodData]);
        })
      }

    })
  };
  // const [selectedRestaurants, setSelectedRestaurants] = useState("")
  const AddFood = async (item, itemdesc, itemprice, tookPicture) => {
    const uuid = uid();
    set(ref(database, "restaurants/" + userId + "/foods" + `/${uuid}`), {
      food: item,
      food_id: uuid,
      description: itemdesc,
      price: itemprice,
      restaurant: restaurant,
      upvotes: 0,
      eatagain: 0,
      category: cate,
      menus: menuname,
      imageUrl:image,
      ratingCount:0,
      overall:0,
    
    });

    setInputItem("");
    const metadata = {
      contentType: `${uuid}`
    }
    console.log(tookPicture);
    const getImage = tef(storage, 'foodImages/' + restaurant + "/" + uuid); //how the image will be addressed inside the storage

    if (Platform.OS === 'web') {
      const img = await fetch(image);
      const bytes = await img.blob();
      uploadBytes(getImage, bytes, metadata).catch((error) => {
        console.log(error)
      })
      // //ADD SOMETHING THAT CLEARS THE PICTURE 
      // dispatch(setFoodItemImage(null))

      navigation.goBack()
    } else {
      const img = await fetch(tookPicture);
      const bytes = await img.blob();
      uploadBytes(getImage, bytes, metadata).catch((error) => {
        console.log(error)
      })
      // //ADD SOMETHING THAT CLEARS THE PICTURE 
      // dispatch(setFoodItemImage(null))

      navigation.goBack()

    }

  }
  const renderMenus = ({ item, index }) => {

    return (
      <TouchableOpacity onPress={() => (setMenuName(item.desc), onMenuClick(index, item.desc, item.time), setMenuIndex(index))}>
        <View style={[styles.shadowProp, { margin: 20, borderRadius: 10, borderWidth: 1, backgroundColor: (item.desc === menuname) ? restaurantColor : "white" }]}>
          <Text style={{ padding: 10, color: (item.desc === menuname) ? "white" : "black" }}>{item.desc} </Text>
        </View>
      </TouchableOpacity>
    )

  }


  const renderItem = (item) => {

    return (
      <TouchableOpacity onPress={() => (setCate(selectedCategory[`${item.index}`]))}>
        <View style={[styles.shadowProp, { margin: 20, borderRadius: 10, borderWidth: 1, backgroundColor: (item.item === cate) ? "#F2F2F2" : "white" }]}>
          <Text style={{ padding: 20 }}>{selectedCategory[`${item.index}`]}</Text>
        </View>

      </TouchableOpacity>
    )

  }

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    // dispatch(setFoodItemImage(pickerResult.uri))
    setImage(pickerResult.uri)
  }
  



  return (
    <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "orange" }}>
      <View style={{ margin: Platform.OS === 'web' ? 0 : 10, paddingTop: Platform.OS === 'web' ? 0 : 30 }}>
        <View style={{ padding: 5, flexDirection: "row", backgroundColor: "white" }}>
          <TouchableOpacity style={{ justifyContent: 'center', }} onPress={() => { navigation.navigate("Home") }}>
            <Image
              style={{
                justifyContent: 'flex-start',
                width: 125,
                height: 50,
                resizeMode: "contain",
                justifyContent: 'center'
              }}
              source={require('../assets/logo_name_simple.png')} />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Primary', alignSelf: "center", fontSize: Platform.OS === 'web' ? 17 : 14, fontWeight: "600" }}>
            for mexican restaurants
          </Text>
        </View>
        {Platform.OS === 'web' ?
          <View style={{ flexDirection: 'row', }}>
            <Icon
              style={{ marginTop: 20, marginLeft: 20, alignContent: 'center', alignSelf: 'center' }}
              color="white" size={45} name="arrow-left" onPress={() => { navigation.goBack() }}
            />
            {/* <Text style={{justifyContent:'center', color:'white',fontSize:20}}>Go Back</Text> */}
          </View>
          :

          <Icon
            color="white" size={35} name="arrow-left" onPress={() => { navigation.goBack() }}
          />
        }
        <View style={{ margin: 20 }}>
          <Text style={{ color: 'white', fontFamily: 'Bold', fontSize: 40, maxWidth: 500, textAlign: 'center', alignSelf: "center" }}>
            {restaurant}
          </Text>
          <Text style={{ color: 'white', fontFamily: 'Bold', fontSize: 30, maxWidth: 500, textAlign: 'center', alignSelf: "center" }}>Please input all fields for best results</Text>
        </View>

        <View style={[styles.shadowProp, { backgroundColor: 'white', alignSelf: 'center', margin: 20, borderRadius: 20, width: '90%', maxWidth: 650 }]}>
          <View style={{ padding: 25 }}>
            <Text style={[{ marginTop: 10 }, styles.subHeaderText]}>New Food Item :</Text>
            <TextInput
              style={[styles.inputContainer, { padding: 10, maxWidth: 400 }]}
              onChangeText={setInputItem}
              value={inputItem}
              placeholder="Tacos"
              autoCapitalize='words'
            />
            <Text style={styles.subHeaderText}>Food Item Price:</Text>
            <TextInput
              style={[styles.inputContainer, { padding: 10, maxWidth: 200, marginRight: 'auto' }]}
              onChangeText={setInputItemPrice}
              value={inputItemPrice}
              placeholder="2.34"
              keyboardType="decimal-pad"
            />
          </View>

          <Divider style={{ margin: 10 }} />
          <Text style={styles.subHeaderText}> Pick Menu</Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={selectedMenus}

            renderItem={renderMenus}
            initialNumToRender={10}

          />
          <Text style={styles.subHeaderText}> Pick a Category</Text>

          <FlatList
            horizontal
            style={{ maxHeight: windowHeight / 5 }}
            data={selectedCategory}
            keyExtractor={item => item.id}
            renderItem={renderItem} />
          {/* <Text>{selectedCategory[1]}</Text> */}
          <View style={{ padding: 25 }}>
            <Text style={styles.subHeaderText}>Add Photo</Text>
            {Platform.OS === 'web' ?
              <View>
                <Button title="Add Photo" buttonStyle={[styles.button, { marginHorizontal: "10%", maxWidth: 400, backgroundColor: restaurantColor, alignSelf: 'center' }]} titleStyle={styles.buttonTitle} onPress={openImagePickerAsync} />
                <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
              </View>

              :
              <View>
                <Button title="Add Photo" buttonStyle={[styles.button, { marginHorizontal: 60, width: "40%", backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} onPress={() => navigation.navigate("Camera")} />
                <Image source={{ uri: tookPicture }} style={{ width: 200, height: 200 }} />
              </View>

            }

            <Text style={styles.subHeaderText}>Food Item Description:</Text>
            <TextInput
              style={[styles.inputContainer, { padding: 14, paddingBottom: 50 }]}
              onChangeText={setInputItemDesc}
              value={inputItemDesc}
              placeholder="This is a meal"
              numberOfLines={10}
              multiline="true"
              maxlength="70"

            />
            <Button onPress={() => AddFood(
              inputItem,
              inputItemDesc,
              inputItemPrice,
              tookPicture
            )} buttonStyle={[styles.button, { maxWidth: 400, width: "20%", minWidth: 100, marginBottom: 10, backgroundColor: restaurantColor, alignSelf: 'center' }]} titleStyle={styles.buttonTitle} title="Add Food" />

          </View>



        </View>
      </View>
    </KeyboardAwareScrollView>

  );
}

export default FoodAdd