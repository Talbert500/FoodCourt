
import React from 'react';
import { Modal, Alert, TextInput, ImageBackground, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, Input } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { connect, useDispatch } from 'react-redux';
import { Link } from '@react-navigation/native';
import { useFonts } from '@use-expo/font';
import { uid } from 'uid';
import { setSearchedRestaurantImage, setSearchedRestaurant, setUserProps, setLoggined, setLoading } from '../../redux/action'
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { db, provider, auth, database } from '../../firebase-config'
import { setDoc, getDoc, doc } from 'firebase/firestore'
import { ref, set, update, onValue } from 'firebase/database'
import * as GoogleSignIn from 'expo-google-sign-in';
import { Icon } from 'react-native-elements'
import SyncLoader from "react-spinners/SyncLoader";
import { LogIn } from '../../redux/saga';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


function Login(props) {


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
  const [loginSession, setLoginSession] = useState(null)

  // useEffect(() => {
  //   // dispatch(setSearchedRestaurant(null, null, null, null, null, null))
  //   // dispatch(setNewRestaurant(null, null, null, null, null))

  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setloggedin(true)
  //       props.navigation.goBack();
  //     } else {
  //       setloggedin(false)
  //     }
  //   })

  // }, [])

  function googleSignIn() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.log(user)
        setUserPhoto(user.photoURL)
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
        props.navigation.goBack();
      }).catch((error) => {
        const errorCode = error.code;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromResult(error);
        console.log(credential, errorCode)
      })

  }

  useEffect(() => {
    dispatch(setLoading(false))
  }, [])

  const handleLogin = () => {
    LogIn(dispatch, email, password)

    if (!props.isLoading)
      props.navigation.navigate("Home");
  }

  return (
    <View style={{ flex: 1, flexDirection: windowWidth >= 450 ? 'row' : 'column', backgroundColor: 'white' }}>
      <View style={{ backgroundColor: 'white', flex: 1, justifyContent: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            style={{
              width: 200,
              height: 100,
              resizeMode: "contain",
              justifyContent: 'center'
            }}
            source={require('../../assets/logo.png')} />
        </View>
        <View style={{ marginHorizontal: windowWidth >= 450 ? 20 : 20, minWidth: 250, maxWidth: 450, justifyContent: "center", alignSelf: 'center', marginTop: windowWidth >= 450 ? 20 : -100 }}>
          <Text style={{ color: 'black', fontFamily: 'Bold', fontSize: 30 }}>
            Welcome back
          </Text>
          <Text style={{ color: 'black', fontFamily: 'Primary', fontSize: 16 }}>
            By continuing, you agree to FoodCourt's Terms of Service and acknowledge our Privacy Policy
          </Text>
        </View>

        <View style={{ backgroundColor: 'white', padding: 20, margin: 10, borderRadius: 10, maxWidth: 500, alignSelf: 'center', width: "100%" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ marginRight: 'auto', fontFamily: 'Bold', marginVertical: 10 }}>Email</Text>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={text => setEmail(text)}
              style={{ backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 4, marginTop: 5, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C3C3' }}
            />
            <Text style={{ marginRight: 'auto', fontFamily: 'Bold', marginVertical: 10 }}>Password</Text>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={text => setPassword(text)}
              style={{ backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 4, marginTop: 5, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C3C3' }}
              secureTextEntry
            />
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity
                onPress={handleLogin}
                style={[styles.button, { marginTop: 20 }]}
              >
                <Text style={[styles.buttonText, { paddingHorizontal: 30, textAlign: "center" }]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={googleSignIn} style={[styles.button, { backgroundColor: '#4285F4' }]}>
                <View style={{ flexDirection: 'row' }}>
                  <Icon type="font-awesome" name="google-plus-square" color="white" size={25} />
                  <Text style={[styles.buttonText, { paddingHorizontal: 30, textAlign: "center", fontWeight: '400', justifyContent: 'center' }]}>Continue with Google</Text>
                </View>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', justifyContent: "center",marginTop:20 }}>
                <Text style={{color:'grey'}}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => props.navigation.navigate("SignUp")}>
                  <Text style={{ color: 'black' }}> Sign up for free </Text>
                </TouchableOpacity>
              </View>
            </View>
            {Platform.OS === 'web' ? (<Text style={{ color: 'red' }}>{error}</Text>) : (<></>)}
          </View>
        </View>
        <SyncLoader color={"white"} loading={props.isLoading} size={25} />
      </View>
      {windowWidth >= 450 ?
        <View style={{ flex: 1 }}>

          <ImageBackground style={{ flex: 1, alignItems: 'center' }} imageStyle={{}} resizeMode="cover" source={require('../../assets/latin-restaurant-onscreen.png')}>

          </ImageBackground>
        </View> :
        <></>
      }
    </View>
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

const mapStateToProps = (state) => {
  if (state === undefined)
    return {
      isLoading: true
    }

  return {
    isLoading: state.isLoading
  }
}

const LoginContainer = connect(mapStateToProps, null)(Login)

export default LoginContainer