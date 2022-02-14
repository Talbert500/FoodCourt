
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


function AddToMenu({ navigation }) {
  const dispatch = useDispatch();
  const restaurant = useSelector(state => state.searchedRestaurant)
  const tookPicture = useSelector(state => state.foodImage);
  const restaurantId = useSelector(state => state.restaurantId)
  const restaurantColor = useSelector(state => state.restaurantColor)

  //Item
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [cate, setCate] = useState("");
  const [image, setImage] = useState("");
  const [inputItem, setInputItem] = useState("")
  const [inputItemPrice, setInputItemPrice] = useState("")
  const [inputItemDesc, setInputItemDesc] = useState("")

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
  const [selectedSectionName, setSelectedSectionName] = useState("")
  useEffect(() => {
    getCategories();
  }, [])




  const getCategories = async () => {
    const categories = ref(database, "restaurants/" + restaurantId + "/categories")
    onValue(categories, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        console.log(data)
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
    set(ref(database, "restaurants/" + restaurantId + "/menus" + `/${uuid}`), {
      food: item,
      food_id: uuid,
      description: itemdesc,
      price: itemprice,
      restaurant: restaurant,
      upvotes: 0,
      eatagain: 0,
      category: cate
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


  const renderItem = (item) => {

    return (
      <TouchableOpacity onPress={() => setCate(selectedCategory[`${item.index}`])}>
        <View style={[styles.shadowProp, { margin: 20, borderRadius: 10, borderWidth: 1, backgroundColor: "grey" }]}>
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
    <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ margin: 10, paddingTop: 30 }}>

        <Icon
          color="black" size={35} name="arrow-left" onPress={() => { navigation.goBack() }}
        />
        <Text style={styles.headerText}>{restaurant}</Text>
        <Text style={styles.subHeaderText}>New Food Item</Text>
        <Divider style={{ margin: 10 }} />
        <Text style={styles.subHeaderText}> Pick a Category</Text>

        <FlatList
          horizontal
          style={{ maxHeight: windowHeight / 5 }}
          data={selectedCategory}
          keyExtractor={item => item.id}
          renderItem={renderItem} />
        {/* <Text>{selectedCategory[1]}</Text> */}
        <View style={{ padding: 10 }}>
          <Text style={styles.subHeaderText}>Add Photo</Text>
          {Platform.OS === 'web' ?
            <View>
              <Button title="Add Photo" buttonStyle={[styles.button, { marginHorizontal: 60, backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} onPress={openImagePickerAsync} />
              <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
            </View>

            :
            <View>
              <Button title="Add Photo" buttonStyle={[styles.button, { marginHorizontal: 60, backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} onPress={() => navigation.navigate("Camera")} />
              <Image source={{ uri: tookPicture }} style={{ width: 200, height: 200 }} />
            </View>

          }


          <Text style={styles.subHeaderText}>Food Name: </Text>
          <TextInput
            style={[styles.inputContainer, { padding: 10, alignSelf: 'center', }]}
            onChangeText={setInputItem}
            value={inputItem}
            placeholder="Tacos"
            autoCapitalize='words'

          />
          <Text style={styles.subHeaderText}>Food Item Price:</Text>
          <TextInput
            style={[styles.inputContainer, { padding: 10, alignSelf: 'center' }]}
            onChangeText={setInputItemPrice}
            value={inputItemPrice}
            placeholder="2.34"
            keyboardType="decimal-pad"
          />
          <Text style={styles.subHeaderText}>Food Item Description:</Text>
          <TextInput
            style={[styles.inputContainer, { padding: 14, paddingBottom: 50, alignSelf: 'center' }]}
            onChangeText={setInputItemDesc}
            value={inputItemDesc}
            placeholder="This is a meal"
            numberOfLines={10}
            multiline="true"
            maxlength="70"

          />
        </View>

        <Button onPress={() => AddFood(
          inputItem,
          inputItemDesc,
          inputItemPrice,
          tookPicture
        )} buttonStyle={[styles.button, { marginHorizontal: 40, marginBottom: 10, backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} title="Add Food" />


      </View>
    </KeyboardAwareScrollView>

  );
}

export default AddToMenu