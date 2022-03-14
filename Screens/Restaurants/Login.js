
import React from 'react';
import { Modal, Alert, TextInput, RefreshControl, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, Input } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Feather'
import { useDispatch } from 'react-redux';
import { Link } from '@react-navigation/native';
import { useFonts } from '@use-expo/font';
import { uid } from 'uid';
import { setSearchedRestaurantImage, setSearchedRestaurant, setNewRestaurant,setUserProps } from '../../redux/action'
import { signInWithPopup, GoogleAuthProvider,onAuthStateChanged } from "firebase/auth";
import { db, provider, auth, database } from '../../firebase-config'
import { setDoc, getDoc, doc } from 'firebase/firestore'
import { ref, set, update, onValue } from 'firebase/database'
import * as GoogleSignIn from 'expo-google-sign-in';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


function Login({ navigation }) {


  let [fontsLoaded] = useFonts({
    'Primary': require('../../assets/fonts/proxima_nova_reg.ttf'),
    'Bold': require('../../assets/fonts/proxima_nova_bold.ttf')
  });


  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, seterror] = useState('')
  const [userPhoto, setUserPhoto] = useState('')
  const [loggedin, setloggedin] = useState(false)
  useEffect(() => {
    dispatch(setSearchedRestaurant(null, null, null, null, null, null))
    dispatch(setNewRestaurant(null, null, null, null, null))

    onAuthStateChanged(auth, (user) => {
      if (user) {
          setloggedin(true)
          navigation.goBack();
      } else {
          setloggedin(false)
      }
  })

  }, [])

  function googleSignIn() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.log(user)
        setUserPhoto(user.photoURL)
        dispatch(setUserProps(user.email,user.displayName,user.photoURL))
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
        navigation.goBack();
      }).catch((error) => {
        const errorCode = error.code;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromResult(error);
        console.log(credential, errorCode)
      })

  }

  const handleLogin = () => {
    const uuid = uid();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userCredential_id = userCredential.user.uid;
        const emails = userCredential.user.email;
        const loginSession = userCredential.user.accessToken
        console.log(userCredential_id)
        dispatch(setNewRestaurant(userCredential_id, emails))

        navigation.goBack();

      }).catch((error) => {
        seterror(error.code)
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert(
          "Alert",
          `${errorCode}`,
          [
            {
              text: "Try again",
              style: 'cancel'

            }
          ]
        )
      })


  }
  return (
    <KeyboardAwareScrollView style={{ backgroundColor: '#F6AE2D' }}>
      <View>

        <View style={[styles.shadowProp, { zIndex: 1, flexDirection: "row", backgroundColor: "white", paddingTop: Platform.OS === 'web' ? 0 : "10%" }]}>
          {Platform.OS === 'web' ? (
            <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => { navigation.navigate("RestaurantHome") }}>
              <Image
                style={{
                  justifyContent: 'flex-start',
                  width: 125,
                  height: 50,
                  resizeMode: "contain",
                }}
                source={require('../../assets/logo_name_simple.png')} />
            </TouchableOpacity>) : (
            <TouchableOpacity onPress={() => { navigation.navigate("Home") }}>
              <Image
                style={{
                  justifyContent: 'flex-start',
                  width: 125,
                  height: 70,
                  resizeMode: "contain",
                }}
                source={require('../../assets/logo_name_simple.png')} />
            </TouchableOpacity>

          )}
          <Text style={{ fontFamily: 'Primary', alignSelf: "center", fontSize: Platform.OS === 'web' ? 17 : 14, fontWeight: "600" }}>
            for restaurants
          </Text>
        </View>


        <View style={{ backgroundColor: '#F6AE2D' }}>
          <View style={{ margin: 20 }}>
            <Text style={{ color: 'white', fontFamily: 'Bold', fontSize: 30, maxWidth: 500, textAlign: 'center', alignSelf: "center" }}>
              Welcome back
            </Text>
            <Text style={{ color: 'white', fontFamily: 'Primary', fontSize: 16, maxWidth: "85%", textAlign: 'center', alignSelf: "center", margin: 10 }}>
              By continuing, you agree to Feiri's Terms of Service and acknowledge our Privacy Policy
            </Text>
          </View>

          <View style={[styles.shadowProp, { alignSelf: 'center', backgroundColor: 'white', padding: 20, margin: 10, borderRadius: 10 }]}>
            <View style={{ width: 300 }}>
              <Text style={{ marginRight: 'auto', fontFamily: 'Bold', marginVertical: 10 }}>Email</Text>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={text => setEmail(text)}
                style={[styles.input, { marginHorizontal: Platform.OS === 'web' ? '5%' : 0, backgroundColor: '#F3F3F3' }]}
              />
              <Text style={{ marginRight: 'auto', fontFamily: 'Bold', marginVertical: 10 }}>Password</Text>
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={text => setPassword(text)}
                style={[styles.input, { marginHorizontal: Platform.OS === 'web' ? '5%' : 0, backgroundColor: '#F3F3F3' }]}
                secureTextEntry
              />

            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleLogin}
                style={styles.button}
              >
                <Text style={[styles.buttonText, { paddingHorizontal: 30 }]}>Login</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={googleSignIn} style={[styles.button, { backgroundColor: '#4285F4' }]}>
                <Text style={[styles.buttonText, { paddingHorizontal: 30 }]}>Google</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row' }}>
                <Text>Restaurant?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                  <Text style={{ color: 'blue' }}> Sign up</Text>
                </TouchableOpacity>
              </View>



              {Platform.OS === 'web' ? (<Text style={{ color: 'red' }}>{error}</Text>) : (<></>)}
            </View>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}


const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: "#f6ae2d",
    shadowColor: '#171717',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: 5,
    margin: 5,
    padding: 5,
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#f6ae2d',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#f6ae2d',
    fontWeight: "700",
    fontSize: 16,
  },
})


export default Login