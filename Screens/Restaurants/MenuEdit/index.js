import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { View, Text, FlatList } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth, database, storage } from '../../../firebase-config';
import { ref, onValue} from 'firebase/database';
import { getDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref as tef } from 'firebase/storage';

import Header from './Header';
import Billing from '../../web/Billing';
import QRMenus from '../../QRMenus';
import Notifications from '../Notifications';
import Settings from '../Settings';
import Card from '../../../Components/Card'
import LeftNavigation from './LeftNavigation'

import { setSearchedRestaurantImage, setSearchedRestaurant } from '../../../redux/action';
import { QRapiKey } from '../../../config.js';

const MenuEdit = ({ route, navigation }) => {

    const dispatch = useDispatch();

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

    const [menuData, setMenuItem] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loggedin, setloggedin] = useState(false);
    const [isRestaurant, setIsRestaurant] = useState(false)
    const [userPhoto, setUserPhoto] = useState('')
    const [foodItem, setFoodItem] = useState([])
    const [selectedMenus, setSelectedMenus] = useState([]);
    const [filterCatgory, setFilteredCategory] = useState('')
    const [userName, setUserName] = useState('')

    const [loadingbio, setLoadingBio] = useState(true);
    const [loadingPic, setLoadingPic] = useState(true);

    const [totalLikes,setTotalLikes] = useState(0);

    const [activeTab, setActiveTab] = useState("home");

    const [checkedPrice, setCheckedPrice] = useState("any")

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
                    setTotalLikes(prevState => prevState + foodData.upvotes)
                })
                //setSetMenu("Breakfast")

            }
        })

    }

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
                getQrId();


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
            getMenus();
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

    const options = [
        { label: 'Any', value: 'any' },
        { label: 'Under $5', value: 'underFive' },
        { label: '$5 to $10', value: 'fiveToTen' },
        { label: '20$ and over', value: 'twentyAndOver' },
      ];

    return(
        <View style={{ backgroundColor: "white", height: "100%" }}>
            <Header 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                restaurantImage={restaurantImage}
                searchedRestaurant={searchedRestaurant}
                restaurantDesc={restaurantDesc}
            />
            {activeTab === "home" && (
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <LeftNavigation
                        selectedMenus={selectedMenus}
                        setSelectedCategory={setSelectedCategory}
                        setFiltered={setFiltered}
                        setMenuItem={setMenuItem}
                        selectedCategory={selectedCategory}
                        foodItem={foodItem}
                        menuData={menuData}
                        setMenuIndex={setMenuIndex}
                        setCheckedPrice={setCheckedPrice}
                    />
                    <View style={{ marginLeft: "10px" }}>
                        <FlatList
                            data={filtered}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item, index }) =>
                                <View>
                                    {checkedPrice === "any" && 
                                    <Card
                                        restaurant={item.restaurant}
                                        ranking={index + item.upvotes}
                                        price={item.price}
                                        food={item.food}
                                        description={item.description}
                                        percent={item.ratingCount > 0 ? (item.eatagain * 100 / item.ratingCount).toFixed(0) : (item.eatagain)}
                                        upvotes={item.upvotes}
                                        overall={item.overall}
                                        upvoteColor={restaurantColor}
                                        category = {item.category}
                                        imageUrl = {item.imageUrl}
                                        navigation={navigation}
                                        restaurantId={restaurantId}
                                        item={item}
                                        searchedRestaurant={searchedRestaurant}
                                    />}

                                    {checkedPrice === "underFive" && item.price < 5 &&
                                    <Card
                                        restaurant={item.restaurant}
                                        ranking={index + item.upvotes}
                                        price={item.price}
                                        food={item.food}
                                        description={item.description}
                                        percent={item.ratingCount > 0 ? (item.eatagain * 100 / item.ratingCount).toFixed(0) : (item.eatagain)}
                                        upvotes={item.upvotes}
                                        overall={item.overall}
                                        upvoteColor={restaurantColor}
                                        category = {item.category}
                                        imageUrl = {item.imageUrl}
                                        navigation={navigation}
                                        restaurantId={restaurantId}
                                        item={item}
                                        searchedRestaurant={searchedRestaurant}
                                    />}

                                    {checkedPrice === "fiveToTen" && item.price >= 5 && item.price <= 10 &&
                                    <Card
                                        restaurant={item.restaurant}
                                        ranking={index + item.upvotes}
                                        price={item.price}
                                        food={item.food}
                                        description={item.description}
                                        percent={item.ratingCount > 0 ? (item.eatagain * 100 / item.ratingCount).toFixed(0) : (item.eatagain)}
                                        upvotes={item.upvotes}
                                        overall={item.overall}
                                        upvoteColor={restaurantColor}
                                        category = {item.category}
                                        imageUrl = {item.imageUrl}
                                        navigation={navigation}
                                        restaurantId={restaurantId}
                                        item={item}
                                        searchedRestaurant={searchedRestaurant}
                                    />}

                                    {checkedPrice === "twentyAndOver" && item.price >= 20 &&
                                    <Card
                                        restaurant={item.restaurant}
                                        ranking={index + item.upvotes}
                                        price={item.price}
                                        food={item.food}
                                        description={item.description}
                                        percent={item.ratingCount > 0 ? (item.eatagain * 100 / item.ratingCount).toFixed(0) : (item.eatagain)}
                                        upvotes={item.upvotes}
                                        overall={item.overall}
                                        upvoteColor={restaurantColor}
                                        category = {item.category}
                                        imageUrl = {item.imageUrl}
                                        navigation={navigation}
                                        restaurantId={restaurantId}
                                        item={item}
                                        searchedRestaurant={searchedRestaurant}
                                    />}
                                </View>
                            }
                        />
                        <View onClick={() => {
                            navigation.navigate(
                                "FoodAdd", 
                                { userId: restaurantId }), 
                                dispatch(
                                    setSearchedRestaurant(
                                        searchedRestaurant, 
                                        restaurantDesc, 
                                        restaurant_address, 
                                        restaurantPhone, 
                                        restaurantId, 
                                        restaurantColor)
                                    )
                                }} 
                            style={{ marginLeft: "32vw", marginTop: "10px", marginBottom: "10px", cursor: "pointer" }}
                        >
                            <View style={{ marginLeft: "28px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="36.559" height="36.559" viewBox="0 0 36.559 36.559">
                                    <g id="Icon_ionic-ios-add-circle-outline" data-name="Icon ionic-ios-add-circle-outline" transform="translate(-3.375 -3.375)">
                                        <path id="Контур_739" data-name="Контур 739" d="M27.824,18.465H21.277V11.918a1.406,1.406,0,0,0-2.812,0v6.547H11.918a1.347,1.347,0,0,0-1.406,1.406,1.361,1.361,0,0,0,1.406,1.406h6.547v6.547a1.362,1.362,0,0,0,1.406,1.406,1.4,1.4,0,0,0,1.406-1.406V21.277h6.547a1.406,1.406,0,0,0,0-2.812Z" transform="translate(1.783 1.783)" fill="#b3b3b3"/>
                                        <path id="Контур_740" data-name="Контур 740" d="M21.654,5.836a15.812,15.812,0,1,1-11.187,4.631A15.714,15.714,0,0,1,21.654,5.836m0-2.461A18.279,18.279,0,1,0,39.934,21.654,18.277,18.277,0,0,0,21.654,3.375Z" transform="translate(0 0)" fill="#b3b3b3"/>
                                    </g>
                                </svg>
                            </View>
                            <Text style={{ fontSize: "20px", color: "#B3B3B3", fontWeight: "bold", marginTop: "10px" }}>
                                Add Food
                            </Text>
                        </View>
                    </View>
                </View>
            )}
            {activeTab === "snapshot" && <Billing route={route} navigation={navigation}/>}
            {/* {activeTab === "qrmenu" && <QRMenus route={route} navigation={navigation}/>} */}
            {activeTab === "qrmenu" && <Text>There will be QRMenu</Text>}
            {activeTab === "notifications" && <Notifications route={route} navigation={navigation}/>}
            {activeTab === "settings" && <Settings navigation={navigation}/>}
        </View>
    )
}

export default MenuEdit