import React, { useState, useEffect } from 'react';
import { Dimensions,View, Image, Text } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { ref, onValue} from 'firebase/database';
import { getDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import reviewOutline from './../../../assets/review_outline.png';
import { db, auth, database } from '../../../firebase-config';
import { getRestaurantImage, getQRMenuData, getQrId, getFullMenu, getMyRestaurant } from '../../../redux/saga';
import { setSearchedRestaurantImage, setSearchedRestaurant, setSelectedMenus, setSelectedCategory, setActivePageTab, setUserId } from '../../../redux/action';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Header = (props) => {
    
    const dispatch = useDispatch();

    // const { restId } = props.route.params;

    const [rating, setRating] = useState([]);

    const [scanTotal, setScanTotal] = useState("")

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
        // console.log("Getting Category")
        // const categories = ref(database, "restaurants/" + restId + "/menus/" + 1 + "/categories/")
        // onValue(categories, (snapshot) => {
        //     const data = snapshot.val();
        //     console.log(data)
        //     if (data !== null) {
        //         props.setSelectedCategory("")
        //         props.setSelectedCategory(data)
        //         // setFilteredCategory(data)
        //         getFullMenu(restId, dispatch);
        //         getQrId(QRMenuData, restId, dispatch)
        //     }

        // })

        // const getRestRatings = ref(database, "restaurants/" + restId + "/restaurantRatings");
        // onValue(getRestRatings, (snapshot) => {
        //     const data = snapshot.val();

        //     if (data !== null) {
        //         setRating("")
        //         Object.values(data).map((ratingData) => {
        //             setRating((food) => [...food, ratingData]);

        //         })
        //     }
        // })
    };

    const getMenus = async () => {
        // console.log("Getting Menu")
        // const menus = ref(database, "restaurants/" + restId + "/menus")
        // onValue(menus, (snapshot) => {
        //     const data = snapshot.val();
        //     if (data !== null) {

        //         console.log(data)
        //         // props.setSelectedMenus(null)
        //         let foodDataArray = []
        //         Object.values(data).map((foodData) => {
        //             foodDataArray.push(foodData)
        //         })
        //         props.setSelectedMenus(foodDataArray)
        //         console.log("Menus COLLECTED")
        //         getCategories();
        //     }

        // })
    };

    const getRestaurant = async () => {
        // console.log("Getting Restaurant")
        // const docRef = doc(db, "restaurants", restId);
        // const snapshot = await getDoc(docRef)
        // if (snapshot.exists()) {

        //     // props.setSearchedRestaurant(
        //     //     snapshot.data().restaurant_name, 
        //     //     snapshot.data().restaurant_desc, 
        //     //     snapshot.data().restaurant_address, 
        //     //     snapshot.data().restaurant_phone, 
        //     //     snapshot.data().restaurant_id, 
        //     //     snapshot.data().restaurant_color, 
        //     //     snapshot.data().restaurant_city,
        //     //     snapshot.data().restaurant_state,
        //     //     snapshot.data().restaurant_zip,
        //     //     snapshot.data().restaurant_website)
        //     getMenus();
        //     getRestaurantImage(restId, dispatch).then((url) => {
        //         props.setSearchedRestaurantImage(url)
        //     })
        // } else {
        //     console.log("No souch document!")
        // }
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                props.setUserId(user.uid)
            }
        })

        getMyRestaurant(dispatch)

        getRestaurant();
    }, [])

    const ratingArray = [0,1,2,3,4]

    const underline = { fontSize: "18px", fontWeight: "bold", cursor: "pointer", paddingBottom: "8px", borderBottom: "3px solid #F6AE2D" }

    const riview = ratingArray.map(r => (
        <Image key={r} style={{ 
                height: "20px", 
                width: "20px",
                marginRight: "5px",
                cursor: "pointer"
             }} 
             source={reviewOutline}
        />
    ))

    const openTab = (tabName) => {
        props.setActivePageTab(tabName)
        props.navigation.navigate(tabName)
    }

    useEffect(() => {
        console.log("Mounting")
        onAuthStateChanged(auth, (user) => {
            if (user) {
                props.setUserId(user.uid)
            }
        })
    }, [])

    function QRMenuData(id, to, from) {
        getQRMenuData(id, to, from, dispatch)
            .then(function (response) {
                console.log(response.data);
                // setScanTotal(JSON.stringify(response.data.points["0"]["0"]["1"]))
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        getRestaurant();
    }, [props.activePageTab])

    return(
        <View>
            <View style={{
                borderBottom: "1px solid #D3D3D3",
                backgroundColor: "white",
                flex:1,
                alignContent:"center"
            }}>
                <View style={{ 
                        flexDirection: "row",
                        flexWrap:'wrap',
                        alignContent:'center',
                        justifyContent:'center',
                        marginHorizontal:windowWidth >= 450 ? windowWidth / 7 : windowWidth / 11,
                }}>
                    <Image
                        style={{
                            width: 200,
                            height: 200,
                            borderRadius: 15,
                            margin:10,
                            resizeMode: "cover",
                        }}
                        source={props.restaurantImage}
                    />

                    <View style={{margin:10,flex:1,minWidth:300}}>
                        <Text style={{ 
                            fontSize: "40px",
                            fontWeight: "bold"
                        }}>
                            {props.searchedRestaurant}
                        </Text>

                        <View style={{ 
                                display: "flex", 
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                            {riview}
                            <Text style={{ fontSize: "11px" }}>1337 reviews</Text>
                        </View>

                        <Text style={{ marginTop: "19px" }}>{props.restaurantDesc}</Text>

                        <View style={{ 
                                display: "flex", 
                                flexDirection: "row",
                                marginTop:20,
                         }}>
                            <View style={{
                                    borderRadius: "30px",
                                    backgroundColor: "#F6AE2D",
                                    width: "188.16px",
                                    alignItems: "center",
                                    marginRight: "28.8px",
                                    cursor: "pointer",
                                    shadowColor: 'orange',
                                    shadowOffset: { width: 1, height: 1 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 9,
                                    flex:1,
                                    justifyContent:'center',
                                    maxWidth:200,
                                    paddingVertical:10
                
                            }}>
                                <Text style={{ fontWeight: "bold" ,color:'white'}}>Viewing as Admin</Text>
                            </View>
                            <View style={{                
                                    borderRadius: "30px",
                                    width: "188.16px",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    shadowColor: '#171717',
                                    shadowOffset: { width: 1, height: 1 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 9,
                                    flex:1,
                                    justifyContent:'center',
                                    maxWidth:200,
                                    paddingVertical:10
                            }}>
                                <Text style={{ fontWeight: "bold" }}>Share</Text>
                            </View>
                        </View>
                    </View>

                </View>
                <View style={{
                    flexDirection: "row",
                    marginHorizontal:windowWidth >= 450 ? windowWidth / 7 : windowWidth / 11,
                    justifyContent:'space-evenly'

                }}>
                    <Text style={props.activeTab === "MenuEdit" ? underline : { fontSize: "18px", paddingBottom: "8px", cursor: "pointer" }} onPress={() => openTab("MenuEdit")}>Home</Text>
                    <Text style={props.activeTab === "Billing" ? underline : { fontSize: "18px", cursor: "pointer" }} onPress={() => openTab("Billing")}>Snapshot</Text>
                    <Text style={props.activeTab === "QRMenus" ? underline : { fontSize: "18px", cursor: "pointer" }} onPress={() => openTab("QRMenus")}>QRMenu</Text>
                    <Text style={props.activeTab === "Notifications" ? underline : { fontSize: "18px", cursor: "pointer" }} onPress={() => openTab("Notifications")}>Notifications</Text>
                    <Text style={props.activeTab === "Settings" ? underline : { fontSize: "18px", cursor: "pointer" }} onPress={() => openTab("Settings")}>Settings</Text>
                </View>
            </View>
        </View>
    )
}

const mapStateToProps = (state) => {
    if(state === undefined)
    return {
        isLoading: true
    }

    return({
        // isLoading: false,
        // restaurantImage: state.restaurantImage,
        // searchedRestaurant: state.searchedRestaurant,
        // restaurantDesc: state.restaurantDesc,
        // activePageTab: state.activePageTab,
        // userId: state.userIdString,
        // menuIndex: state.menuIndex
        isLoading: false,
        restaurantImage: "https://firebasestorage.googleapis.com/v0/b/restaurants-db-dee75.appspot.com/o/imagesRestaurant%2FGrg60XZr0VeCHcMKyAWZp6kWbDk2?alt=media&token=82950c44-e7b2-4494-b5d6-ddad85af9ff7",
        searchedRestaurant: "La Korita Taqueria",
        restaurantDesc: "Authentic Mecican Foods",
        activePageTab: state.activePageTab,
        userId: state.userIdString,
        menuIndex: state.menuIndex
    })
}

const HeaderContainer = connect(mapStateToProps, {setSearchedRestaurantImage, setSearchedRestaurant, setSelectedMenus, setSelectedCategory, setActivePageTab, setUserId})(Header)

export default HeaderContainer;