import { useRef } from 'react'
import { ImageBackground, Animated, Image, ScrollView, Text, View, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-native-elements'
import { styles } from '../styles'
import { ref, onValue, orderByChild,query } from 'firebase/database'
import { collection, getDoc,doc} from 'firebase/firestore'
import { storage } from '../firebase-config';
import { useEffect, useState } from 'react';
import Card from '../Components/Card'
import { setFoodItemId } from '../redux/action'
import {  uploadBytes, getDownloadURL,ref as tef, list } from 'firebase/storage';
import { BlurView } from 'expo-blur';
import {setSearchedRestaurantImage,setSearchedRestaurant} from '../redux/action'
import { auth,database,db } from '../firebase-config'
import { Link } from '@react-navigation/native';
import {signOut } from 'firebase/auth'

function RestaurantScreen({ navigation }) {

    const dispatch = useDispatch();
    const [rawMenuData, setRawMenuData] = useState([]);
    const [menuData, setMenuItem] = useState([]);
    const [restaurants, setRestaurants] = useState([])
    const searchedRestaurant = useSelector(state => state.searchedRestaurant)
    const restaurantImage = useSelector(state => state.restaurantImage)
    const restaurantDesc = useSelector(state => state.restaurantDesc)
    const restaurantId = useSelector(state => state.restaurantId)
    const restaurantColor = useSelector(state => state.restaurantColor)

    const setRestaurant =async()=> {
        const restId = auth.currentUser.uid;
        const docRef = doc(db, "restaurants",restId);
        const snapshot = await getDoc(docRef)
        if(snapshot.exists()){
            const restaurant_id = snapshot.data().restaurant_id
            const restaurant_phone = snapshot.data().restaurant_phone
            const restaurant_address = snapshot.data().restaurant_address
            const restaurant_desc = snapshot.data().restaurant_desc
            const restaurant_name = snapshot.data().restaurant_name
            const restaurant_color = snapshot.data().restaurant_color

            dispatch(setSearchedRestaurant(restaurant_name, restaurant_desc ,restaurant_address,restaurant_phone, restaurant_id, restaurant_color))
        }  else {
            console.log("No souch document!")
        }     
    }
const getMenu= async()=>{
    const menu = query(ref(database, 'restaurants/' + restaurantId + '/menus/'));
    onValue(menu, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
            setRawMenuData("")
            Object.values(data).map((foodData) => {
                setRawMenuData((food) => [...food,foodData]);  
            })
        } 
        console.log(restaurantImage)
    })
}

// const getRestaurant= async()=>{

// }
    useEffect(() => {
        setRestaurant();
        getMenu();
        getImage();
    }, [])


    const getImage = async () => {
        const imageRef = tef(storage, 'imagesRestaurant/' + restaurantId);
        await getDownloadURL(imageRef).then((url) => {
          dispatch(setSearchedRestaurantImage(url))

        })
      }

      const topMenuItems = () => {
          const topMenuItems = rawMenuData.sort((a,b) =>(a.upvotes < b.upvotes) ? 1 : -1)
          if (topMenuItems.length > 3){
              topMenuItems.length = 3
              setMenuItem(rawMenuData.sort((a,b) =>(a.upvotes < b.upvotes) ? 1 : -1));
          } else {
            setMenuItem(rawMenuData.sort((a,b) =>(a.upvotes < b.upvotes) ? 1 : -1));
          }
        
      }
      const userSignOut= ()=> {
        signOut(auth).then(()=>{
            navigation.navigate("Home")

        }).catch((error)=> {
            console.log(error)
        })
      }

    return (
        <SafeAreaView style ={{backgroundColor:'white'}}>
            <ScrollView showsVerticalScrollIndicator = {false}>
            <Image
                style={{
                    backgroundColor:'white',
                    height: 150,
                    left: 0, right: 0,}}
                    // height: HEADER_HEIGHT_EXPANDED + HEADER_HEIGHT_NARROWED,
                source={{uri: restaurantImage}}
            />
                <View style={{margin: 10, flex: 1, backgroundColor: 'white'}}>
                    <Text style={styles.headerText}>
                        {searchedRestaurant}
                        {/* {restaurantDesc} */}
                    </Text>
                    <TouchableOpacity>
                        <Text style={[styles.subHeaderText, { marginVertical: 10 }]}>Menu Dashboard</Text>
                    </TouchableOpacity>
                    <View style ={{flexDirection:'row', justifyContent:'space-between', marginRight:'60%'}}>
                    <TouchableOpacity>
                        <Text style={{ textDecorationLine: 'underline' }} onPress={() => navigation.navigate("AddToMenu")}> Add To Menu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={{ textDecorationLine: 'underline' }} onPress={() => navigation.navigate("Settings")}>Settings</Text>
                    </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'row', margin: 5, justifyContent: 'space-evenly' }}>
                        <Button onPress={topMenuItems} buttonStyle={[styles.button,{backgroundColor:restaurantColor}]} titleStyle={styles.buttonTitle} title="Run Report"></Button>
                    
                        <Button onPress={() => navigation.navigate("RestaurantMenu")} buttonStyle={[styles.button,{backgroundColor:restaurantColor}]} titleStyle={styles.buttonTitle} title="Menu"></Button>
                    </View>
                </View>
                <View style={[styles.cards, { margin: 10, flex: 1, overflow: 'hidden', padding: 5, marginTop: 10, backgroundColor:'#FAFAFA' }]}>
                    <View style={{ flex: 1, maxHeight: 400 }}>
                        <Text style={[styles.subHeaderText, { margin: 13, fontSize: 25 }]}>Top Menu Items</Text>
                        <FlatList
                            data={menuData}
                            keyExtractor={(item) => item.food_id}
                            renderItem={({ item }) =>
                                <Card
                                    restaurant={item.restaurant}
                                    ranking={item.index}
                                    food={item.food}
                                    percent={item.upvotes > 0 ? (item.eatagain * 100 / item.upvotes) : (item.upvotes)}
                                    onPress={() => { dispatch(setFoodItemId(item.food_id, item.food, item.price, item.description, item.upvotes, item.restaurant,item.eatagain)), navigation.navigate("Food") }}
                                    upvotes={item.upvotes}
                                />
                            }
                        />
                    </View>
                </View>
                <View>
                    <Text style={[styles.headerText, { marginVertical: 10 }]}>
                        Restaurant Ratings
                    </Text>
                    <View style={{height:200,borderRadius:20,padding:20,margin:10}}>
                    <Text>No Ratings for this Menu</Text>

                    </View>

                </View>
                <View style ={{margin:10}}>
                    <TouchableOpacity>
                        <Text style={{ fontSize:20 ,textDecorationLine: 'underline' }} onPress={userSignOut}> Sign Out</Text>
                    </TouchableOpacity>
                    </View>
            </ScrollView>
        </SafeAreaView>
    )

}


export default RestaurantScreen;

