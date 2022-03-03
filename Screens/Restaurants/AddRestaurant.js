import { Image, ScrollView, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, TextInput, Text, View, SafeAreaView, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Button } from 'react-native-elements'
import React, { useState, useEffect } from 'react';
import { db,database} from '../../firebase-config'
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
import { setSearchedRestaurant, setSearchedRestaurantImage,setRestaurantInfo } from '../../redux/action'
import { Link } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker';
import { useFonts } from "@use-expo/font";
import axios from 'axios';

function AddRestaurant({ navigation }) {
    // I need to go to reducer state to get this object because the camera is called in the component to set a  new image and I want to see it
    //after I take the photo
    //Item
    let [fontsLoaded] = useFonts({
        'Primary': require('../../assets/fonts/proxima_nova_reg.ttf'),
        'Bold': require('../../assets/fonts/proxima_nova_bold.ttf'),
        'Black': require('../../assets/fonts/proxima_nova_black.otf')
    });
    const dispatch = useDispatch();

    useEffect(() => {
        //console.log(auth.currentUser.email)

    }, [])

    const userCredential_id = useSelector(state => state.userCredential_id)
    const adminEmail = useSelector(state => state.adminEmail)
    const tookPicture = useSelector(state => state.foodImage)
    const restaurantName = useSelector(state => state.searchedRestaurant)
    const firstName = useSelector(state => state.firstName)
    const lastName = useSelector(state => state.lastName)

    // const userCredential_id = "useSelector(state => state.userCredential_id)"
    // const adminEmail =" useSelector(state => state.adminEmail)"
    // const tookPicture =" useSelector(state => state.foodImage)"
    // const restaurantName = "useSelector(state => state.searchedRestaurant)"



    const [phone, setPhone] = useState("")
    const [desc, setDesc] = useState("")
    const [color, setColor] = useState("")
    const [image, setImage] = useState("")
    const [website, setWebsite] = useState('')
    const [QRMenuId, setQRMenuId] = useState("359885")
    const APIKEY = "d37bdf656af0540a07b000834391f02f70e453f6"


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
                "logoScale": 0.1992,
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

    const AddNewRestaurant = async () => {
        console.log(userCredential_id)
        console.log("Added")
        const date = new Date()
        setDoc(doc(db, "restaurants", userCredential_id), {
            adminEmail: adminEmail,
            adminName: firstName + ` ${lastName}`,
            restaurant_id: userCredential_id,
            restaurant_name: restaurantName,
            restaurant_phone: phone,
            restaurant_desc: desc,
            restaurant_date_added: date,
            restaurant_color: color,
            restaurant_website: website

        }).catch((error) => {
            const errorCode = error;
            console.log("ERROR" + errorCode)
        })
        createQRMenu();
        
        dispatch(setSearchedRestaurant(restaurantName, desc, null, phone, userCredential_id, color))
        dispatch(setRestaurantInfo(website))
        //just added 
        if (Platform.OS === 'web') {
            console.log(image);
            const getImageRef = tef(storage, 'imagesRestaurant/' + userCredential_id); //how the image will be addressed inside the storage
            //convert image to array of bytes
            const img = await fetch(image);
            const bytes = await img.blob();
            uploadBytes(getImageRef, bytes).catch((error) => {
                console.log(error)
            })
            dispatch(setSearchedRestaurantImage(image));
            updateProfile(auth.currentUser, {
                displayName: restaurantName,
                photoURL: image
            }).then(() => {
                console.log()
            })
            //we can keep it local or do a check on the backend side and out from there
            //dispatch(setSearchedRestaurant(inputRest,restaurant_desc,restaurant_address,restaurant_phone,restaurant_id))
            navigation.navigate("AddAddress")
        } else {
            console.log(tookPicture);
            const getImageRef = tef(storage, 'imagesRestaurant/' + userCredential_id); //how the image will be addressed inside the storage
            //convert image to array of bytes
            const img = await fetch(tookPicture);
            const bytes = await img.blob();
            uploadBytes(getImageRef, bytes).catch((error) => {
                console.log(error)
            })
            dispatch(setSearchedRestaurantImage(tookPicture));
            updateProfile(auth.currentUser, {
                displayName: restaurantName,
                photoURL: tookPicture
            }).then(() => {
                console.log()
            })
            //we can keep it local or do a check on the backend side and out from there
            //dispatch(setSearchedRestaurant(inputRest,restaurant_desc,restaurant_address,restaurant_phone,restaurant_id))
            navigation.navigate("AddAddress")
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
    const cancelAccount= ()=> {
        navigation.goBack();
        console.log("REMOVED ACCOUNT HERE")
    }

    return (
        <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor:Platform.OS === 'web' ? "orange" : "white"}}>
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
                <Text style={{ alignSelf: "center", fontSize:Platform.OS ==="web"? 17: 14, fontWeight: "600" }}>
                    for mexican restaurants
                </Text>
            </View>
            <View style={{ marginBottom: '10%', backgroundColor: 'orange' }}>
            {Platform.OS === 'web' ? <></> :
                <Icon style={{ paddingTop: 10, margin: 10 }}
                    color="black" size={35}
                    name="arrow-left"
                    onPress={cancelAccount} />}
           


                <View style={{ marginVertical: Platform.OS === 'web' ? 20 : 10, marginHorizontal: Platform.OS === 'web' ? "10%" : "5%" }}>
                    <Text style={[styles.headerText, { color: 'white', fontSize: 30, maxWidth: 600, textAlign: 'center', alignSelf: "center" }]}>Create Your Menu Page</Text>
                    <Text style={[styles.headerText, { color: 'white', fontSize: 20, fontWeight: "400", marginTop: 5, maxWidth: 600, textAlign: 'center', alignSelf: "center" }]}>Creating your menu is completely free! Please add accurate data for best results.</Text>
                </View>



                <View style={{ backgroundColor: 'orange' }}>

                    <View style={[styles.shadowProp, { backgroundColor: 'white', alignSelf: 'center', padding: 35, margin: 20, borderRadius: 20, width: '90%', maxWidth: 650 }]}>
                        <View style={{}}>
                            <View style={{}}>
                                <Text style={[styles.subHeaderText, { fontWeight: "400" }]}>Welcome,</Text>
                                <Text style={styles.subHeaderText}>
                                    {restaurantName}
                                </Text>
                            </View>
                        </View>
                        <Divider style={{ margin: 10 }} />

                        <Text style={styles.subHeaderText}>Add Photo</Text>

                        {Platform.OS === "web" ?
                            <View>
                                <Image source={{ uri: image }} style={{ alignSelf: 'center', width: "90%", height: 250, backgroundColor: '#D3D3D3', marginTop: 10 }} />
                                <Button title="Add Photo" buttonStyle={[styles.button, { marginHorizontal: 60 }]} titleStyle={styles.buttonTitle} title="Add Picture" onPress={openImagePickerAsync} />
                            </View>
                            :
                            <View>
                                <Image source={{ uri: tookPicture }} style={{ alignSelf: 'center', width: 200, height: 200, borderRadius: 30, backgroundColor: '#D3D3D3' }} />
                                <Button title="Add Photo" buttonStyle={[styles.button, { marginHorizontal: 60 }]} titleStyle={styles.buttonTitle} onPress={() => { navigation.navigate("Camera") }} />

                            </View>
                        }
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.subHeaderText}>Restaurant HEX Color: </Text>
                            <Text onPress={() => Linking.openURL("https://htmlcolorcodes.com/")} style={{ backgroundColor: 'grey', alignSelf: 'center', borderRadius: 50, color: 'white', justifyContent: 'center' }}> ? </Text>
                        </View>
                        <TextInput
                            style={[styles.inputContainer, { margin: 10, padding: 10, alignSelf: 'center' }]}
                            onChangeText={setColor}
                            value={color}
                            placeholder="#754FAD"
                        />

                        <Text style={styles.subHeaderText}>Restaurant Phone:</Text>
                        <TextInput
                            style={[styles.inputContainer, { padding: 10, alignSelf: 'center' }]}
                            onChangeText={setPhone}
                            value={phone}
                            placeholder="9323948554"
                            keyboardType="decimal-pad"
                        />
                        <Text style={styles.subHeaderText}>Restaurant Description:</Text>
                        <TextInput
                            style={[styles.inputContainer, { padding: 14, paddingBottom: 50, alignSelf: 'center' }]}
                            onChangeText={setDesc}
                            value={desc}
                            placeholder="This is a Description"
                            numberOfLines={10}
                            multiline="true"
                            maxlength="70"
                        />
                        <Text style={styles.subHeaderText}>Restaurant Website:</Text>
                        <TextInput
                            style={[styles.inputContainer, { padding: 14, paddingBottom: 50, alignSelf: 'center' }]}
                            onChangeText={setWebsite}
                            value={website}
                            placeholder="www.ratemyfood.app"
                        />
                        <Button onPress={AddNewRestaurant} buttonStyle={[styles.button, { marginHorizontal: 40 }]} titleStyle={styles.buttonTitle} title="Continue" />
                    </View>
                </View>
            </View>
        </KeyboardAwareScrollView>

    );
}

export default AddRestaurant