import React from 'react';
import { ActivityIndicator, ImageBackground, KeyboardAvoidingView, Dimensions, FlatList, ScrollView, View, TouchableOpacity, Image, StyleSheet, Text, Platform, Linking, Keyboard, BackHandler } from 'react-native';
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
import axios from 'axios';
import { Icon } from 'react-native-elements'
import LottieView from 'lottie-react-native';
import Footer from '../../Components/Footer';
import { QRapiKey } from '../../config.js'
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";


const Notifications = ({ route, navigation }) => {

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
    const [scanTotal, setScanTotal] = useState("")
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
    const [loggedin, setloggedin] = useState(false);
    const [isRestaurant, setIsRestaurant] = useState(false)
    const [userPhoto, setUserPhoto] = useState('')

    const [foodItem, setFoodItem] = useState([])

    const [ratings, setRatings] = useState([])
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

    const [loadingbio, setLoadingBio] = useState(true);
    const [loadingPic, setLoadingPic] = useState(true);

    const [totalLikes, setTotalLikes] = useState(0);

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
    const getRatings = async () => {
        console.log("Getting Menu")
        const ratings = ref(database, "restaurants/" + restId + "/ratings")
        onValue(ratings, (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                console.log("Ratings", data)
                setRatings("")
                Object.values(data).map((foodData) => {
                    Object.values(foodData).map((ratingData) => {
                        setRatings((rate) => [...rate, ratingData]);
                        console.log(ratingData)
                    })


                })
                console.log("Ratings COLLECTED")
            }

        })
    };


    function QRMenuData(id, to, from) {
        console.log("QR DAYA", id)
        console.log("TO", to)
        console.log("FROM", from)

        const data = JSON.stringify({
            "product_id": `${id}`,
            "from": `${from}`,
            "to": `${to}`,
            "product_type": "qr",
            "interval": "1d"
        });

        const config = {
            method: 'post',
            url: 'https://api.beaconstac.com/reporting/2.0/?organization=105513&method=Products.getVisitorDistribution',
            headers: {
                'Authorization': `Token ${QRapiKey}`,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then(function (response) {
                console.log(response.data);
                setScanTotal(JSON.stringify(response.data.points["0"]["0"]["1"]))
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    function getQrId() {
        const getData = ref(database, 'restaurants/' + restId + '/data/')
        onValue(getData, (snapshot) => {
            const dataqr = snapshot.val();
            if (dataqr !== null) {
                console.log(dataqr.qrid)
                QRMenuData(dataqr.qrid, new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24).valueOf(), new Date().valueOf())


            }
        })

    }




    const getImage = async () => {
        const imageRef = tef(storage, 'imagesRestaurant/' + restId);
        await getDownloadURL(imageRef).then((url) => {
            dispatch(setSearchedRestaurantImage(url))
            setRestaurantImage(url)
            setLoadingPic(false);
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
            getRatings();
            getImage();
            setLoadingBio(false);
        } else {
            console.log("No souch document!")
        }
    }

    useEffect(() => {
        setLoadingBio(true);
        setLoadingPic(true);
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



    const userSignOut = () => {
        signOut(auth).then(() => {
            dispatch(setSearchedRestaurant(null, null, null, null, null, null))
            dispatch(setNewRestaurant(null, null, null, null, null))
            if (Platform.OS === 'web') {
                navigation.replace("RestaurantHome")
            } else {
                navigation.replace("Home")
            }

        }).catch((error) => {
            console.log(error)
        })
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
                                <Image
                                    style={{ height: 50, width: 50, borderRadius: 40, marginHorizontal: 10 }}
                                    source={{ uri: userPhoto }}
                                /> :
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 30 }}>
                                    <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                                        <Image
                                            style={{ height: 40, width: 40, borderRadius: 40, marginHorizontal: 10 }}
                                            source={{ uri: userPhoto }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>

                    )}
                </View>
            ) : (<></>)
            }
            <View style={{ flexDirection: (windowWidth >= 500) ? 'row' : 'column', flexWrap: 'wrap-reverses', margin: 5 }}>
                {(windowWidth >= 500) ?
                    <View style={{ marginTop: 10, padding: 10 }}>
                        <TouchableOpacity onMouseOver={() => (setHoverSide(true))} onMouseLeave={() => { setHoverSide(false) }} onPress={() => { navigation.navigate("MenuEdit", { restId: restId }) }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside === true) ? 0 : 3 }} type="entypo" name="home" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Billing", { restId: loginSession })} onMouseOver={() => (setHoverSide2(true))} onMouseLeave={() => { setHoverSide2(false) }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside2 === true) ? 0 : 3 }} type="material" name="analytics" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide3(true))} onMouseLeave={() => { setHoverSide3(false) }} onPress={() => navigation.navigate("QRMenus", { userId: loginSession })} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside3 === true) ? 0 : 3 }} type="material-community" name="qrcode-edit" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide4(true))} onMouseLeave={() => { setHoverSide4(false) }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside4 === true) ? 0 : 3 }} type="material-community" name="message-text" color="grey" size={35} />
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>

                        <TouchableOpacity onPress={() => navigation.navigate("Billing", { restId: loginSession })} onMouseOver={() => (setHoverSide2(true))} onMouseLeave={() => { setHoverSide2(false) }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside2 === true) ? 0 : 3 }} type="material" name="analytics" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide4(true))} onMouseLeave={() => { setHoverSide4(false) }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside4 === true) ? 0 : 3 }} type="material-community" name="message-text" color="grey" size={35} />
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

                        {/*ON PHONE*/}
                    </View>
                }
                {(windowWidth >= 500) ?
                    <View style={{ flex: 1, maxWidth: 325, margin: 8 }}>

                        {/* SNAPSHOT */}
                        <View style={[styles.shadowProp, { backgroundColor: 'white', padding: 15, marginVertical: 5, borderRadius: 8 }]}>
                            <View style={{ marginVertical: 10 }}>
                                <Text style={{ fontSize: 30, fontFamily: 'Bold' }}>Snapshot</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                <Icon type="ant-design" name="hearto" color="grey" size={20} style={{ margin: 5 }} />
                                <Text numberOfLines={1} style={{ fontFamily: 'Bold' }}>{searchedRestaurant} has 0 regulars</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                <Icon type="material-icons" name="rate-review" outline color="grey" size={20} style={{ margin: 5 }} />
                                <Text numberOfLines={1} style={{ fontFamily: 'Bold' }}>2 new reviews from {searchedRestaurant}</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                <Icon type="feather" name="edit" color="grey" size={20} style={{ margin: 5 }} />
                                <Text numberOfLines={1} style={{ fontFamily: 'Bold' }}>Charles made edit to dashboard</Text>
                            </View>
                            <Text style={{ fontFamily: 'Primary' }}>(Semi-Functional...)</Text>
                        </View>

                        {/* TOP RANKING */}
                        <View style={[styles.shadowProp, { backgroundColor: 'white', padding: 15, marginVertical: 5, borderRadius: 8 }]}>
                            <View style={{ marginVertical: 10 }}>
                                <Text style={{ fontSize: 30, fontFamily: 'Bold' }}>Top Ranking</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                <Text numberOfLines={1} style={{ fontFamily: 'Bold' }}>Rank #23 </Text>
                            </View>
                            <Text style={{ fontFamily: 'Primary' }}>(Not Functional...)</Text>
                        </View>
                        {/* STATS */}
                        <View style={[styles.shadowProp, { backgroundColor: 'white', padding: 15, marginVertical: 5, borderRadius: 8 }]}>
                            <View style={{ marginVertical: 5 }}>
                                <Text style={{ fontSize: 20, fontFamily: 'Bold', textAlign: 'center' }}>Statistics</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                <Icon type="ant-design" name="hearto" color="grey" size={20} style={{ margin: 5 }} />
                                <View>
                                    <Text numberOfLines={1} style={{ fontFamily: 'Bold', fontSize: 18 }}>{totalLikes} </Text>
                                    <Text numberOfLines={1} style={{ fontFamily: 'Bold', fontSize: 12 }}>total likes </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                <Icon type="material-community" name="qrcode-scan" color="grey" size={20} style={{ margin: 5 }} />
                                <View>
                                    <Text numberOfLines={1} style={{ fontFamily: 'Bold', fontSize: 18 }}>{scanTotal} </Text>
                                    <Text numberOfLines={1} style={{ fontFamily: 'Bold', fontSize: 12 }}>total scans </Text>
                                </View>
                            </View>
                            <Text style={{ fontFamily: 'Primary' }}>(Semi-Functional...)</Text>
                        </View>
                        {/* COMP ANALYSIS */}
                        <View style={[styles.shadowProp, { backgroundColor: 'white', padding: 15, marginVertical: 5, borderRadius: 8 }]}>
                            <View style={{ marginVertical: 10 }}>
                                <Text style={{ fontSize: 17, fontFamily: 'Bold' }}>Competitive Analysis</Text>
                                <Text style={{ fontSize: 15, fontFamily: 'Primary' }}>based on 23,000 competitors</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                <Text numberOfLines={1} style={{ fontFamily: 'Bold' }}>Rank #23 </Text>
                            </View>
                            <Text style={{ fontFamily: 'Primary' }}>(Not Functional...).</Text>
                        </View>

                    </View>
                    :
                    <></>
                }
                <View style={[styles.shadowProp, { backgroundColor: 'white', marginHorizontal: 10, borderRadius: 13, overflow: 'hidden', flex: 3 }]}>
                    <ImageBackground style={{ margin: 5, borderTopLeftRadius: 13, borderTopRightRadius: 13, overflow: 'hidden', height: Platform.OS === "web" ? 250 : 75 }} resizeMode="cover" source={{ uri: restaurantImage }}>
                        <LinearGradient
                            colors={['#00000000', '#000000']}
                            style={{ height: '100%', width: '100%', }}>
                            {loadingPic ? <ActivityIndicator size="large" style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }} color="#F6AE2D" /> :
                                <View style={{ width: "100%", maxWidth: 600, flex: 1, alignSelf: 'center', flexDirection: 'row-reverse' }}>
                                    <View style={{ justifyContent: 'flex-end', margin: 10 }}>
                                        {(windowWidth >= 500) ?
                                            <TouchableOpacity >
                                                <Image
                                                    style={{ height: 50, width: 50, borderRadius: 40, marginHorizontal: 10 }}
                                                    source={{ uri: userPhoto }}
                                                />
                                            </TouchableOpacity> :
                                            <></>}
                                    </View>
                                    <View style={{
                                        flex: 1,
                                        justifyContent: "flex-end",
                                        marginLeft: 10
                                    }}>
                                        <Text ellipsizeMode='tail' numberOfLines={2} style={[styles.headerText, { color: "white", textAlign: 'left' }]}>Notifications</Text>
                                        <Text style={{ color: "white", fontWeight: "bold", textAlign: 'left', margin: 10 }}>Viewing as Admin</Text>
                                    </View>
                                </View>}
                        </LinearGradient>
                    </ImageBackground >
                    <View style={{ maxWidth: 700, alignSelf: Platform.OS === 'web' ? 'center' : '', width: '100%', padding: 10 }}>
                        <FlatList
                            data={ratings}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item, index }) =>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: "center", flex: 1 }}>
                                        <Image
                                            style={{ height: 50, width: 50, borderRadius: 40, marginHorizontal: 10 }}
                                            source={{ uri: item.userPhoto }}
                                        />
                                        <View>
                                            <Text style={{ fontFamily: 'Bold', marginTop: 2 }}>{item.raters_name},{<Text style={{ fontFamily: 'Primary' }}> rated your </Text>} {<Text style={{ fontFamily: 'Bold' }}>{item.food_name} : </Text>} </Text>
                                            <Text style={{ fontFamily: 'Primary', marginBottom: 2 }}>{item.rating}</Text>
                                            <Text style={{ fontFamily: 'Primary', marginVertical: 5 }}>{item.rating_date}</Text>



                                        </View>
                                        <View style={{ flex: 1, justifyContent:'flex-end',}}>
                                            <Button title="Message" buttonStyle={[styles.button, { backgroundColor: restaurantColor, maxWidth: 100 , alignSelf:'flex-end',alignContent:"flex-end"}]} titleStyle={styles.buttonTitle} />
                                        </View>
                                    </View>

                                    <Divider style={{ margin: 5 }} />
                                </View>
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

export default Notifications