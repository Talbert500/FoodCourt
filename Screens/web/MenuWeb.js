import React from 'react';
import { Animated, ImageBackground, KeyboardAvoidingView, Dimensions, FlatList, ScrollView, View, TouchableOpacity, Image, StyleSheet, Text, Platform, Linking, Keyboard, BackHandler } from 'react-native';
import { Button, Input } from 'react-native-elements'
import { database } from '../../firebase-config'
import { ref, onValue, orderByValue, equalTo, query, limitToLast } from 'firebase/database'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styles } from '../../styles'
import { setFoodItemId, setSearchedRestaurantImage, setSearchedRestaurant, setUserProps } from '../../redux/action'
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
import LottieView from 'lottie-react-native';
import Footer from '../../Components/Footer';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Icon } from 'react-native-elements'


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
    const spring = new Animated.Value(0.3)



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

    const startAnmiationa = () => {
        spring.setValue(0.3)
        Animated.spring(
            spring, {
            toValue: 1.1,
            bounciness: 30,
            speed: 10

        }
        ).start();
    }

    const onHover = () => {
        spring.setValue(0.3)
        Animated.spring(
            spring, {
            toValue: 1,
            bounciness: 30,
            speed: 10

        }
        ).start();
    }
    useEffect(() => {
        startAnmiationa();

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
            setSetCate("")
            setSetMenu("")
            setMenuItem(foodItem)
            setFiltered(null)
            setSelectedCategory(null)
            setmenusDesc("")

        }


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

    return (
        <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }}>
            {Platform.OS === 'web' ? (
                <View style={{ width: '100%', padding: 5, flexDirection: "row", backgroundColor: Platform.OS === "web" ? "white" : "transparent", zIndex: 1 }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
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
                                        navigation.navigate("MenuEdit", {
                                            restId: loginSession
        
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
            <View style={{ flexDirection: 'row', flexWrap: 'wrap-reverses', margin: 5 }}>
                {(windowWidth >= 500) ?
                    <View style={{ marginTop: 10 }}>
                        <View style={{ marginBottom: 10 }}>
                            <Icon onPress={()=>{navigation.navigate("Home")}} type="entypo" name="home" color="#F6AE2D" size={35} />
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Icon type="material-community" name="message-draw" color="#F6AE2D" size={35} />
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Icon type="font-awesome5" name="bookmark" color="#F6AE2D" size={35} />
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Icon type="fontisto" name="player-settings" color="#F6AE2D" size={35} />
                        </View>
                    </View>
                    :
                    <View></View>
                }
                <View style={[styles.shadowProp, { backgroundColor: 'white', marginHorizontal: 10, borderRadius: 13, overflow: 'hidden', flex: 1 }]}>
                    <ImageBackground style={{ margin: 5, borderTopLeftRadius: 13, borderTopRightRadius: 13, overflow: 'hidden', height: Platform.OS === "web" ? 250 : 75 }} resizeMode="cover" source={{ uri: restaurantImage }}>
                        <LinearGradient
                            colors={['#00000000', '#000000']}
                            style={{ height: '100%', width: '100%' }}>
                            <View style={{ width: "100%", maxWidth: 600, flex: 1, alignSelf: 'center', flexDirection: 'row-reverse' }}>
                                <View style={{ justifyContent: 'flex-end', margin: 10 }}>
                                    {(windowWidth >= 500) ?
                                        <TouchableOpacity onPress={startAnmiationa}>
                                            <Animated.Image style={{ height: 80, width: 80, borderRadius: 100, transform: [{ scale: spring }] }} source={require("../../assets/guestphoto.jpg")} />
                                        </TouchableOpacity> :
                                        <></>}
                                </View>
                                <View style={{
                                    flex: 1,
                                    justifyContent: "flex-end",
                                }}>
                                    <Text ellipsizeMode='tail' numberOfLines={2} style={[styles.subHeaderText, { color: "white", fontSize: 16, textAlign: 'left', marginLeft: 10 }]}>100 Regulars</Text>
                                    <Text ellipsizeMode='tail' numberOfLines={2} style={[styles.headerText, { color: "white", fontSize: 50, textAlign: 'left', marginLeft: 10 }]}>{searchedRestaurant} </Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </ImageBackground >
                    <View style={{ maxWidth: 700, alignSelf: Platform.OS === 'web' ? 'center' : '', width: '100%', padding: 10 }}>
                        <View>
                            <View style={{ alignSelf: "center", maxWidth: 500, width: "100%", flexDirection: 'row' }}>

                                <View>
                                    <Text style={{ color: "black", fontWeight: "bold", textAlign: 'left', marginLeft: 10 }}>{overall} Overall Ratings</Text>
                                    {!(loginSession === restaurantId) ?
                                        <View style={{ alignSelf: 'center', flex: 1, margin: 10 }}>
                                            {loggedin ?
                                                <Button title="Rate Us" buttonStyle={[styles.button, { backgroundColor: restaurantColor, maxWidth: 250, width: 250 }]}
                                                    titleStyle={styles.buttonTitle}
                                                    onPress={() => {
                                                        navigation.navigate("RatingRestaurant", { restaurantId: restaurantId }),
                                                            dispatch(setSearchedRestaurant(searchedRestaurant, restaurantDesc, restaurant_address, restaurantPhone, restaurantId, restaurantColor))
                                                    }}
                                                />
                                                :
                                                <Button title="Rate Us" buttonStyle={[styles.button, { backgroundColor: restaurantColor, maxWidth: 240, width: 240 }]}
                                                    titleStyle={styles.buttonTitle}
                                                    onPress={googleSignIn}
                                                />
                                            }

                                        </View>
                                        :
                                        <View>
                                            <Button title="Rate Us" buttonStyle={[styles.button, { backgroundColor: restaurantColor, maxWidth: 240, width: 240, opacity: 0.5 }]} titleStyle={styles.buttonTitle} />
                                            <Text onPress={() => navigation.navigate("MenuEdit", {restId: loginSession})} style={{ color: "black", textDecorationLine: 'underline' }}>Menu Dashboard</Text>
                                        </View>
                                    }
                                </View>
                            </View>
                            <View style={{ maxWidth: '100%', width: 550, alignSelf: "center" }}>
                                <Text style={styles.subHeaderText}>About Us</Text>

                                <View >
                                    <Text style={{ margin: 10 }}>{restaurantDesc} </Text>
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
                                    <Text style={styles.headerText}>
                                        Menu
                                    </Text>
                                </View>
                            </View>
                            <View style={{ backgroundColor: 'white' }}>

                            </View>
                            {!(windowWidth >= 500) ?
                                <View style={{ backgroundColor: 'white' }}>

                                    <FlatList
                                        showsHorizontalScrollIndicator={false}
                                        horizontal
                                        data={selectedMenus}
                                        renderItem={renderMenus}
                                        initialNumToRender={10}

                                    />
                                </View>
                                :
                                <View style={{ backgroundColor: 'white' }}>

                                    <FlatList
                                        showsHorizontalScrollIndicator={false}
                                        data={selectedMenus}
                                        renderItem={renderMenus}
                                        initialNumToRender={10}

                                    />
                                </View>
                            }

                            <Divider style={{ margin: 10 }} />
                            {menusDesc === "" ?
                                <Text style={{ textAlign: "center", fontWeight: '800' }}> Pick a Menu</Text>
                                :
                                <Text style={{ textAlign: "center" }}>{menusDesc}</Text>
                            }
                            <View>
                                <Text style={[styles.subHeaderText, { fontSize: 20 }]}>Categories</Text>

                                <FlatList
                                    showsHorizontalScrollIndicator={true}
                                    horizontal
                                    data={selectedCategory}
                                    renderItem={renderItem}
                                    initialNumToRender={10}
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

                                    menu={item.category}
                                    food={item.food}
                                    percent={item.ratingCount > 0 ? (item.eatagain * 100 / item.ratingCount).toFixed(0) : (item.eatagain)}
                                    upvotes={item.upvotes}
                                    upvoteColor={restaurantColor}
                                />
                            }
                        />
                    </View>
                </View>
            </View>
            <View style={{ marginTop: "20%" }}>
                <Footer />
            </View>
        </KeyboardAwareScrollView>
    );
};

export default MenuWeb