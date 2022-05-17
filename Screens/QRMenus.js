import { useRef } from 'react'
import { Linking, ImageBackground, Dimensions, Image, ScrollView, Text, View, Platform, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-native-elements'
import { styles } from '../styles'
import { collection, getDoc, doc } from 'firebase/firestore'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
import { Icon } from 'react-native-elements'
import Footer from '../Components/Footer';
import axios from 'axios';
import { QRapiKey } from '../config.js'
import { LineChart } from 'react-native-chart-kit';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment'

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
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;
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
    const [date, setDate] = useState("");

    const [hoverside, setHoverSide] = useState(false)
    const [hoverside1, setHoverSide1] = useState(false)
    const [hoverside2, setHoverSide2] = useState(false)
    const [hoverside3, setHoverSide3] = useState(false)
    const [hoverside4, setHoverSide4] = useState(false)
    const [hoverside5, setHoverSide5] = useState(false)
    const [hoverside6, setHoverSide6] = useState(false)
    const [hoverside7, setHoverSide7] = useState(false)
    const [userPhoto, setUserPhoto] = useState('')
    const [userName, setUserName] = useState('')
    const [totalLikes,setTotalLikes] = useState(0);

    const [currentDate, setCurrentDate] = useState('')

    const [fromdate, setFromDate] = useState("");
    const [todate, setToDate] = useState("");

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Today', value: '1d' },
        //{ label: 'Yesterday', value: 'banana' },
        { label: 'Last 7 days', value: '1w' },
        { label: 'Last 30 days', value: '1m' },
        // { label: 'Last 90 days', value: 'banana' },
        // { label: 'Lifetime', value: 'banana' }
    ]);




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
    const QRMenuData = (id, interval, to, from) => {
        console.log("QR DAYA", id)
        console.log("SET INTERBAL", interval)
        console.log("TO", to)
        console.log("FROM", from)

        const data = JSON.stringify({
            "product_id": `${id}`,
            "from": `${from}`,
            "to": `${to}`,
            "product_type": "qr",
            "interval": `${interval}`
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
                'Authorization': `Token ${QRapiKey}`,
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

    function getFullMenu() {
        const getMenu = ref(database, 'restaurants/' + userId + '/foods/')
        onValue(getMenu, (snapshot) => {

            const data = snapshot.val();
            if (data !== null) {
                console.log(data)

                Object.values(data).map((foodData) => {

                    setTotalLikes(prevState => prevState + foodData.upvotes)
                })
                //setSetMenu("Breakfast")

            }
        })

    }
    const setRestaurant = async () => {
        getFullMenu();
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
            const userRef = ref(database, "restaurants/" + snapshot.data().restaurant_id + "/data")
            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                console.log(data)
                if (data !== null) {
                    console.log(data.qrid)
                    setQRMenuId(data.qrid)

                    QRMenuData(data.qrid);
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

        setCurrentDate((new Date().getTime() / 1000) * 1000)

        const userRef = ref(database, "user/" + userId)
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                console.log(data)

                setUserPhoto(data.userPhoto)
                setUserName(data.userName)
            }
        });
        console.log(moment(1646469039466).format('L'))
        console.log((new Date().getTime() / 1000) * 1000);

        console.log(new Date().valueOf())
        //console.log(moment(new Date()).format("MM/dd/yyyy HH:mm:ss").parse("01/01/1970 01:00:00").getTime()/ 1000)



    }, [])

    const [labelConfig,setLabelConfig]= useState([]);
    const [datasets,setDataSets]= useState([]);
    function selectIntervalHandler(item) {
        console.log(item);

        if (item === "1d") {
            console.log(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24).valueOf())
            console.log(new Date().valueOf())
            setFromDate(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24).valueOf());
            setToDate(new Date().valueOf())
            setLabelConfig([
                moment((new Date()).valueOf() - 1000 * 60 * 60 * 24).format("dddd"),
                moment((new Date()).valueOf() - 1000 * 60 * 60 * 21).format("LTS"),
                moment((new Date()).valueOf() - 1000 * 60 * 60 * 18).format("LTS"),
                moment((new Date()).valueOf() - 1000 * 60 * 60 * 15).format("LTS"),
                moment((new Date()).valueOf() - 1000 * 60 * 60 * 12).format("LTS"),
                moment((new Date()).valueOf() - 1000 * 60 * 60 * 9).format("LTS"),
                moment((new Date()).valueOf() - 1000 * 60 * 60 * 6).format("LTS"),
                moment((new Date()).valueOf() - 1000 * 60 * 60 * 3).format("LTS"),
                moment().format("dddd")
            ])
            QRMenuData(QRMenuId, item, new Date().valueOf(), new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24).valueOf())
        }
        if (item === "1w") {
            QRMenuData(QRMenuId, item, new Date().valueOf(), new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24 * 7).valueOf())

        }
        if (item === "1m") {
            QRMenuData(QRMenuId, item, new Date().valueOf(), new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24 * 31).valueOf())

        }

    }

    return (
        <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap-reverses', margin: 5 }}>
                <View style={{ flex: 3 }}>
                    <View style={[styles.shadowProp, { backgroundColor: 'white', marginHorizontal: 10, borderRadius: 13, overflow: 'hidden', flex: 3 }]}>
                        <View style={{ maxWidth: 700, alignSelf: Platform.OS === 'web' ? 'center' : '', width: '100%' }}>
                            <View style={{ margin: 10 }}>
                                <Divider style={{ margin: 10 }} />
                                <View style={{ flexDirection: 'row' }}>
                                    <View>
                                        <Image
                                            style={{
                                                width: 200,
                                                height: 200,
                                                resizeMode: "contain",
                                                marginRight: -10
                                            }}
                                            source={require('../assets/introslides/slide4.png')} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.subHeaderText, { marginBottom: 10 }]}>Why use QRMenus?</Text>
                                        <Text style={{ fontFamily: 'Primary', fontSize: 14 }}>QR Menus will be how your customers access your virtual menu</Text>
                                        <Text style={{ fontFamily: 'Primary', fontSize: 14, marginBottom: 10 }}>With our proprieary QRMenus we are able to track to see who is scanning! </Text>
                                        <Text style={[styles.subHeaderText, { fontSize: 16, marginBottom: 10 }]}>Once you finishing adding your food items to the virtual menu. You can download your QRMenu and place them on your dinning tables.</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View>

                        <View style={{ flexDirection: 'row', zIndex: 1, margin: 10, marginRight: 30, justifyContent: 'flex-end' }}>
                            <View style={[styles.shadowProp, { backgroundColor: 'white', marginRight: 30, maxWidth: 150, borderRadius: 5 }]}>
                                <Text style={{ textAlign: 'center', padding: 20, fontFamily: 'Primary' }}>
                                    {moment(currentDate).format('L')}
                                </Text>
                            </View>
                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                setOpen={setOpen}
                                setValue={setValue}
                                onSelectItem={(item) => (selectIntervalHandler(item.value))}
                                setItems={setItems}
                                showTickIcon={false}
                                arrowIconContainerStyle={{ margin: 5, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}
                                textStyle={{ textAlign: 'center', color: 'black', fontFamily: 'Bold', padding: 10, paddingVertical: 20 }}
                                style={{ flexDirection: 'row' }}
                                containerStyle={[styles.shadowProp, { maxWidth: 150, borderRadius: 5, backgroundColor: "orange" }]}
                            />
                        </View>

                        <View style={[styles.shadowProp, { backgroundColor: 'white', margin: 10, borderRadius: 13, overflow: 'hidden', flex: 3 }]}>
                            <Text style={[styles.subHeaderText, { fontFamily: 'Primary', marginHorizontal: 15, marginTop: 10 }]}>Scans</Text>
                            <Text style={[styles.subHeaderText, { fontFamily: 'Primary', marginHorizontal: 15, fontSize: 30, color: "orange", margin: 5 }]}>{scanTotal}</Text>
                            <Text style={{marginHorizontal: 15}}>Unstable</Text>
                            <ScrollView horizontal>
                            <LineChart data={{
                                labels: labelConfig,
                                datasets: [{
                                    data: [0,0,0,0,0,scanTotal,0]
                                }]
                            }}
                                width={windowWidth}
                                height={220}
                                chartConfig={{
                                    backgroundColor: 'white',
                                    backgroundGradientFrom: 'white',
                                    backgroundGradientTo: "white",
                                    decimalPlaces: 2, // optional, defaults to 2dp
                                    color: (opacity = 1) => `rgba(259, 180, 45, ${opacity})`,
                                    style: {
                                        borderRadius: 16,
                                
                                    }
                                }}
                                bezier
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16,

                                }}
                            />
                            </ScrollView>
                        </View>
                        <Text style={[styles.subHeaderText, { fontSize: 14 }]}>More Coming Soon..</Text>
                        <Divider style={{ margin: 10 }} />
                        <Text style={[styles.subHeaderText, { marginBottom: 10 }]}>QRMenu Metrics</Text>


                        <Text style={[styles.subHeaderText, { fontSize: 14 }]} onPress={createQRMenuImage}>Download Official QRMenus</Text>
                        <Button onPress={createQRMenuImage} buttonStyle={[styles.button, { backgroundColor: restaurantColor, maxWidth: 150 }]} titleStyle={styles.buttonTitle} title="Download" />
                        <View style={{ flexDirection: 'row' }}>
                            <View style={[styles.shadowProp, { justifyContent: 'center', padding: 20, borderRadius: 10 }]}>
                                <Text style={[styles.headerText, { textAlign: 'center' }]}>{scanTotal}</Text>
                                <Text style={{ textAlign: 'center' }}>Total Scans</Text>
                            </View>
                            <View style={[styles.shadowProp, { justifyContent: 'center', padding: 20, borderRadius: 10 }]}>
                                <Text style={[styles.headerText, { textAlign: 'center' }]}>{scanUnique}</Text>
                                <Text style={{ textAlign: 'center' }}>Unique Scans</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', margin: 5, flexWrap: 'wrap', justifyContent: 'center' }}>

                        </View>

                        <Image
                            style={{ margin: 50, width: 200, height: 200, alignSelf: 'center' }}
                            source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?data=https://www.ratemyfood.app/restaurant-menu-web?restId=${userId}` }}
                        />
                        <Text style={{ textAlign: 'center' }}>Preview (will not be tracked)</Text>


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
                        <Divider style={{ margin: 10 }} />
                    </View>
                </View>
            </View>
            <View style={{ marginTop: "20%" }}>
                <Footer />
            </View>

        </KeyboardAwareScrollView>
    )

}


export default RestaurantScreen;

