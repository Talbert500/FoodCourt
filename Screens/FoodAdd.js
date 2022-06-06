
import { Image, ScrollView, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, TextInput, Text, View, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { database } from '../firebase-config'
import { ref, set, update, push, onValue } from 'firebase/database'
import { useSelector, useDispatch, connect } from 'react-redux';
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
import { Dropdown } from 'react-native-element-dropdown';
import { createFood, getRestaurantMenus } from '../redux/saga';
import SyncLoader from "react-spinners/SyncLoader";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


function FoodAdd(props) {
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
  const [inputItem, setInputItem] = useState("");
  const [inputItemPrice, setInputItemPrice] = useState("");
  const [inputItemDesc, setInputItemDesc] = useState("");
  const [menuIndex, setMenuIndex] = useState(0);
  const [menuItem, setMenuItem] = useState("");
  const [setMenu, setSetMenu] = useState('');
  const [calories, setCalories] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');

  const [tags, setTags] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const [tagInput, setTagInput] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');

  const [choosenMenu, setChoosenMenu] = useState("")
  const [choosenCategory, setChoosenCategory] = useState("")

  const menus_dropdown = props.restaurantMenus.map((rm, index) => ({ label: rm.name, value: index, categories: rm.categories, id: rm.id }))
  const categories_dropdown = choosenMenu && choosenMenu.categories.map((c, index) => ({ label: c.name, value: index, id: c.id }))
  
  useEffect(() => {
    console.log("restaurant: ", restaurant)
    getMenus();
    getCategories();

    getRestaurantMenus(dispatch)

  }, [])

  const getMenus = async () => {
    // const menus = ref(database, "restaurants/" + userId + "/menus")
    // onValue(menus, (snapshot) => {
    //   const data = snapshot.val();
    //   if (data !== null) {
    //     console.log(data)
    //     setSelectedMenu("")
    //     Object.values(data).map((foodData) => {
    //       setSelectedMenu((food) => [...food, foodData]);
    //     })
    //   }

    // })
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
    // const categories = ref(database, "restaurants/" + userId + "/menus/" + menuIndex + "/categories/")
    // onValue(categories, (snapshot) => {
    //   const data = snapshot.val();
    //   if (data !== null) {
    //     console.log("categories:", data)
    //     setSelectedCategory("")
    //     Object.values(data).map((foodData) => {
    //       setSelectedCategory((food) => [...food, foodData]);
    //     })
    //   }

    // })
  };
 
  const AddFood = () => {
    const tagsForApi = tags.map(t => t.tagName)
    const ingredientsForApi = ingredients.map(i => i.ingredientName)

    const foodData = {
      name: inputItem,
      price: parseFloat(inputItemPrice),
      menu: choosenMenu.id,
      calories: parseInt(calories),
      fats: parseInt(fat),
      carbs: parseInt(carbs),
      proteins: parseInt(protein),
      category: choosenCategory.id
    }

    createFood(dispatch, foodData)

    props.navigation.navigate("MenuEdit")
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

  const addTag = () => {
    if(tagInput !== "") {
      setTagInput("")
      setTags([...tags, { tagName: tagInput, id: Math.random().toString(16).slice(2) }])
    }
  }

  const addIngredient= () => {
    if(ingredientInput !== "") {
      setIngredientInput("")
      setIngredients([...ingredients, { ingredientName: ingredientInput, id: Math.random().toString(16).slice(2) }])
    }
  }

  const deleteTag = (tag) => {
    setTags(tags.filter(item => item.id !== tag.id))
  }

  const deleteIngredient = (ingredient) => {
    setIngredients(ingredients.filter(item => item.id !== ingredient.id))
  }

  return (
    <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "orange" }}>
      <View style={{ margin: Platform.OS === 'web' ? 0 : 10, paddingTop: Platform.OS === 'web' ? 0 : 30 }}>
        <View style={{ padding: 5, flexDirection: "row", backgroundColor: "white" }}>
          <TouchableOpacity style={{ justifyContent: 'center', }} onPress={() => { props.navigation.navigate("Home") }}>
            <Image
              style={{
                justifyContent: 'flex-start',
                width: 125,
                height: 50,
                resizeMode: "contain",
                justifyContent: 'center'
              }}
              source={require('../assets/splash.png')} />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Primary', alignSelf: "center", fontSize: Platform.OS === 'web' ? 17 : 14, fontWeight: "600" }}>
            for mexican restaurants
          </Text>
        </View>
        {Platform.OS === 'web' ?
          <View style={{ flexDirection: 'row', }}>
            <Icon
              style={{ marginTop: 20, marginLeft: 20, alignContent: 'center', alignSelf: 'center' }}
              color="white" size={45} name="arrow-left" onPress={() => { props.navigation.goBack() }}
            />
            {/* <Text style={{justifyContent:'center', color:'white',fontSize:20}}>Go Back</Text> */}
          </View>
          :

          <Icon
            color="white" size={35} name="arrow-left" onPress={() => { props.navigation.goBack() }}
          />
        }
        <View style={{ margin: 20 }}>
          <Text style={{ color: 'white', fontFamily: 'Bold', fontSize: 40, maxWidth: 500, textAlign: 'center', alignSelf: "center" }}>
            {restaurant}
          </Text>
          <Text style={{ color: 'white', fontSize: 30, maxWidth: 500, textAlign: 'center', alignSelf: "center" }}>Please input all fields for best results</Text>
        </View>

        <View style={[styles.shadowProp, { backgroundColor: 'white', alignSelf: 'center', margin: 20, borderRadius: 20, width: '90%', maxWidth: 450 }]}>
          <View style={{ padding: 25 }}>
            <Text style={[{ marginTop: 7, marginBottom: 20 }, styles.subHeaderText, { fontSize: "25px" }]}>Add Food</Text>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <View>
                <Text style={[styles.subHeaderText, { fontSize: "16px", marginBottom: "10px" }]}>Food Name</Text>
                <TextInput
                  style={[styles.inputContainer, { padding: 10, maxWidth: 400 }]}
                  onChangeText={setInputItem}
                  value={inputItem}
                  placeholder="Chicken Taco"
                  autoCapitalize='words'
                />
              </View>

              <View>
                <Text style={[styles.subHeaderText, { fontSize: "16px", marginBottom: "10px" }]}>Price</Text>
                <TextInput
                  style={[styles.inputContainer, { padding: 10, maxWidth: 200, marginRight: 'auto' }]}
                  onChangeText={setInputItemPrice}
                  value={inputItemPrice}
                  placeholder="2.34"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <View>
                <Text style={[styles.subHeaderText, { fontSize: "16px", marginBottom: "10px", marginTop: "7px" }]}>Cuisine</Text>
                <TextInput
                  style={[styles.inputContainer, { padding: 10, maxWidth: 400 }]}
                  value={"Mexican"}
                  autoCapitalize='words'
                />
              </View>

              <View>
                <Text style={[styles.subHeaderText, { fontSize: "16px", marginBottom: "10px", marginTop: "7px" }]}>Menu</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  placeholder="Hot food"
                  data={menus_dropdown}
                  onChange={item => setChoosenMenu({name: item.value, categories: item.categories, id: item.id})}
                  value={choosenMenu.name}
                  valueField="value"
                  labelField="label"
                />
              </View>
            </View>

            <Text style={[styles.subHeaderText, { fontSize: "16px", marginBottom: "10px", marginTop: "7px" }]}>Description</Text>
            <TextInput
              style={[styles.inputContainer, { padding: 14, paddingBottom: 50, height: "100px" }]}
              onChangeText={setInputItemDesc}
              value={inputItemDesc}
              placeholder=""
              numberOfLines={10}
              multiline="true"
              maxlength="70"
            />

            <Text style={[styles.subHeaderText, { fontSize: "16px", marginBottom: "10px", marginTop: "7px" }]}>Category</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={categories_dropdown ? categories_dropdown : [{label: "", value: 0}]}
              onChange={item => setChoosenCategory({name: item.value, id: item.id})}
              value={choosenCategory.name}
              placeholder="Tacos"
              valueField="value"
              labelField="label"
            />
          </View>

          <View style={{ paddingLeft: 25, paddingRight: 25 }}>
            {Platform.OS === 'web' ?
              <View>
                {!image && <View style={{ cursor: "pointer" }} onClick={openImagePickerAsync}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="250" viewBox="0 0 364 190.476">
                    <g id="Сгруппировать_524" data-name="Сгруппировать 524" transform="translate(-13 -623.468)">
                      <g id="Сгруппировать_14" data-name="Сгруппировать 14" transform="translate(-136.5 112.737)">
                        <g id="Прямоугольник_24" data-name="Прямоугольник 24" transform="translate(149.5 510.731)" fill="#fff" stroke="#707070" strokeWidth="1" strokeDasharray="5">
                          <rect width="364" height="190.476" rx="5" stroke="none"/>
                          <rect x="0.5" y="0.5" width="363" height="189.476" rx="4.5" fill="none"/>
                        </g>
                        <text id="_" data-name="+" transform="translate(308.5 597.091)" fill="#dedede" fontSize="24" fontFamily="SegoeUI, Segoe UI"><tspan x="0" y="0">+</tspan></text>
                        </g>
                        <text id="Add_Photo" data-name="Add Photo" transform="translate(162 753)" fill="#aeaeae" fontSize="14" fontFamily="SegoeUI-Bold, Segoe UI" fontWeight="700"><tspan x="0" y="0">Add Photo</tspan></text>
                      <path id="Icon_awesome-camera" data-name="Icon awesome-camera" d="M36,10.125v20.25a3.376,3.376,0,0,1-3.375,3.375H3.375A3.376,3.376,0,0,1,0,30.375V10.125A3.376,3.376,0,0,1,3.375,6.75H9.563l.865-2.313A3.37,3.37,0,0,1,13.584,2.25h8.824a3.37,3.37,0,0,1,3.157,2.187l.872,2.313h6.188A3.376,3.376,0,0,1,36,10.125ZM26.438,20.25A8.438,8.438,0,1,0,18,28.688,8.444,8.444,0,0,0,26.438,20.25Zm-2.25,0A6.188,6.188,0,1,1,18,14.063,6.2,6.2,0,0,1,24.188,20.25Z" transform="translate(177 700.706)" fill="#aeaeae"/>
                    </g>
                  </svg>
                </View>}
                {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, alignSelf: "center" }} />}
              </View>

              :
              <View>
                <Button title="Add Photo" buttonStyle={[styles.button, { marginHorizontal: 60, width: "40%", backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} onPress={() => props.navigation.navigate("Camera")} />
                <Image source={{ uri: tookPicture }} style={{ width: 200, height: 200 }} />
              </View>

            }
            <Text style={{ fontSize: "12px" }}>Optional</Text>
            <View style={{ justifyContent: "space-between", flexDirection: "row", width: "400px" }}>
              <View>
                <Text style={{ fontSize: "16px", fontWeight: "bold" }}>Calories</Text>
                <TextInput
                  style={[styles.inputContainer, { padding: 10, width: "90px" }]}
                  onChangeText={(value) => setCalories(value.replace(/\D/g, ''))}
                  value={calories}
                  placeholder=""
                  autoCapitalize='words'
                />
              </View>
              <View>
                <Text style={{ fontSize: "16px", fontWeight: "bold" }}>Fat</Text>
                <TextInput
                  style={[styles.inputContainer, { padding: 10, width: "90px" }]}
                  onChangeText={(value) => setFat(value.replace(/\D/g, ''))}
                  value={fat}
                  placeholder=""
                  autoCapitalize='words'
                />
              </View>
              <View>
                <Text style={{ fontSize: "16px", fontWeight: "bold" }}>Carbs</Text>
                <TextInput
                  style={[styles.inputContainer, { padding: 10, width: "90px" }]}
                  onChangeText={(value) => setCarbs(value.replace(/\D/g, ''))}
                  value={carbs}
                  placeholder=""
                  autoCapitalize='words'
                />
              </View>
              <View>
                <Text style={{ fontSize: "16px", fontWeight: "bold" }}>Protein</Text>
                <TextInput
                  style={[styles.inputContainer, { padding: 10, width: "90px" }]}
                  onChangeText={(value) => setProtein(value.replace(/\D/g, ''))}
                  value={protein}
                  placeholder=""
                  autoCapitalize='words'
                />
              </View>
            </View>

            <View style={{ marginTop: "20px" }}>
              <Text style={{ fontSize: "12px" }}>Optional</Text>
              <Text style={{ fontSize: "16px", fontWeight: "bold" }}>Add Tags</Text>
              <FlatList
                data={tags}
                keyExtractor={(item, index) => index}
                renderItem={({ item,index}) => (
                  <View>
                      <TextInput
                          style={[styles.inputContainer, { padding: 14, marginTop: "7px", width: "261px" }]}
                          value={item.tagName}
                      />
                      <TouchableOpacity onPress={() => deleteTag(item)} style={{ position: "absolute", marginLeft: "230px", marginTop: "20px" }}>
                          <Text style={{ fontWeight: "600", marginLeft: 'auto' }}>
                              X
                          </Text>
                      </TouchableOpacity>
                  </View>
                )}
              />

              <TextInput
                style={[styles.inputContainer, { padding: 14, marginTop: "7px", width: "261px" }]}
                onChangeText={setTagInput}
                value={tagInput}
              />
              <View style={{ width: "145px" }}>
                <Button 
                  buttonStyle={{ 
                    borderColor: '#f6ae2d', 
                    borderWidth: 1, 
                    borderRadius: "100px",
                    height: "32px", 
                    backgroundColor: "white",
                    marginTop: "28px",
                    marginBottom: "32px"
                  }} 
                  titleStyle={{ 
                    color: "#F6AE2D", 
                    fontSie: "14px",
                    fontWeight: "bold"
                  }} 
                  onPress={addTag} title="+ Tag"
                />
              </View>
            </View>

            <View style={{ marginTop: "20px" }}>
              <Text style={{ fontSize: "12px" }}>Optional</Text>
              <Text style={{ fontSize: "16px", fontWeight: "bold" }}>Add Ingredients</Text>
              <FlatList
                data={ingredients}
                keyExtractor={(item, index) => index}
                renderItem={({ item,index}) => (
                  <View>
                      <TextInput
                          style={[styles.inputContainer, { padding: 14, marginTop: "7px", width: "261px" }]}
                          value={item.ingredientName}
                      />
                      <TouchableOpacity onPress={() => deleteIngredient(item)} style={{ position: "absolute", marginLeft: "230px", marginTop: "20px" }}>
                          <Text style={{ fontWeight: "600", marginLeft: 'auto' }}>
                              X
                          </Text>
                      </TouchableOpacity>
                  </View>
                )}
              />

              <TextInput
                style={[styles.inputContainer, { padding: 14, marginTop: "7px", width: "261px" }]}
                onChangeText={setIngredientInput}
                value={ingredientInput}
              />
              <View style={{ width: "145px" }}>
                <Button 
                  buttonStyle={{ 
                    borderColor: '#f6ae2d', 
                    borderWidth: 1, 
                    borderRadius: "100px",
                    height: "32px", 
                    backgroundColor: "white",
                    marginTop: "28px",
                    marginBottom: "32px"
                  }} 
                  titleStyle={{ 
                    color: "#F6AE2D", 
                    fontSie: "14px",
                    fontWeight: "bold"
                  }} 
                  onPress={addIngredient} title="+ Ingredient"
                />
              </View>
            </View>

            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "60px", marginBottom: "55px" }}>
              <Button onPress={() => props.navigation.goBack()} buttonStyle={[styles.buttonOutline, { width: "186px", borderRadius: 20 }]} titleStyle={styles.buttonOutlineText} title="Go back" />
              <Button onPress={AddFood} buttonStyle={[styles.buttonOutline, { width: "186px", borderRadius: 20 }]} titleStyle={styles.buttonOutlineText} title="Add Food" />
            </View>
            {props.isLoading && 
              <View style={{ marginLeft: "100px", marginTop: "60px" }}>
                <SyncLoader color={"#F6AE2D"} loading={props.isLoading} size={25} />
              </View>
            }
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>

  );
}

const mapStateToProps = (state) => {
  if(state === undefined)
  return {
      isLoading: true
  }

  return {
    restaurantMenus: state.restaurantMenus,
    isLoading: state.isLoading
  }
}

const FoodAddContainer = connect(mapStateToProps, null)(FoodAdd)

export default FoodAddContainer