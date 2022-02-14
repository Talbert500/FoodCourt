import { Image, ScrollView, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, TextInput, Text, View, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements'
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config'
import { ref, set, update, push } from 'firebase/database'
import { useSelector, useDispatch } from 'react-redux';
import { styles } from '../../styles'
import { storage } from '../../firebase-config';
import { Divider } from 'react-native-elements'
import { doc, setDoc } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { auth } from '../../firebase-config'
import { updateProfile } from 'firebase/auth';
import { setSearchedRestaurant } from '../../redux/action'
import Icon from 'react-native-vector-icons/Feather'
import { uid } from 'uid'
import { database } from '../../firebase-config'
import { Link } from '@react-navigation/native';

function CreateMenu({ navigation }) {
    const searchedRestaurant = useSelector(state => state.searchedRestaurant)
    const restaurantDesc = useSelector(state => state.restaurantDesc)
    const restaurantPhone = useSelector(state => state.restaurantPhone)
    const restaurantAddress = useSelector(state => state.restaurantAddress)
    const restaurantId = useSelector(state => state.restaurantId)
    const restaurantImage = useSelector(state => state.restaurantImage)
    const restaurantColor = useSelector(state => state.restaurantColor)
    
    // I need to go to reducer state to get this object because the camera is called in the component to set a  new image and I want to see it
    //after I take the photo
    //Item
    
    const AddCategories = async () => {
        const uuid = uid();
        set(ref(database, "restaurants/" + restaurantId + "/categories" ), {
            desc,
            desc1,
            desc2,
            desc3,
            desc4,
            desc5,
            desc6,
            desc7
        });

        navigation.navigate("Restaurant")
    }


    useEffect(() => {

        console.log(auth.currentUser.email)

    }, [])

     const userCredential_id = useSelector(state => state.userCredential_id)
     const adminEmail = useSelector(state => state.adminEmail)

    const [inputRest, setInputRest] = useState("")
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")
    const [desc, setDesc] = useState("Appetizers")
    const [desc1, setDesc1] = useState("Breakfast")
    const [desc2, setDesc2] = useState("Lunch")
    const [desc3, setDesc3] = useState("Dinner")
    const [desc4, setDesc4] = useState("Dessert")
    const [desc5, setDesc5] = useState("Happy Hour")
    const [desc6, setDesc6] = useState("Drinks")
    const [desc7, setDesc7] = useState("Other")



    return (
        <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "transparent" }}>
            <View style={{ backgroundColor: 'white', marginTop:Platform.OS === 'web'? 0:'10%' }}>
                <View style={{ backgroundColor: '#F2F2F2', borderBottomEndRadius: 50, shadowColor: 'black', shadowOffset: { width: -1, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 }}>
                {Platform.OS === 'web' ? <TouchableOpacity
                onPress={()=> {navigation.goBack()}}
                style={[styles.button, { marginRight: "65%" }]}>
                    <View style ={{flexDirection:'row'}}>
                <Icon style={{  margin: 10 }}
                    color="black" size={20}
                    name="arrow-left" />
                <Text style={[styles.buttonText,{fontWeight:'bold', alignSelf:'center', marginHorizontal:1}]}>Back</Text></View>
            </TouchableOpacity> :
                <Icon style={{ paddingTop: 30, margin: 10 }}
                    color="black" size={35}
                    name="arrow-left"
                    onPress={() => { navigation.goBack() }} />}

                    <View style={{ marginHorizontal: 20, marginVertical: 5 }}>
                        <Text style={[styles.subHeaderText,{fontSize:40}]}>
                            Welcome, {searchedRestaurant}
                        </Text>
                        <View style={{ flexDirection: 'row', }}>
                        </View>
                    </View>
                    <View>
                        <View style={{ marginHorizontal: 20, flexDirection: 'row', margin: 10 }}>
                            <View style={{ maxWidth: '66%' }}>
                                <Text style={styles.subHeaderText}>About Us</Text>
                                <Text>{restaurantDesc} </Text>
                            </View>

                        </View>
                    </View >
                </View>
                <View style ={{marginHorizontal: Platform.OS === 'web' ? "10%" : "5%"}}>
                <Image source={{ uri: restaurantImage }} style={{ alignSelf: 'center', width: "100%", height: 200 }} />
                <View style={{ padding: 10 }}>
                    
                    <View style={{ margin: 10, flex: 1, backgroundColor: 'white' }}>

                        <Button onPress={() => navigation.navigate("RestaurantMenu")} buttonStyle={[styles.button, { marginHorizontal: 40, backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} title="Preview Menu" />


                        <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'row', margin: 5, justifyContent: 'space-evenly' }}>
                        </View>
                    </View>
                    <View style ={[styles.shadowProp, {backgroundColor:'#F2F2F2', padding: 20, borderRadius:10}]}>
                    <Text style={styles.subHeaderText}>Add Menu Categories</Text>
                    <TextInput
                        style={[styles.inputContainer, { padding: 14, alignSelf: 'center' }]}
                        onChangeText={setDesc}
                        value={desc}
                        placeholder="Appetizers"
                    />
                    <TextInput
                        style={[styles.inputContainer, { padding: 14, alignSelf: 'center' }]}
                        onChangeText={setDesc1}
                        value={desc1}
                        placeholder="Breakfast"
                    />
                    <TextInput
                        style={[styles.inputContainer, { padding: 14, alignSelf: 'center' }]}
                        onChangeText={setDesc2}
                        value={desc2}
                        placeholder="Lunch"
                    />
                    <TextInput
                        style={[styles.inputContainer, { padding: 14, alignSelf: 'center' }]}
                        onChangeText={setDesc3}
                        value={desc3}
                        placeholder="Dinner"
                    />
                    <TextInput
                        style={[styles.inputContainer, { padding: 14, alignSelf: 'center' }]}
                        onChangeText={setDesc4}
                        value={desc4}
                        placeholder="Dessert"
                    />
                    <TextInput
                        style={[styles.inputContainer, { padding: 14, alignSelf: 'center' }]}
                        onChangeText={setDesc5}
                        value={desc5}
                        placeholder="Happy Hour"
                    />
                    <TextInput
                        style={[styles.inputContainer, { padding: 14, alignSelf: 'center' }]}
                        onChangeText={setDesc6}
                        value={desc6}
                        placeholder="Drinks"
                    />
                    <TextInput
                        style={[styles.inputContainer, { padding: 14, alignSelf: 'center' }]}
                        onChangeText={setDesc7}
                        value={desc7}
                        placeholder="Others"
                    />
                    </View>
                    <Button onPress={AddCategories} buttonStyle={[styles.button, { marginHorizontal: 40, backgroundColor: restaurantColor }]} titleStyle={styles.buttonTitle} title="Complete Restaurant" />
                </View>
            </View>
            </View>
        </KeyboardAwareScrollView>

    );
}

export default CreateMenu