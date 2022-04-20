
import { useRef } from 'react'
import { Dimensions, Platform, TextInput, RefreshControl, ImageBackground, Animated, Image, ScrollView, Text, View, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Input } from 'react-native-elements'
import { styles } from '../../styles'
import { ref, onValue, orderByChild, query, update } from 'firebase/database'
import { collection, getDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import { storage } from '../../firebase-config';
import { useEffect, useState } from 'react';
import Card from '../../Components/Card'
import { setFoodItemId } from '../../redux/action'
import { uploadBytes, getDownloadURL, ref as tef, list } from 'firebase/storage';
import { BlurView } from 'expo-blur';
import { setSearchedRestaurantImage, setSearchedRestaurant, setNewRestaurant } from '../../redux/action'
import { auth, database } from '../../firebase-config'
import { db } from '../../firebase-config'
import { Link } from '@react-navigation/native';
import Footer from '../../Components/Footer';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut, onAuthStateChanged,updateEmail } from 'firebase/auth'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { Icon } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker';
import { useFonts } from '@use-expo/font';

function Settings({ navigation }) {

    let [fontsLoaded] = useFonts({
        'Primary': require('../../assets/fonts/proxima_nova_reg.ttf'),
        'Bold': require('../../assets/fonts/proxima_nova_bold.ttf'),
        'Black': require('../../assets/fonts/proxima_nova_black.otf')
    });

    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;

    const dispatch = useDispatch();

    // const searchedRestaurant = useSelector(state => state.searchedRestaurant)
    // const restaurantImage = useSelector(state => state.restaurantImage)
    // const restaurantDesc = useSelector(state => state.restaurantDesc)
    // const restaurantId = useSelector(state => state.restaurantId)
    // const restaurantColor = useSelector(state => state.restaurantColor)
    // const restaurantAddress = useSelector(state => state.restaurantAddress)
    // const restaurantPhone = useSelector(state => state.restaurantPhone)
    // const tookPicture = useSelector(state => state.foodImage)


    const [color, setColor] = useState("");
    const [text, onChangeText] = useState("")
    const [image, setImage] = useState("")
    const [desc, setDesc] = useState(restaurantDesc);
    const [isRestaruant, setIsRestaurant] = useState("");
    const [userPhoto, setUserPhoto] = useState("");
    const [searchedRestaurant, setCurrentRest] = useState("")
    const [restaurantImage, setRestaurantImage] = useState("");
    const [restaurantColor, setRestaurantColor] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantPhone, setRestaurantPhone] = useState("");
    const [restaurantDesc, setRestaurantDesc] = useState("");
    const [phone, setPhone] = useState(restaurantPhone);
    const [restId, setRestId] = useState("")

    const [hoverside, setHoverSide] = useState(false)
    const [hoverside1, setHoverSide1] = useState(false)
    const [hoverside2, setHoverSide2] = useState(false)
    const [hoverside3, setHoverSide3] = useState(false)
    const [hoverside4, setHoverSide4] = useState(false)
    const [hoverside5, setHoverSide5] = useState(false)
    const [hoverside6, setHoverSide6] = useState(false)
    const [hoverside7, setHoverSide7] = useState(false)

    const [regulars, setRegulars] = useState([])
    const [bookmarked, setBookmarked] = useState(false)
    const [loggedin, setloggedin] = useState(false);

    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userCreated, setUserCreated] = useState('');

    const setRestaurant = async (restId) => {

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
            setCurrentRest(snapshot.data().restaurant_name)
            setRestaurantColor(snapshot.data().restaurant_color)
            setRestaurantAddress(snapshot.data().restaurant_address)
            setRestaurantPhone(snapshot.data().restaurant_phone)
            setRestaurantDesc(snapshot.data().restaurant_desc)


        } else {
            console.log("No souch document!")
        }
    }
    const getImage = async (restId) => {
        const imageRef = tef(storage, 'imagesRestaurant/' + restId);
        await getDownloadURL(imageRef).then((url) => {
            dispatch(setSearchedRestaurantImage(url))
            setRestaurantImage(url)
        })
    }
    const AddNewRestaurant = async () => {

        console.log(auth.currentUser.email)
        console.log(auth.currentUser.uid)
        console.log("Updated")
        updateNewEmail();

        updateEmail(auth.currentUser, userEmail ).then(()=> {
        }).catch((error)=> {
            console.log(error)
        })

        updateDoc(doc(db, "restaurants", auth.currentUser.uid), {
            restaurant_phone: restaurantPhone,
            restaurant_desc: restaurantDesc,
            restaurant_color: restaurantColor

        }).catch((error) => {
            const errorCode = error;
            console.log("ERROR" + errorCode)
        })

        update(ref(database, "user/" + auth.currentUser.uid), {
            userName: searchedRestaurant

        });
        //just added 

        // console.log(tookPicture);
        // const getImageRef = tef(storage, 'imagesRestaurant/' + auth.currentUser.uid); //check if the storage updates 
        // //convert image to array of bytes
        // const img = await fetch(tookPicture);
        // const bytes = await img.blob();
        // uploadBytes(getImageRef, bytes).catch((error) => {
        //     console.log(error)
        // })
        // dispatch(setSearchedRestaurantImage(tookPicture));
        // updateProfile(auth.currentUser, {
        //     displayName: inputRest,
        //     photoURL: tookPicture
        // }).then(() => {
        //     console.log()
        // })

        //we can keep it local or do a check on the backend side and out from there
        //dispatch(setSearchedRestaurant(inputRest,restaurant_desc,restaurant_address,restaurant_phone,restaurant_id))
        navigation.navigate("Settings")

    }


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

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setRestId(user.uid)
                setRestaurant(user.uid);
                getImage(user.uid);
                console.log(user)
                setUserEmail(user.email)
                setUserCreated(user.metadata.creationTime)
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
                navigation.navigate("Home")
            }
        })


    }, [])

    const editPhoto = async (imagee) => {
        const getImageRef = tef(storage, 'imagesRestaurant/' + restId); //how the image will be addressed inside the storage
        //convert image to array of bytes
        const img = await fetch(imagee);
        const bytes = await img.blob();
        uploadBytes(getImageRef, bytes).catch((error) => {
            console.log(error)
        })


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
        editPhoto(pickerResult.uri)

    }

    const updateNewEmail = ()=> {
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
                    <View style={{ flexDirection: "row", marginLeft: 'auto', marginRight: 30 }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                                <Image
                                    style={{ height: 50, width: 50, borderRadius: 40, marginHorizontal: 10 }}
                                    source={{ uri: userPhoto }}
                                />
                            </TouchableOpacity>
                            <Text style={{ fontFamily: 'Bold' }}>{userName}</Text>
                        </View>
                    </View>
                </View>
            ) : (<></>)
            }
            <View style={{ flexDirection: windowWidth >= 500 ? 'row' : 'column', flexWrap: 'wrap-reverses', margin: 5 }}>
                {(windowWidth >= 500) ?
                    <View style={{ marginTop: 10, padding: 10 }}>
                        <TouchableOpacity onMouseOver={() => (setHoverSide(true))} onMouseLeave={() => { setHoverSide(false) }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside === true) ? 0 : 3 }} onPress={() => { navigation.navigate("MenuEdit", { restId: restId }) }} type="entypo" name="home" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide1(true))} onMouseLeave={() => { setHoverSide1(false) }} onPress={() => navigation.navigate("Billing", { restId: restId })} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside1 === true) ? 0 : 3 }} type="material" name="analytics" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide2(true))} onMouseLeave={() => { setHoverSide2(false) }} onPress={() => navigation.navigate("QRMenus", { userId: restId })} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside2 === true) ? 3 : 3 }} type="material-community" name="qrcode-edit" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide3(true))} onMouseLeave={() => { setHoverSide3(false) }} onPress={() => navigation.navigate("Notifications", { restId: restId })} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside3 === true) ? 0 : 3 }} type="material-community" name="message-text" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide4(true))} onMouseLeave={() => { setHoverSide4(false) }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside4 === true) ? 0 : 3 }} type="material" name="fastfood" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide5(true))} onMouseLeave={() => { setHoverSide5(false) }} onPress={() => { navigation.navigate("Settings") }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside5 === true) ? 0 : 3 }} type="fontisto" name="player-settings" color="grey" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide6(true))} onMouseLeave={() => { setHoverSide6(false) }} onPress={userSignOut} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside6 === true) ? 0 : 3 }} type="material-community" name="logout-variant" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={{ marginTop: 2, padding: 5,flexDirection:'row',justifyContent:'space-around' }}>
                        <TouchableOpacity onMouseOver={() => (setHoverSide(true))} onMouseLeave={() => { setHoverSide(false) }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside === true) ? 0 : 3 }} onPress={() => { navigation.navigate("MenuEdit", { restId: restId }) }} type="entypo" name="home" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide3(true))} onMouseLeave={() => { setHoverSide3(false) }} onPress={() => navigation.navigate("Notifications", { restId: restId })} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside3 === true) ? 0 : 3 }} type="material-community" name="message-text" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide4(true))} onMouseLeave={() => { setHoverSide4(false) }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside4 === true) ? 0 : 3 }} type="material" name="fastfood" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide5(true))} onMouseLeave={() => { setHoverSide5(false) }} onPress={() => { navigation.navigate("Settings") }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside5 === true) ? 0 : 3 }} type="fontisto" name="player-settings" color="grey" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide6(true))} onMouseLeave={() => { setHoverSide6(false) }} onPress={userSignOut} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside6 === true) ? 0 : 3 }} type="material-community" name="logout-variant" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                    </View>
                }
                {(windowWidth >= 500) ?
                    <View style={{ flex: 1, maxWidth: 400, margin: 8 }}>

                        {/* SNAPSHOT */}
                        <View style={[styles.shadowProp, { backgroundColor: 'white', padding: 15, marginVertical: 5, borderRadius: 8 }]}>
                            <View style={{ marginVertical: 10 }}>
                                <Text style={{ fontSize: 50, fontFamily: 'Bold' }}>Settings</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                <Icon type="ant-design" name="hearto" color="grey" size={20} style={{ margin: 5 }} />
                                <Text numberOfLines={1} style={{ fontFamily: 'Bold' }}>Account Settings</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                <Icon type="material-icons" name="rate-review" outline color="grey" size={20} style={{ margin: 5 }} />
                                <Text numberOfLines={1} style={{ fontFamily: 'Bold' }}>Restaurant Settings</Text>
                            </View>
                            <Text style={{ fontFamily: 'Primary', marginTop: 50 }}>(Not Functional...)</Text>
                        </View>
                    </View>
                    :
                    <></>
                }
                <View style={{ backgroundColor: 'white', flex: 2 }}>
                    <View style={[styles.shadowProp, { backgroundColor: 'white', marginHorizontal: 10, borderRadius: 13, overflow: 'hidden', flex: 1 }]}>
                        <ImageBackground style={{ margin: 5, borderTopLeftRadius: 13, borderTopRightRadius: 13, overflow: 'hidden', height: Platform.OS === "web" ? 150 : 75 }} resizeMode="cover" source={{ uri: restaurantImage }}>
                            <LinearGradient
                                colors={['#00000000', '#000000']}
                                style={{ height: '100%', width: '100%' }}>
                                <View style={{ width: "100%", maxWidth: 600, flex: 1, alignSelf: 'center', flexDirection: 'row-reverse' }}>
                                    <View style={{ justifyContent: 'flex-end', margin: 10 }}>
                                    </View>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row'
                                    }}>
                                        <View>
                                            <Text ellipsizeMode='tail' numberOfLines={2} style={[styles.subHeaderText, { color: "white", textAlign: 'left', marginLeft: 10, margin: 10 }]}>Account Details</Text>
                                            <Image
                                                style={{ height: 75, width: 75, borderRadius: 40, marginHorizontal: 10, marginLeft: 20 }}
                                                source={{ uri: userPhoto }}
                                            />
                                        </View>
                                        <View style={{ justifyContent: 'flex-end', marginLeft: 'auto' }}>
                                            <TouchableOpacity onPress={openImagePickerAsync}>
                                                <Text style={{ color: "white", fontSize: 18, fontWeight: 500 }}>Edit Photo</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </LinearGradient>
                        </ImageBackground >
                        <View style={{ flex: 1, maxWidth: 700, alignSelf: Platform.OS === 'web' ? 'center' : '', width: '100%', padding: 10 }}>
                            <View style={{ margin: 10 }}>
                                <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', marginVertical: -5 }}>Display name</Text>
                                <TextInput
                                    style={[styles.inputContainer, { padding: 10, width: 300, alignContent: 'flex-start' }]}
                                    onChangeText={searchedRestaurant}
                                    value={searchedRestaurant}
                                    placeholder="El Taco Norte"
                                    autoCapitalize='words'
                                />
                            </View>
                            <View style={{ margin: 9 }}>
                                <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', marginVertical: -5 }}>Description</Text>
                                <TextInput
                                    style={[styles.inputContainer, { padding: 10, alignSelf: 'center', }]}
                                    onChangeText={setRestaurantDesc}
                                    value={restaurantDesc}
                                    placeholder={restaurantDesc}
                                    autoCapitalize='words'
                                />
                            </View>
                            <Divider style={{ marginVertical: 10 }} />
                            <View style={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
                                <View style={{ marginHorizontal: 5, width: "45%" }} >
                                    <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', marginRight: 'auto' }}>Email address</Text>
                                    <TextInput
                                        placeholder="john@gmail.com"
                                        value={userEmail}
                                        onChangeText={setUserEmail}
                                        style={[styles.inputContainer, { padding: 10, alignSelf: 'center', backgroundColor: '#ECECEC' }]}
                                    />
                                </View>
                                <View style={{ marginHorizontal: 5, width: "45%", marginLeft: "auto" }} >
                                    <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', marginRight: 'auto' }}>Address</Text>
                                    <TextInput
                                        placeholder="247 W Camelback Rd"
                                        value={restaurantAddress}
                                        onChangeText={restaurantAddress}
                                        style={[styles.inputContainer, { padding: 10, alignSelf: 'center', backgroundColor: '#ECECEC' }]}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
                                <View style={{ marginHorizontal: 5, width: "45%" }} >
                                    <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', marginRight: 'auto' }}>Phone Number</Text>
                                    <TextInput
                                        placeholder="9372249843"
                                        value={restaurantPhone}
                                        onChangeText={setRestaurantPhone}
                                        style={[styles.inputContainer, { padding: 10, alignSelf: 'center', }]}
                                    />
                                </View>
                                <View style={{ marginHorizontal: 5, width: "45%", marginLeft: "auto" }} >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', marginRight: 'auto' }}>Color Theme</Text>
                                        <Text onPress={() => Linking.openURL("https://htmlcolorcodes.com/")} style={{ backgroundColor: 'grey', borderRadius: 50, color: 'white', marginRight: 'auto' }}> ? </Text>
                                    </View>
                                    <TextInput
                                        placeholder="John"
                                        value={restaurantColor}
                                        onChangeText={setRestaurantColor}
                                        style={[styles.inputContainer, { padding: 10, alignSelf: 'center', }]}
                                    />
                                </View>
                            </View>

                        </View>
                    </View>

                    <View style={[styles.shadowProp, { backgroundColor: 'white', marginHorizontal: 10, borderRadius: 13, overflow: 'hidden', marginTop: 15 }]}>
                        <View style={{ flex: 1, maxWidth: 700, alignSelf: Platform.OS === 'web' ? 'center' : '', width: '100%', padding: 10, margin: 10 }}>
                            <Text style={[styles.subHeaderText, { color: "black", textAlign: 'left', marginLeft: 10, fontSize: 22 }]}>Billing Details</Text>
                            <Divider style={{ marginVertical: 10 }} />
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', minWidth: 150, alignSelf: 'center' }}>Subscription plan</Text>
                                <TextInput
                                    style={[styles.inputContainer, { padding: 10, alignSelf: 'center', backgroundColor: '#ECECEC' }]}
                                    placeholder='Starter monthly plan ($12.00)'
                                    autoCapitalize='words'
                                />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', minWidth: 150, alignSelf: 'center' }}>Next billing date</Text>
                                <TextInput
                                    style={[styles.inputContainer, { padding: 10, alignSelf: 'center', backgroundColor: '#ECECEC' }]}
                                    placeholder='Sat Mar 04 17:33:05 GMT-0700 (Mountain Standard Time)'
                                    autoCapitalize='words'
                                />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', minWidth: 150, alignSelf: 'center' }}>Payment method</Text>
                                <TextInput
                                    style={[styles.inputContainer, { padding: 10, alignSelf: 'center', backgroundColor: '#ECECEC' }]}
                                    placeholder='American Express ending in 1005'
                                    autoCapitalize='words'
                                />
                                <Button onPress={() => navigation.goBack()} buttonStyle={[styles.button, { backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} title="Change" />
                            </View>
                        </View>
                    </View>
                    <View style={{ maxWidth: 700, margin: 15, alignSelf: 'center' }}>
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', minWidth: 150 }}>Delete Account</Text>
                                <Text style={{ textAlign: 'left' }}>By deleting your account you will lose all your data and no longer be able to access your restaurant</Text>
                            </View>
                            <View style={{ width: 200, maxWidth: 200, marginRight: 'auto' }}>
                                <Button buttonStyle={[styles.button, { backgroundColor: 'white' }]} titleStyle={[styles.buttonTitle, { color: "#828182" }]} title="Delete Account" />
                            </View>
                        </View>
                        <View style={{ width: 200, maxWidth: 200, marginLeft: 'auto', marginTop: 10 }}>
                            <Button onPress={AddNewRestaurant} buttonStyle={[styles.button, { backgroundColor: '#F6AE2D' }]} titleStyle={styles.buttonTitle} title="Save" />
                        </View>
                    </View>
                </View>

            </View>

            <View style={{ marginTop: "20%" }}>
                <Footer />
            </View>

            {/* <View style={{backgroundColor:'rgba(0, 0,0,0.5)',position: 'absolute',zIndex:1,top:'0',bottom:'0',left:'0',right:'0',paddingTop:"20%",paddingHorizontal:'3%'}}>
                <View style={[styles.shadowProp, { flex:1,backgroundColor: 'white', maxHeight: 600,alignSelf:'center',width:'100%',backgroundColor:'white',borderRadius:5}]}>

                </View>
            </View> */}

        </KeyboardAwareScrollView>


    )

}



export default Settings 