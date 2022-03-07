import { Image, ScrollView, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, TextInput, Text, View, SafeAreaView, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Button } from 'react-native-elements'
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config'
import { ref, set, update, push } from 'firebase/database'
import { useSelector, useDispatch } from 'react-redux';
import { styles } from '../../styles'
import { uploadBytes, getDownloadURL, ref as tef } from 'firebase/storage';
import { uid } from 'uid'
import { storage } from '../../firebase-config';
import { Divider } from 'react-native-elements'
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { auth } from '../../firebase-config'
import { updateProfile } from 'firebase/auth';
import { setSearchedRestaurant, setSearchedRestaurantImage } from '../../redux/action'
import { Link } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker';
import { useFonts } from "@use-expo/font";

function AddRestaurant({ navigation }) {
    let [fontsLoaded] = useFonts({
        'Primary': require('../../assets/fonts/proxima_nova_reg.ttf'),
        'Bold': require('../../assets/fonts/proxima_nova_bold.ttf'),
        'Black': require('../../assets/fonts/proxima_nova_black.otf')
    });


    // I need to go to reducer state to get this object because the camera is called in the component to set a  new image and I want to see it
    //after I take the photo
    //Item
    const dispatch = useDispatch();

    useEffect(() => {
        //console.log(auth.currentUser.email)

    }, [])

    const userCredential_id = useSelector(state => state.userCredential_id)
    const adminEmail = useSelector(state => state.adminEmail)
    const tookPicture = useSelector(state => state.foodImage)
    const restaurantName = useSelector(state => state.searchedRestaurant)

    // const userCredential_id = "useSelector(state => state.userCredential_id)"
    // const adminEmail = " useSelector(state => state.adminEmail)"
    // const tookPicture = " useSelector(state => state.foodImage)"
    // const restaurantName = "useSelector(state => state.searchedRestaurant)"



    const [inputRest, setInputRest] = useState("")
    const [address, setAddress] = useState("")
    const [addressCity, setAddressCity] = useState("")
    const [addressState, setAddressState] = useState("")
    const [addressZip, setAddressZip] = useState("")
    const [addressCountry, setAddressCountry] = useState("United States")
    const [phone, setPhone] = useState("")
    const [desc, setDesc] = useState("")

    const AddNewRestaurant = async () => {
        console.log("Added")
        const date = new Date()
        updateDoc(doc(db, "restaurants", userCredential_id), {
            adminEmail: adminEmail,
            restaurant_address: address,
            restaurant_city: addressCity,
            restaurant_state: addressState,
            restaurant_zip: addressZip,
            restaurant_state: addressState

        }).catch((error) => {
            const errorCode = error;
            console.log("ERROR" + errorCode)
        })
        //just added 
        navigation.navigate("AddMenus")
    }



return (
    <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor:Platform.OS === 'web' ? "orange" : "white"}}>
        <View style={[styles.shadowProp, { zIndex: 1, flexDirection: "row", backgroundColor: "white",paddingTop: Platform.OS === 'web' ? 0 : "10%" }]}>
            <TouchableOpacity onPress={() => { navigation.navigate("Login") }}>
                <Image
                    style={{
                        justifyContent: 'flex-start',
                        width: 125,
                        height: 50,
                        resizeMode: "contain",
                    }}
                    source={require('../../assets/logo_name_simple.png')} />
            </TouchableOpacity>
            <Text style={{ alignSelf: "center", fontSize:Platform.OS ==="web"? 17: 14, fontWeight: "600" }}>
                for restaurants
            </Text>
        </View>
        <View style={{ marginBottom: '10%', backgroundColor: 'orange', flex:1 }}>

        {Platform.OS === 'web' ? <></> :
            <Icon style={{ paddingTop: 10, margin: 10 }}
                color="black" size={35}
                name="arrow-left"
                onPress={() => { navigation.goBack() }} />}


            <View style={{ marginVertical: Platform.OS === 'web' ? 20 : 10, marginHorizontal: Platform.OS === 'web' ? "10%" : "5%" }}>
                <Text style={[styles.headerText, { color: 'white', fontSize: 30, maxWidth: 600, textAlign: 'center', alignSelf: "center" }]}>What is your restaurant address?</Text>
                <Text style={[styles.headerText, { color: 'white', fontSize: 20, fontWeight: "400", marginTop: 5, maxWidth: 600, textAlign: 'center', alignSelf: "center" }]}>Enter the address for where your customers can find you.</Text>
            </View>
            <View style={{ backgroundColor: 'orange' }}>

                <View style={[styles.shadowProp, { backgroundColor: 'white', alignSelf: 'center', padding: 35, margin: 50, borderRadius: 20, width: '90%', maxWidth: 650 }]}>

                    <Text style={styles.subHeaderText}>Restaurant Address</Text>
                    <Text style={[styles.headerText, { fontSize: 15, fontWeight: "400", marginBottom: 4 }]}>Free QR Menu codes will be sent to this location.</Text>
                    
                    <Text style={[styles.headerText, { fontSize: 15, fontWeight: "500", marginTop:10}]}>Address:</Text>
                    <TextInput

                        style={[styles.inputContainer, { margin: 10, padding: 10, alignSelf: 'center' }]}
                        onChangeText={setAddress}
                        value={address}
                        placeholder="2030 W Camelback Rd"
                    />
                     <Text style={[styles.headerText, { fontSize: 15, fontWeight: "500", marginTop:10}]}>City:</Text>
                    <TextInput

                        style={[styles.inputContainer, { margin: 10, padding: 10, alignSelf: 'center' }]}
                        onChangeText={setAddressCity}
                        value={addressCity}
                        placeholder="Phoenix"
                    />
                     <Text style={[styles.headerText, { fontSize: 15, fontWeight: "500", marginTop:10}]}>State:</Text>
                    <TextInput

                        style={[styles.inputContainer, { margin: 10, padding: 10, alignSelf: 'center' }]}
                        onChangeText={setAddressState}
                        value={addressState}
                        placeholder="Arizona"
                    />
                     <Text style={[styles.headerText, { fontSize: 15, fontWeight: "500", marginTop:10}]}>Zip Code:</Text>
                    <TextInput

                        style={[styles.inputContainer, { margin: 10, padding: 10, alignSelf: 'center' }]}
                        onChangeText={setAddressZip}
                        value={addressZip}
                        placeholder="85017"
                    />
                     <Text style={[styles.headerText, { fontSize: 15, fontWeight: "500", marginTop:10}]}>Country:</Text>
                    <TextInput
                        style={[styles.inputContainer, { margin: 10, padding: 10, alignSelf: 'center' }]}
                        value={addressCountry}
                        placeholder="United States"
                    />
                    <Button onPress={AddNewRestaurant} buttonStyle={[styles.button, { marginHorizontal: 40 }]} titleStyle={styles.buttonTitle} title="Continue" />
                </View>
            </View>
        </View>
    </KeyboardAwareScrollView>

);
}

export default AddRestaurant