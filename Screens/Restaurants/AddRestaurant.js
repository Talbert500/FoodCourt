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
import { doc, setDoc } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { auth } from '../../firebase-config'
import { updateProfile } from 'firebase/auth';
import { setSearchedRestaurant, setSearchedRestaurantImage } from '../../redux/action'
import { Link } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker';

function AddRestaurant({ navigation }) {
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


    const [inputRest, setInputRest] = useState("")
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")
    const [desc, setDesc] = useState("")
    const [color, setColor] = useState("")
    const [image, setImage] = useState("")

    const AddNewRestaurant = async () => {
        console.log(userCredential_id)
        console.log("Added")
        const date = new Date()
        setDoc(doc(db, "restaurants", userCredential_id), {
            adminEmail: adminEmail,
            restaurant_address: address,
            restaurant_id: userCredential_id,
            restaurant_name: inputRest,
            restaurant_phone: phone,
            restaurant_desc: desc,
            restaurant_date_added: date,
            restaurant_color: color

        }).catch((error) => {
            const errorCode = error;
            console.log("ERROR" + errorCode)
        })
        dispatch(setSearchedRestaurant(inputRest, desc, address, phone, userCredential_id, color))
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
                displayName: inputRest,
                photoURL: image
            }).then(() => {
                console.log()
            })
            //we can keep it local or do a check on the backend side and out from there
            //dispatch(setSearchedRestaurant(inputRest,restaurant_desc,restaurant_address,restaurant_phone,restaurant_id))
            navigation.navigate("CreateMenu")
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
                displayName: inputRest,
                photoURL: tookPicture
            }).then(() => {
                console.log()
            })
            //we can keep it local or do a check on the backend side and out from there
            //dispatch(setSearchedRestaurant(inputRest,restaurant_desc,restaurant_address,restaurant_phone,restaurant_id))
            navigation.navigate("CreateMenu")
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

    return (
        <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }}>
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
            {/* <Text style={styles.headerText}>{restaurant}</Text> */}
            {Platform.OS === 'web' ? <TouchableOpacity
                onPress={() => { navigation.goBack() }}
                style={[styles.button, { marginRight: "65%" }]}>
                <View style={{ flexDirection: 'row' }}>
                    <Icon style={{ margin: 10 }}
                        color="black" size={20}
                        name="arrow-left" />
                    <Text style={[styles.buttonText, { fontWeight: 'bold', alignSelf: 'center', marginHorizontal: 1 }]}>Back</Text></View>
            </TouchableOpacity> :
                <Icon style={{ paddingTop: 30, margin: 10 }}
                    color="black" size={35}
                    name="arrow-left"
                    onPress={() => { navigation.goBack() }} />}
            <View style={{ marginBottom: '10%' }}>
                <View style={{ marginVertical: Platform.OS === 'web' ? 20 : 10, marginHorizontal: Platform.OS === 'web' ? "10%" : "5%" }}>
                    <Text style={[styles.headerText]}>Create Your Menu Page</Text>
                    <Text style={[styles.headerText, { fontSize: 20, fontWeight: "400", marginTop: 5 }]}>Creating your menu is completely free! Please add accurate data for best results.</Text>
                </View>
                <View style={{ margin: 10 }}>
                    <View style={{ marginHorizontal: Platform.OS === 'web' ? "15%" : "5%" }}>
                        <Text style={styles.subHeaderText}>Restaurant Name</Text>
                        <TextInput
                            style={[styles.inputContainer, { padding: 10, alignSelf: 'center' }]}
                            onChangeText={setInputRest}
                            value={inputRest}
                            placeholder="Canyon 49 Grill..."
                            autoCapitalize='words'

                        />
                    </View>
                </View>
                <Divider style={{ margin: 10 }} />
                <View style={{ padding: 10, marginHorizontal: Platform.OS === 'web' ? '1%' : "5%" }}>
                    <Text style={styles.subHeaderText}>Add Photo</Text>

                    {Platform.OS === "web" ?
                        <View>
                            <Image source={{ uri: image }} style={{ alignSelf: 'center', width: 200, height: 200, borderRadius: 30, backgroundColor: '#D3D3D3' }} />
                            <Button title="Add Photo" buttonStyle={[styles.button, { marginHorizontal: 60 }]} titleStyle={styles.buttonTitle} title="Add Picture" onPress={openImagePickerAsync} />
                        </View>
                        :
                        <View>
                            <Image source={{ uri: foodImage }} style={{ alignSelf: 'center', width: 200, height: 200, borderRadius: 30, backgroundColor: '#D3D3D3' }} />
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
                    <Text style={styles.subHeaderText}>Restaurant Address:</Text>
                    <Text style={[styles.headerText, { fontSize: 15, fontWeight: "400", marginBottom: 4 }]}>Free QR Menu codes will be sent to this location.</Text>
                    <TextInput

                        style={[styles.inputContainer, { margin: 10, padding: 10, alignSelf: 'center' }]}
                        onChangeText={setAddress}
                        value={address}
                        placeholder="2030 W Camelback Rd"
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
                    <Button onPress={AddNewRestaurant} buttonStyle={[styles.button, { marginHorizontal: 40 }]} titleStyle={styles.buttonTitle} title="Create Menu" />
                </View>

            </View>
        </KeyboardAwareScrollView>

    );
}

export default AddRestaurant