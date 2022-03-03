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
import { render } from 'react-dom';

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
    // const restaurantId = "2kkaW6jvTzWghR27IGuXckUUhul1"
    // const restaurantImage = "developlement"
    // const restaurantColor = "developlement"
    // const userCredential_id = "develop,ent"
    // const adminEmail = "hi"


    const [menus, setTextInputs] = useState([]);
    const [nameHolder, setNameHolder] = useState("8am - 11am")
    const [textHolder, setTextHolder] = useState("Breakfast")



    // I need to go to reducer state to get this object because the camera is called in the component to set a  new image and I want to see it
    //after I take the photo
    //Item

    const AddMenus = async () => {
        const uuid = uid();
        update(ref(database, "restaurants/" + restaurantId + "/menus"), {
            menus
        });

        navigation.navigate("AddCategories")
    }


    useEffect(() => {

        // console.log(auth.currentUser.email)
    }, [])
   


    const joinData = () => {
        setTextInputs([...menus, { time: nameHolder, desc: textHolder,isDefault:"false" }])
        if (textHolder === "Breakfast") {
            setNameHolder("11am - 9pm")
            setTextHolder("Lunch & Dinner")
        }
        if (textHolder === "Lunch & Dinner") {
            setNameHolder("11am - 9pm")
            setTextHolder("Dessert")
        }
        if (textHolder === "Dessert") {
            setNameHolder("3pm - 6pm")
            setTextHolder("Happy Hour")
        }
        if (textHolder === "Happy Hour") {
            setNameHolder("All Day")
            setTextHolder("Beverages")
        }
        if (textHolder === "Beverages") {
            setNameHolder("")
            setTextHolder("")
        }
    }
    const makeDefault = ()=>{
        console.log(menus)
    }


    return (
        <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }}>
            <View style={[styles.shadowProp, { zIndex: 1, flexDirection: "row", backgroundColor: "white", paddingTop: Platform.OS === 'web' ? 0 : "10%" }]}>
                <TouchableOpacity>
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
                    <Text style={[styles.headerText, { color: 'white', fontSize: 30, maxWidth: 600, textAlign: 'center', alignSelf: "center" }]}>What are your Menus?</Text>
                    <Text style={[styles.headerText, { color: 'white', fontSize: 20, fontWeight: "400", marginTop: 5, maxWidth: 600, textAlign: 'center', alignSelf: "center" }]}>You will be able to edit and change this at any time.</Text>
                </View>



                <View style={{ backgroundColor: 'orange' }}>

                    <View style={[styles.shadowProp, { backgroundColor: 'white', alignSelf: 'center', padding: 35, margin: 50, borderRadius: 20, width: '90%', maxWidth: 650 }]}>
                        <Text style={styles.subHeaderText}>Add Menus</Text>
                        <FlatList
                            data={menus}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item }) => (
                                <View style={[styles.shadowProp, { margin: 10, padding: 10, backgroundColor: 'white', borderRadius: 5 }]}>
                                    <TouchableOpacity onPress={makeDefault({item})}>
                                        <Text style={{ fontFamily: "Bold", fontSize: 20 }}>{item.desc}</Text>
                                        <Text style={{ margin: 10, fontFamily: 'Primary' }}>{item.time}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        <Text style={{ fontFamily: 'Bold', fontSize: 15, marginBottom: -5, }}>Name</Text>
                        <TextInput
                            style={[styles.inputContainer, { padding: 14, alignSelf: 'center' }]}
                            onChangeText={setTextHolder}
                            value={textHolder}
                            placeholder="Breakfast"
                        />
                        <Text style={{ fontFamily: 'Bold', fontSize: 15, marginBottom: -5 }}>Time</Text>
                        <TextInput
                            style={[styles.inputContainer, { padding: 14, alignSelf: 'center' }]}
                            onChangeText={setNameHolder}
                            value={nameHolder}
                            placeholder="7am-9am"
                        />
                        <Button onPress={joinData} title="Add Menu +" />

                        <Button onPress={AddMenus} buttonStyle={[styles.button, { marginHorizontal: 40 }]} titleStyle={styles.buttonTitle} title="Continue" />
                    </View>

                </View>
            </View>
        </KeyboardAwareScrollView>

    );
}

export default CreateMenu