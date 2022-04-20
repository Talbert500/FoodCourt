
import React from 'react';
import { RefreshControl, TextInput, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, Input, Divider } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux';
import { uid } from 'uid'
import { database, auth } from '../firebase-config'
import { ref, onValue, orderByValue, equalTo, push, update, set, off } from 'firebase/database'
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
import Card from '../Components/Card'
import { ScrollView } from 'react-native-gesture-handler';
import Emoji from 'react-native-emoji';



const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function RatingRestaurant({ route, navigation }) {
    let [fontsLoaded] = useFonts({
        'Primary': require('../assets/fonts/proxima_nova_reg.ttf'),
        'Bold': require('../assets/fonts/proxima_nova_bold.ttf'),
        'Black': require('../assets/fonts/proxima_nova_black.otf')
    });

    const { restaurantId, userId } = route.params;
    const dispatch = useDispatch();
    const [inputRating, setInputRating] = useState("");
    const [name, setName] = useState()
    const [image, setImage] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [toggle, setToggle] = useState(true)
    const [userPhoto, setUserPhoto] = useState()
    const [foodItems, setFoodItem] = useState();
    const [text, onChangeText] = useState("")
    const [filtered, setFiltered] = useState([]);
    const [clickedFood, setClickedFood] = useState();

    const searchedRestaurant = useSelector(state => state.searchedRestaurant)
    const foodItemId = useSelector(state => state.foodItemId)
    const food = useSelector(state => state.food)
    const foodImage = useSelector(state => state.foodImage)


    // const restaurantId = "3vL62uZRwcS3nBG4miSfywKyr133"
    // const userId = "kkaW6jvTzWghR27IGuXckUUhul1"
    // const tookPicture = "Juanderful Tacos"
    // const restaurantColor = "#fff393"
    // const searchedRestaurant = "Waffletto"
    // const foodItemId = "test"
    // const food = "test"
    // const foodImage = "test"

    const [executionvalue, setExecutionValue] = useState()
    const [executionvalueColor, setExecutionValueColor] = useState(0)
    const [executionvalueText, setExecutionValueText] = useState("")

    const [eatagain, setEatAgain] = useState(0);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);

    const [imageUrl, setImageUrl] = useState(false)
    const [siteGuidelines,setSiteGuidelines]= useState("Site Guidelines")

    const termsOfUse = "Terms of Use"
    const privacyPolicy = "Privacy Policy"

    const AddFoodRating = async () => {
        console.log(imageUrl)
        const date = new Date().toDateString();
        const uuid = uid();
        if (imageUrl == true) {
            console.log("image available")
            const imageRatingRaf = tef(storage, 'foodRatingImage/' + foodItemId + "/" + userId);
            if (imageRatingRaf !== null) {
                getDownloadURL(imageRatingRaf)
                    .then((rateurl) => {
                        Object.values(imageRatingRaf).map((foodData) => {
                            console.log("Rating imaged URL :", rateurl)
                            update(ref(database, "restaurants/" + restaurantId + "/ratings/" + clickedFood + "/" + userId), {
                                rating: inputRating,
                                restaurant: searchedRestaurant,
                                raters_name: name,
                                upvotes: 0,
                                rating_date: date,
                                execution: executionvalue,
                                personaleatagain: eatagain,
                                likes: 0,
                                dislikes: 0,
                                imageUrl: rateurl,
                                review_id: uuid,
                                userPhoto: userPhoto,

                            });

                        })
                    })
            }
        }
        if (imageUrl == false) {
            console.log("image notavailable")
            set(ref(database, "restaurants/" + restaurantId + "/ratings" + "/" + clickedFood + `/${userId}`), {
                rating: inputRating,
                restaurant: searchedRestaurant,
                raters_name: name,
                upvotes: 0,
                rating_date: date,
                execution: executionvalue,
                personaleatagain: eatagain,
                likes: 0,
                dislikes: 0,
                imageUrl: null,
                review_id: uuid,
                userPhoto: userPhoto,
            });
        }

        setInputRating("");
        const metadata = {
            contentType: `${uuid}`,
            user: `${name}`
        }

        navigation.navigate("Food", {
            restId: restaurantId,
            foodId: clickedFood,
            restName: searchedRestaurant,
        })

    }

    function getFullMenu() {
        const getMenu = ref(database, 'restaurants/' + restaurantId + '/foods/')
        onValue(getMenu, (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                console.log(data)
                setFoodItem("")
                console.log("THE FOOD ARRAY", data)
                Object.values(data).map((foodData) => {
                    setFoodItem((oldArray) => [...oldArray, { id: foodData.food_id, value: foodData.food, category: foodData.category}]);
                })
            }
        })

    }
    useEffect(() => {
        getFullMenu();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setName(user.displayName)
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
    }, [])

    useEffect(() => {
        console.log("second")
        executionValueChanger();

    }, [executionvalue])

    const executionValueChanger = () => {

        if (executionvalue === 0) {
            setExecutionValueText('')
            setExecutionValueColor("grey")


        }
        if (executionvalue === 1) {
            setExecutionValueText('Run Away')
            setExecutionValueColor("#F62D2D")


        }
        if (executionvalue === 2) {
            setExecutionValueText('Id rather go home and cook!')
            setExecutionValueColor("#EE8761")


        }
        if (executionvalue === 3) {
            setExecutionValueText('Ok')
            setExecutionValueColor("#F6AE2D")


        }
        if (executionvalue == 4) {
            setExecutionValueText('I crave it , I seek it... regularly')
            setExecutionValueColor("#FFEA5E")


        }
        if (executionvalue == 5) {
            setExecutionValueText('I would drive 20 miles!')
            setExecutionValueColor("#A8D7B5")

        }
    }

    const searchFilter = (text) => {
        if (text) {
            const newData = foodItems.filter((item) => {
                const itemData = item.value ?
                    item.value.toUpperCase()
                    : ' '.toUpperCase()
                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;
            });
            console.log(filtered)
            setFiltered(newData.sort((a, b) => b.upvotes - a.upvotes));
            onChangeText(text);
        } else {
            setFiltered(foodItems.sort((a, b) => b.upvotes - a.upvotes));
            onChangeText(text);

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
            const getImage = tef(storage, 'foodRatingImage/' + foodItemId + "/" + userId); //how the image will be addressed inside the storage
            //convert image to array of bytes
            const img = await fetch(pickerResult.uri);
            const bytes = await img.blob();
            await uploadBytes(getImage, bytes, metadata);


        } else {
            console.log(pickerResult.uri)
            const getImage = tef(storage, 'foodRatingImage/' + foodItemId + "/" + userId); //how the image will be addressed inside the storage
            //convert image to array of bytes
            const img = await fetch(pickerResult.uri);
            const bytes = await img.blob();
            await uploadBytes(getImage, bytes, metadata);
            setImageUrl(true)
        }
    }

    return (
        <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ backgroundColor: "white", flex: 1 }} refreshControl={
            <RefreshControl refreshing={refreshing} />
        }>
            {Platform.OS === 'web' ? (
                <View style={[styles.shadowProp, { width: '100%', padding: 0, flexDirection: "row", backgroundColor: Platform.OS === "web" ? "white" : "transparent", zIndex: 1 }]}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <Image
                            style={{
                                alignItems: 'center',
                                width: 75,
                                height: 75,
                                resizeMode: "contain",
                                opacity: Platform.OS === 'web' ? 1 : 0
                            }}
                            source={require('../assets/splash.png')} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row", marginLeft: 'auto' }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 30 }}>
                            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                                <Image
                                    style={{ height: 40, width: 40, borderRadius: 40, marginHorizontal: 10 }}
                                    source={{ uri: userPhoto }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : (<></>)
            }
            {/* <Icon
                color="black" size={35} name="arrow-left" onPress={() => { navigation.goBack() }}
            /> */}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F6AE2D', width: '100%' }}>
                <Text style={{ margin: 5 }}>Go Back to: </Text>
                <TouchableOpacity onPress={() => navigation.navigate("RestaurantWeb", {
                    restId: restaurantId,
                })}>
                    <Text style={[styles.subHeaderText, { textDecorationLine: 'underline', fontSize: 15, fontFamily: 'Primary', marginVertical: 5 }]}>{searchedRestaurant}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, backgroundColor: 'white', padding: 20, maxWidth: 650, alignSelf: 'center' }}>

                <Text style={[styles.subHeaderText, { fontSize: 18, fontFamily: 'Primary', marginLeft: 15 }]}>Lets rate,</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Emoji name="heart" style={{ fontSize: (windowWidth >= 500) ? 35 : 25, alignSelf: 'center' }} />
                    <Text style={[styles.headerText, { fontFamily: 'Primary', fontSize: (windowWidth >= 500) ? 60 : 30, alignSelf: 'center' }]}>{searchedRestaurant}'s {value} ?</Text>
                </View>
                <View style={[styles.menuItemContaner, { marginVertical: 20 }]}>
                    <Input
                        inputContainerStyle={{ borderBottomWidth: 0, marginBottom: Platform.OS === 'web' ? -15 : -20 }}
                        onChangeText={(text) => searchFilter(text)}
                        value={text}
                        placeholder="What food did you eat?"
                        leftIcon={{ type: 'material-community', name: "taco" }}
                    />
                </View>
                <View style={[styles.shadowProp, { maxHeight: 250 }]}>
                    <FlatList
                        data={filtered}
                        keyExtractor={(item, index) => index}
                        renderItem={({ item, index }) =>
                        (
                            <TouchableOpacity onPress={() => { setClickedFood(item.id), setValue(item.value), onChangeText(item.value) }}>
                                <View style={{ height: 50, backgroundColor: (item.id === clickedFood) ? '#ebebeb' : 'white' }}>
                                    <Text style={{ fontFamily: 'Bold', padding: 20 }}>
                                        {item.value} | {item.category}
                                    </Text>
                                </View>
                                <Divider />
                            </TouchableOpacity>
                        )
                        }
                    />
                </View>
                <View style={[styles.shadowProp, { backgroundColor: 'white', alignSelf: 'center', padding: 15, margin: 20, borderRadius: 5, maxWidth: 650, flex: 1, width: "100%" }]}>
                    <Text style={{ fontSize: 21, fontFamily: 'Bold', marginBottom: 5 }}>Would you eat here again?</Text>
                    {!toggle ?
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                            <Button buttonStyle={[styles.button, { marginHorizontal: 40, paddingHorizontal: 30, backgroundColor: "white", borderWidth: 2, borderColor: '#ECECEC' }]} titleStyle={[styles.buttonTitle, { color: "black" }]} title="Yes" onPress={() => { setEatAgain(1), setToggle(true) }} />
                            <Button buttonStyle={[styles.button, { marginHorizontal: 40, paddingHorizontal: 30, backgroundColor: "#c34632" }]} titleStyle={[styles.buttonTitle, { color: "white" }]} title="No" onPress={() => { setEatAgain(0) }} />
                        </View>
                        :
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                            <Button buttonStyle={[styles.button, { marginHorizontal: 40, paddingHorizontal: 30, backgroundColor: "#c5e1a5" }]} titleStyle={styles.buttonTitle} title="Yes" onPress={() => { setEatAgain(1) }} />
                            <Button buttonStyle={[styles.button, { marginHorizontal: 40, paddingHorizontal: 30, backgroundColor: "white", borderWidth: 2, borderColor: '#ECECEC' }]} titleStyle={[styles.buttonTitle, { color: "black" }]} title="No" onPress={() => { setEatAgain(0), setToggle(false) }} />
                        </View>
                    }
                </View>

                <View style={[styles.shadowProp, { width: "100%", backgroundColor: 'white', alignSelf: 'center', padding: 15, borderRadius: 5, maxWidth: 650, flex: 1 }]}>
                    <Text style={{ fontSize: 21, fontFamily: 'Bold', marginBottom: 5 }}>Take a Photo</Text>
                    {Platform.OS === "web" ?
                        <View style={{ flexDirection: 'row', flex: 1, padding: 10 }}>
                            <Button buttonStyle={[styles.button, { alignItems: 'center', backgroundColor: '#F6AE2D' }]} titleStyle={styles.buttonTitle} title="Add Picture" onPress={openImagePickerAsync} />
                            <Image source={{ uri: image }} style={{ marginBottom: 20, marginLeft: "auto", justifyContent: 'center', alignSelf: 'center', width: (windowWidth >= 500) ? 150 : 100, height: (windowWidth >= 500) ? 150 : 100, borderRadius: 5, backgroundColor: '#D3D3D3' }} /></View>
                        :
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Button buttonStyle={[styles.button, { marginHorizontal: 40, backgroundColor: '#F6AE2D' }]} titleStyle={styles.buttonTitle} title="Add Picture" onPress={() => { navigation.navigate("Camera") }} />
                            <Image source={{ uri: image }} style={{ marginLeft: "auto", justifyContent: 'center', alignSelf: 'center', width: 200, height: 200, borderRadius: 5, backgroundColor: '#D3D3D3' }} />
                        </View>
                    }
                </View>

                <View style={[styles.shadowProp, { width: '100%', backgroundColor: 'white', alignSelf: 'center', padding: 15, margin: 20, borderRadius: 5, maxWidth: 650 }]}>
                    <Text style={{ fontSize: 21, fontFamily: 'Bold', marginBottom: 5 }}>Overall</Text>
                    <Text style={{ fontSize: 14, fontWeight: '400', fontFamily: 'Primary' }}> Did yout food come out in a reasonable time? Did the food choice come together? initial feelings?</Text>
                    <Text style={[styles.subHeaderText, { fontSize: 20 }]}>"{executionvalueText}"</Text>
                    <Slider
                        onValueChange={(value) => { setExecutionValue(value) }}
                        maximumValue={5}
                        minimumValue={0}
                        step
                        minimumTrackTintColor={executionvalueColor}
                        style={[styles.shadowProp, { height: 25, borderRadius: 20, backgroundColor: `${executionvalueColor}`, marginHorizontal: 30 }]}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.subHeaderText, { fontSize: 10, margin: 10 }]}>1 - Run Away</Text>
                        <Text style={[styles.subHeaderText, { fontSize: 10, marginLeft: 'auto', margin: 10 }]}>5 - I would drive 20 miles!</Text>
                    </View>
                </View>

                <View style={[styles.shadowProp, { width: '100%', backgroundColor: 'white', alignSelf: 'center', padding: 15, margin: 20, borderRadius: 5, maxWidth: 650 }]}>
                    <Text style={{ fontSize: 20, fontWeight: "500" }}>Write a Review</Text>
                    <Text style={{ fontSize: 17, margin: 5 }}>Before leaving a negative review please try to work with the restaurant for them to improve on your food.</Text>

                    <TextInput
                        style={[styles.inputContainer, { padding: 14, paddingBottom: 50, alignSelf: 'center' }]}
                        onChangeText={setInputRating}
                        value={inputRating}
                        placeholder="What would you say if you where this food and ... someone is about to eat you!"
                        numberOfLines={10}
                        multiline="true"
                        maxlength="70"
                    />

                </View>
                <View style={[styles.shadowProp, { width: '100%', backgroundColor: 'white', alignSelf: 'center', padding: 15, margin: 20, borderRadius: 5, maxWidth: 650 }]}>
                    <Text style={{ fontSize: 14, margin: 5, textAlign: "center", fontWeight: 'Primary' }}>By clicking the "Submit" button, I acknowledge that I have read and agreed to the Feiri {<Text style={{textDecorationLine:'underline',fontWeight:'700'}} onPress={()=> {navigation.navigate("Guidelines")}}>Site Guidelines</Text>}, {<Text style={{textDecorationLine:'underline',fontWeight:'700'}} onPress={()=> {navigation.navigate("Guidelines")}}>Terms of Use</Text>}, and {<Text style={{textDecorationLine:'underline',fontWeight:'700'}} onPress={()=> {navigation.navigate("Guidelines")}}>Privacy Policy</Text>}. Submitted data becomes the property of feiri.app. IP addresses are logged.</Text>
                    <Button onPress={AddFoodRating} buttonStyle={[styles.button, { marginHorizontal: 40, backgroundColor: '#F6AE2D', maxWidth: 200, alignSelf: 'center', width: 200 }]} titleStyle={styles.buttonTitle} title="Finish" />
                </View>
            </View>
        </KeyboardAwareScrollView >
    );

}


export default RatingRestaurant