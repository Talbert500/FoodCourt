import { Image, ScrollView, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, TextInput, Text, View, SafeAreaView, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Button } from 'react-native-elements'
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config'
import { ref, set, update, push } from 'firebase/database'
import { useSelector, useDispatch, connect } from 'react-redux';
import { styles } from '../../styles'
import { uploadBytes, getDownloadURL, ref as tef } from 'firebase/storage';
import { uid } from 'uid'
import { storage } from '../../firebase-config';
import { Divider } from 'react-native-elements'
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { auth } from '../../firebase-config'
import { updateProfile } from 'firebase/auth';
import { setRestaurantAddressData, setLoading } from '../../redux/action'
import { Link } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker';
import { useFonts } from "@use-expo/font";
import { Dropdown } from 'react-native-element-dropdown';
import { states } from './states.json';
import { LogIn, createNewRestaurant } from '../../redux/saga';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;



function AddRestaurant(props) {
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

    // const userCredential_id = useSelector(state => state.userCredential_id)
    // const adminEmail = useSelector(state => state.adminEmail)
    // const tookPicture = useSelector(state => state.foodImage)
    // const restaurantName = useSelector(state => state.searchedRestaurant)

    // const userCredential_id = "useSelector(state => state.userCredential_id)"
    // const adminEmail = " useSelector(state => state.adminEmail)"
    // const tookPicture = " useSelector(state => state.foodImage)"
    // const restaurantName = "useSelector(state => state.searchedRestaurant)"



    const [inputRest, setInputRest] = useState("")
    const [address, setAddress] = useState("")
    const [addressCity, setAddressCity] = useState()
    const [addressState, setAddressState] = useState("")
    const [addressZip, setAddressZip] = useState("")
    const [addressCountry, setAddressCountry] = useState("United States")
    const [phone, setPhone] = useState("")
    const [desc, setDesc] = useState("")

    const [cityError, setCityError] = useState(false)
    const [zipError, setZipError] = useState(false)

    const AddNewRestaurant = async () => {

        if (!addressCity)
            setCityError(true)

        if (addressZip.length !== 5)
            setZipError(true)

        if (addressCity && addressZip.length === 5) {
            console.log("Added")
            const date = new Date()
            // updateDoc(doc(db, "restaurants", userCredential_id), {
            //     adminEmail: adminEmail,
            //     restaurant_address: address,
            //     restaurant_city: addressCity,
            //     restaurant_state: addressState,
            //     restaurant_zip: addressZip,
            //     restaurant_state: addressState

            // }).catch((error) => {
            //     const errorCode = error;
            //     console.log("ERROR" + errorCode)
            // })
            dispatch(setRestaurantAddressData({
                restaurantAddress: address,
                restaurant_city: addressCity,
                restaurant_state: addressState,
                restaurant_zip: addressZip
            }))

            const new_restaurant = {
                firstName: props.firstName,
                lastName: props.lastName,
                password: props.password,
                email: props.email,
                name: props.name,
                description: props.description,
                address: address,
                phone: props.phone,
                website: props.website,
                city: addressCity,
                state: addressState,
                zip: addressZip,
                country: "United States",
                photo: "test"
            }
    
            createNewRestaurant(dispatch, new_restaurant)
            .then(() => {
                dispatch(setLoading(false))
                LogIn(dispatch, props.email, props.password)
            })
    
            //just added 
            props.navigation.navigate("AddMenus")
        }
    }

    useEffect(() => {
        if (addressCity)
            setCityError(false)

        if (addressCity === "")
            setCityError(true)

    }, [addressCity])

    useEffect(() => {
        if (addressZip.length === 5)
            setZipError(false)

        if (addressZip.length !== 5)
            setZipError(true)

    }, [addressZip])

    useEffect(() => {
        setZipError(false)
    }, [])

    const setZipCode = (value) => {
        const onlyDigits = value.replace(/\D/g, '');
        setAddressZip(onlyDigits)
    }

    return (
        <KeyboardAwareScrollView style={{ backgroundColor: '#F5F5F5' }}>
            <View style={{ alignSelf: 'center'}}>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        style={{
                            width: 200,
                            height: 100,
                            resizeMode: "contain",
                            justifyContent: 'center'
                        }}
                        source={require('../../assets/logo.png')} />
                    <Image
                        style={{
                            width: windowWidth >= 450 ? 500 : 300,
                            height: 35,
                            resizeMode: "contain",
                            justifyContent: 'center'
                        }}
                        source={require('../../assets/onboarding_steps/step3.png')} />
                    <Text style={{ fontFamily: 'Bold', fontSize: 25, marginTop: 20 }}>
                        Verify your address
                    </Text>
                    <Text style={{ fontFamily: 'Primary', fontSize: 16, color: '#7E7E7E',maxWidth:350,textAlign:'center'}}>
                        Enter the address for where your customers can find you.
                    </Text>
                </View>
                <View style={{marginTop:20}}>
                    <View style={{ alignSelf: 'center',width:'100%', maxWidth: 650}}>
                        <Text style={{ fontFamily: 'Bold', fontSize: 25, marginTop: 20}}>Restaurant Address</Text>
                        <Text style={{ fontFamily: 'Primary', fontSize: 14,maxWidth:350,}}>Free QR Menu codes will be sent to this location.</Text>

                        <Text style={[styles.headerText, { fontSize: 15, fontWeight: "500", marginTop: 10 }]}>Address</Text>
                        <TextInput
                            style={{ backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 4, marginTop: 5, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C3C3' }}
                            onChangeText={setAddress}
                            value={address}
                            placeholder="2030 W Camelback Rd"
                        />
                        <View style={{ display: "flex", flexDirection:windowWidth >= 450 ? "row":"column", justifyContent: "space-between" }}>
                            <View style={{flex:1,marginRight:windowWidth >= 450 ? 15 : 0}}>
                                <View style={{flexDirection:'row'}}>
                                <Text style={[styles.headerText, { fontSize: 15, fontWeight: "500", marginTop: 10,}]}>City<Text style={{ color: "red" }}>*</Text></Text>
                                {cityError && <Text style={{ color: "red", marginTop: "10px", marginLeft: "10px" }}>this field can't be empty</Text>}
                                </View>
                                <TextInput
                                   style={{ backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 4, marginTop: 5, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C3C3' }}
                                    onChangeText={setAddressCity}
                                    value={addressCity}
                                    placeholder="Phoenix"
                                />
                            </View>
                            <View style={{flex:1, marginLeft:windowWidth >= 450 ? 15 : 0}}>
                                <Text style={[styles.headerText, { fontSize: 15, fontWeight: "500", marginTop: 10 }]}>State</Text>
                                {/* <TextInput
                                style={[styles.inputContainer, { margin: 10, padding: 10, alignSelf: 'center' }]}
                                onChangeText={setAddressState}
                                value={addressState}
                                placeholder="Arizona"
                            /> */}
                                <Dropdown
                                    style={[styles.dropdown, { marginRight: "10px" }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    placeholder="Arizona"
                                    data={states}
                                    valueField="value"
                                    labelField="label"
                                    onChange={item => {
                                        setAddressState(item.label)
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ display: "flex", flexDirection: windowWidth >= 450 ? "row":"column", justifyContent: "space-between" }}>
                            <View style={{flex:1, marginRight:windowWidth >= 450 ? 15 : 0}}>
                                <Text style={[styles.headerText, { fontSize: 15, fontWeight: "500", marginTop: 10}]}>Zip Code</Text>
                                <TextInput
                                    style={{ backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 4, marginTop: 5, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C3C3' }}
                                    onChangeText={(value) => setZipCode(value)}
                                    value={addressZip}
                                    placeholder="85017"
                                />
                                {zipError && <Text style={{ color: "red", marginLeft: "10px" }}>incorrect zip code format</Text>}
                            </View>
                            <View style={{flex:1, marginLeft:windowWidth >= 450 ? 15 : 0}}>
                                <Text style={[styles.headerText, { fontSize: 15, fontWeight: "500", marginTop: 10,}]}>Country</Text>
                                <TextInput
                                    style={{ backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 4, marginTop: 5, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C3C3' }}
                                    value={addressCountry}
                                    placeholder="United States"
                                />
                            </View>
                        </View>
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "55px" }}>
                            <TouchableOpacity
                                onPress={() => props.navigation.goBack()}
                                style={{flex:1,backgroundColor: "#f6ae2d",borderRadius: 10,marginVertical: 10,padding: 15,marginHorizontal:5}}
                            >
                                <Text style={{ color: "white", fontFamily: 'Primary', fontWeight: 'bold', alignSelf: 'center' }}>Go Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={AddNewRestaurant}
                                style={{flex:1,backgroundColor: "#f6ae2d",borderRadius: 10,marginVertical: 10,padding: 15,marginHorizontal:5}}
                            >
                                <Text style={{ color: "white", fontFamily: 'Primary', fontWeight: 'bold', alignSelf: 'center' }}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAwareScrollView>

    );
}

const mapStateToProps = (state) => {
    return {
        firstName: state.firstName,
        lastName: state.lastName,
        password: state.adminPassword,
        email: state.adminEmail,
        name: state.searchedRestaurant,
        description: state.restaurantDesc,
        phone: state.restaurantPhone,
        website: state.restaurant_website,
        country: state.restaurant_country
    }
}

const AddRestaurantContainer = connect(mapStateToProps, null)(AddRestaurant)

export default AddRestaurantContainer