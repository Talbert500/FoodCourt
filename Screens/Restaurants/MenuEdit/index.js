import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector, connect } from 'react-redux';
import { View, Text } from 'react-native';
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
import LeftNavigation from './LeftNavigation'
import FoodList from './FoodList'

import { setSearchedRestaurantImage, setSearchedRestaurant, setFoodItem } from '../../../redux/action';
import { getRestaurantImage, getQRMenuData, getQrId, getFullMenu } from './../../../redux/saga';
import { getMenuItem, getIsLoading, getFoodItem } from './../../../redux/selector';

const MenuEdit = (props) => {

    const dispatch = useDispatch();

    const { restId } = props.route.params;

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

    const [loggedin, setloggedin] = useState(false);
    const [isRestaurant, setIsRestaurant] = useState(false)
    const [userPhoto, setUserPhoto] = useState('')
    const [selectedMenus, setSelectedMenus] = useState([]);
    const [filterCatgory, setFilteredCategory] = useState('')
    const [userName, setUserName] = useState('')

    const [loadingbio, setLoadingBio] = useState(true);
    const [loadingPic, setLoadingPic] = useState(true);

    const [totalLikes,setTotalLikes] = useState(0);

    const [activeTab, setActiveTab] = useState("home");

    const [checkedPrice, setCheckedPrice] = useState("any")

    function QRMenuData(id, to, from) {
        getQRMenuData(id, to, from, dispatch)
            .then(function (response) {
                console.log(response.data);
                setScanTotal(JSON.stringify(response.data.points["0"]["0"]["1"]))
            })
            .catch(function (error) {
                console.log(error);
            });
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
                getFullMenu(restId, dispatch);
                getQrId(QRMenuData, restId, dispatch)
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
            getRestaurantImage(restId, dispatch).then((url) => {
                dispatch(setSearchedRestaurantImage(url))
                setRestaurantImage(url)
                setLoadingPic(false);
            })
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

    return(
        <View style={{ backgroundColor: "white", height: "100%" }}>
            {!props.isLoading && <Header 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                restaurantImage={restaurantImage}
                searchedRestaurant={searchedRestaurant}
                restaurantDesc={restaurantDesc}
            />}
            {activeTab === "home" && (
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <LeftNavigation
                        selectedMenus={selectedMenus}
                        setSelectedCategory={setSelectedCategory}
                        selectedCategory={selectedCategory}
                        menuItem={props.menuItem}
                        setMenuIndex={setMenuIndex}
                        setCheckedPrice={setCheckedPrice}
                        foodItem={props.foodItem}
                    />
                    <FoodList
                        filtered={props.filtered}
                        checkedPrice={checkedPrice}
                        restaurantColor={restaurantColor}
                        navigation={props.navigation}
                        restaurantId={restaurantId}
                        searchedRestaurant={searchedRestaurant}
                        restaurantDesc={restaurantDesc}
                        restaurant_address={restaurant_address}
                        restaurantPhone={restaurantPhone}
                    />
                </View>
            )}
            {activeTab === "snapshot" && <Billing route={route} navigation={props.navigation}/>}
            {/* {activeTab === "qrmenu" && <QRMenus route={route} navigation={navigation}/>} */}
            {activeTab === "qrmenu" && <Text>There will be QRMenu</Text>}
            {activeTab === "notifications" && <Notifications route={route} navigation={props.navigation}/>}
            {activeTab === "settings" && <Settings navigation={props.navigation}/>}
        </View>
    )
}

const mapStateToProps = (state) => {
    if(state === undefined)
        return {
            isLoading: true
        }

    return {
        isLoading: false,
        menuItem: state.menuItem,
        foodItem: state.foodItem,
        filtered: state.filtered
    }
}

const MenuEditContainer = connect(mapStateToProps, null)(MenuEdit)

export default MenuEditContainer