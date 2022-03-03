import { useRef } from 'react'
import { Linking, ImageBackground, Animated, Image, ScrollView, Text, View, Platform, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-native-elements'
import { styles } from '../styles'
import { collection, getDoc, doc } from 'firebase/firestore'
import { storage } from '../firebase-config';
import { useEffect, useState } from 'react';
import { ref, set, update, push, onValue } from 'firebase/database'
import { setFoodItemId } from '../redux/action'
import { uploadBytes, getDownloadURL, ref as tef, list } from 'firebase/storage';
import { BlurView } from 'expo-blur';
import { setSearchedRestaurantImage, setSearchedRestaurant, setNewRestaurant } from '../redux/action'
import { auth, database, db } from '../firebase-config'
import { Link } from '@react-navigation/native';
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from '@use-expo/font';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Footer from '../Components/Footer';
import axios from 'axios';


function RestaurantScreen({ route, navigation }) {

    const { userId } = route.params;

    let [fontsLoaded] = useFonts({
        'Primary': require('../assets/fonts/proxima_nova_reg.ttf'),
        'Bold': require('../assets/fonts/proxima_nova_bold.ttf'),
        'Black': require('../assets/fonts/proxima_nova_black.otf')
    });

    const dispatch = useDispatch();
    const [rawMenuData, setRawMenuData] = useState([]);
    const [menuData, setMenuItem] = useState([]);
    const [rating, setRating] = useState([]);

    const [loading, setLoading] = useState(false)
    const [ratingRefreshing, setRatingRefreshing] = useState(false)
    const [restaurant_city, setrestaurant_city] = useState("");
    const [restaurant_state, setrestaurant_state] = useState("");
    const [restaurant_zip, setrestaurant_zip] = useState("");
    const [restaurant_website, setWebsite] = useState('')
    const [searchedRestaurant, setRestaurantName] = useState("");
    const [restaurantDesc, setRestaurantDec] = useState("");
    const [restaurantId, setRestaurantId] = useState("");
    const [restaurant_address, setRestaurantAddress] = useState("");
    const [restaurantPhone, setRestaurantPhone] = useState("");
    const [restaurantColor, setRestaurantColor] = useState("");
    const [restaurantImage, setRestaurantImage] = useState("");
    const [QRMenuId, setQRMenuId] = useState("")
    const [QRDownload, setQRDownload] = useState("");
    const [reviewNum, setReviewNum] = useState("");
    const [scanTotal, setScanTotal] = useState("")
    const [scanUnique, setScanUnique] = useState("")
    const APIKEY = "d37bdf656af0540a07b000834391f02f70e453f6"

    const QRMenuData = async => {
        const data = JSON.stringify({
            "product_id": QRMenuId,
            "from": "1579158356477",
            "to": "1883317799999",
            "product_type": "qr",
            "interval": "1w"
        });

        const config = {
            method: 'post',
            url: 'https://api.beaconstac.com/reporting/2.0/?organization=105513&method=Products.getVisitorDistribution',
            headers: {
                'Authorization': `Token ${APIKEY}`,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then(function (response) {
                console.log(response.data);
                setScanTotal(JSON.stringify(response.data.points["0"]["0"]["1"]))
                setScanUnique(response.data.points["0"]["0"]["2"])
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    const createQRMenuImage = async => {
        const data = '';

        const config = {
            method: 'get',
            url: `https://api.beaconstac.com/api/2.0/qrcodes/${QRMenuId}/download/?size=1024&error_correction_level=5&canvas_type=pdf`,
            headers: {
                'Authorization': `Token ${APIKEY}`,
                'Content-Type': 'application/json'
            },
            data: data
        };


        axios.request(config)
            .then(function (response) {
                console.log(response.data)
                setQRDownload(response.data.urls.pdf);
                update(ref(database, "restaurants/" + userId + "/data"), {
                    qridDownload: response.data.urls.pdf

                });
                Linking.openURL(`${response.data.urls.pdf}`)
                QRMenuData()

            })
            .catch(function (error) {
                console.log(error);
            });

        console.log(QRDownload)



    }

    const setRestaurant = async () => {
        //const restId = auth.currentUser.uid;
        const docRef = doc(db, "restaurants", userId);
        const snapshot = await getDoc(docRef)
        if (snapshot.exists()) {
            setWebsite(snapshot.data().restaurant_website)
            setRestaurantId(snapshot.data().restaurant_id)
            setRestaurantPhone(snapshot.data().restaurant_phone)
            setRestaurantAddress(snapshot.data().restaurant_address)
            setRestaurantDec(snapshot.data().restaurant_desc)
            setRestaurantName(snapshot.data().restaurant_name)
            setRestaurantColor(snapshot.data().restaurant_color)

            setrestaurant_city(snapshot.data().restaurant_city)
            setrestaurant_state(snapshot.data().restaurant_state)
            setrestaurant_zip(snapshot.data().restaurant_zip)
            const imageRef = tef(storage, 'imagesRestaurant/' + snapshot.data().restaurant_id);
            await getDownloadURL(imageRef).then((url) => {
                setRestaurantImage(url)
                console.log(url)
                console.log(restaurantImage)
                setLoading(false);
                dispatch(setSearchedRestaurantImage(url))

            })

            const userRef = ref(database, "restaurants/" + snapshot.data().restaurant_id +"/data")
            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                if (data !== null) {
                    setQRMenuId(data.qrid)
           
                }

            });

        } else {
            console.log("No souch document!")
        }
    }

    useEffect(() => {
        dispatch(setSearchedRestaurant(null, null, null, null, null, null))
        setLoading(true);
        setRatingRefreshing(true);
        setRestaurant();
        QRMenuData();


    }, [])

    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            {Platform.OS === 'web' ? (
                <View style={{ width: '100%', padding: 5, flexDirection: "row", backgroundColor: Platform.OS === "web" ? "white" : "transparent", position: 'absolute', zIndex: 1 }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <Image
                            style={{
                                justifyContent: 'flex-start',
                                width: 125,
                                height: 50,
                                resizeMode: "contain",
                                opacity: Platform.OS === 'web' ? 1 : 0
                            }}
                            source={require('../assets/logo_name_simple.png')} />
                    </TouchableOpacity>
                </View>
            ) : (<></>)
            }
            <ScrollView showsVerticalScrollIndicator={false}>
                {!loading ?
                    (
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
                                        <Text style={{ color: "white", fontWeight: "bold" }}>Viewing as Admin</Text>

                                        <Text ellipsizeMode='tail' numberOfLines={2} style={[styles.headerText, { color: "white", }]}>Create QRMenus</Text>
                                        <Text style={{ color: "white", fontWeight: "bold" }}>{searchedRestaurant}</Text>


                                    </View>
                                </View>
                            </LinearGradient>
                        </ImageBackground >
                    ) : (
                        <ActivityIndicator size="large" style={{ height: 300 }} color="#F6AE2D" />
                    )}

                <View style={{ maxWidth: 700, alignSelf: Platform.OS === 'web' ? 'center' : '', width: '100%' }}>
                    <View style={{ margin: 10 }}>
                        <Divider style={{ margin: 10 }} />
                        <View>

                            <Text style={[styles.subHeaderText, { marginBottom: 10 }]}>Why use QRMenus?</Text>
                            <Text style={{ fontFamily: 'Primary', fontSize: 14 }}>QR Menus will be how your customers access your virtual menu</Text>
                            <Text style={{ fontFamily: 'Primary', fontSize: 14, marginBottom: 10 }}>With our proprieary QRMenus we are able to track to see who is scanning! </Text>
                            <Text style={[styles.subHeaderText, { fontSize:16 ,marginBottom: 10 }]}>Once you finishing adding your food items to the virtual menu. You can download your QRMenu and post them on your dinning tables.</Text>
                            <Text style={[styles.subHeaderText, { fontSize:16 ,marginBottom: 10 }]}>5$/month</Text>
                        </View>
                        <Divider style={{ margin: 10 }} />
                        <Text style={[styles.subHeaderText, { marginBottom: 10 }]}>QRMenu Metrics</Text>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.headerText}>{scanTotal}</Text>
                                <Text>Total Scans</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.headerText}>{scanUnique}</Text>
                                <Text>Unique Scans</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', margin: 5, flexWrap: 'wrap', justifyContent: 'center' }}>

                        </View>
                        <Text style={styles.subHeaderText} onPress={createQRMenuImage}>Download Official QRMenus</Text>
                        <Button onPress={createQRMenuImage} buttonStyle={[styles.button, { backgroundColor: restaurantColor, maxWidth:150 }]} titleStyle={styles.buttonTitle} title="Download" />
                        <Image
                            style={{ margin: 50, width: 200, height: 200, alignSelf: 'center' }}
                            source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?data=https://www.ratemyfood.app/restaurant-menu-web?restId=${userId}` }}
                        />
                        <Text style={{ textAlign: 'center' }}>Preview</Text>


                        <Divider style={{ margin: 10 }} />


                        <View style={{ backgroundColor: 'white', borderColor: 'black', padding: 20, borderRadius: 15 }}>
                            <View style={{ flexDirection: "row", alignContent: "center", alignItems: 'center', margin: 5 }}>
                                <Icon name="call" color="black" size="35" />
                                <Text style={{ fontSize: 17, fontWeight: "500", marginHorizontal: 10 }}>{restaurantPhone}</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignContent: "center", margin: 5, alignItems: 'center' }}>
                                <Icon name="web" color="black" size="35" />
                                <Text style={{ fontSize: 17, fontWeight: "500", marginHorizontal: 10, maxWidth: 300 }} >{restaurant_website}</Text>
                            </View>

                        </View>
                        <TouchableOpacity onPress={() => {
                                        navigation.navigate("RestaurantAdmin", {
                                            loginSession: userId,
                                            userId: userId,
                                        })
                                    }}>
                                <Text style={{ marginLeft: 'auto', fontWeight: "500" }}> Go Back to Profile</Text>
                        </TouchableOpacity>
                        <Divider style={{ margin: 10 }} />

                    </View>



                </View>
                <View style={{ marginTop: "20%" }}>
                    <Footer />
                </View>
            </ScrollView >

        </View >
    )

}


export default RestaurantScreen;

