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
            {Platform.OS === 'web' ? (
                <View style={{ width: '100%', padding: 5, flexDirection: "row", backgroundColor: Platform.OS === "web" ? "white" : "transparent", zIndex: 1 }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <Image
                            style={{
                                justifyContent: 'flex-start',
                                width: 75,
                                height: 75,
                                resizeMode: "contain",
                                opacity: Platform.OS === 'web' ? 1 : 0
                            }}
                            source={require('../assets/splash.png')} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row", marginLeft: 'auto' }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center',marginRight:30}}>
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
            <View style={{ flexDirection: 'row', flexWrap: 'wrap-reverses', margin: 5 }}>
                {(windowWidth >= 500) ?
                    <View style={{ marginTop: 10, padding: 10 }}>
                        <TouchableOpacity onMouseOver={() => (setHoverSide(true))} onMouseLeave={() => { setHoverSide(false) }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside === true) ? 0 : 3 }} onPress={() => { navigation.navigate("MenuEdit", { restId: userId }) }} type="entypo" name="home" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide1(true))} onMouseLeave={() => { setHoverSide1(false) }} onPress={() => navigation.navigate("Billing", { restId: userId })} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside1 === true) ? 0 : 3 }} type="material" name="analytics" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide2(true))} onMouseLeave={() => { setHoverSide2(false) }} onPress={() => navigation.navigate("QRMenus", { userId: userId })} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside2 === true) ? 3 : 3 }} type="material-community" name="qrcode-edit" color="grey" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide3(true))} onMouseLeave={() => { setHoverSide3(false) }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside3 === true) ? 0 : 3 }} type="material-community" name="message-text" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide4(true))} onMouseLeave={() => { setHoverSide4(false) }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside4 === true) ? 0 : 3 }} type="material" name="fastfood" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide5(true))} onMouseLeave={() => { setHoverSide5(false) }} onPress={() => { navigation.navigate("Settings") }} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside5 === true) ? 0 : 3 }} type="fontisto" name="player-settings" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity onMouseOver={() => (setHoverSide6(true))} onMouseLeave={() => { setHoverSide6(false) }} onPress={userSignOut} style={{ marginBottom: 12 }}>
                            <Icon style={{ top: (hoverside6 === true) ? 0 : 3 }} type="material-community" name="logout-variant" color="#F6AE2D" size={35} />
                        </TouchableOpacity>
                    </View>
                    :
                    <View>
                        {/*ON PHONE*/}
                    </View>
                }
                {(windowWidth >= 800) ?
                    <View style={{ flex: 1, maxWidth: 325, margin: 8 }}>

                        {/* SNAPSHOT */}
                        <View style={[styles.shadowProp, { backgroundColor: 'white', padding: 15, marginVertical: 5, borderRadius: 8 }]}>
                            <View style={{ marginVertical: 10 }}>
                                <Text style={{ fontSize: 30, fontFamily: 'Bold' }}>Snapshot</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                <Icon type="ant-design" name="hearto" color="grey" size={20} style={{ margin: 5 }} />
                                <Text numberOfLines={1} style={{ fontFamily: 'Bold' }}>1242 likes from Sweet Waffle </Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                <Icon type="material-icons" name="rate-review" outline color="grey" size={20} style={{ margin: 5 }} />
                                <Text numberOfLines={1} style={{ fontFamily: 'Bold' }}>2 new reviews from Sweet Waffle </Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                <Icon type="feather" name="edit" color="grey" size={20} style={{ margin: 5 }} />
                                <Text numberOfLines={1} style={{ fontFamily: 'Bold' }}>Charles made edit to dashboard</Text>
                            </View>
                            <Text style={{ fontFamily: 'Primary' }}>more...</Text>
                        </View>

                        {/* TOP RANKING */}
                        <View style={[styles.shadowProp, { backgroundColor: 'white', padding: 15, marginVertical: 5, borderRadius: 8 }]}>
                            <View style={{ marginVertical: 10 }}>
                                <Text style={{ fontSize: 30, fontFamily: 'Bold' }}>Top Ranking</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                <Text numberOfLines={1} style={{ fontFamily: 'Bold' }}>Rank #23 </Text>
                            </View>
                            <Text style={{ fontFamily: 'Primary' }}>more...</Text>
                        </View>
                        {/* STATS */}
                        <View style={[styles.shadowProp, { backgroundColor: 'white', padding: 15, marginVertical: 5, borderRadius: 8 }]}>
                            <View style={{ marginVertical: 5 }}>
                                <Text style={{ fontSize: 20, fontFamily: 'Bold', textAlign: 'center' }}>Statistics</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                <Icon type="ant-design" name="hearto" color="grey" size={20} style={{ margin: 5 }} />
                                <View>
                                    <Text numberOfLines={1} style={{ fontFamily: 'Bold', fontSize: 18 }}>203844 </Text>
                                    <Text numberOfLines={1} style={{ fontFamily: 'Bold', fontSize: 12 }}>total likes </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                <Icon type="material-community" name="qrcode-scan" color="grey" size={20} style={{ margin: 5 }} />
                                <View>
                                    <Text numberOfLines={1} style={{ fontFamily: 'Bold', fontSize: 18 }}>203844 </Text>
                                    <Text numberOfLines={1} style={{ fontFamily: 'Bold', fontSize: 12 }}>total scans </Text>
                                </View>
                            </View>
                            <Text style={{ fontFamily: 'Primary' }}>more...</Text>
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
                            <Text style={{ fontFamily: 'Primary' }}>more...</Text>
                        </View>

                    </View>
                    :
                    <></>
                }
                <View style={{ flex: 3 }}>
                    <View style={[styles.shadowProp, { backgroundColor: 'white', marginHorizontal: 10, borderRadius: 13, overflow: 'hidden', flex: 3 }]}>
                        {!loading ?
                            (
                                <ImageBackground style={{ margin: 5, borderTopLeftRadius: 13, borderTopRightRadius: 13, overflow: 'hidden', height: Platform.OS === "web" ? 250 : 75 }} resizeMode="cover" source={{ uri: restaurantImage }}>
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

