import React from 'react';
import { ImageBackground, KeyboardAvoidingView, Dimensions, FlatList, ScrollView, View, TouchableOpacity, Image, StyleSheet, Text, Platform, Linking, Keyboard } from 'react-native';
import { Button, Input } from 'react-native-elements'
import { database } from '../../firebase-config'
import { ref, onValue, orderByValue, equalTo, query, limitToLast } from 'firebase/database'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styles } from '../../styles'
import { setFoodItemId, setSearchedRestaurantImage, setSearchedRestaurant,setUserProps } from '../../redux/action'
import { storage } from '../../firebase-config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { uploadBytes, getDownloadURL, ref as tef } from 'firebase/storage';
import ImagePicker from 'react-native-image-picker';
import { Link } from '@react-navigation/native';
import Card from '../../Components/Card'
import { db, provider, auth } from '../../firebase-config'
import { setDoc, getDoc, doc } from 'firebase/firestore'
import { useLinkTo } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { onAuthStateChanged,signOut } from 'firebase/auth';

import { Divider } from 'react-native-elements/dist/divider/Divider';
import { useFonts } from '@use-expo/font';
import Icon from 'react-native-vector-icons/MaterialIcons'
import LottieView from 'lottie-react-native';
import Footer from '../../Components/Footer';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const MenuWeb = ({ route, navigation }) => {

    let [fontsLoaded] = useFonts({
        'Primary': require('../../assets/fonts/proxima_nova_reg.ttf'),
        'Bold': require('../../assets/fonts/proxima_nova_bold.ttf'),
        'Black': require('../../assets/fonts/proxima_nova_black.otf')
    });

    const { restId } = route.params;

    const [selectedCategory, setSelectedCategory] = useState([]);
    const [restaurant_city, setrestaurant_city] = useState("");
    const [restaurant_state, setrestaurant_state] = useState("");
    const [restaurant_zip, setrestaurant_zip] = useState("");
    const [searchedRestaurant, setRestaurantName] = useState([])
    const [restaurantDesc, setRestaurantDesc] = useState([]);
    const [restaurantId, setRestaurantId] = useState([]);
    const [restaurantImage, setRestaurantImage] = useState([]);
    const [restaurantColor, setRestaurantColor] = useState([]);
    const [restaurantPhone, setRestaurantPhone] = useState([]);
    const [restaurant_address, setRestaurantAddress] = useState("");
    const [restaurant_website, setWebsite] = useState('')

    const [loginSession, setLoginSession] = useState('')
    const [accessToken, setAccessToken] = useState('')

    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;

    // const searchedRestaurant = useSelector(state => state.searchedRestaurant)
    // const restaurantDesc = useSelector(state => state.restaurantDesc)
    // const restaurantPhone = useSelector(state => state.restaurantPhone)
    // const restaurantAddress = useSelector(state => state.restaurantAddress)
    // const restaurantId = useSelector(state => state.restaurantId)
    // const restaurantImage = useSelector(state => state.restaurantImage)

    const dispatch = useDispatch();
    const [menuData, setMenuItem] = useState([]);
    const [text, onChangeText] = useState("")
    const [filtered, setFiltered] = useState([]);
    const [catfilter,setCatFilter] = useState([]);
    const [loggedin, setloggedin] = useState(false);
    const [isRestaurant, setIsRestaurant] = useState(false)
    const [userPhoto, setUserPhoto] = useState('')

    function googleSignOut(){
        signOut(auth).then(()=>{
          setloggedin(false);
        }).catch(error => {
          console.log(error)
        })
      
      }
    function googleSignIn() {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log(user)
                setloggedin(true);
                setUserPhoto(user.photoURL)
                dispatch(setUserProps(user.email,user.displayName,user.photoURL))
                //Storing user data
                setDoc(doc(db, "users", user.email), {
                    userEmail: user.email,
                    userName: user.displayName,
                    userId: user.uid,
                    user_date_add: user.metadata.creationTime,
                    last_seen: user.metadata.lastSignInTime,
                    userPhone: user.phoneNumber,
                }).catch((error) => {
                    const errorCode = error.code;
                    console.log("ERROR", errorCode)
                })
                //Also storing but tracked user data in realtime
                set(ref(database, "user/" + user.uid), {
                    userEmail: user.email,
                    userName: user.displayName,
                    userId: user.uid,
                    user_date_add: user.metadata.creationTime,
                    last_seen: user.metadata.lastSignInTime,
                    userPhone: user.phoneNumber,
                    hasRestaurant: "false",
                    userPhoto: user.photoURL
                });


            }).catch((error) => {
                const errorCode = error.code;
                const email = error.email;
                const credential = GoogleAuthProvider.credentialFromResult(error);
                console.log(credential, errorCode)
            })
    }

    const getCategories = async () => {
        const categories = ref(database, "restaurants/" + restId + "/categories")
        onValue(categories, (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                getFullMenu();
                console.log(data)
                setSelectedCategory("")
                Object.values(data).map((foodData) => {
                    setSelectedCategory((food) => [...food, foodData]);
                })
            }

        })
    };

    function getFullMenu() {
        const getMenu = ref(database, 'restaurants/' + restId + '/menus/')
        onValue(getMenu, (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                console.log(data)
                setFiltered("")
                setMenuItem("")
                Object.values(data).map((foodData) => {
                    setMenuItem((oldArray) => [...oldArray, foodData]);
                    setFiltered((oldArray) => [...oldArray, foodData]);
                })
            }
        })
    }

    const getImage = async () => {
        const imageRef = tef(storage, 'imagesRestaurant/' + restId);
        await getDownloadURL(imageRef).then((url) => {
            dispatch(setSearchedRestaurantImage(url))
            setRestaurantImage(url)
        })
    }

    useEffect(() => {

        onAuthStateChanged(auth, (user) => {
            if (user) {
                setloggedin(true)
                setLoginSession(user.uid)
                setAccessToken(user.accessToken)
                console.log(user)

                const userRef = ref(database, "user/" + user.uid)
                onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data !== null) {
                        console.log(data)
                        setIsRestaurant(data.hasRestaurant)
                    }

                });


            } else {
                setloggedin(false)
            }
        })

        const getRestaurant = async () => {
            const docRef = doc(db, "restaurants", restId);
            const snapshot = await getDoc(docRef)
            if (snapshot.exists()) {
                setRestaurantId(snapshot.data().restaurant_id)
                setRestaurantPhone(snapshot.data().restaurant_phone)
                setRestaurantAddress(snapshot.data().restaurant_address)
                setRestaurantDesc(snapshot.data().restaurant_desc)
                setRestaurantName(snapshot.data().restaurant_name)
                setRestaurantColor(snapshot.data().restaurant_color)
                setWebsite(snapshot.data().restaurant_website)

                setrestaurant_city(snapshot.data().restaurant_city)
                setrestaurant_state(snapshot.data().restaurant_state)
                setrestaurant_zip(snapshot.data().restaurant_zip)

                dispatch(setSearchedRestaurant(searchedRestaurant, restaurantDesc, restaurant_address, restaurantPhone, restaurantId, restaurantColor))

                getCategories();
                getImage();
            } else {
                console.log("No souch document!")
            }
        }
        getRestaurant();


    }, [])


    const renderItem = (item) => {
        return (
            <TouchableOpacity onPress={() => (setFiltered(menuData), onCategoryClick(selectedCategory[`${item.index}`]))}>
                <View style={[styles.shadowProp, { margin: 15, borderRadius: 10, borderWidth: 1, backgroundColor: "white", borderColor: 'white' }]}>
                    <Text style={{ padding: 20 }}>{selectedCategory[`${item.index}`]} </Text>
                </View>
            </TouchableOpacity>
        )
    }

    const searchFilter = (text) => {
        if (text) {
            const newData = menuData.filter((item) => {
                const itemData = item.food ?
                    item.food.toUpperCase()
                    : ' '.toUpperCase()
                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;
            });
            setFiltered(newData);
            onChangeText(text);
        } else {
            setFiltered(menuData);
            onChangeText(text);
        }
    }

    function onCategoryClick(clicked) {
        console.log(clicked)  
        setCatFilter(filtered.filter((item) => item.category === clicked))
        
    }

    return (
        <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }}>
            {Platform.OS === 'web' ? (
                <View style={{ width: '100%', padding: 5, flexDirection: "row", backgroundColor: Platform.OS === "web" ? "white" : "transparent", position: 'absolute', zIndex: 1 }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <Image
                            style={{
                                justifyContent: 'flex-start',
                                width: 125,
                                height: 50,
                                resizeMode: "contain",
                            }}
                            source={require('../../assets/logo_name_simple.png')} />
                    </TouchableOpacity>
                    <View style={[styles.shadowProp, { marginHorizontal: 12, overflow: 'hidden', maxWidth: "60%", alignSelf: Platform.OS === 'web' ? 'center' : '', width: '100%' }]}>
                        <Input
                            inputContainerStyle={{ borderBottomWidth: 0, marginBottom: Platform.OS === 'web' ? -15 : -20 }}
                            // onChangeText={(text) => searchFilter(text)}
                            // value={}
                            placeholder="Chicken Tacos..."
                            leftIcon={{ type: 'material-community', name: "taco" }}
                        />
                    </View>

                    {!loggedin ? (

                        // NEED TO BE USER FRIENDLY--- ONLY RESTAURANT FRIENDLY 
                        <View style={{ flexDirection: "row", marginLeft: 'auto' }}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={googleSignIn}
                            >
                                <Text style={[styles.buttonTitle, { paddingHorizontal: 10 }]}>Google Sign In</Text>
                            </TouchableOpacity>
                        </View>

                    ) : (
                        <View style={{ flexDirection: "row", marginLeft: 'auto' }}>

                            {!isRestaurant ?
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate("RestaurantAdmin", {
                                            loginSession: loginSession,
                                            userId: accessToken,
                                        })
                                    }}
                                    style={styles.button}
                                >
                                    <Text style={[styles.buttonTitle, { paddingHorizontal: 10 }]}>Menu Dashboard</Text>
                                </TouchableOpacity> :
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        style={{ height: 50, width: 50, borderRadius: 40, marginHorizontal: 10 }}
                                        source={{ uri: userPhoto }}
                                    />
                                    <TouchableOpacity
                                        style={[styles.buttonOutline, styles.shadowProp, { borderRadius: 5 }]}
                                        onPress={googleSignOut}
                                    >
                                        <Text style={[styles.buttonOutlineText, { padding: 10 }]}>Sign Out</Text>
                                    </TouchableOpacity>
                                </View>}
                        </View>

                    )}
                </View>
            ) : (<></>)
            }
            <View style={{ backgroundColor: 'white' }}>
                <ImageBackground style={{ justifyContent: 'center', paddingTop: "9%", height: Platform.OS === "web" ? 400 : 200 }} resizeMode="cover" source={{ uri: restaurantImage }}>
                    <LinearGradient
                        colors={['#00000000', '#000000']}
                        style={{ height: '100%', width: '100%', }}>
                        <View style={{ width: "100%", maxWidth: 700, flex: 1, alignSelf: 'center' }}>
                            <View style={{
                                margin: 10,
                                alignSelf: Platform.OS === "web" ? 'center' : '',
                                flex: 1,
                                justifyContent: "flex-end",
                                marginRight: 'auto',

                            }}>


                                <Text ellipsizeMode='tail' numberOfLines={2} style={[styles.headerText, { color: "white", }]}>{searchedRestaurant} </Text>
                                <Text style={{ color: "white", fontWeight: "bold" }}>2304 Overall Ratings</Text>
                                {!(loginSession === restaurantId) ?
                                    <Button title="Rate Us" buttonStyle={[styles.button, { backgroundColor: restaurantColor, maxWidth: 200 }]} titleStyle={styles.buttonTitle} onPress={() => { navigation.navigate("RatingRestaurant") }} />
                                    :
                                    <View>
                                        <Button title="Rate Us" buttonStyle={[styles.button, { backgroundColor: restaurantColor, maxWidth: 200, opacity: 0.5 }]} titleStyle={styles.buttonTitle} />
                                        <Text onPress={() => navigation.navigate("RestaurantAdmin", {
                                            loginSession: loginSession,
                                            userId: accessToken,
                                        }

                                        )} style={{ color: "white", textDecorationLine: 'underline' }}>Menu Dashboard</Text>
                                    </View>
                                }

                            </View>
                        </View>
                    </LinearGradient>
                </ImageBackground >
                <View style={{ maxWidth: 700, alignSelf: Platform.OS === 'web' ? 'center' : '', width: '100%', padding: 10 }}>
                    <View>
                        <View style={{ maxWidth: '66%' }}>
                            <Text style={styles.subHeaderText}>About Us</Text>
                            <Text style={{ margin: 10 }}>{restaurantDesc} </Text>
                            <View >
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: 'center', margin: 5 }}>

                                    <Icon name="location-pin" color="black" size="35" />
                                    <Text onPress={() => Linking.openURL(`https://www.google.com/maps/place/${restaurant_address} ${restaurant_city}, ${restaurant_state} ${restaurant_zip}`)}
                                        style={{ fontFamily: 'Bold', fontSize: 14, marginHorizontal: 10 }}>
                                        {restaurant_address} {restaurant_city}, {restaurant_state} {restaurant_zip}
                                    </Text>

                                </View>
                                <View style={{ flexDirection: "row", alignContent: "center", alignItems: 'center', margin: 5 }}>
                                    <Icon name="call" color="black" size="35" />
                                    <Text onPress={() => Linking.openURL("https://htmlcolorcodes.com/")} style={{ fontFamily: 'Bold', fontSize: 14, marginHorizontal: 10 }}>{restaurantPhone}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignContent: "center", margin: 5, alignItems: 'center' }}>
                                    <Icon name="web" color="black" size="35" />
                                    <Text onPress={() => Linking.openURL(`${restaurant_website}`)} style={{ fontFamily: 'Bold', fontSize: 14, marginHorizontal: 10 }} >{restaurant_website}</Text>
                                </View>

                            </View>
                        </View>

                        <Divider style={{ margin: 10 }} />
                        <Text style={styles.headerText}>
                            Menu
                        </Text>
                        <View>
                            <Text style={[styles.subHeaderText, { fontSize: 20 }]}>Categories</Text>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                horizontal
                                data={selectedCategory}
                                keyExtractor={item => item.id}
                                renderItem={renderItem}
                            />
                        </View>
                    </View>
                    <View style={[styles.menuItemContaner, { marginVertical: 20 }]}>
                        <Input
                            inputContainerStyle={{ borderBottomWidth: 0, marginBottom: Platform.OS === 'web' ? -15 : -20 }}
                            onChangeText={(text) => searchFilter(text)}
                            value={text}
                            placeholder="Chicken Tacos..."
                            leftIcon={{ type: 'material-community', name: "taco" }}
                        />

                    </View>
                    <FlatList
                        data={filtered}
                        keyExtractor={(item, index) => index}
                        renderItem={({ item, index }) =>
                            <Card
                                onPress={() => {
                                    dispatch(setFoodItemId(item.food_id, item.food, item.price, item.description, item.upvotes, item.restaurant)), navigation.navigate("Food", {
                                        restId: restId,
                                        foodId: item.food_id,
                                        restName: item.restaurant,
                                    })
                                }}
                                restaurant={item.restaurant}
                                ranking={index + item.upvotes}
                                food={item.food}
                                percent={item.ratingCount > 0 ? (item.eatagain * 100 / item.ratingCount).toFixed(0) : (item.eatagain)}
                                upvotes={item.upvotes}
                                upvoteColor={restaurantColor}
                            />
                        }
                    />
                </View>
            </View>
            <View style={{ marginTop: "20%" }}>
                <Footer />
            </View>
        </KeyboardAwareScrollView>
    );
};

export default MenuWeb