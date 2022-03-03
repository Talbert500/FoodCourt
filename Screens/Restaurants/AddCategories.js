import { Image, ScrollView, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, TextInput, Text, View, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements'
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config'
import { ref, set, onValue, update } from 'firebase/database'
import { useSelector, useDispatch } from 'react-redux';
import { styles } from '../../styles'
import { storage } from '../../firebase-config';
import { Divider } from 'react-native-elements'
import { doc, setDoc } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { auth } from '../../firebase-config'
import { updateProfile } from 'firebase/auth';
import { setSearchedRestaurant } from '../../redux/action'
import Icon from 'react-native-vector-icons/Feather'
import { uid } from 'uid'
import { database } from '../../firebase-config'
import { Link } from '@react-navigation/native';
import { useFonts } from "@use-expo/font";

function AddCategories({ navigation }) {

    let [fontsLoaded] = useFonts({
        'Primary': require('../../assets/fonts/proxima_nova_reg.ttf'),
        'Bold': require('../../assets/fonts/proxima_nova_bold.ttf'),
        'Black': require('../../assets/fonts/proxima_nova_black.otf')
    });
    const searchedRestaurant = useSelector(state => state.searchedRestaurant)
    const restaurantDesc = useSelector(state => state.restaurantDesc)
    const restaurantPhone = useSelector(state => state.restaurantPhone)
    const restaurantAddress = useSelector(state => state.restaurantAddress)
    const restaurantId =  auth.currentUser.uid;
    const restaurantImage = useSelector(state => state.restaurantImage)
    const restaurantColor = useSelector(state => state.restaurantColor)
    const userCredential_id = useSelector(state => state.userCredential_id)
    const adminEmail = useSelector(state => state.adminEmail)
    const [selectedMenus, setSelectedMenus] = useState([])
    const [categories, setCategories] = useState([])
    const [input, setInput] = useState("Share or Don't")
    const [menucount, setMenuCount] = useState(0)

    // const searchedRestaurant = "developlement"
    // const restaurantDesc = "developlement"
    // const restaurantPhone = "developlement"
    // const restaurantAddress = "developlement"
    // const restaurantId = "2kkaW6jvTzWghR27IGuXckUUhul1"
    // const restaurantImage = "developlement"
    // const restaurantColor = "developlement"
    // const userCredential_id = "develop,ent"
    // const adminEmail = "hi"




    // I need to go to reducer state to get this object because the camera is called in the component to set a  new image and I want to see it
    //after I take the photo
    //Item
    const getMenus = async () => {
        console.log("Getting Menu")
        const menus = ref(database, "restaurants/" + restaurantId + "/menus")
        onValue(menus, (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {

                console.log(data)

                setSelectedMenus("")
                Object.values(data).map((foodData) => {
                    setSelectedMenus((food) => [...food, foodData.desc]);
                })
            }

        })
    };

    const AddCategory = async () => {
        console.log(selectedMenus.length + "Total Number of Menus-------")
        if (menucount < selectedMenus.length) {
            const uuid = uid();
            update(ref(database, "restaurants/" + restaurantId + "/menus/"+ menucount), {
                categories
            });

            setMenuCount(menucount + 1)
            console.log(menucount + "You Have" + (selectedMenus.length - menucount) + " Menus Left")
            setCategories([])
        }

        if (menucount == selectedMenus.length) {

            navigation.navigate("RestaurantAdmin", {
                loginSession: restaurantId
            })
        }
    }

    const joinData = () => {
        setCategories([...categories, input ])
        console.log(categories)
        
        if (input === "Share or Don't") {
            setInput("Soups & Salads")
        }
        if (input === "Soups & Salads") {
            setInput("12'Pizza")
        }
        if (input === "12'Pizza") {
            setInput("In The Hand")
        }
        if (input === "In The Hand") {
            setInput("On The Plate")
        }
        if (input === "On The Plate") {
            setInput("Sides")
        }
        if (input === "Sides") {
            setInput("Fountain Beverages")
        }
        if (input === "Fountain Beverages") {
            setInput("")
        }else if (input === input){
            setInput("")
        }
    }

    useEffect(() => {
        getMenus();

        // console.log(auth.currentUser.email)

    }, [])

    const deleteItem =(category)=>{
        setCategories(categories.filter(item => item.category !== category))

    }




    return (
        <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }}>
            <View style={[styles.shadowProp, { zIndex: 1, flexDirection: "row", backgroundColor: "white", paddingTop: Platform.OS === 'web' ? 0 : "10%" }]}>
                <TouchableOpacity onPress={() => { navigation.navigate("RestaurantHome") }}>
                    <Image
                        style={{
                            justifyContent: 'flex-start',
                            width: 125,
                            height: 50,
                            resizeMode: "contain",
                        }}
                        source={require('../../assets/logo_name_simple.png')} />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Primary', alignSelf: "center", fontSize: Platform.OS === 'web' ? 17 : 14, fontWeight: "600" }}>
                    for mexican restaurants
                </Text>
            </View>
            <View style={{ marginBottom: '10%', backgroundColor: 'orange' }}>
                {Platform.OS === 'web' ? <></> :
                    <Icon style={{ paddingTop: 10, margin: 10 }}
                        color="black" size={35}
                        name="arrow-left"
                        onPress={() => { navigation.goBack() }} />}



                <View style={{ marginVertical: Platform.OS === 'web' ? 20 : 10, marginHorizontal: Platform.OS === 'web' ? "10%" : "5%" }}>
                    <Text style={[styles.headerText, { color: 'white', fontSize: 30, maxWidth: 600, textAlign: 'center', alignSelf: "center" }]}>What are your Menu Categories for {selectedMenus[menucount]}?</Text>
                    <Text style={[styles.headerText, { color: 'white', fontSize: 20, fontWeight: "400", marginTop: 5, maxWidth: 600, textAlign: 'center', alignSelf: "center" }]}>You will be able to edit and change this at any time.</Text>
                </View>



                <View style={{ backgroundColor: 'orange' }}>

                    <View style={[styles.shadowProp, { backgroundColor: 'white', alignSelf: 'center', padding: 35, margin: 50, borderRadius: 20, width: '90%', maxWidth: 650 }]}>

                        <Text style={styles.subHeaderText}>Add Menu Categories for {selectedMenus[menucount]}</Text>
                        <FlatList
                            data={categories}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item,index}) => (
                                <View style={[styles.shadowProp, { flexDirection: 'row', margin: 10, padding: 10, backgroundColor: 'white', borderRadius: 5 }]}>

                                    <Text style={{ fontFamily: "Bold", fontSize: 20 }}>{item}</Text>

                                    <TouchableOpacity onPress={()=>deleteItem(item.category)} style={{marginLeft: 'auto'}}>
                                        <Text style={{ fontWeight: "600", marginLeft: 'auto' }}>
                                            Delete
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        <TextInput
                            style={[styles.inputContainer, { padding: 14, alignSelf: 'center' }]}
                            onChangeText={setInput}
                            value={input}
                            placeholder="Appetizers..."
                        />
                        <Button onPress={joinData} title="Add To Menu +" />
                        <View style={{flexDirection:'row'}}>
                        <Button onPress={()=>setMenuCount(menucount+1)} buttonStyle={[styles.button, { paddingHorizontal: 10 }]} titleStyle={[styles.buttonTitle,{paddingHorizontal:20}]} title="Skip" />
                        <Button onPress={AddCategory} buttonStyle={[styles.button, { marginHorizontal: 40 }]} titleStyle={styles.buttonTitle} title="Create Menu" />
                        </View>

                    </View>

                </View>
            </View>
        </KeyboardAwareScrollView>

    );
}

export default AddCategories