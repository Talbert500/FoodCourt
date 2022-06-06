
import React from 'react';
import { ImageBackground, Modal, Alert, TextInput, RefreshControl, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, Image, Touchable } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, Input } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,onAuthStateChanged } from 'firebase/auth';
import { setProfileData, setLoading } from '../../redux/action'
import { auth } from '../../firebase-config'
import Icon from 'react-native-vector-icons/Feather'
import { useDispatch } from 'react-redux';
import { Link } from '@react-navigation/native';
import { useFonts } from '@use-expo/font';
import { checkEmail } from '../../redux/saga';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


function SignUp({ navigation }) {

  let [fontsLoaded] = useFonts({
    'Primary': require('../../assets/fonts/proxima_nova_reg.ttf'),
    'Bold': require('../../assets/fonts/proxima_nova_bold.ttf')
  });


  const dispatch = useDispatch();
  const [name, setName] = useState();
  const [first, setFirst] = useState();
  const [last, setLast] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, seterror] = useState('');
  const [loggedin, setloggedin] = useState('');

  const [firstError, setFirstError] = useState(false)
  const [lastError, setLastError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [nameError, setNameError] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
          setloggedin(true)
          navigation.navigate("Home")
      } else {
          setloggedin(false)
      }
  })

  }, [])

  const handleSignUp = async () => {
    if (!first)
      setFirstError(true)

    if (!last)
      setLastError(true)

    if (!email)
      setEmailError(true)

    if (!password)
      setPasswordError(true)

    if (!name)
      setNameError(true)

    if(first && email && password && name) {
      checkEmail(dispatch, email)
      .then((data) => {

        dispatch(setLoading(false))

        if(!data.data) {
          dispatch(setProfileData({ 
            firstName: first,
            lastName: "",
            adminEmail: email,
            adminPassword: password,
            searchedRestaurant: name
          }))
          
          navigation.navigate("AddRestaurant")
        }

        if(data.data) {
          alert("email is already registered")
        }
      })
    }
  }

  useEffect(() => {
    if (first)
      setFirstError(false)

    if (first === "")
      setFirstError(true)

  }, [first])

  useEffect(() => {
    if (last)
      setLastError(false)

    if (last === "")
      setLastError(true)

  }, [last])

  useEffect(() => {
    if (email)
      setEmailError(false)

    if (email === "")
      setEmailError(true)

  }, [email])

  useEffect(() => {
    if (password)
      setPasswordError(false)

    if (password === "")
      setPasswordError(true)

  }, [password])

  useEffect(() => {
    if (name)
      setNameError(false)

    if (name === "")
      setNameError(true)

  }, [name])


  return (
    <KeyboardAwareScrollView style={{ backgroundColor: '#F5F5F5' }}>
      <View style={{ flex: 1 }}>
        <View>
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
                source={require('../../assets/onboarding_steps/step1.png')} />
              <Text style={{ fontFamily: 'Bold', fontSize: 25, marginTop: 20 }}>
                Welcome! First things first...
              </Text>
              <Text style={{ fontFamily: 'Primary', fontSize: 16, color: '#7E7E7E', textAlign: 'center' }}>
                Create a restaurant account to start your virtual menu.
              </Text>
            </View>
            <View style={{ marginHorizontal: windowWidth >= 450 ? 5 : windowWidth / 11, marginTop: 20 }} >
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ marginRight: 'auto', fontFamily: 'Bold', marginBottom: "7px" }}>Full Name<Text style={{ color: "red" }}>*</Text></Text>
                {firstError && <Text style={{ color: "red", marginTop: "10px" }}>this field can't be empty</Text>}
              </View>
              <TextInput
                placeholder="John Doe"
                value={first}
                onChangeText={(value) => setFirst(value)}
                style={[styles.input, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C3C3' }]}
              />
            </View>
            <View style={{ margin: 5,marginHorizontal: windowWidth >= 450 ? 5 : windowWidth / 11}} >
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ marginRight: 'auto', fontFamily: 'Bold', marginVertical: "7px" }}>Email<Text style={{ color: "red" }}>*</Text></Text>
                {emailError && <Text style={{ color: "red", marginTop: "10px" }}>this field can't be empty</Text>}
              </View>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={text => setEmail(text)}
                style={[styles.input, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C3C3' }]}
              />
            </View>
            <View style={{ margin: 5,marginHorizontal: windowWidth >= 450 ? 5 : windowWidth / 11, }} >
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ marginRight: 'auto', fontFamily: 'Bold', marginVertical: "7px" }}>Password<Text style={{ color: "red" }}>*</Text></Text>
                {passwordError && <Text style={{ color: "red", marginTop: "10px" }}>this field can't be empty</Text>}
              </View>
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={text => setPassword(text)}
                style={[styles.input, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C3C3' }]}
                secureTextEntry
              />
            </View>
            <View style={{ margin: 5,marginHorizontal: windowWidth >= 450 ? 5 : windowWidth / 11, }} >
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ marginRight: 'auto', fontFamily: 'Bold', marginVertical: "7px" }}>Restaurant Name<Text style={{ color: "red" }}>*</Text></Text>
                {nameError && <Text style={{ color: "red", marginTop: "10px" }}>this field can't be empty</Text>}
              </View>
              <TextInput
                placeholder="Compadres Tacos"
                value={name}
                onChangeText={text => setName(text)}
                style={[styles.input, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C3C3C3' }]}
              />
            </View>
            <Text style={{ maxWidth: 450, fontSize: 10, margin: 5 ,marginHorizontal: windowWidth >= 450 ? 5 : windowWidth / 11,}}>
              By continuing, you agree to FoodCourt's Terms of Service and acknowledge
              our Privacy Policy. We may send you marketing emails about FoodCourt's products,
              services and local events. Unsubscribe at any time.
            </Text>

            <View style={{ marginTop: 5,marginHorizontal: windowWidth >= 450 ? 5 : windowWidth / 11,}}>
              <View style={{ flexDirection: 'row' }}>
                <Text>Already have a FoodCourt?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={{ color: 'blue' }}>Login</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleSignUp}
                style={[styles.button]}
              >
                <Text style={{ color: "white", fontFamily: 'Primary', fontWeight: 'bold', alignSelf: 'center' }}>Create Menu</Text>
              </TouchableOpacity>
              {Platform.OS === 'web' ? (<Text style={{ color: 'red' }}>{error}</Text>) : (<></>)}
            </View>
          </View>

        </View>
      </View>
    </KeyboardAwareScrollView >
  );
}


const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  signUpForm: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    marginHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
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
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 4,
    marginTop: 5,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: "auto"
  },
  button: {
    flex: 1,
    backgroundColor: "#f6ae2d",
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
  },
  buttonOutline: {
    backgroundColor: '#f6ae2d',
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: "700",
    fontSize: 16,
    fontFamily: 'Primary'
  },
  buttonOutlineText: {
    color: '#f6ae2d',
    fontWeight: "700",
    fontSize: 16,
    fontFamily: 'Primary'
  },
})


export default SignUp