
import * as React from 'react';
import { TextInput, RefreshControl, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, Input } from 'react-native-elements'
import { useDispatch, useSelector } from 'react-redux';
import { db, provider, auth } from '../firebase-config'
import { collection, getDocs, setDoc, doc, updateDoc } from 'firebase/firestore'
import { ref, set, update, onValue } from 'firebase/database'
import { setSearchedRestaurant, setFoodItemImage, setUserProps, setNewRestaurant } from '../redux/action'
import { useFonts } from "@use-expo/font";
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppLoading from 'expo-app-loading';
import { styles } from '../styles'
import Footer from '../Components/Footer';
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { database } from '../firebase-config'
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Video, AVPlaybackStatus } from 'expo-av';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function HomeScreen({ navigation }) {

  let [fontsLoaded] = useFonts({
    'Primary': require('../assets/fonts/proxima_nova_reg.ttf'),
    'Bold': require('../assets/fonts/proxima_nova_bold.ttf'),
    'Black': require('../assets/fonts/proxima_nova_black.otf')
  });


  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [restaurantsId, setRestaurantsId] = useState("")
  const [text, onChangeText] = useState("")
  const restCollectionRef = collection(db, "restaurants")
  const [isRestaurant, setIsRestaurant] = useState(false)

  const [restaurants, setRestaurants] = useState([])
  const [filtered, setFiltered] = useState([]);
  const [searching, setSearching] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [userPhoto, setUserPhoto] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')
  const [user_date_add, setUserDate] = useState('')
  const [last_seen, setLastSeen] = useState('')
  const [userPhone, setUserPhone] = useState('')

  function googleSignOut() {
    signOut(auth).then(() => {
      setLoggedIn(false);
    }).catch(error => {
      console.log(error)
    })

  }

  function googleSignIn() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        setUserPhoto(user.photoURL)
        console.log(user)
        setLoggedIn(true);
        //Storing user data
        dispatch(setUserProps(user.email, user.displayName, user.photoURL))
        setDoc(doc(db, "users", user.email), {
          userEmail: user.email,
          userName: user.displayName,
          userId: user.uid,
          user_date_add: user.metadata.creationTime,
          last_seen: user.metadata.lastSignInTime,
          userPhone: user.phoneNumber,
        }).catch((error) => {
          const errorCode = error.code;
          console.log("ERROR", errorCode)
        })

        //Also storing but tracked user data in realtime
        set(ref(database, "user/" + user.uid), {
          userEmail: user.email,
          userName: user.displayName,
          userId: user.uid,
          user_date_add: user.metadata.creationTime,
          last_seen: user.metadata.lastSignInTime,
          userPhone: user.phoneNumber,
          hasRestaurant: "false",
          userPhoto: user.photoURL
        })


      }).catch((error) => {
        const errorCode = error.code;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromResult(error);
        console.log(credential, errorCode)
      })
  }


  const getRest = async () => {
    const data = await getDocs(restCollectionRef);
    setRestaurants(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    setFiltered(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    setRefreshing(false);
  }

  useEffect(() => {
    //dispatch(setSearchedRestaurant(null, null, null, null, null, null))
    setRefreshing(true);
    getRest()
    dispatch(setFoodItemImage("null"))
    // dispatch(setNewRestaurant(null, null, null, null, null))

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true)
        console.log(user.accessToken)
        setUserId(user.uid)
        const userRef = ref(database, "user/" + user.uid)
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            console.log(data)
            setIsRestaurant(data.hasRestaurant)
          }

        });
      } else {
        setLoggedIn(false)
      }
    })


  }, [])


  const ItemView = ({ item }) => {

    return (
      <View>
        {Platform.OS === 'web' ?
          <TouchableOpacity
            onPress={() => {
              setRestaurantsId(item.restaurant_id)
              dispatch(setSearchedRestaurant(item.restaurant_name, item.restaurant_desc, item.restaurant_address, item.restaurant_phone, item.restaurant_id, item.restaurant_color)),
                onChangeText(item.restaurant_name),
                //linkTo(`/RestaurantMenu/${item.restaurant_id}`)
                navigation.navigate("RestaurantWeb", {
                  restId: item.restaurant_id,
                })

            }
            }>
            <View style={{ backgroundColor: 'white' }}>
              <Text style={{ fontSize: 16, padding: 5, fontWeight: "500" }}>
                {item.restaurant_name.toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity> :
          <TouchableOpacity
            onPress={() => {
              setRestaurantsId(item.restaurant_id)
              dispatch(setSearchedRestaurant(item.restaurant_name, item.restaurant_desc, item.restaurant_address, item.restaurant_phone, item.restaurant_id, item.restaurant_color)),
                onChangeText(item.restaurant_name),
                //linkTo(`/RestaurantMenu/${item.restaurant_id}`)
                navigation.navigate("RestaurantMenuApp", {
                  restId: item.restaurant_id,
                })

            }
            }>
            <View style={{ backgroundColor: 'white' }}>
              <Text style={{ fontSize: 16, padding: 5, fontWeight: "500" }}>
                {item.restaurant_name.toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        }
      </View>
    )
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

  if (!fontsLoaded) {
    return (<AppLoading />)
  }
  return (
    <View style={{ backgroundColor: "white" }}>
      <KeyboardAwareScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={getRest} />}
        enableOnAndroid extraHeight={120} style={{ backgroundColor: "white" }}>
        {Platform.OS === 'web' ? (
          <View style={[styles.shadowProp, { flexDirection: "row", backgroundColor: "white", zIndex: 1, alignItems: 'center' }]}>
            <TouchableOpacity style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }} onPress={() => { navigation.navigate("Home") }}>
              {/* <Image
                style={[styles.shadowProp, {
                  width: 100, height: 70, shadowColor: '#171717',
                  marginTop: Platform.OS === 'ios' ? "30%" : 0,
                  shadowOffset: { width: -1, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                }]}
                source={require('../assets/splash.png')}
              /> */}
            </TouchableOpacity>
            <View style={{ flexDirection: "row", marginLeft: 'auto', paddingHorizontal: 12 }}>
              {loggedIn ? (
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    style={{ height: 50, width: 50, borderRadius: 40, marginHorizontal: 10 }}
                    source={{ uri: userPhoto }}
                    onPress={() => {
                      navigation.navigate("RestaurantAdmin", {
                        loginSession: userId,
                        userId: null,
                      })
                    }}
                  />
                  <TouchableOpacity
                    style={[styles.buttonOutline, styles.shadowProp, { borderRadius: 5 }]}
                    onPress={googleSignOut}
                  >
                    <Text style={[styles.buttonOutlineText, { padding: 10 }]}>Sign Out</Text>
                  </TouchableOpacity>
                </View>
              ) : (<></>
                // <TouchableOpacity
                //   style={styles.button}
                //   onPress={googleSignIn}
                // >
                //   <Text style={[styles.buttonTitle, { paddingHorizontal: 10 }]}>Google Sign In</Text>
                // </TouchableOpacity>
              )}
            </View>
          </View>
        ) :
          (<View>
          </View>
          )}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop:"5%" }}>
          <View style={{
            alignContent: 'flex-start',
            flex: 1,
            justifyContent: "center",
            padding: 20,
            alignItems: 'center',
            //paddingHorizontal: Platform.OS === 'ios' ? "10%" : "30%",
            backgroundColor: 'white', maxWidth: 600, minWidth: 300
          }}>
            <Image
              style={[styles.shadowProp, {
                width: 100, height: 70, shadowColor: '#171717',
                marginTop: Platform.OS === 'ios' ? "30%" : 0,
                shadowOffset: { width: -1, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }]}
              source={require('../assets/splash.png')}
            />
            <View style={{ alignContent: 'center' }}>
              <Text style={{ fontSize: 30, fontWeight: "bold", margin: 10, textAlign: 'center' }}>Rate My Food</Text>

              <Text style={{ fontSize: 15, textAlign: "center", width: windowWidth - 30 }}>get rankings of the best mexican foods in your area:</Text>
            </View>

            <Text style={{ fontSize: 15, textAlign: "center", width: windowWidth - 30 }}>Phoenix, AZ</Text>
            <Text style={{ fontSize: 20, margin: 30, textAlign: "center", width: windowWidth - 20 }} >Enter a restaurant to get started</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.inputContainer, { marginHorizontal: 2, paddingBottom: Platform.OS === 'ios' ? "0%" : 6 }]}>
                <Input
                  inputContainerStyle={styles.input}
                  onChangeText={(text) => searchFilter(text)}
                  value={text}
                  placeholder="Taco Bell..."
                  onSubmitEditing={pullout}
                  onPressOut={pullup}
                  leftIcon={{ type: 'material-community', name: "taco" }}
                />
              </View>
              <TouchableOpacity onPress={() => (onChangeText(""), setSearching(false))}>
                <Text style={{ fontSize: 16, fontWeight: "400", color: 'grey', marginHorizontal: 10 }}>
                  x
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.container}>
              {searching ?
                <View style={[styles.search, { marginBottom: 10, maxWidth: 300, width: 300 }]}>
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


              {Platform.OS === 'web' ? (
                <View style={{ backgroundColor: 'white', alignContent: 'center', justifyContent: 'center', paddingTop: "2%" }}>
                  <View style={{ backgroundColor: 'white', flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => { console.log("GO TO APP STORE") }}>
                      <Image
                        style={{
                          width: 150,
                          height: 75,
                          resizeMode: "contain",
                        }}
                        source={require('../assets/apple.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { console.log("GO TO GOGOLE PLAY STORE") }}>
                      <Image
                        style={{
                          width: 150,
                          height: 75,
                          resizeMode: "contain",
                        }}
                        source={require('../assets/googleplay.png')} />
                    </TouchableOpacity>

                  </View>
                  <Text style={{ alignSelf: "center", fontFamily: 'Bold', fontSize: 20 }}>
                    Available on the app store
                  </Text>
                </View>)
                : (<View></View>)}
              {Platform.OS === 'web' ? (
                <Text
                  onPress={() => { navigation.navigate("RestaurantHome") }}
                  style={{ fontSize: 15, marginTop: 20, textAlign: "center", fontWeight: "bold" }}
                >
                  Feiri for Restaurant Owners
                </Text>) : (
                <Text
                  onPress={() => { navigation.navigate("Login") }}
                  style={{ fontSize: 15, marginTop: 20, textAlign: "center", fontWeight: "bold" }}
                >
                  Feiri for Restaurant Owners
                </Text>

              )}
            </View>
          </View>
          <View style={[styles.shadowProp,{ alignItems: 'center', borderRadius:10, overflow:'hidden'}]}>
            <Image
              style={{
                width: 600,
                height: 600,
                resizeMode: "cover",
               
              }}
              source={require('../assets/web-examples/medium-shot-women-scanning-qr-code.jpg')} />
          </View>
        </View>
        {Platform.OS === 'web' ?
          <View style={{ marginTop: "10%",marginBottom:'auto'}}>
            <Footer />
          </View> :
          <View>

          </View>
        }

      </KeyboardAwareScrollView>
    </View>
  );
}



export default HomeScreen