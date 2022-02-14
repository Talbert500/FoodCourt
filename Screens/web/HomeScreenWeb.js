
import { TextInput, RefreshControl, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, Input } from 'react-native-elements'

import { useDispatch } from 'react-redux';

import { db } from '../../firebase-config'
import { collection, getDocs } from 'firebase/firestore'
import { setSearchedRestaurant, setFoodItemImage, } from '../../redux/action'
import { useFonts } from "@use-expo/font";
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Link } from '@react-navigation/native';

import { styles } from '../../styles'
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Primary = "#F6AE2D"
const Secondary = "#F2F2F2"
function HomeScreenWeb({ navigation }) {

    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [text, onChangeText] = useState("")
    const restCollectionRef = collection(db, "restaurants")

    const [restaurants, setRestaurants] = useState([])
    const [filtered, setFiltered] = useState([]);
    const [searching, setSearching] = useState(false);

    // const [selectedRestaurants, setSelectedRestaurants] = useState("")
    const getRest = async () => {
        setRefreshing(true);
        const data = await getDocs(restCollectionRef);
        setRestaurants(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        setFiltered(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        setRefreshing(false);
    }

    useEffect(() => {
        const getRest = async () => {
            const data = await getDocs(restCollectionRef);
            setRestaurants(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            setFiltered(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }
        getRest()
        dispatch(setFoodItemImage("null"))

    }, [])


    const ItemView = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    dispatch(setSearchedRestaurant(item.restaurant_name, item.restaurant_desc, item.restaurant_address, item.restaurant_phone, item.restaurant_id, item.restaurant_color)),
                        onChangeText(item.restaurant_name),
                        navigation.navigate("RestaurantMenu")

                }
                }>
                <View style={{ backgroundColor: 'white' }}>
                    <Text style={{ fontSize: 16, padding: 5, fontWeight: '500' }}>
                        {item.restaurant_name.toUpperCase()}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    const ItemSeparatorView = () => {
        return (
            <View style={{ height: 0.5, width: '100%', backgroundColor: '#c8c8c8' }} />
        )
    }

    const searchFilter = (text) => {
        setSearching(true);

        if (text) {
            const newData = restaurants.filter((item) => {
                const itemData = item.restaurant_name ?
                    item.restaurant_name.toUpperCase()
                    : ' '.toUpperCase()
                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;
            });
            setFiltered(newData);
            onChangeText(text);
        } else {
            setFiltered(restaurants);
            onChangeText(text);
        }
    }
    const pullup = () => {
        setSearching(true);
    }
    const pullout = () => {
        onChangeText("")
        setSearching(false);
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {/* TAB HEADER*/}
            <View style={{ backgroundColor: "white", height: "10%", justifyContent: "center" }}>
                <View style={{ margin: 20, flexDirection: "row", justifyContent: 'space-around', maxWidth: '15%' }}>

                    <Text style={{ fontWeight: '700' }}>About Us</Text>
                    <Text style={{ fontWeight: '700' }}>Blog</Text>
                    <View style ={{justifyContent:"flex-end",alignItems:'flex-end'}}>
                    {/* <TouchableOpacity
                    onPress={{}}
                    style={[styles.button, styles.buttonOutline, { paddingHorizontal: 50 }]}
                >
                    <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity> */}
                </View>
                </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    style={[styles.shadowProp, {
                        resizeMode: 'cover',
                        position: 'absolute',
                        width: windowWidth, shadowColor: '#171717',
                        shadowOffset: { width: -1, height: 2 },
                        shadowOpacity: 0.5,
                        shadowRadius: 3,
                        opacity: 0.2,
                        height: '100%'
                    }]}
                    source={require('../../assets/homescreen1.jpg')}
                />
                <Image
                    style={[styles.shadowProp, {
                        width: 125, height: 125, shadowColor: '#171717',
                        marginTop: "5%",
                        shadowOffset: { width: -1, height: 2 },
                        shadowOpacity: 0.5,
                        shadowRadius: 3,
                    }]}
                    source={require('../../assets/logos/white_taco.png')}
                />
                <View style={{ alignContent: 'center' }}>
                    <Text style={{ fontSize: 30, fontWeight: "bold", margin: 10, textAlign: 'center' }}>Rate My Food</Text>
                    <Text style={{ fontSize: 15, textAlign: "center", width: windowWidth - 30 }}>get rankings of the best mexican foods in your area:</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                    <Input
                        inputContainerStyle={[styles.input, styles.shadowProp]}
                        onChangeText={(text) => searchFilter(text)}
                        value={text}
                        placeholder="Taco Bell..."
                        onSubmitEditing={pullout}
                        onPressOut={pullup}
                        leftIcon={{ type: 'material-community', name: "taco" }}
                    />
                    <Input
                        inputContainerStyle={[styles.input, styles.shadowProp]}
                        onChangeText={(text) => searchFilter(text)}
                        value={text}
                        placeholder="Phoenix, AZ"
                        onSubmitEditing={pullout}
                        onPressOut={pullup}
                        leftIcon={{ type: 'material-icons', name: "food-bank" }}
                    />
                </View>
                {searching ?
                <View style={[styles.search]}>
                  <FlatList
                    data={filtered}
                    keyExtractor={(item, index) => index}
                    ItemSeparatorComponent={ItemSeparatorView}
                    renderItem={ItemView}
                    refreshing={false}
                    onRefresh={getRest}
                  />
                </View>
                : <View />}
                <Text
                    onPress={() => { navigation.navigate("SignUp") }}
                    style={{ fontSize: 15, marginTop: 20, textAlign: "center", fontWeight: 'bold' }}
                >
                    Restaurant Login
                </Text>
                <Button title ="Restaurant Login" onPress={() => { navigation.navigate("SignUp") }}/>
            </View>
            <View style={{ backgroundColor: "red", height: "10%", justifyContent: "flex-end" }}>
                <Text>Test</Text>
            </View>
        </View>
    )

}



export default HomeScreenWeb;