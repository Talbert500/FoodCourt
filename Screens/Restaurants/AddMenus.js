import { Image, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, TextInput, Text, View, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements'
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config'
import { ref, set, update, push } from 'firebase/database'
import { useSelector, useDispatch, connect } from 'react-redux';
import { styles } from '../../styles'
import { storage } from '../../firebase-config';
import { Divider } from 'react-native-elements'
import { doc, setDoc } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { auth } from '../../firebase-config'
import { updateProfile } from 'firebase/auth';
import { setLoading, setSearchedRestaurant } from '../../redux/action'
import Icon from 'react-native-vector-icons/Feather'
import { database } from '../../firebase-config'
import { Link } from '@react-navigation/native';
import { useFonts } from "@use-expo/font";
import { render } from 'react-dom';
import { setMenusData } from '../../redux/saga';
// import TimePicker from 'react-time-picker';
import SyncLoader from "react-spinners/SyncLoader";

function CreateMenu(props) {

    const dispatch = useDispatch()

    let [fontsLoaded] = useFonts({
        'Primary': require('../../assets/fonts/proxima_nova_reg.ttf'),
        'Bold': require('../../assets/fonts/proxima_nova_bold.ttf'),
        'Black': require('../../assets/fonts/proxima_nova_black.otf')
    });


    const [menus, setMenus] = useState([]);
    const [time_from, setTimeFrom] = useState("")
    const [time_to, setTimeTo] = useState("")
    const [name, setName] = useState("")
    const [cuisine, setCuisine] = useState("Mexican")
    const [input, setInput] = useState("")
    const [categories, setCategories] = useState([])

    // I need to go to reducer state to get this object because the camera is called in the component to set a  new image and I want to see it
    //after I take the photo
    //Item
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;


    const AddMenus = async () => {
        setMenusData(dispatch, props.navigation, menus)
    }


    useEffect(() => {
        console.log(categories, 'categories')
        // console.log(auth.currentUser.email)
    })


    const makeDefault = () => {
        console.log(menus)
        // setMenusData(dispatch, props.navigation, menus)
    }

    const addCategory = () => {
        if(input !== "") {
            setInput("")
            setCategories([...categories, { categoryName: input, id: Math.random().toString(16).slice(2) }])
        }
    }

    const deleteItem = (category) => {
        setCategories(categories.filter(item => item.id !== category.id))
    }

    const deleteMenu = (menu) => {
        setMenus(menus.filter(item => item !== menu))
    }

    const addMenu = () => {
        const categoriesForApi = categories.map(c => c.categoryName)

        setMenus([...menus, { name: name, available_from: time_from, available_to: time_to, cuisine: "Mexican", categories: categoriesForApi }])
        setTimeFrom("")
        setTimeTo("")
        setName("")
        setCategories("")
        setInput("")
    }

    useEffect(() => {
        dispatch(setLoading(false))
    }, [])


    return (
        <KeyboardAwareScrollView style={{ backgroundColor: '#F5F5F5' }}>
            <View style={{ alignSelf: 'center' }}>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        style={{
                            width: 200,
                            height: 100,
                            resizeMode: "contain",
                            justifyContent: 'center'
                        }}
                        source={require('../../assets/logo.png')} />
                    <Image
                        style={{
                            width: windowWidth >= 450 ? 500 : 300,
                            height: 35,
                            resizeMode: "contain",
                            justifyContent: 'center'
                        }}
                        source={require('../../assets/onboarding_steps/step4.png')} />
                    <Text style={{ fontFamily: 'Bold', fontSize: 25, marginTop: 20 }}>
                        Add your menus
                    </Text>
                    <Text style={{ fontFamily: 'Primary', fontSize: 16, color: '#7E7E7E', maxWidth: 350, textAlign: 'center' }}>
                        You will be able to edit and change this at any time.
                    </Text>
                </View>
                <View>
                    <View style={[styles.shadowProp, { backgroundColor: 'white', alignSelf: 'center', padding: 35, margin: 50, borderRadius: 20, width: '475px', maxWidth: 650 }]}>
                        <Text style={styles.subHeaderText}>Add Menu</Text>
                        <Text>Menus are created when you have food options severed a specific times. (Example. Breakfast Menu and Dinner Menu)</Text>
                        <FlatList
                            data={menus}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item }) => (
                                <View style={[styles.shadowProp, { margin: 10, padding: 10, backgroundColor: 'white', borderRadius: 5, display: "flex", flexDirection: "row" }]}>
                                    <TouchableOpacity onPress={() => makeDefault({ item })}>
                                        <Text style={{ fontFamily: "Bold", fontSize: 20 }}>{item.desc}</Text>
                                        <Text style={{ fontFamily: "Bold", fontSize: 20 }}>{item.name}</Text>
                                        <Text style={{ margin: 10, fontFamily: 'Primary' }}>{item.time}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => deleteMenu(item)} style={{ marginLeft: 'auto' }}>
                                        <Text style={{ fontWeight: "600", marginLeft: 'auto' }}>
                                            X
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        <Text style={{ fontFamily: 'Bold', fontSize: 15, marginTop: "11px", marginBottom: "7px" }}>Name</Text>
                        <TextInput
                            style={[styles.inputContainer, { color: "#7D7D7D" }]}
                            onChangeText={setName}
                            value={name}
                            placeholder="Lunch"
                        />
                        <View style={{ display: "flex", flexDirection: "row" }}>
                            <View>
                                <Text style={{ fontFamily: 'Bold', fontSize: 15, marginTop: "11px", marginBottom: "7px" }}>Times</Text>
                                <View style={{ display: "flex", flexDirection: "row" }}>
                                    <TextInput
                                        style={[styles.inputContainer, { color: "#7D7D7D", marginRight: "10px", width: "70px" }]}
                                        onChangeText={setTimeFrom}
                                        value={time_from}
                                        placeholder="7:00"
                                    />
                                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                                        <Text>-</Text>
                                    </View>
                                    <TextInput
                                        style={[styles.inputContainer, { color: "#7D7D7D", marginLeft: "10px", width: "70px" }]}
                                        onChangeText={setTimeTo}
                                        value={time_to}
                                        placeholder="9:00"
                                    />
                                </View>
                            </View>
                            <View>
                                <Text style={{ fontFamily: 'Bold', fontSize: 15, marginTop: "11px", marginBottom: "7px" }}>Default Cuisine</Text>
                                <TextInput
                                    style={[styles.inputContainer, { color: "#7D7D7D", marginLeft:windowWidth >= 450 ? "10px": "0" }]}
                                    value={cuisine}
                                />
                            </View>
                        </View>
                        <Divider style={{marginTop:20}}/>
                        <Text style={{ fontFamily: 'Bold', fontSize: 15, marginTop: "11px", marginBottom: "7px" }}>Categories</Text>
                        <FlatList
                            data={categories}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item, index }) => (
                                <View>
                                    <TextInput
                                        style={[styles.inputContainer, { padding: 14, marginTop: "7px", width: "261px" }]}
                                        value={item.categoryName}
                                    />
                                    <TouchableOpacity onPress={() => deleteItem(item)} style={{ position: "absolute", marginLeft: "230px", marginTop: "20px" }}>
                                        <Text style={{ fontWeight: "600", marginLeft: 'auto' }}>
                                            X
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        <TextInput
                            style={[styles.inputContainer, { padding: 14, marginTop: "7px", width: "261px" }]}
                            onChangeText={setInput}
                            value={input}
                        />
                        <View style={{ width: "145px" }}>
                            <Button
                                buttonStyle={{
                                    borderColor: '#f6ae2d',
                                    borderWidth: 1,
                                    borderRadius: "100px",
                                    height: "32px",
                                    backgroundColor: "white",
                                    marginTop: "28px",
                                    marginBottom: "32px"
                                }}
                                titleStyle={{
                                    color: "#F6AE2D",
                                    fontSie: "14px",
                                    fontWeight: "bold"
                                }}
                                onPress={addCategory} title="+ Category"
                            />
                        </View>

                        <Divider />

                        <View style={{ width: "145px", alignSelf: "center" }}>
                            <Button
                                buttonStyle={{
                                    borderColor: '#f6ae2d',
                                    borderWidth: 1,
                                    borderRadius: "100px",
                                    height: "32px",
                                    backgroundColor: "white",
                                    marginTop: "39px",
                                    marginBottom: "32px"
                                }}
                                titleStyle={{
                                    color: "#F6AE2D",
                                    fontSie: "14px",
                                    fontWeight: "bold"
                                }} 
                                onPress={addMenu} title="+ Menu" 
                            />
                        </View>
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "55px" }}>
                            <TouchableOpacity
                                onPress={() => props.navigation.goBack()}
                                style={{ flex: 1, backgroundColor: "#f6ae2d", borderRadius: 10, marginVertical: 10, padding: 15, marginHorizontal: 5 }}
                            >
                                <Text style={{ color: "white", fontFamily: 'Primary', fontWeight: 'bold', alignSelf: 'center' }}>Go Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={AddMenus}
                                style={{flex:1,backgroundColor: "#f6ae2d",borderRadius: 10,marginVertical: 10,padding: 15,marginHorizontal:5}}
                            >
                                <Text style={{ color: "white", fontFamily: 'Primary', fontWeight: 'bold', alignSelf: 'center' }}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: "center", marginTop: "20px" }}>
                            <SyncLoader color={"#F6AE2D"} loading={props.isLoading} size={25} />
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAwareScrollView>

    );
}

const mapStateToProps = (state) => {
    if(state === undefined)
    return {
        isLoading: true
    }
    
    return {
        isLoading: state.isLoading
    }
}

const CreateMenuContainer = connect(mapStateToProps, null)(CreateMenu)

export default CreateMenuContainer