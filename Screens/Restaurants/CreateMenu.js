import { Image, ScrollView, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, TextInput, Text, View, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements'
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config'
import { ref, set, update, push } from 'firebase/database'
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

function CreateMenu({ navigation }) {

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

    // const searchedRestaurant = "developlement"
    // const restaurantDesc = "developlement"
    // const restaurantPhone = "developlement"
    // const restaurantAddress = "developlement"
    // const restaurantId = "developlement"
    // const restaurantImage = "developlement"
    // const restaurantColor = "developlement"
    // const userCredential_id = "develop,ent"
    // const adminEmail = "hi"




    // I need to go to reducer state to get this object because the camera is called in the component to set a  new image and I want to see it
    //after I take the photo
    //Item

    const AddCategories = async () => {
        const uuid = uid();
        set(ref(database, "restaurants/" + restaurantId + "/categories"), {
            desc,
            desc1,
            desc2,
            desc3,
            desc4,
            desc5,
            desc6,
            desc7
        });

        navigation.navigate("RestaurantAdmin" , {
            loginSession:restaurantId
        })
    }


    useEffect(() => {

        // console.log(auth.currentUser.email)

    }, [])

    const [inputRest, setInputRest] = useState("")
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")
    const [desc, setDesc] = useState("Appetizers")
    const [desc1, setDesc1] = useState("Breakfast")
    const [desc2, setDesc2] = useState("Lunch")
    const [desc3, setDesc3] = useState("Dinner")
    const [desc4, setDesc4] = useState("Dessert")
    const [desc5, setDesc5] = useState("Happy Hour")
    const [desc6, setDesc6] = useState("Drinks")
    const [desc7, setDesc7] = useState("Other")



    return (
        <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }}>
            <View style={[styles.shadowProp, { zIndex: 1, flexDirection: "row", backgroundColor: "white",paddingTop: Platform.OS === 'web' ? 0 : "10%" }]}>
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
                <Text style={{ fontFamily:'Primary', alignSelf: "center", fontSize: Platform.OS === 'web' ? 17 : 14, fontWeight: "600" }}>
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
                    <Text style={[styles.headerText, { color: 'white', fontSize: 30, maxWidth: 600, textAlign: 'center', alignSelf: "center" }]}>What are your Menu Categories?</Text>
                    <Text style={[styles.headerText, { color: 'white', fontSize: 20, fontWeight: "400", marginTop: 5, maxWidth: 600, textAlign: 'center', alignSelf: "center" }]}>You will be able to edit and change this at any time.</Text>
                </View>



                <View style={{ backgroundColor: 'orange' }}>

                    <View style={[styles.shadowProp, { backgroundColor: 'white', alignSelf: 'center', padding: 35, margin: 50, borderRadius: 20, width: '90%', maxWidth: 650 }]}>

                            <Text style={styles.subHeaderText}>Add Menu Categories</Text>
                            <TextInput
                                style={[styles.inputContainer, { padding: 14, alignSelf: 'center' }]}
                                onChangeText={setDesc}
                                value={desc}
                                placeholder="Appetizers"
                            />
                            <TextInput
                                style={[styles.inputContainer, { padding: 14, alignSelf: 'center' }]}
                                onChangeText={setDesc1}
                                value={desc1}
                                placeholder="Breakfast"
                            />
                            <TextInput
                                style={[styles.inputContainer, { padding: 14, alignSelf: 'center' }]}
                                onChangeText={setDesc2}
                                value={desc2}
                                placeholder="Lunch"
                            />
                            <TextInput
                                style={[styles.inputContainer, { padding: 14, alignSelf: 'center' }]}
                                onChangeText={setDesc3}
                                value={desc3}
                                placeholder="Dinner"
                            />
                            <TextInput
                                style={[styles.inputContainer, { padding: 14, alignSelf: 'center' }]}
                                onChangeText={setDesc4}
                                value={desc4}
                                placeholder="Dessert"
                            />
                            <TextInput
                                style={[styles.inputContainer, { padding: 14, alignSelf: 'center' }]}
                                onChangeText={setDesc5}
                                value={desc5}
                                placeholder="Happy Hour"
                            />
                            <TextInput
                                style={[styles.inputContainer, { padding: 14, alignSelf: 'center' }]}
                                onChangeText={setDesc6}
                                value={desc6}
                                placeholder="Drinks"
                            />
                            <TextInput
                                style={[styles.inputContainer, { padding: 14, alignSelf: 'center' }]}
                                onChangeText={setDesc7}
                                value={desc7}
                                placeholder="Others"
                            />
                              <Button onPress={AddCategories} buttonStyle={[styles.button, { marginHorizontal: 40 }]} titleStyle={styles.buttonTitle} title="Create Menu" />
                        </View>
                      
                    </View>
            </View>
        </KeyboardAwareScrollView>

    );
}

export default CreateMenu