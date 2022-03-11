
import React from 'react';
import { RefreshControl, TextInput, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, Input, Divider } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux';
import { uid } from 'uid'
import { database, auth } from '../firebase-config'
import { ref, set, update, push, increment } from 'firebase/database'
import { collection, getDocs } from 'firebase/firestore'
import { setSearchedRestaurant } from '../redux/action'
import { useFonts } from "@use-expo/font";
import { styles } from '../styles'
import { uploadBytes, getDownloadURL, ref as tef } from 'firebase/storage';
import { storage } from '../firebase-config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Feather'
import { Link } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { setFoodItemImage } from '../redux/action'

import { onAuthStateChanged } from 'firebase/auth';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


function RatingFood({ route, navigation }) {
    const { restId, foodId, restName } = route.params;
    const dispatch = useDispatch();

    const [inputRating, setInputRating] = useState("");
    const [name, setName] = useState("")
    const [image, setImage] = useState();
    const [userPhoto, setUserPhoto] = useState()
    const [userId, setUserId] = useState("")
    const [refreshing, setRefreshing] = useState(false);
    const tookPicture = useSelector(state => state.foodImage);
    const [restaurantColor, setRestaurantColor] = useState("")
    const searchedRestaurant = useSelector(state => state.searchedRestaurant)
    const restaurantId = useSelector(state => state.restaurantId)
    // const username = useSelector(state => state.username)
    //const userPhoto = useSelector(state => state.userPhoto)
    //const userId = useSelector(state => state.userId)
    const foodItemId = useSelector(state => state.foodItemId)
    const food = useSelector(state => state.food)
    const foodImage = useSelector(state => state.foodImage)

    const [toggle, setToggle] = useState(false)
    const [executionvalue, setExecutionValue] = useState()
    const [executionvalueColor, setExecutionValueColor] = useState(0)
    const [executionvalueText, setExecutionValueText] = useState("Rate 1-5")

    const [appearancevalue, setAppearanceValue] = useState()
    const [appearanceColor, setAppearanceValueColor] = useState(0)
    const [appearanceValueText, setAppearanceValueText] = useState("")

    const [tastevalue, setTasetValue] = useState()
    const [tasteColor, setTasteValueColor] = useState(0)
    const [tasteText, setTasteValueText] = useState("")

    const [loggedin, setloggedin] = useState("")

    const [eatagain, setEatAgain] = useState(0);

    const [imageUrl, setImageUrl] = useState(false)

    const AddFoodRating = async () => {
        const date = new Date().toDateString();
        const uuid = uid();
        update(ref(database, "restaurants/" + restId + "/foods" + "/" + foodId), {
            ratingCount: increment(1),
        });
        if (eatagain === 1) {
            console.log("EATING AGAIN")
            update(ref(database, "restaurants/" + restId + "/foods" + "/" + foodId), {
                eatagain: increment(1),
            });
        }
        if (imageUrl == true) {
            const imageRatingRaf = tef(storage, 'foodRatingImage/' + foodId + "/" + userId);
            if (imageRatingRaf !== null) {
                getDownloadURL(imageRatingRaf)
                    .then((rateurl) => {
                        Object.values(imageRatingRaf).map((foodData) => {
                            console.log("Rating imaged URL :", rateurl)

                            set(ref(database, "restaurants/" + restId + "/ratings" + "/" + foodId + `/${userId}`), {
                                review_id: uuid,
                                food_id: foodId,
                                food_name: food,
                                rating: inputRating,
                                restaurant: searchedRestaurant,
                                raters_name: name,
                                verfied: loggedin,
                                upvotes: 0,
                                rating_date: date,
                                taste: tastevalue,
                                appearance: appearancevalue,
                                execution: executionvalue,
                                personaleatagain: eatagain,
                                user_Id: userId,
                                userPhoto: userPhoto,
                                likes: 0,
                                dislikes: 0,
                                imageUrl: rateurl

                            });

                        })
                    })
            }
        }
        if (imageUrl == false){
            set(ref(database, "restaurants/" + restId + "/ratings" + "/" + foodId + `/${userId}`), {
                review_id: uuid,
                food_id: foodId,
                food_name: food,
                rating: inputRating,
                restaurant: searchedRestaurant,
                raters_name: name,
                verfied: loggedin,
                upvotes: 0,
                rating_date: date,
                taste: tastevalue,
                appearance: appearancevalue,
                execution: executionvalue,
                personaleatagain: eatagain,
                user_Id: userId,
                userPhoto: userPhoto,
                likes: 0,
                dislikes: 0,
                imageUrl: null

            });
        }
        setInputRating("");

        dispatch(setFoodItemImage(""))

        navigation.goBack()

    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setloggedin(true)
                setName(user.displayName)
                setUserId(user.uid)
                setUserPhoto(user.photoURL)
                console.log(user)
                // const userRef = ref(database, "user/" + user.uid)
                // onValue(userRef, (snapshot) => {
                //     const data = snapshot.val();
                //     if (data !== null) {
                //         console.log(data)
                //         setIsRestaurant(data.hasRestaurant)
                //     }

                // });

            } else {
                console.log("unverifed user")
                setloggedin(false)
                setName("Guest")
            }
        })
        // if (name === "") {
        //     console.log("unverifed user")
        //     setName("Guest")
        // }
        console.log(userId)
        executionValueChanger();
        appearanceValueChanger();
        tasteValueChanger();
        setRestaurantColor("#F6AE2D")

    }, [executionvalue, appearancevalue, tastevalue])

    const executionValueChanger = () => {

        if (executionvalue === 0) {
            setExecutionValueText('Rate 1-5')
            setExecutionValueColor("grey")


        }
        if (executionvalue === 1) {
            setExecutionValueText('Horrible')
            setExecutionValueColor("#F62D2D")


        }
        if (executionvalue === 2) {
            setExecutionValueText('Poor')
            setExecutionValueColor("#EE8761")


        }
        if (executionvalue === 3) {
            setExecutionValueText('Decent')
            setExecutionValueColor("#F6AE2D")


        }
        if (executionvalue == 4) {
            setExecutionValueText('Good')
            setExecutionValueColor("#FFEA5E")


        }
        if (executionvalue == 5) {
            setExecutionValueText('Spectacular')
            setExecutionValueColor("#A8D7B5")

        }
    }
    const appearanceValueChanger = () => {

        if (appearancevalue === 0) {
            setAppearanceValueText('')
            setAppearanceValueColor("grey")


        }
        if (appearancevalue === 1) {
            setAppearanceValueText('Repellent')
            setAppearanceValueColor("#F62D2D")

        }
        if (appearancevalue === 2) {
            setAppearanceValueText('Dull')
            setAppearanceValueColor("#EE8761")


        }
        if (appearancevalue === 3) {
            setAppearanceValueText('Decent')
            setAppearanceValueColor("#F6AE2D")


        }
        if (appearancevalue == 4) {
            setAppearanceValueText('Appealing')
            setAppearanceValueColor("#FFEA5E")


        }
        if (appearancevalue == 5) {
            setAppearanceValueText('Mouth-watering')
            setAppearanceValueColor("#A8D7B5")

        }
    }
    const tasteValueChanger = () => {

        if (tastevalue === 0) {
            setTasteValueText('')
            setTasteValueColor("grey")

        }
        if (tastevalue === 1) {
            setTasteValueText('Inedible')
            setTasteValueColor("#F62D2D")


        }
        if (tastevalue === 2) {
            setTasteValueText('Nasty')
            setTasteValueColor("#EE8761")


        }
        if (tastevalue === 3) {
            setTasteValueText('Decent')
            setTasteValueColor("#F6AE2D")


        }
        if (tastevalue == 4) {
            setTasteValueText('Tastes great!')
            setTasteValueColor("#FFEA5E")

        }
        if (tastevalue == 5) {
            setTasteValueText('Exquisite')
            setTasteValueColor("#A8D7B5")

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

        const metadata = {
            contentType: `${userId}`,
            user: `${name}`
        }
        if (Platform.OS === 'web') {
            setImageUrl(true)
            const getImage = tef(storage, 'foodRatingImage/' + foodId + "/" + userId); //how the image will be addressed inside the storage
            //convert image to array of bytes
            const img = await fetch(pickerResult.uri);
            const bytes = await img.blob();
            await uploadBytes(getImage, bytes, metadata);

        } else {
            setImageUrl(true)
            console.log(pickerResult.uri)
            const getImage = tef(storage, 'foodRatingImage/' + foodId + "/" + userId); //how the image will be addressed inside the storage
            //convert image to array of bytes
            const img = await fetch(pickerResult.uri);
            const bytes = await img.blob();
            await uploadBytes(getImage, bytes, metadata);
        }

    }


    return (
        <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }} refreshControl={
            <RefreshControl refreshing={refreshing} />
        }>


            <Icon
                color="black" size={35} name="arrow-left" onPress={() => { navigation.goBack() }}
            />
            <View style={[styles.shadowProp, { backgroundColor: 'white', alignSelf: 'center', padding: 5, margin: 20, borderRadius: 20, width: '90%', maxWidth: 650 }]}>


                <View style={{ flex: 1, padding: 12 }}>
                    <View style={{ flex: 1, padding: 10, borderRadius: 13, }}>
                        <Text style={[styles.subHeaderText, { fontSize: 20 }]}>Lets rate,</Text>
                        <Text style={styles.subHeaderText}>{searchedRestaurant}</Text>
                        <Text style={[styles.headerText, { fontSize: 40, marginBottom: 20 }]}>{food}</Text>
                        <Text style={{ fontSize: 35, fontWeight: "400" }}>1.  Rate Your Food</Text>


                        {Platform.OS === "web" ?
                            <View>
                                <Button buttonStyle={[styles.button, { marginHorizontal: 40, backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} title="Add Picture" onPress={openImagePickerAsync} />
                                <Image source={{ uri: image }} style={{ alignSelf: 'center', width: 200, height: 200, borderRadius: 30, backgroundColor: '#D3D3D3' }} /></View>
                            :
                            <View>
                                <Button buttonStyle={[styles.button, { marginHorizontal: 40, backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} title="Add Picture" onPress={() => { navigation.navigate("Camera") }} />
                                <Image source={{ uri: foodImage }} style={{ alignSelf: 'center', width: 200, height: 200, borderRadius: 30, backgroundColor: '#D3D3D3' }} />
                            </View>
                        }


                        <Text style={[styles.subHeaderText, { fontSize: 20, alignSelf: 'center', marginTop: 30 }]}>Would you eat again?</Text>
                        {!toggle ?
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Button buttonStyle={[styles.button, { marginHorizontal: 40, paddingHorizontal: 30, backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} title="Yes" onPress={() => { setEatAgain(1), setToggle(true) }} />
                                <Button buttonStyle={[styles.button, { marginHorizontal: 40, paddingHorizontal: 30, opacity: 0.5, shadowOpacity: 0 }]} titleStyle={styles.buttonTitle} title="No" onPress={() => { setEatAgain(0) }} />
                            </View>
                            :
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Button buttonStyle={[styles.button, { marginHorizontal: 40, paddingHorizontal: 30, opacity: 0.5, shadowOpacity: 0 }]} titleStyle={styles.buttonTitle} title="Yes" onPress={() => { setEatAgain(1) }} />
                                <Button buttonStyle={[styles.button, { marginHorizontal: 40, paddingHorizontal: 30, backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} title="No" onPress={() => { setEatAgain(0), setToggle(false) }} />
                            </View>
                        }

                        <View style={{ marginVertical: 20 }}>
                            <Text style={{ fontSize: 25, fontWeight: "500" }}>Execution</Text>
                            <Text style={{ fontSize: 17, margin: 5 }}>Execution, Did yout food come out in a reasonable time? Did the food choice come together? initial feelings?</Text>
                            <Text style={[styles.subHeaderText, { fontSize: 20 }]}>"{executionvalueText}"</Text>

                            <Slider
                                onValueChange={(value) => { setExecutionValue(value) }}
                                maximumValue={5}
                                minimumValue={0}
                                step
                                minimumTrackTintColor={executionvalueColor}
                                style={[styles.shadowProp, { height: 30, borderRadius: 20, backgroundColor: `${executionvalueColor}`, marginHorizontal: 30 }]}
                            />

                        </View>
                        <Divider />
                        <View style={{ marginVertical: 10 }}>
                            <Text style={[styles.subHeaderText, { fontSize: 25 }]}>Appearance</Text>
                            <Text style={{ fontSize: 17, margin: 5 }}>Appearance, Is it pleasing to the eye? Does it look appertizing? Did you want to take a big bite out of it?</Text>
                            <Text style={[styles.subHeaderText, { fontSize: 20 }]}>"{appearanceValueText}"</Text>
                            <Slider
                                onValueChange={(value) => { setAppearanceValue(value) }}
                                maximumValue={5}
                                minimumValue={0}
                                step
                                minimumTrackTintColor={appearanceColor}
                                style={[styles.shadowProp, { height: 30, borderRadius: 20, backgroundColor: `${appearanceColor}`, marginHorizontal: 30 }]}
                            />
                        </View>
                        <Divider />
                        <View style={{ marginVertical: 10 }}>
                            <Text style={[styles.subHeaderText, { fontSize: 25 }]}>Taste</Text>
                            <Text style={{ fontSize: 17, margin: 5 }}>Taste, Is it pleasing to the taste buds? Does it make you want more? Is there an appropriate balance of flavors?</Text>
                            <Text style={[styles.subHeaderText, { fontSize: 20 }]}>"{tasteText}"</Text>
                            <Slider
                                onValueChange={(value) => { setTasetValue(value) }}
                                maximumValue={5}
                                minimumValue={0}
                                step
                                minimumTrackTintColor={tasteColor}
                                style={[styles.shadowProp, { height: 30, borderRadius: 20, backgroundColor: `${tasteColor}`, marginHorizontal: 30 }]}
                            />
                        </View>
                        <Divider color="black" style={{ marginVertical: 10 }} />
                        <Text style={{ fontSize: 35, fontWeight: "400" }}>2.  Review</Text>
                        <TextInput
                            style={[styles.inputContainer, { padding: 10, alignSelf: 'center', }]}
                            onChangeText={setName}
                            value={name}
                            placeholder="Name"
                            autoCapitalize='words'

                        />
                        <TextInput
                            style={[styles.inputContainer, { padding: 14, paddingBottom: 50, alignSelf: 'center' }]}
                            onChangeText={setInputRating}
                            value={inputRating}
                            placeholder="This was the best food I have ever had because..."
                            numberOfLines={10}
                            multiline="true"
                            maxlength="70"
                        />

                        <Text style={{ fontSize: 17, margin: 5 }}>Before leaving a negative review please try to work with the restaurant for them to improve on your food.</Text>

                        <Button onPress={AddFoodRating} buttonStyle={[styles.button, { marginHorizontal: 40, backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} title="Finish" />
                    </View>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );

}


export default RatingFood