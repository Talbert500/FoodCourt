
import React from 'react';
import { ImageBackground, Modal, Alert, TextInput, RefreshControl, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, Text, View, SafeAreaView, Linking, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, Divider, Input } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { signOut, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { connect, useDispatch } from 'react-redux';
import { Link } from '@react-navigation/native';
import { useFonts } from '@use-expo/font';
import AppLoading from 'expo-app-loading';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Footer from '../../Components/Footer';
import { database } from '../../firebase-config'
import { ref, onValue } from 'firebase/database'
import { Directions } from 'react-native-gesture-handler';




const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function RestaurantHome(props) {

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
    const [value, setValue] = useState(null)

    useEffect(() => {
        // onAuthStateChanged(auth, (user) => {
        //     if (user) {
        //         setloggedin(true)
        //         setLoginSession(user.uid)
        //         setAccessToken(user.accessToken)
        //         console.log(user.accessToken)
        //         const userRef = ref(database, "user/" + user.uid)
        //         onValue(userRef, (snapshot) => {
        //             const data = snapshot.val();
        //             if (data !== null) {
        //                 console.log(data)
        //                 setIsRestaurant(data.hasRestaurant)
        //             }

        //         });
        //     } else {
        //         setloggedin(false)
        //     }
        // })
    }, [])

    const userSignOut = () => {
        delete localStorage.isLoggined;
        delete localStorage.token;

        if (Platform.OS === 'web') {
            props.navigation.navigate("Login")
        } else {
            props.navigation.navigate("Home")
        }

    }

    return (
        <KeyboardAwareScrollView style={{ backgroundColor: 'white', display: "flex"}}>
            {/** HEADER  */}
            <View style={{ zIndex: 5, flexDirection: "row", backgroundColor: "white", boxShadow: "0px 1px 5px #DDDDDD", alignItems: 'center', justifyContent: 'center', maxHeight: 600 }}>
                <TouchableOpacity style={{ justifyContent: 'center', width: windowWidth >= 450 ? 500 : 375 }} onPress={() => { props.navigation.replace("RestaurantHome") }}>
                    <Image
                        style={{
                            justifyContent: 'flex-start',
                            width: 200,
                            height: 75,
                            resizeMode: 'contain',
                        }}
                        source={require('../../assets/logo.png')} />
                </TouchableOpacity>
                {!localStorage.isLoggined ? (
                    <View style={{ justifyContent: "flex-end", flexDirection: "row", alignItems: 'center', flex: 1, maxWidth: 600, width: windowWidth >= 450 ? 500 : 375 }}>
                        <TouchableOpacity
                            onPress={() => { props.navigation.navigate("Login") }}
                            style={[styles.button, { alignItems: 'center', flex: 1, backgroundColor: "white", shadowOpacity: 0, minWidth: 50, maxWidth: 100 }]}
                        >
                            <Text style={[styles.buttonText, { color: "black", fontSize: windowWidth >= 450 ? 12 : 12 }]}>Log in</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { props.navigation.navigate("SignUp") }}
                            style={[styles.button, { alignItems: 'center', flex: 1, backgroundColor: "#f6ae2d", minWidth: 100, maxWidth: 200 }]}
                        >
                            <Text style={[styles.buttonOutlineText, { justifyContent: "center" }]}>Sign up</Text>
                        </TouchableOpacity>

                    </View>
                ) : (
                    <View style={{justifyContent: "flex-end", flexDirection: "row", alignItems: 'center', flex: 1, width: windowWidth >= 450 ? 500 : 375 }}>
                        <TouchableOpacity
                            onPress={userSignOut}
                            style={[styles.button, { alignItems: 'center', flex: 1, backgroundColor: "white", shadowOpacity: 0, minWidth: 50, maxWidth: 100 }]}
                        >
                            <Text style={[styles.buttonText, { paddingHorizontal: 10, color: "black" }]}>Sign Out</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.navigate("MenuEdit", {
                                    restId: props.restaurant_id,
                                })
                            }}
                            style={[styles.button, { alignItems: 'center', flex: 1, backgroundColor: "#f6ae2d", minWidth: 100, maxWidth: 200 }]}
                        >
                            <Text style={styles.buttonOutlineText}>Menu Dashboard</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* BANNER STYLE GUIDE*/}
            <View style={{ height: "100%", maxHeight: "500px" }}>
                <ImageBackground style={{ flex: 1, alignItems: 'center' }} imageStyle={{}} resizeMode="cover" source={require('../../assets/background.png')}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ flex: 1, minWidth: 400, paddingTop: 90 }}>
                            <Text style={{ color: '#242325', fontSize: 60, fontFamily: 'Bold', marginVertical: 10, paddingTop: 10, marginHorizontal:windowWidth >= 450 ? 0 : windowWidth/10}}>Replace your paper <Text style={{ color: '#f6ae2d' }}>menu</Text></Text>
                            <Text ellipsizeMode="middle" numberOfLines={2} style={{ color: '#898383', fontSize: 18, fontWeight: "Primary", maxWidth: 400,marginHorizontal:windowWidth >= 450 ? 0 : windowWidth/10}}>More than 1 million restaurants have switched to virtual menus</Text>
                            <View style={{marginHorizontal:windowWidth >= 450 ? 0 : windowWidth/10 }}>
                                {!localStorage.isLoggined ?
                                    <View style={{ flexDirection: 'row', flex: 1, marginTop: 15}}>
                                        <TouchableOpacity onPress={() => { Linking.openURL("https://calendly.com/foodcourt-sales/30min?month=2022-06") }} style={[styles.button, {alignItems: 'center',flex:1, marginHorizontal: 0, marginVertical: 10, shadowColor: '#f6ae2d', padding: 10, shadowRadius: 20, shadowOpacity: 0.5,minWidth: 50, maxWidth: 150,}]}>
                                            <Text adjustsFontSizeToFit ellipsizeMode="middle" numberOfLines={1} style={{ fontFamily: 'Bold', color: "white", alignSelf: 'center' }}>Request Demo</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => { props.navigation.navigate("SignUp") }} style={[styles.button, { alignItems: 'center', flex: 1, backgroundColor: "#898383", minWidth: 50, maxWidth: 150, padding: 10 }]}>
                                            <Text adjustsFontSizeToFit ellipsizeMode="middle" numberOfLines={1} style={styles.buttonText}>Get started</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <TouchableOpacity onPress={() => {
                                        props.navigation.navigate("MenuEdit", {
                                            loginSession: loginSession,
                                            restId: loginSession,
                                        })
                                    }} style={[styles.button, { flexDirection: 'row', alignItems: 'center', flex: 1, backgroundColor: "black", margin: 0, marginTop: 15 }]}>
                                        {!isRestaurant ?
                                            <Text adjustsFontSizeToFit ellipsizeMode="middle" numberOfLines={1} style={[styles.buttonText, { paddingHorizontal: 10 }]}>Edit Menu Online</Text> :
                                            <Text adjustsFontSizeToFit ellipsizeMode="middle" numberOfLines={1} style={[styles.buttonText, { paddingHorizontal: 10 }]}>Edit</Text>}
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                        {windowWidth >= 450 ?
                            <View style={{ flex: 1, minWidth: 400 }}>
                                <ImageBackground style={{ flex: 1, margin: -150, zIndex: 1 }} source={require('../../assets/phonesplash.png')} >
                                </ImageBackground>
                            </View> :
                            <></>
                        }
                    </View>
                </ImageBackground>
            </View>
            <View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',marginHorizontal:windowWidth >= 450 ? 0 : windowWidth/11 }}>
                <View style={{ alignItems: 'center', marginTop: windowWidth >= 450 ? 90 : 50 }}>
                    <Text style={{ fontFamily: 'Bold', fontSize: 35,flex:1,textAlign:'center'}}>The problem with paper menus</Text>
                </View>
                {/*3 Problem cards*/}
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, maxWidth: 1100, marginTop: 30,flexWrap:'wrap'}}>
                    <View style={styles.minicard}>
                        <Icon color="#f6ae2d" size={25} name="error-outline" />
                        <Text style={{ fontFamily: 'Bold', fontSize: 20, marginTop: 5 }}>Not environmentally friendly</Text>
                        <Text style={{ fontFamily: 'Primary', fontSize: 16, marginTop: 10 }}>
                            30 million customers say <Text style={{ textDecorationLine:'underline',fontFamily: 'Bold' }} onPress={() => { Linking.openURL("https://www.evergreenhq.com/blog/reduce-your-carbon-footprint-with-an-eco-friendly-digital-menu") }}>sustainability</Text> is a deciding factor in choosing where to eat.
                        </Text>
                        {/*https://www.evergreenhq.com/blog/reduce-your-carbon-footprint-with-an-eco-friendly-digital-menu/*/}
                    </View>
                    <View style={styles.minicard}>
                        <Icon color="#f6ae2d" size={25} name="error-outline" />
                        <Text style={{ fontFamily: 'Bold', fontSize: 20, marginTop: 5 }}>Confusing descriptions</Text>
                        <Text style={{ fontFamily: 'Primary', fontSize: 16, marginTop: 5 }}>
                            Lengthy food descriptions makes ordering food from your menu a<Text style={{textDecorationLine:'underline',fontFamily: 'Bold'}}> gamble</Text>.
                            Keep customers happy with a simple powerful menus
                        </Text>
                    </View>
                    <View style={styles.minicard}>
                        <Icon color="#f6ae2d" size={25} name="error-outline" />
                        <Text style={{ fontFamily: 'Bold', fontSize: 20, marginTop: 5 }}>Hard to change</Text>
                        <Text style={{ fontFamily: 'Primary', fontSize: 16, marginTop: 5 }}>
                        Time sensetive items and specials hard to communicate and <Text style={{ textDecorationLine:'underline',fontFamily: 'Bold'}}>outdated</Text> menu with no real time live control.</Text>
                    </View>
                </View>
                <View style={{ alignItems: "center" }}>
                    <Text style={{ margin: 20, fontFamily: 'Primary', fontSize: 20 }}>We have the solution</Text>
                    <TouchableOpacity onPress={() => { Linking.openURL("https://calendly.com/foodcourt-sales/30min?month=2022-06") }} style={[styles.button, { justifyContent: 'center', flex: 1, margin: 0, shadowColor: '#f6ae2d', padding: 20, shadowRadius: 20, shadowOpacity: 0.5 }]}>
                        <Text adjustsFontSizeToFit ellipsizeMode="middle" numberOfLines={1} style={{ fontFamily: 'Bold', color: "white", alignSelf: 'center' }}>Lets talk</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ alignItems: 'center', marginTop: 90 }}>
                    <Text style={{ fontFamily: 'Bold', fontSize: windowWidth >= 450 ? 45 :30 ,textAlign:'center'}}>Your menu becomes marketing </Text>
                </View>
                <View style={{ maxWidth: 1000 }}>
                    <View style={styles.card}>
                        <View style={{ justifyContent: 'center', flex: 1 }}>
                            <Text style={{ fontFamily: 'Bold', fontSize: windowWidth >= 450 ? 20 :16  }}>Call it "QRMenus" !</Text>
                            <Text style={{ fontFamily: 'Primary', fontSize: 16, marginTop: 10 }}>Replace your paper menu with our QR Menus that will be a direct link from the customers phone to your menu.</Text>
                        </View>
                        <Image
                            style={{
                                width: windowWidth >= 450 ? 150 :74,
                                height: 150,
                                resizeMode: "contain",
                            }}
                            source={require('../../assets/introslides/slide4.png')} />
                    </View>
                    <View style={styles.card}>
                        <View style={{ justifyContent: 'center', flex: 1 }}>
                            <Text style={{ fontFamily: 'Bold', fontSize: windowWidth >= 450 ? 20 :16 }}>Ultimate Menu Control</Text>
                            <Text style={{ fontFamily: 'Primary', fontSize: 16, marginTop: 10 }}>Your menu will have the ability to collect customer-driven activity, reviews, photos, and other metrics</Text>
                        </View>
                        <Image
                            style={{
                                width: windowWidth >= 450 ? 150 :74,
                                height: 150,
                                resizeMode: "contain",
                            }}
                            source={require('../../assets/introslides/slide3.png')} />

                    </View>
                    <View style={styles.card}>
                        <View style={{ justifyContent: 'center', flex: 1 }}>
                            <Text style={{ fontFamily: 'Bold', fontSize: windowWidth >= 450 ? 20 :16 }}>Leverage</Text>
                            <Text style={{ fontFamily: 'Primary', fontSize:16, marginTop: 10 }}>Tools for easily leveraging your menu items to attract thousands of customers daily.</Text>
                        </View>
                        <Image
                            style={{
                                width: windowWidth >= 450 ? 150 :74,
                                height: 150,
                                resizeMode: "contain",
                            }}
                            source={require('../../assets/introslides/slide1.png')} />
                    </View>
                </View>
                <View style={{flexWrap:'wrap-reverse',flexDirection:'row',alignItems: 'center', alignItems: 'center', minWidth: 300, maxWidth: 1100}}>
                    <View style={{minWidth:350, marginHorizontal:windowWidth >= 450 ? 30 : windowWidth/8,flex:1}}>
                        <Text style={{ fontFamily: 'Bold', fontSize: 60}}>
                            FoodCourt is free
                        </Text>
                        <Text style={{ fontFamily: 'Bold', fontSize: 20, maxWidth: 450, marginTop: 16 }}>
                            After your 60-day trial of our Premium plan, enjoy the free version of FoodCourt - forever.
                        </Text>
                        <TouchableOpacity onPress={() => { Linking.openURL("https://calendly.com/foodcourt-sales/30min?month=2022-06") }} style={[styles.button, { flexDirection: 'row', justifyContent: 'center', flex: 1, margin: 0, marginVertical: 10, shadowColor: '#f6ae2d', padding: 15, shadowRadius: 0, shadowOpacity: 0, marginTop: 25 }]}>
                            <Text adjustsFontSizeToFit ellipsizeMode="middle" numberOfLines={1} style={{ fontFamily: 'Bold', color: "white", alignSelf: 'center', fontSize: 18 }}>Request Demo</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{minWidth:350,marginHorizontal:windowWidth >= 450 ? 0 : windowWidth/11}}>
                        <Image
                            style={{
                                width: 400,
                                height: 400,
                                resizeMode: "contain",
                                borderRadius: '200',
                                overflow: 'hidden',
                            }}
                            source={require('../../assets/web-examples/restaurant-owner1.png')} />
                    </View>


                </View>
            </View>

            <View style={{ marginTop: "20%" }}>
                <Footer />
            </View>
        </KeyboardAwareScrollView>
    );
}


const styles = StyleSheet.create({
    selectedTextStyle: {
        fontSize: 16
    },
    placeholderStyle: {
        fontSize: 16
    },
    dropdown: {
        margin: 16,
        height: 50,
        width: "200px",
        backgroundColor: "#F0F0F0",
        borderRadius: "5px",
        paddingLeft: "10px",
        paddingRight: "10px"
    },
    stepText: {
        fontSize: 25,
        fontFamily: 'Bold',
        marginBottom: 10,
        maxWidth: 350,
        textAlign: 'center'
    },
    minicard: {
        borderColor: '#B4B4B4',
        borderWidth: 0.1,
        margin: 15,
        borderRadius: 5,
        padding: 25,
        minWidth:250,
        flex: 1,
        height: 200
    },
    card: {
        backgroundColor: 'white',
        paddingHorizontal:windowWidth >= 450 ? 10 :10, 
        paddingVertical: 10,
        borderRadius: 5,
        shadowColor: '#171717',
        shadowOffset: { width: -1, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 50,
        marginTop: 30,
        justifyContent: 'center',
        flex: 1,
        width: "100%",
        flexDirection: 'row-reverse',
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
        borderRadius: "10px",
        height: "40px",
        width: "200px",
        margin: 10,
        padding: 5,
        textAlign: "center",
        justifyContent: "center"
    },
    buttonOutline: {
        backgroundColor: '#F6AE2D',
        borderColor: '#f6ae2d',
        borderWidth: 2
    },
    buttonText: {
        color: 'white',
        fontWeight: "600",
        fontSize: 15,
        justifyContent: "center"

    },
    buttonOutlineText: {
        color: 'white',
        fontWeight: "600",
        fontSize: 15
    },
})

const mapStateToProps = (state) => {
    if (state === undefined)
        return {
            isLoading: true
        }

    return {
        isLoggined: state.isLoggined,
        restaurant_id: state.restaurant_id
    }
}

const RestaurantHomeContainer = connect(mapStateToProps, null)(RestaurantHome)

export default RestaurantHomeContainer