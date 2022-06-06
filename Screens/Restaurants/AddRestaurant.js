import { Image, ScrollView, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, TextInput, Text, View, SafeAreaView, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Button } from 'react-native-elements'
import React, { useState, useEffect } from 'react';
import { db, database } from '../../firebase-config'
import { ref, set, update, push } from 'firebase/database'
import { useSelector, useDispatch } from 'react-redux';
import { styles } from '../../styles'
import { uploadBytes, getDownloadURL, ref as tef } from 'firebase/storage';
import { uid } from 'uid'
import { storage } from '../../firebase-config';
import { Divider } from 'react-native-elements'
import { doc, setDoc } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { auth } from '../../firebase-config'
import { updateProfile } from 'firebase/auth';
import { setSearchedRestaurant, setSearchedRestaurantImage, setRestaurantInfo, setRestaurantData } from '../../redux/action'
import { Link } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker';
import { useFonts } from "@use-expo/font";
import axios from 'axios';

function AddRestaurant(props) {
    // I need to go to reducer state to get this object because the camera is called in the component to set a  new image and I want to see it
    //after I take the photo
    //Item
    let [fontsLoaded] = useFonts({
        'Primary': require('../../assets/fonts/proxima_nova_reg.ttf'),
        'Bold': require('../../assets/fonts/proxima_nova_bold.ttf'),
        'Black': require('../../assets/fonts/proxima_nova_black.otf')
    });
    const dispatch = useDispatch();
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;
    
    const userCredential_id = useSelector(state => state.userCredential_id)
    const adminEmail = useSelector(state => state.adminEmail)
    const tookPicture = useSelector(state => state.foodImage)
    const restaurantName = useSelector(state => state.searchedRestaurant)
    const firstName = useSelector(state => state.firstName)
    const lastName = useSelector(state => state.lastName)


    // const userCredential_id = "useSelector(state => state.userCredential_id)"
    // const adminEmail = " useSelector(state => state.adminEmail)"
    // const tookPicture = " useSelector(state => state.foodImage)"
    // const restaurantName = "La Korita La Taqueria"



    const [phone, setPhone] = useState()
    const [desc, setDesc] = useState("")
    const [color, setColor] = useState("")
    const [image, setImage] = useState("")
    const [website, setWebsite] = useState('')
    const [QRMenuId, setQRMenuId] = useState("359885")
    const APIKEY = "d37bdf656af0540a07b000834391f02f70e453f6"

    const [phoneError, setPhoneError] = useState(false)


    useEffect(() => {
        // console.log(props, 'props')
    }, [])


    const createQRMenu = async => {

        const data = JSON.stringify({
            "name": `${restaurantName}'s Menu`,
            "organization": 105513,
            "qr_type": 2,
            "campaign": {
                "content_type": 1,
                "custom_url": `https://www.ratemyfood.app/restaurant-menu-web?restId=${userCredential_id}`
            },
            "location_enabled": false,
            "attributes": {
                "color": `${color}`,
                "colorDark": "#000000",
                "margin": 40,
                "isVCard": false,
                "frameText": `${restaurantName}'s Menu`,
                "logoImage": "https://www.ratemyfood.app/static/media/splash.8cba55b7.png",
                "logoScale": 0.2,
                "frameColor": `${color}`,
                "frameStyle": "banner-bottom",
                "logoMargin": 5,
                "dataPattern": "square",
                "eyeBallShape": "circle",
                "gradientType": "none",
                "eyeFrameColor": `${color}`,
                "eyeFrameShape": "rounded"
            }
        });
        const config = {
            method: "post",
            url: "https://api.beaconstac.com/api/2.0/qrcodes/",
            headers: {
                "Authorization": `Token ${APIKEY}`,
                "Content-Type": "application/json"
            },
            data: data
        }
        axios.request(config)
            .then(response => {
                console.log(response.data)
                setQRMenuId(response.data.id)
                set(ref(database, "restaurants/" + userCredential_id + "/data"), {
                    qrid: response.data.id

                });
            })
            .then(result => {
                console.log(result)
            })
            .catch(error => console.log('error', error));

    }

    useEffect(() => {
        if (phone)
            setPhoneError(false)

        if (phone === "")
            setPhoneError(true)

    }, [phone])

    const AddNewRestaurant = () => {
        if (!phone)
            setPhoneError(true)

        if (phone) {
            // console.log(userCredential_id)
            // console.log("Added")
            // const date = new Date()
            // setDoc(doc(db, "restaurants", userCredential_id), {
            //     adminEmail: adminEmail,
            //     adminName: firstName + ` ${lastName}`,
            //     restaurant_id: userCredential_id,
            //     restaurant_name: restaurantName,
            //     restaurant_phone: phone,
            //     restaurant_desc: desc,
            //     restaurant_date_added: date,
            //     restaurant_color: color,
            //     restaurant_website: website

            // }).catch((error) => {
            //     const errorCode = error;
            //     console.log("ERROR" + errorCode)
            // })
            // createQRMenu();

            // dispatch(setSearchedRestaurant(restaurantName, desc, null, phone, userCredential_id, color))
            // dispatch(setRestaurantInfo(website))
            dispatch(setRestaurantData({
                restaurantPhone: phone,
                restaurant_website: website,
                restaurantDesc: desc
            }))
            // //just added 
            // if (Platform.OS === 'web') {
            //     console.log(image);
            //     const getImageRef = tef(storage, 'imagesRestaurant/' + userCredential_id); //how the image will be addressed inside the storage
            //     //convert image to array of bytes
            //     const img = await fetch(image);
            //     const bytes = await img.blob();
            //     uploadBytes(getImageRef, bytes).catch((error) => {
            //         console.log(error)
            //     })
            //     dispatch(setSearchedRestaurantImage(image));
            //     updateProfile(auth.currentUser, {
            //         displayName: restaurantName,
            //         photoURL: image
            //     }).then(() => {
            //         console.log()
            //     })
            //     //we can keep it local or do a check on the backend side and out from there
            //     //dispatch(setSearchedRestaurant(inputRest,restaurant_desc,restaurant_address,restaurant_phone,restaurant_id))
            props.navigation.navigate("AddAddress")
            // } else {
            //     console.log(tookPicture);
            //     const getImageRef = tef(storage, 'imagesRestaurant/' + userCredential_id); //how the image will be addressed inside the storage
            //     //convert image to array of bytes
            //     const img = await fetch(tookPicture);
            //     const bytes = await img.blob();
            //     uploadBytes(getImageRef, bytes).catch((error) => {
            //         console.log(error)
            //     })
            //     dispatch(setSearchedRestaurantImage(tookPicture));
            //     updateProfile(auth.currentUser, {
            //         displayName: restaurantName,
            //         photoURL: tookPicture
            //     }).then(() => {
            //         console.log()
            //     })
            //     //we can keep it local or do a check on the backend side and out from there
            //     //dispatch(setSearchedRestaurant(inputRest,restaurant_desc,restaurant_address,restaurant_phone,restaurant_id))
            //     props.navigation.navigate("AddAddress")
            // }
        }
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
    const cancelAccount = () => {
        props.navigation.goBack();
        console.log("REMOVED ACCOUNT HERE")
    }

    return (
        <KeyboardAwareScrollView style={{ backgroundColor: '#F5F5F5' }}>
            <View style={{ alignSelf: 'center' }}>
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
                        source={require('../../assets/onboarding_steps/step2.png')} />
                    <Text style={{ fontFamily: 'Bold', fontSize: 25, marginTop: 20 }}>
                        Claim your menu page
                    </Text>
                    <Text style={{ fontFamily: 'Primary', fontSize: 16, color: '#7E7E7E', maxWidth: 400, textAlign: 'center',marginHorizontal:windowWidth >= 450 ? 5 : windowWidth / 11 }}>
                        Creating your menu is completely free! Please claim or add your infomation.
                    </Text>
                </View>

                <View>
                    <View style={{ alignSelf: 'center', padding: 5, margin: 20, borderRadius: 20, width: '90%', maxWidth: 500 }}>
                        <View style={{ flexDirection:windowWidth >= 450 ? 'row':'column-reverse' }}>
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={[styles.subHeaderText, { fontWeight: "400", fontSize: "14px" }]}>Welcome,</Text>
                                <Text style={[styles.subHeaderText, { fontSize: "24px" }]}>
                                    {restaurantName}
                                </Text>
                            </View>
                            <View style={{ maxHeight: 200, maxWidth: 200, padding: 10 }}>
                                {image && <Image source={{ uri: image }} style={{ alignSelf: 'left', width: "90%", height: 100, backgroundColor: 'white', borderRadius: "5px", marginTop: 10 }} onPress={openImagePickerAsync} />}
                                {!image && <View style={{ flex: 1, marginTop: 10, cursor: "pointer" }} onClick={openImagePickerAsync}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="250" viewBox="0 0 364 190.476">
                                        <g id="Сгруппировать_524" data-name="Сгруппировать 524" transform="translate(-13 -623.468)">
                                            <g id="Сгруппировать_14" data-name="Сгруппировать 14" transform="translate(-136.5 112.737)">
                                                <g id="Прямоугольник_24" data-name="Прямоугольник 24" transform="translate(149.5 510.731)" fill="#fff" stroke="#707070" stroke-width="1" stroke-dasharray="5">
                                                    <rect width="364" height="190.476" rx="5" stroke="none" />
                                                    <rect x="0.5" y="0.5" width="363" height="189.476" rx="4.5" fill="none" />
                                                </g>
                                                <text id="_" data-name="+" transform="translate(308.5 597.091)" fill="#dedede" font-size="24" font-family="SegoeUI, Segoe UI"><tspan x="0" y="0">+</tspan></text>
                                            </g>
                                            <text id="Add_Photo" data-name="Add Photo" transform="translate(162 753)" fill="#aeaeae" font-size="14" font-family="SegoeUI-Bold, Segoe UI" font-weight="700"><tspan x="0" y="0">Add Photo</tspan></text>
                                            <path id="Icon_awesome-camera" data-name="Icon awesome-camera" d="M36,10.125v20.25a3.376,3.376,0,0,1-3.375,3.375H3.375A3.376,3.376,0,0,1,0,30.375V10.125A3.376,3.376,0,0,1,3.375,6.75H9.563l.865-2.313A3.37,3.37,0,0,1,13.584,2.25h8.824a3.37,3.37,0,0,1,3.157,2.187l.872,2.313h6.188A3.376,3.376,0,0,1,36,10.125ZM26.438,20.25A8.438,8.438,0,1,0,18,28.688,8.444,8.444,0,0,0,26.438,20.25Zm-2.25,0A6.188,6.188,0,1,1,18,14.063,6.2,6.2,0,0,1,24.188,20.25Z" transform="translate(177 700.706)" fill="#aeaeae" />
                                        </g>
                                    </svg>
                                </View>}
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.subHeaderText, { fontSize: "16px", marginTop: "19px" }]}>Restaurant Phone Number<Text style={{ color: "red" }}>*</Text></Text>
                            {phoneError && <Text style={{ color: "red", marginTop: "10px" }}>this field can't be empty</Text>}
                        </View>
                        <TextInput
                            style={{ backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 4, marginTop: 5, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C3C3' }}
                            onChangeText={(value) => setPhone(value.replace(/\D/g, ''))}
                            value={phone}
                            placeholder="9323948554"
                            keyboardType="decimal-pad"
                        />
                        <Text style={[styles.subHeaderText, { fontSize: "16px", marginTop: "19px" }]}>Restaurant Website</Text>
                        <TextInput
                            style={{ backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 4, marginTop: 5, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C3C3' }}
                            onChangeText={setWebsite}
                            value={website}
                            placeholder="www.eatfoodcourt.com"
                        />
                        <Text style={[styles.subHeaderText, { fontSize: "16px", marginTop: "19px" }]}>Restaurant Description</Text>
                        <TextInput
                            style={{ backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 4, marginTop: 5, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C3C3' }}
                            onChangeText={setDesc}
                            value={desc}
                            placeholder="This is a Description"
                            maxlength="70"
                        />
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

export default AddRestaurant