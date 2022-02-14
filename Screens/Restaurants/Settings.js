
import { useRef } from 'react'
import { TextInput, RefreshControl, ImageBackground, Animated, Image, ScrollView, Text, View, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-native-elements'
import { styles } from '../../styles'
import { ref, onValue, orderByChild, query } from 'firebase/database'
import { collection, getDoc, doc, setDoc ,updateDoc} from 'firebase/firestore'
import { storage } from '../../firebase-config';
import { useEffect, useState } from 'react';
import Card from '../../Components/Card'
import { setFoodItemId } from '../../redux/action'
import { uploadBytes, getDownloadURL, ref as tef, list } from 'firebase/storage';
import { BlurView } from 'expo-blur';
import { setSearchedRestaurantImage, setSearchedRestaurant } from '../../redux/action'
import { auth, database } from '../../firebase-config'
import { db } from '../../firebase-config'
import { Link } from '@react-navigation/native';
import { signOut } from 'firebase/auth'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Divider } from 'react-native-elements/dist/divider/Divider';


function Settings({navigation}) {

    const dispatch = useDispatch();

    const [color, setColor] = useState([]);
    const [phone, setPhone] = useState([]);
    const [desc, setDesc] = useState([]);

    const searchedRestaurant = useSelector(state => state.searchedRestaurant)
    const restaurantImage = useSelector(state => state.restaurantImage)
    const restaurantDesc = useSelector(state => state.restaurantDesc)
    const restaurantId = useSelector(state => state.restaurantId)
    const restaurantColor = useSelector(state => state.restaurantColor)
    const restaurantAddress = useSelector(state => state.restaurantAddress)
    const restaurantPhone = useSelector(state => state.restaurantPhone)
    const tookPicture = useSelector(state => state.foodImage)

    const setRestaurant = async () => {
        const restId = auth.currentUser.uid;
        const docRef = doc(db, "restaurants", restId);
        const snapshot = await getDoc(docRef)
        if (snapshot.exists()) {
            const restaurant_id = snapshot.data().restaurant_id
            const restaurant_phone = snapshot.data().restaurant_phone
            const restaurant_address = snapshot.data().restaurant_address
            const restaurant_desc = snapshot.data().restaurant_desc
            const restaurant_name = snapshot.data().restaurant_name
            const restaurant_color = snapshot.data().restaurant_color

            dispatch(setSearchedRestaurant(restaurant_name, restaurant_desc, restaurant_address, restaurant_phone, restaurant_id, restaurant_color))
        } else {
            console.log("No souch document!")
        }
    }
    const getImage = async () => {
        const imageRef = tef(storage, 'imagesRestaurant/' + restaurantId);
        await getDownloadURL(imageRef).then((url) => {
            dispatch(setSearchedRestaurantImage(url))
        })
    }
    const AddNewRestaurant = async () => {
        console.log(auth.currentUser.email)
        console.log(auth.currentUser.uid)
        console.log("Updated")
        updateDoc(doc(db, "restaurants", auth.currentUser.uid), {
            restaurant_phone: phone,
            restaurant_desc: desc,
            restaurant_color: color

        }).catch((error) => {
            const errorCode = error;
            console.log("ERROR" + errorCode)
        })
        //just added 
        console.log(tookPicture);
        const getImageRef = tef(storage, 'imagesRestaurant/' + auth.currentUser.uid); //check if the storage updates 
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



    useEffect(() => {
        setRestaurant();
        getImage();
    }, [])

    return (
        <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ backgroundColor: "white", margin: 30 }}>

                <View style={[styles.shadowProp, { backgroundColor: "#F2F2F2", padding: 10, borderRadius: 13, }]}>
                    <Text style={[styles.subHeaderText, { marginVertical: 20 }]}> {searchedRestaurant} </Text>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={{ uri: restaurantImage }} style={{ width: 200, height: 200, borderRadius: 30, backgroundColor: '#D3D3D3' }} />
                        <Button onPress={() => { navigation.navigate("Camera") }} buttonStyle={[styles.button, { backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} title="Change Profile Picutre" />
                    </View>
                    <Divider style={{ margin: 10 }} />
                    <Text style={styles.subHeaderText}>Restaurant Address</Text>
                    <Text style={[styles.subHeaderText, { fontSize: 20, margin: 10 }]}>{restaurantAddress}</Text>
                    <Text style={styles.subHeaderText}>Phone Number</Text>
                    <TextInput
                        style={[styles.inputContainer, { padding: 10, alignSelf: 'center', }]}
                        onChangeText={setPhone}
                        value={phone}
                        placeholder={restaurantPhone}
                        autoCapitalize='words'
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.subHeaderText}>Color Theme</Text>
                        <Text onPress={() => Linking.openURL("https://htmlcolorcodes.com/")} style={{ backgroundColor: 'grey', alignSelf: 'center', borderRadius: 50, color: 'white', justifyContent: 'center' }}> ? </Text>
                    </View>
                    <TextInput
                        style={[styles.inputContainer, { padding: 10, alignSelf: 'center', }]}
                        onChangeText={setColor}
                        value={color}
                        placeholder={restaurantColor}
                        autoCapitalize='words'
                    />
                    <Text style={styles.subHeaderText}> Description </Text>
                    <TextInput
                        style={[styles.inputContainer, { padding: 10, alignSelf: 'center', }]}
                        onChangeText={setDesc}
                        value={desc}
                        placeholder={restaurantDesc}
                        autoCapitalize='words'
                    />
                    <Text style={{ fontSize: 14, margin: 10, textDecorationLine: 'underline' }}>Delete Restaurant</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <Button onPress={AddNewRestaurant} buttonStyle={[styles.button, { backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} title="Save" />
                        <Button onPress={()=> navigation.goBack()} buttonStyle={[styles.button, { backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} title="Return" />
                    </View>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )

}



export default Settings 