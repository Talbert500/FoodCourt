import React from 'react';
import { ImageBackground, KeyboardAvoidingView, Dimensions, FlatList, ScrollView, View, TouchableOpacity, Image, StyleSheet, Text, Platform, Linking, Keyboard, BackHandler } from 'react-native';
import { Button, Input } from 'react-native-elements'
import { database } from '../../firebase-config'
import { ref, onValue, remove, equalTo, query, limitToLast } from 'firebase/database'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styles } from '../../styles'
import { setFoodItemId, setSearchedRestaurantImage, setSearchedRestaurant, setUserProps, setNewRestaurant } from '../../redux/action'
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
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { useFonts } from '@use-expo/font';
import { Icon } from 'react-native-elements'
import LottieView from 'lottie-react-native';
import Footer from '../../Components/Footer';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";


const Billing = ({ route, navigation }) => {

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
    const [rating, setRating] = useState([]);
    const [menuIndex, setMenuIndex] = useState(0);

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
    const [catfilter, setCatFilter] = useState([]);
    const [loggedin, setloggedin] = useState(false);
    const [isRestaurant, setIsRestaurant] = useState(false)
    const [userPhoto, setUserPhoto] = useState('')
    const [setCate, setSetCate] = useState('');
    const [setMenu, setSetMenu] = useState('');
    const [overall, setOverall] = useState()
    const [foodItem, setFoodItem] = useState([])
    const [overallArray, setOverallArray] = useState('')
    const [selectedMenus, setSelectedMenus] = useState([]);
    const [menusDesc, setmenusDesc] = useState('')
    const [filterCatgory, setFilteredCategory] = useState('')
    const [userName, setUserName] = useState('')

    const [hoverside, setHoverSide] = useState(false)
    const [hoverside1, setHoverSide1] = useState(false)
    const [hoverside2, setHoverSide2] = useState(false)
    const [hoverside3, setHoverSide3] = useState(false)
    const [hoverside4, setHoverSide4] = useState(false)
    const [hoverside5, setHoverSide5] = useState(false)
    const [hoverside6, setHoverSide6] = useState(false)
    const [hoverside7, setHoverSide7] = useState(false)

    function googleSignOut() {
        signOut(auth).then(() => {
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
                dispatch(setUserProps(user.email, user.displayName, user.photoURL))
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
    const getMenus = async () => {
        console.log("Getting Menu")
        const menus = ref(database, "restaurants/" + restId + "/menus")
        onValue(menus, (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {

                console.log(data)
                setSelectedMenus("")
                Object.values(data).map((foodData) => {
                    setSelectedMenus((food) => [...food, foodData]);
                })
                console.log("Menus COLLECTED")
                getCategories();
            }

        })
    };

    const getCategories = async () => {
        console.log("Getting Category")
        const categories = ref(database, "restaurants/" + restId + "/menus/" + menuIndex + "/categories/")
        onValue(categories, (snapshot) => {
            const data = snapshot.val();
            console.log(data)
            if (data !== null) {
                setSelectedCategory("")
                setSelectedCategory(data)
                setFilteredCategory(data)
                getFullMenu();


            }

        })

        const getRestRatings = ref(database, "restaurants/" + restId + "/restaurantRatings");
        onValue(getRestRatings, (snapshot) => {
            const data = snapshot.val();

            if (data !== null) {
                setRating("")
                Object.values(data).map((ratingData) => {
                    setRating((food) => [...food, ratingData]);

                })
            }
        })
    };

    function getFullMenu() {
        const getMenu = ref(database, 'restaurants/' + restId + '/foods/')
        onValue(getMenu, (snapshot) => {

            const data = snapshot.val();
            if (data !== null) {
                console.log(data)
                setFoodItem("")
                setFiltered("")
                setMenuItem("")
                Object.values(data).map((foodData) => {
                    setFoodItem((oldArray) => [...oldArray, foodData]);
                    setMenuItem((oldArray) => [...oldArray, foodData]);
                    //setFiltered((oldArray) => [...oldArray, foodData]);
                })
                //setSetMenu("Breakfast")

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
    const getRestaurant = async () => {
        console.log("Getting Restaurant")
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
            getMenus();
            getImage();
        } else {
            console.log("No souch document!")
        }
    }

    useEffect(() => {

        console.log("Mounting")
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
                        setUserPhoto(data.userPhoto)
                        setUserName(data.userName)
                    }

                });


            } else {
                setloggedin(false)
            }
        })


        getRestaurant();


    }, [])
    const [hover, setHover] = useState(false)
    const [tempSelect, setTempSelect] = useState("")
    //(item.name==selectedCategory)?"white":"black"
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onMouseOver={() => (setTempSelect(item), setHover(true))} onMouseLeave={() => { setHover(false) }} onPress={() => (setFiltered(menuData), onCategoryClick(item))}>
                <View style={[styles.shadowProp, { top: (item === tempSelect) && (hover === true) ? 0 : 3, margin: 15, borderRadius: 10, borderWidth: 1, backgroundColor: (item === setCate) ? "#F2F2F2" : "whtie", borderColor: 'transparent' }]}>
                    <Text style={{ padding: 20, fontWeight: 600 }}>{item} </Text>
                </View>

            </TouchableOpacity>
        )

    }
    const renderMenus = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => (setMenuItem(foodItem), setFiltered(menuData), onMenuClick(index, item.desc, item.time), setMenuIndex(index))}>
                <View style={[(item.desc !== setMenu) ? styles.shadowProp : styles.null, { paddingHorizontal: (item.desc !== setMenu) ? 20 : 60, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderRadius: 5, marginHorizontal: 5, marginBottom: 5, backgroundColor: (item.desc === setMenu) ? restaurantColor : "white", borderColor: 'white' }]}>
                    <Text style={{ padding: 10, fontWeight: 600, color: (item.desc === setMenu) ? "white" : "black" }}>{item.desc} </Text>
                </View>
            </TouchableOpacity >

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
            setSetCate(null)
        } else {
            setFiltered(menuData);
            onChangeText(text);

        }
    }
    function onMenuClick(index, clicked, description) {
        setmenusDesc(description)
        // setSetCate(clicked)
        if (setMenu != clicked) {

            //setting categories
            setSelectedCategory(selectedMenus[index].categories)

            // Object.values(foodItem.categories).map((food) => {
            //     setSelectedMenus((food) => [...food, foodData]);
            // })

            //setting food
            setSetMenu(clicked)
            const newData = foodItem.filter((item) => {
                const cateDate = item.menus ?
                    item.menus.toUpperCase() : ''.toUpperCase()
                const cate = clicked.toUpperCase();

                return cateDate.indexOf(cate) > -1;
            });
            setFiltered(newData);

        } else {
            setSetMenu("")
            setMenuItem(foodItem)
            setmenusDesc("")
            setFiltered(null)
            setSelectedCategory(null)
            setmenusDesc("")
        }


    }
    const userSignOut = () => {
        signOut(auth).then(() => {
            dispatch(setSearchedRestaurant(null, null, null, null, null, null))
            dispatch(setNewRestaurant(null, null, null, null, null))
            if (Platform.OS === 'web') {
                navigation.navigate("RestaurantHome")
            } else {
                navigation.navigate("Home")
            }

        }).catch((error) => {
            console.log(error)
        })
    }

    function onCategoryClick(clicked) {
        // setSetCate(clicked)

        if (setCate != clicked) {
            setSetCate(clicked)
            const newData = menuData.filter((item) => {
                const cateDate = item.category ?
                    item.category.toUpperCase() : ''.toUpperCase()
                const cate = clicked.toUpperCase();

                return cateDate.indexOf(cate) > -1;
            });
            setFiltered(newData);
        } else {
            setSetCate("")
            setFiltered(menuData)
        }


    }
    function deleteFood(food_id) {
        console.log("deleting", food_id)
        remove(ref(database, "restaurants/" + loginSession + "/foods" + `/` + food_id));

    }

    return (
        <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }}>
            {Platform.OS === 'web' ? (
                <View style={{ width: '100%', padding: 5, flexDirection: "row", backgroundColor: Platform.OS === "web" ? "white" : "transparent", zIndex: 1 }}>
                    <TouchableOpacity onPress={() => navigation.replace("RestaurantHome")}>
                        <Image
                            style={{
                                justifyContent: 'flex-start',
                                width: 75,
                                height: 75,
                                resizeMode: "contain",
                            }}
                            source={require('../../assets/splash.png')} />
                    </TouchableOpacity>

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
                                    <Text style={[styles.buttonTitle, { paddingHorizontal: 10 }]}>Old Dashboard</Text>
                                </TouchableOpacity> :
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center',marginRight:30 }}>
                                    <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                                        <Image
                                            style={{ height: 50, width: 50, borderRadius: 40, marginHorizontal: 10 }}
                                            source={{ uri: userPhoto }}
                                        />
                                    </TouchableOpacity>
                                    <Text style={{ fontFamily: 'Bold' }}>{userName}</Text>
                                </View>}
                        </View>

                    )}
                </View>
            ) : (<></>)
            }
            <View style={{ flexDirection: 'row', flexWrap: 'wrap-reverses', margin: 5 }}>
                {(windowWidth >= 500) ?
                    <View style={{ marginTop: 10, padding: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate("MenuEdit", { restId: loginSession })} onMouseOver={() => (setHoverSide(true))} onMouseLeave={() => { setHoverSide(false) }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside === true) ? 0 : 3 }} type="entypo" name="home" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide2(true))} onMouseLeave={() => { setHoverSide2(false) }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside2 === true) ? 0 : 3 }} type="material" name="analytics" color="grey" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide3(true))} onMouseLeave={() => { setHoverSide3(false) }} onPress={() => navigation.navigate("QRMenus", { userId: loginSession })} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside3 === true) ? 0 : 3 }} type="material-community" name="qrcode-edit" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide4(true))} onMouseLeave={() => { setHoverSide4(false) }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside4 === true) ? 0 : 3 }} type="material-community" name="message-text" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide5(true))} onMouseLeave={() => { setHoverSide5(false) }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside5 === true) ? 0 : 3 }} type="material" name="fastfood" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide6(true))} onMouseLeave={() => { setHoverSide6(false) }} onPress={() => { navigation.navigate("Settings") }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside6 === true) ? 0 : 3 }} type="fontisto" name="player-settings" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide7(true))} onMouseLeave={() => { setHoverSide7(false) }} onPress={userSignOut} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside7 === true) ? 0 : 3 }} type="material-community" name="logout-variant" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                    </View>
                    :
                    <View>
                        {/*ON PHONE*/}
                    </View>
                }
                <View style={[styles.shadowProp, { max: 600, backgroundColor: 'white', marginHorizontal: 10, borderRadius: 13, overflow: 'hidden', flex: 3 }]}>
                    <ImageBackground style={{ margin: 5, borderTopLeftRadius: 13, borderTopRightRadius: 13, overflow: 'hidden', height: Platform.OS === "web" ? 250 : 75 }} resizeMode="cover" source={{ uri: restaurantImage }}>
                        <LinearGradient
                            colors={['#00000000', '#000000']}
                            style={{ height: '100%', width: '100%', }}>
                            <View style={{ width: "100%", maxWidth: 600, flex: 1, alignSelf: 'center', flexDirection: 'row-reverse' }}>
                                <View style={{ justifyContent: 'flex-end', margin: 10 }}>
                                </View>
                                <View style={{
                                    flex: 1,
                                    justifyContent: "flex-end",
                                    marginLeft: 10
                                }}>
                                    <Text ellipsizeMode='tail' numberOfLines={2} style={[styles.headerText, { color: "white", textAlign: 'left' }]}>{searchedRestaurant} </Text>
                                    <Text style={{ color: "white", fontWeight: "bold", textAlign: 'left', margin: 10 }}>Viewing as Admin</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </ImageBackground >

                    <View style={{ maxWidth: 850, alignSelf: Platform.OS === 'web' ? 'center' : '', width: '100%', padding: 10 }}>
                        <Text style={styles.subHeaderText}>Your Current Plan: Starter</Text>
                        <View style={{ flexDirection: 'row', justifyContent: "center", flexWrap: "wrap" }}>
                            <View style={[styles.shadowProp, { backgroundColor: 'white', minWidth: 350, maxWidth: 350, flex: 1, margin: 10, padding: 10, borderRadius: 13 }]}>
                                <View style={{ justifyContent: "center", marginLeft: 5 }}>
                                    <Text style={styles.headerText}>Starter</Text>
                                    <Text>The basicis setup for your interactive menu</Text>
                                    <Text style={{ fontSize: 20, }}>$12/per month </Text>
                                </View>
                                <View>

                                    <TouchableOpacity style={[styles.button, { maxWidth: 200, opacity: 0.5 }]} >
                                        <Text style={[styles.buttonTitle, { paddingHorizontal: 5, textAlign: 'center' }]}>Switch to Starter</Text>
                                    </TouchableOpacity>
                                    <View style={{ marginTop: 10, marginLeft: 5 }}>
                                        <Text style={{ fontFamily: 'Bold', marginVertical: 5 }}>Customizable QR Menus</Text>
                                        <Text style={{ fontFamily: 'Bold', marginVertical: 5 }}>Dynamic QR Menus</Text>
                                        <Text style={{ fontFamily: 'Bold', marginVertical: 5 }}>Free delivery</Text>
                                        <Text style={{ fontFamily: 'Bold', marginVertical: 5 }}>Data Metrics on Scans</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.shadowProp, { backgroundColor: 'white', minWidth: 350, maxWidth: 350, flex: 1, margin: 10, padding: 10, borderRadius: 13 }]}>
                                <View style={{ justifyContent: "center", marginLeft: 5 }}>
                                    <Text style={styles.headerText}>Premium</Text>
                                    <Text>The interactive menu and feiri dashboard</Text>
                                    <Text style={{ fontSize: 20, }}>$30/per month </Text>
                                </View>
                                <View>

                                    <TouchableOpacity style={[styles.button, { maxWidth: 200 }]} >
                                        <Text style={[styles.buttonTitle, { paddingHorizontal: 5, textAlign: 'center' }]}>Switch to Premium</Text>
                                    </TouchableOpacity>
                                    <View style={{ marginTop: 10, marginLeft: 5 }}>
                                        <Text style={{ fontFamily: 'Bold', marginVertical: 5 }}>Customizable QR Menus</Text>
                                        <Text style={{ fontFamily: 'Bold', marginVertical: 5 }}>Dynamic QR Menus</Text>
                                        <Text style={{ fontFamily: 'Bold', marginVertical: 5 }}>Free delivery</Text>
                                        <Text style={{ fontFamily: 'Bold', marginVertical: 5 }}>Data Metrics on Scans</Text>
                                    </View>
                                </View>
                            </View>
                        </View>


                    </View>
                </View>
            </View>
            <View style={{ marginTop: "20%" }}>
                <Footer />
            </View>
        </KeyboardAwareScrollView>
    );
};

export default Billing