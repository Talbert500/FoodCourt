import { useState } from 'react';
import { Dimensions, Platform, TextInput, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { updateEmail } from 'firebase/auth';
import { storage, auth, database, db } from '../../firebase-config';
import { ref, update } from 'firebase/database';
import { doc, updateDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { uploadBytes, ref as tef } from 'firebase/storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Divider } from 'react-native-elements/dist/divider/Divider';

import Footer from '../../Components/Footer';
import Header from './../../Screens/Restaurants/MenuEdit/Header';
import RestaurantsHeader from './../../Screens/Restaurants/MenuEdit/RestaurantsHeader';

import { styles } from '../../styles';

function Settings({ route, navigation }) {

    const windowWidth = Dimensions.get("window").width;

    const [searchedRestaurant, setCurrentRest] = useState("")
    const [restaurantColor, setRestaurantColor] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantPhone, setRestaurantPhone] = useState("");
    const [restaurantDesc, setRestaurantDesc] = useState("");
    const [phone, setPhone] = useState(restaurantPhone);
    const [restId, setRestId] = useState("")

    const [userEmail, setUserEmail] = useState('');
    const [oldUserPassword, setOldUserPassword] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [repeatNewUserPassword, setRepeatNewUserPassword] = useState('');

    const AddNewRestaurant = async () => {

        console.log(auth.currentUser.email)
        console.log(auth.currentUser.uid)
        console.log("Updated")
        updateNewEmail();

        updateEmail(auth.currentUser, userEmail ).then(()=> {
        }).catch((error)=> {
            console.log(error)
        })

        updateDoc(doc(db, "restaurants", auth.currentUser.uid), {
            restaurant_phone: restaurantPhone,
            restaurant_desc: restaurantDesc,
            restaurant_color: restaurantColor

        }).catch((error) => {
            const errorCode = error;
            console.log("ERROR" + errorCode)
        })

        update(ref(database, "user/" + auth.currentUser.uid), {
            userName: searchedRestaurant

        });
        //just added 

        // console.log(tookPicture);
        // const getImageRef = tef(storage, 'imagesRestaurant/' + auth.currentUser.uid); //check if the storage updates 
        // //convert image to array of bytes
        // const img = await fetch(tookPicture);
        // const bytes = await img.blob();
        // uploadBytes(getImageRef, bytes).catch((error) => {
        //     console.log(error)
        // })
        // dispatch(setSearchedRestaurantImage(tookPicture));
        // updateProfile(auth.currentUser, {
        //     displayName: inputRest,
        //     photoURL: tookPicture
        // }).then(() => {
        //     console.log()
        // })

        //we can keep it local or do a check on the backend side and out from there
        //dispatch(setSearchedRestaurant(inputRest,restaurant_desc,restaurant_address,restaurant_phone,restaurant_id))
        navigation.navigate("Settings")

    }

    const editPhoto = async (imagee) => {
        const getImageRef = tef(storage, 'imagesRestaurant/' + restId); //how the image will be addressed inside the storage
        //convert image to array of bytes
        const img = await fetch(imagee);
        const bytes = await img.blob();
        uploadBytes(getImageRef, bytes).catch((error) => {
            console.log(error)
        })


    }

    const updateNewEmail = ()=> {
    }

    const userSignOut = () => {
        signOut(auth).then(() => {
            if (Platform.OS === 'web') {
                navigation.navigate("Login")
            } else {
                navigation.navigate("Home")
            }

        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <View>
            <RestaurantsHeader/>
            <Header activeTab={"Settings"} route={route} navigation={navigation}/>
            <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }}>
                <View style={{ flexDirection: windowWidth >= 500 ? 'row' : 'column', flexWrap: 'wrap-reverses', margin: 5 }}>
                    <View style={{ backgroundColor: 'white', flex: 2 }}>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                            <View 
                                style={{ 
                                    marginLeft: "130px", 
                                    marginTop: "35px",
                                    display: "flex"
                                }}
                            >
                                <Text style={{ fontSize: "30px", fontWeight: "bold" }}>Account Details</Text>
                                <View 
                                    style={{ 
                                        backgroundColor: "grey", 
                                        borderRadius: "100px",
                                        height: "100px",
                                        width: "100px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginLeft: "60px",
                                        marginTop: "20px",
                                        cursor: "pointer"
                                     }}
                                >
                                    <Text style={{ color: "white" }}>Edit</Text>
                                </View>
                                <View style={{ marginTop: "20px" }}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", cursor: "pointer" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="34.56" height="30.295" viewBox="0 0 34.56 30.295">
                                            <path id="Icon_map-food" data-name="Icon map-food" d="M35.2,10.911,32.37,33.12H22.8L19.979,10.8H31.662l2.309-7.975,1.309.395-2.215,7.675,2.139.017ZM18.626,23.76s.358-2.88-4.6-2.88h-7.9c-4.955,0-4.6,2.88-4.6,2.88H18.626ZM1.515,30.24s-.351,2.88,4.6,2.88h7.9c4.962,0,4.6-2.88,4.6-2.88H1.515ZM17.884,28.8A1.656,1.656,0,0,0,19.352,27a1.654,1.654,0,0,0-1.468-1.8H2.189A1.657,1.657,0,0,0,.72,27a1.659,1.659,0,0,0,1.469,1.8h15.7Z" transform="translate(-0.72 -2.825)" fill="#f6ae2d"/>
                                        </svg>
                                        <Text style={{ fontSize: "20px", marginLeft: "10px" }}>Billing/Subscription</Text>
                                    </View>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "15px", cursor: "pointer" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="31.499" height="24.004" viewBox="0 0 31.499 24.004">
                                            <path id="Icon_awesome-sign-out-alt" data-name="Icon awesome-sign-out-alt" d="M31.063,17.563l-10.5,10.5A1.5,1.5,0,0,1,18,27V21H9.5A1.5,1.5,0,0,1,8,19.5v-6A1.5,1.5,0,0,1,9.5,12H18V6a1.5,1.5,0,0,1,2.563-1.063l10.5,10.5A1.513,1.513,0,0,1,31.063,17.563ZM12,27.75v-2.5a.752.752,0,0,0-.75-.75H6a2,2,0,0,1-2-2v-12a2,2,0,0,1,2-2h5.25A.752.752,0,0,0,12,7.75V5.25a.752.752,0,0,0-.75-.75H6a6,6,0,0,0-6,6v12a6,6,0,0,0,6,6h5.25A.752.752,0,0,0,12,27.75Z" transform="translate(0 -4.499)" fill="#f6ae2d"/>
                                        </svg>
                                        <Text onPress={userSignOut} style={{ fontSize: "20px", marginLeft: "10px" }}>Sign Out</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ maxWidth: 700, alignSelf: Platform.OS === 'web' ? 'center' : '', width: '100%', padding: 10, marginLeft: "50px", marginTop: "60px" }}>
                                <View style={{ margin: 10 }}>
                                    <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', marginVertical: -5 }}>Display name</Text>
                                    <TextInput
                                        style={[styles.oldInputContainer, { padding: 10, width: 300, alignContent: 'flex-start' }]}
                                        onChangeText={searchedRestaurant}
                                        value={searchedRestaurant}
                                        placeholder=""
                                        autoCapitalize='words'
                                    />
                                </View>
                                <View style={{ display: "flex", flexDirection: "row", margin: 10, justifyContent: "space-between" }}>
                                    <View>
                                        <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', marginVertical: -5 }}>Email address</Text>
                                        <TextInput
                                            placeholder=""
                                            value={userEmail}
                                            onChangeText={setUserEmail}
                                            style={[styles.oldInputContainer, { padding: 10, width: 300, alignContent: 'flex-start' }]}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', marginVertical: -5 }}>Phone number</Text>
                                        <TextInput
                                            placeholder=""
                                            value={restaurantPhone}
                                            onChangeText={setRestaurantPhone}
                                            style={[styles.oldInputContainer, { padding: 10, width: 300, alignContent: 'flex-start' }]}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Text style={{ fontSize: "20px", margin: 10 }}>Linked Accounts</Text>
                                    <Text style={{ fontSize: "17px", marginLeft: 10 }}>
                                        We use this to let you sign in and populate your profile information
                                    </Text>
                                    <View style={{ display: "flex", flexDirection: "row", marginLeft: "auto" }}>
                                        <View style={[styles.oldInputContainer, { 
                                                padding: 10, 
                                                width: 150, 
                                                alignContent: 'flex-start', 
                                                cursor: "pointer", 
                                                textAlign: "center", 
                                                marginRight: "25px" 
                                            }]}>
                                            <Text style={{ color: "#F6AE2D" }}>Connect Facebook</Text>
                                        </View>
                                        <View style={[styles.oldInputContainer, { 
                                                padding: 10, width: 150, 
                                                alignContent: 'flex-start', 
                                                cursor: "pointer", 
                                                textAlign: "center" 
                                            }]}>
                                            <Text style={{ color: "#F6AE2D" }}>Connect Instagram</Text>
                                        </View>
                                    </View>
                                </View>
                                <Text style={{ fontSize: "25px", fontWeight: "bold", marginTop: "20px" }}>Billing Details</Text>
                                <Divider style={{ marginVertical: 10 }} />
                                <View style={{ maxWidth: 700, alignSelf: Platform.OS === 'web' ? 'center' : '', width: '100%' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 18, fontFamily: 'Bold', minWidth: 150, alignSelf: 'center', marginRight: "15px" }}>Subscription plan</Text>
                                        <TextInput
                                            style={[styles.oldInputContainer, { padding: 10, alignSelf: 'center', backgroundColor: '#ECECEC' }]}
                                            placeholder='Starter monthly plan ($12.00)'
                                            autoCapitalize='words'
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 18, fontFamily: 'Bold', minWidth: 150, alignSelf: 'center', marginRight: "15px" }}>Next billing date</Text>
                                        <TextInput
                                            style={[styles.oldInputContainer, { padding: 10, alignSelf: 'center', backgroundColor: '#ECECEC' }]}
                                            placeholder='Sat Mar 04 17:33:05 GMT-0700 (Mountain Standard Time)'
                                            autoCapitalize='words'
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 18, fontFamily: 'Bold', minWidth: 150, alignSelf: 'center', marginRight: "15px" }}>Payment method</Text>
                                        <TextInput
                                            style={[styles.oldInputContainer, { padding: 10, alignSelf: 'center', backgroundColor: '#ECECEC', marginRight: "-15px" }]}
                                            placeholder='American Express ending in 1005'
                                            autoCapitalize='words'
                                        />
                                        <Button onPress={() => navigation.goBack()} buttonStyle={[styles.oldInputContainer, { padding: 10, backgroundColor: "#F6AE2D", width: "120px" }]} titleStyle={{ color: "white", fontSize: "14px" }} title="Change" />
                                    </View>
                                    <View style={{ display: "flex", flexDirection: "row" }}>
                                        <Text style={{ fontSize: 18, fontFamily: 'Bold', minWidth: 150, marginTop: "30px" }}>
                                            Menu Storage
                                        </Text>
                                        <Text style={{ fontSize: 18, fontFamily: 'Bold', marginTop: "30px", marginLeft: "auto" }}>
                                            0/20 Foods
                                        </Text>
                                    </View>
                                    <TextInput
                                        style={[styles.oldInputContainer, { padding: 10, alignSelf: 'center', marginRight: "-15px" }]}
                                        disabled
                                    />
                                    <View style={{ width: 200, maxWidth: 200, marginLeft: 'auto', marginTop: 10 }}>
                                        <Button onPress={AddNewRestaurant} buttonStyle={[styles.button, { backgroundColor: '#F6AE2D', borderRadius: "10px" }]} titleStyle={styles.buttonTitle} title="Change Plan" /> 
                                    </View>
                                </View>
                                <Text style={{ fontSize: "25px", fontWeight: "bold", marginTop: "20px" }}>Reset Password</Text>
                                <Divider style={{ marginVertical: 10 }} />
                                <View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 18, fontFamily: 'Bold', minWidth: 150, alignSelf: 'center', marginRight: "15px" }}>Old Password</Text>
                                        <TextInput
                                            style={[styles.oldInputContainer, { padding: 10, alignSelf: 'center' }]}
                                            autoCapitalize='words'
                                            placeholder='Please enter old password...'
                                            onChangeText={setOldUserPassword}
                                            value={oldUserPassword}
                                            secureTextEntry
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 18, fontFamily: 'Bold', minWidth: 150, alignSelf: 'center', marginRight: "15px" }}>New Password</Text>
                                        <TextInput
                                            style={[styles.oldInputContainer, { padding: 10, alignSelf: 'center' }]}
                                            autoCapitalize='words'
                                            placeholder='Please enter new password...'
                                            onChangeText={setNewUserPassword}
                                            value={newUserPassword}
                                            secureTextEntry
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 18, fontFamily: 'Bold', minWidth: 150, alignSelf: 'center', marginRight: "15px" }}>Re-Enter New Password</Text>
                                        <TextInput
                                            style={[styles.oldInputContainer, { padding: 10, alignSelf: 'center' }]}
                                            autoCapitalize='words'
                                            placeholder='Please re-enter old password...'
                                            onChangeText={setRepeatNewUserPassword}
                                            value={repeatNewUserPassword}
                                            secureTextEntry
                                        />
                                    </View>
                                </View>
                                <View style={{ width: 200, maxWidth: 200, marginLeft: 'auto', marginTop: 10 }}>
                                    <Button onPress={AddNewRestaurant} buttonStyle={[styles.button, { backgroundColor: '#F6AE2D', borderRadius: "10px" }]} titleStyle={styles.buttonTitle} title="Reset" /> 
                                </View>
                                <View style={{ maxWidth: 700 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View>
                                            <Text style={{ fontSize: 18, fontWeight: "500", fontFamily: 'Bold', minWidth: 150 }}>Delete Accounts</Text>
                                            <Text style={{ textAlign: 'left', fontSize: "17px" }}>By deleting your account you will lose all your data</Text>
                                        </View>
                                        <View style={{ width: 200, maxWidth: 200, marginLeft: 'auto' }}>
                                            <Button buttonStyle={[styles.button, { backgroundColor: 'white', borderRadius: "10px" }]} titleStyle={[styles.buttonTitle, { color: "#828182" }]} title="Delete Account" />
                                        </View>
                                    </View>
                                    <Divider style={{ marginVertical: 10 }} />
                                    <View style={{ width: 200, maxWidth: 200, marginLeft: 'auto', marginTop: 10 }}>
                                        <Button onPress={AddNewRestaurant} buttonStyle={[styles.button, { backgroundColor: '#F6AE2D', borderRadius: "10px" }]} titleStyle={styles.buttonTitle} title="Save Changes" />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                </View>

                <View style={{ marginTop: "20%" }}>
                    <Footer />
                </View>

                {/* <View style={{backgroundColor:'rgba(0, 0,0,0.5)',position: 'absolute',zIndex:1,top:'0',bottom:'0',left:'0',right:'0',paddingTop:"20%",paddingHorizontal:'3%'}}>
                    <View style={[styles.shadowProp, { flex:1,backgroundColor: 'white', maxHeight: 600,alignSelf:'center',width:'100%',backgroundColor:'white',borderRadius:5}]}>

                    </View>
                </View> */}

            </KeyboardAwareScrollView>
        </View>
    )
}



export default Settings 