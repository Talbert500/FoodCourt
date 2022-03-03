
import React from 'react';
import { ImageBackground, Modal, Alert, TextInput, RefreshControl, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, Input } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { signOut, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { setNewRestaurant } from '../../redux/action'
import { useDispatch } from 'react-redux';
import { Link } from '@react-navigation/native';
import { useFonts } from '@use-expo/font';
import AppLoading from 'expo-app-loading';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Footer from '../../Components/Footer';
import { database } from '../../firebase-config'
import { ref,onValue} from 'firebase/database'



const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


function RestaurantHome({ navigation }) {

    let [fontsLoaded] = useFonts({
        'Primary': require('../../assets/fonts/proxima_nova_reg.ttf'),
        'Bold': require('../../assets/fonts/proxima_nova_bold.ttf'),
        'Black': require('../../assets/fonts/proxima_nova_black.otf')
    });


    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggedin, setloggedin] = useState(false);
    const [loginSession, setLoginSession] = useState('')
    const [accessToken, setAccessToken] = useState('')
    const [isRestaurant, setIsRestaurant] = useState(false)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setloggedin(true)
                setLoginSession(user.uid)
                setAccessToken(user.accessToken)
                console.log(user.accessToken)
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
    }, [])

    const userSignOut = () => {
        signOut(auth).then(() => {
            if (Platform.OS === 'web') {
                navigation.navigate("Login")
            } else {
                navigation.navigate("Home")
            }

        }).catch((error) => {
            console.log(error)
        })
    }




    return (
        <KeyboardAwareScrollView style={{ backgroundColor: 'white', display: "flex", }}>
            {/** HEADER  */}
            <View style={{ padding: 5, flexDirection: "row", backgroundColor: "white" }}>
                <TouchableOpacity style={{ justifyContent: 'center', }} onPress={() => { navigation.navigate("Home") }}>
                    <Image
                        style={{
                            justifyContent: 'flex-start',
                            width: 125,
                            height: 50,
                            resizeMode: "contain",
                            justifyContent: 'center'
                        }}
                        source={require('../../assets/logo_name_simple.png')} />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Primary', alignSelf: "center", fontSize: Platform.OS === 'web' ? 17 : 14, fontWeight: "600" }}>
                    for mexican restaurants
                </Text>
                {!loggedin ? (
                    <View style={{ flexDirection: "row", marginLeft: 'auto' }}>
                        <TouchableOpacity
                            onPress={() => { navigation.navigate("Login") }}
                            style={styles.button}
                        >
                            <Text style={[styles.buttonText, { paddingHorizontal: 10 }]}>Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => { navigation.navigate("SignUp") }}
                            style={[styles.button, styles.buttonOutline, { paddingHorizontal: 10, flexDirection: 'row' }]}
                        >
                            <Text style={styles.buttonOutlineText}>Create Menu Online</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        {!isRestaurant ?
                            <View style={{ flexDirection: "row", marginLeft: 'auto' }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate("RestaurantAdmin", {
                                            loginSession: loginSession,
                                            userId: accessToken,
                                        })
                                    }}
                                    style={[styles.button, styles.buttonOutline, { paddingHorizontal: 10, flexDirection: 'row' }]}
                                >
                                    <Text style={styles.buttonOutlineText}>Menu Dashboard</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={userSignOut}
                                    style={styles.button}
                                >
                                    <Text style={[styles.buttonText, { paddingHorizontal: 10 }]}>Sign Out</Text>
                                </TouchableOpacity>
                            </View>:
                            <View style={{ flexDirection: "row", marginLeft: 'auto',alignItems:'center',margin: 10}}>
                                <Text style={{fontFamily:'Bold', textAlign:'center'}}> Create a restaurant account?</Text>
                            </View>
                            }
                    </View>
                )}
            </View>

            {/* BANNER STYLE GUIDE*/}
            <View style={{ height: "100%", maxHeight: 700 }}>
                <ImageBackground style={{ paddingTop: "9%", flex: 1 }} resizeMode="cover" source={require('../../assets/web-examples/restaurant-owner1.jpg')}>

                    <View style={{
                        backgroundColor: 'white',
                        maxWidth: "30%",
                        minWidth: 300,
                        left: '15%',
                        borderRadius: 5,
                        padding: 10,
                    }}>
                        <Text style={{ color: '#242325', fontSize: 50, fontFamily: 'Bold', margin: 20, marginVertical: 10, paddingTop: 10 }}>It's free to use Feiri</Text>
                        <View style={{ margin: 20 }}>
                            <Text ellipsizeMode="middle" numberOfLines={2} style={{ color: '#242325', fontSize: 20, fontWeight: "400", marginBottom: 5 }}>An interactive menu that you can manage real-time</Text>
                            <Text ellipsizeMode="middle" numberOfLines={2} style={{ color: '#242325', fontSize: 20, fontWeight: "400", marginBottom: 5 }}>Recieve ratings on individual food items</Text>
                            <Text ellipsizeMode="middle" numberOfLines={2} style={{ color: '#242325', fontSize: 20, fontWeight: "400", marginBottom: 5 }}>See and analyze food metric data</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold" }}>Add your menu in 10 minutes!</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            {!loggedin ?
                                <TouchableOpacity onPress={() => { navigation.navigate("SignUp") }} style={[styles.button, { flexDirection: 'row', alignItems: 'center', flex: 1 }]}>
                                    <Icon
                                        name="menu-book"
                                        color="white"
                                        size="20"
                                    />
                                    <Text adjustsFontSizeToFit ellipsizeMode="middle" numberOfLines={1} style={[styles.buttonText, { paddingHorizontal: 10 }]}>Create Menu Online</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate("RestaurantAdmin", {
                                        loginSession: loginSession,
                                        userId: accessToken,
                                    })
                                }} style={[styles.button, { flexDirection: 'row', alignItems: 'center', flex: 1 }]}>
                                    <Icon
                                        name="menu-book"
                                        color="white"
                                        size="20"
                                    />
                                    {!isRestaurant ?
                                    <Text adjustsFontSizeToFit ellipsizeMode="middle" numberOfLines={1} style={[styles.buttonText, { paddingHorizontal: 10 }]}>Edit Menu Online</Text>:
                                    <Text adjustsFontSizeToFit ellipsizeMode="middle" numberOfLines={1} style={[styles.buttonText, { paddingHorizontal: 10 }]}>Feiri Up!</Text>}
                                </TouchableOpacity>
                            }
                            <View style={{ flex: 1 }}></View>
                        </View>
                    </View>

                </ImageBackground>
            </View>
            <View style={{ backgroundColor: 'white', alignContent: 'center', justifyContent: 'center', paddingTop: "2%" }}>
                <View style={{ backgroundColor: 'white', flexDirection: 'row', alignContent: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <TouchableOpacity onPress={() => { console.log("GO TO APP STORE") }}>
                        <Image
                            style={{
                                width: 300,
                                height: 150,
                                resizeMode: "contain",
                            }}
                            source={require('../../assets/apple.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { console.log("GO TO GOGOLE PLAY STORE") }}>
                        <Image
                            style={{
                                width: 300,
                                height: 150,
                                resizeMode: "contain",
                            }}
                            source={require('../../assets/googleplay.png')} />
                    </TouchableOpacity>

                </View>
                <Text style={{ alignSelf: "center", fontFamily: 'Bold', fontSize: 20 }}>
                    Manage your menu on your mobile phone
                </Text>
            </View>
            <View style={{ backgroundColor: 'white', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: "5%", alignItems: 'center' }}>
                <View style={{ maxWidth: 600, width: 600 }}>
                    {/*removed text align left*/}
                    <Text style={{ fontSize: 50, fontFamily: 'Bold', maxWidth: 500 }}>It's alway been about just the food! </Text>
                    <Text style={{ fontWeight: "550", fontSize: 20, fontFamily: 'Primary', maxWidth: 500, textAlign: 'left', marginVertical: 20 }}>
                        For centuries we have missed the opportunity to receive ratings and reviews on all your food options. Not to mention the overdue experience with your menu that makes your customers more confident in your food. </Text>
                    <TouchableOpacity onPress={() => { navigation.navigate("SignUp") }} style={[styles.button, { flexDirection: 'row', alignItems: 'center', maxWidth: 200, width: 200 }]}>
                        <Icon
                            name="menu-book"
                            color="white"
                            size="20"
                        />
                        <Text adjustsFontSizeToFit ellipsizeMode="middle" numberOfLines={1} style={[styles.buttonText, { paddingHorizontal: 10 }]}>Create Menu Online</Text>
                    </TouchableOpacity>
                </View>
                <Image
                    style={{
                        width: 500,
                        height: 500,
                        resizeMode: "contain",
                    }}
                    source={require('../../assets/web-examples/person-holding-mexican-taco-hands-high-view.jpg')} />
            </View>



            <View style={{ backgroundColor: 'white', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: "5%", paddingBottom: '5%' }}>
                <View style={{ alignItems: 'center', minWidth: 500 }}>
                    <Image
                        style={{
                            width: 300,
                            height: 300,
                            resizeMode: "contain",
                        }}
                        source={require('../../assets/introslides/slide3.png')} />
                    <Text ellipsizeMode="middle" numberOfLines={3} style={styles.stepText}>
                        Create your menu using Feiri's free platform.
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "475", marginBottom: 5, maxWidth: 450, textAlign: 'center' }}>
                        Creating a menu takes 10 minutes, You can scan or manually add prices, description and other details about your food item.
                    </Text>
                </View>
                <View style={{ alignItems: 'center', minWidth: 500 }}>
                    <Image
                        style={{
                            width: 300,
                            height: 300,
                            resizeMode: "contain",
                        }}
                        source={require('../../assets/introslides/slide4.png')} />
                    <Text ellipsizeMode="middle" numberOfLines={3} style={styles.stepText} >
                        Gain access to your virtual interactive QR Menu.
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "475", marginBottom: 5, maxWidth: 450, textAlign: 'center' }}>
                        The QR Menus is how your customers will access your virtual menu. We will send you QR menus for your restaurant, you will also have an option to create them your own.
                    </Text>
                </View>
                <View style={{ alignItems: 'center', minWidth: 500 }}>
                    <Image
                        style={{
                            width: 300,
                            height: 300,
                            resizeMode: "contain",
                        }}
                        source={require('../../assets/introslides/Slide1.png')} />
                    <Text ellipsizeMode="middle" numberOfLines={3} style={styles.stepText}>
                        Get discovered by millions of customers.
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "475", marginBottom: 5, maxWidth: 450, textAlign: 'center' }}>
                        Leverage your ratings to attract more customers who are craving to have your foods
                    </Text>
                </View>
                <View style={{ alignItems: 'center', minWidth: 500 }}>
                    <Image
                        style={{
                            width: 300,
                            height: 300,
                            resizeMode: "contain",
                        }}
                        source={require('../../assets/introslides/slide2.png')} />
                    <Text ellipsizeMode="middle" numberOfLines={3} style={styles.stepText}>
                        Confidence + Customers = Happiness
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "475", marginBottom: 5, maxWidth: 450, textAlign: 'center' }}>
                        No food left behind! 72% of customers won't take any buying action untill they've read reviews.
                    </Text>
                </View>
            </View>


            <View style={{ padding: 20 }}>
                <View style={{ flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center' }}>
                    <Image
                        style={{
                            width: 500,
                            height: 600,
                            resizeMode: "contain",
                            flex: 1,
                            maxWidth: 500
                        }}
                        source={require('../../assets/menu_example.png')} />
                        {/* removed text align left*/}
                    <Text style={{ marginTop: 20, fontSize: 50, fontWeight: "600", maxWidth: 600, minWidth: 400, flex: 1, fontFamily: 'Bold' }}>
                        An interactive menu that allows your food items to
                        recieve ratings. Giving your customers the confidence they need.
                    </Text>
                </View>

            </View>

            <View style={{ marginTop: "20%" }}>
                <Footer />
            </View>
        </KeyboardAwareScrollView>
    );
}


const styles = StyleSheet.create({
    stepText: {
        fontSize: 25,
        fontFamily: 'Bold',
        marginBottom: 10,
        maxWidth: 350,
        textAlign: 'center'
    },
    card: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        margin: 5,
        justifyContent: 'center',
        right: 10,
        margin: '20%',
        right: "10%",
        top: "20%",
        maxWidth: windowWidth / 3,
        flex: 1
    },
    signUpForm: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        margin: 5,
        maxWidth: "50%",
        marginHorizontal: 0,
        justifyContent: 'center',
    },
    shadowProp: {
        shadowColor: '#171717',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    button: {
        backgroundColor: "#f6ae2d",
        shadowColor: '#171717',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        borderRadius: 5,
        margin: 10,
        padding: 10,
    },
    buttonOutline: {
        backgroundColor: 'white',
        borderColor: '#f6ae2d',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: "600",
        fontSize: 15,
        justifyContent: "center"

    },
    buttonOutlineText: {
        color: '#f6ae2d',
        fontWeight: "600",
        fontSize: 15,
        justifyContent: "center"
    },
})


export default RestaurantHome