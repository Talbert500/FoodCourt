
import React from 'react';
import { ImageBackground, Modal, Alert, TextInput, RefreshControl, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, Image, Touchable } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, Input } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,onAuthStateChanged } from 'firebase/auth';
import { setNewRestaurant } from '../../redux/action'
import { auth } from '../../firebase-config'
import Icon from 'react-native-vector-icons/Feather'
import { useDispatch } from 'react-redux';
import { Link } from '@react-navigation/native';
import { useFonts } from '@use-expo/font';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;



function SignUp({ navigation }) {

  let [fontsLoaded] = useFonts({
    'Primary': require('../../assets/fonts/proxima_nova_reg.ttf'),
    'Bold': require('../../assets/fonts/proxima_nova_bold.ttf')
  });


  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, seterror] = useState('');
  const [loggedin,setloggedin] = useState('');

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
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userCredential_id = userCredential.user.uid;
        const emails = userCredential.user.email;
        console.log(userCredential_id)
        dispatch(setNewRestaurant(userCredential_id, emails, first, last, name))
        
        navigation.navigate("AddRestaurant")
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        seterror(errorCode)
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
      <View style={{ flex: 1 }}>

        <View style={[styles.shadowProp, { zIndex: 1, flexDirection: "row", backgroundColor: "white", paddingTop: Platform.OS === 'web' ? 0 : "10%" }]}>
          {Platform.OS === 'web' ? (
            <TouchableOpacity onPress={() => { navigation.navigate("RestaurantHome") }}>
              <Image
                style={{
                  justifyContent: 'flex-start',
                  width: 125,
                  height: 50,
                  resizeMode: "contain",
                }}
                source={require('../../assets/logo_name_simple.png')} />
            </TouchableOpacity>) : (
            <TouchableOpacity  onPress={() => { navigation.navigate("Home") }}>
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


          <Text style={{ fontFamily: 'Primary', alignSelf: "center", fontSize:  Platform.OS === 'web' ? 17 : 14, fontWeight: "600" }}>
            for restaurants
          </Text>
        </View>
        {/* END OF HEADER*/}

        <View style={{ backgroundColor: '#F6AE2D' }}>
          <View style={{ margin: 20 }}>
            <Text style={{ color: 'white', fontFamily: 'Bold', fontSize: 30, maxWidth: 500, textAlign: 'center', alignSelf: "center" }}>
              Create an account to start your interactive menu.
            </Text>
          </View>

          <View style={[styles.shadowProp, {alignSelf: 'center', backgroundColor: 'white', padding: 20, margin:"5%", borderRadius: 10 }]}>
            <View style={{ flexDirection: 'row', width: '100%' , flexWrap:'wrap'}}>
              <View style={{ marginHorizontal: 5, width: "45%" }} >
                <Text style={{ marginRight: 'auto', fontFamily: 'Bold' }}>First Name</Text>
                <TextInput
                  placeholder="John"
                  value={first}
                  onChangeText={text => setFirst(text)}
                  style={[styles.input, { backgroundColor: '#F3F3F3' }]}
                />
              </View>
              <View style={{ marginHorizontal: 5, width: "45%", marginLeft: "auto" }} >
                <Text style={{ marginRight: 'auto', fontFamily: 'Bold' }}>Last Name</Text>
                <TextInput
                  placeholder="Doe"
                  value={last}
                  onChangeText={text => setLast(text)}
                  style={[styles.input, { backgroundColor: '#F3F3F3' }]}
                />
              </View>
            </View>
            <View style={{ margin: 5 }} >
              <Text style={{ marginRight: 'auto', fontFamily: 'Bold' }}>Email</Text>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={text => setEmail(text)}
                style={[styles.input, { backgroundColor: '#F3F3F3' }]}
              />
            </View>
            <View style={{ margin: 5 }} >
              <Text style={{ marginRight: 'auto', fontFamily: 'Bold' }}>Password</Text>
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={text => setPassword(text)}
                style={[styles.input, { backgroundColor: '#F3F3F3' }]}
                secureTextEntry
              />
            </View>
            <View style={{ margin: 5 }} >
              <Text style={{ marginRight: 'auto', fontFamily: 'Bold' }}>Restaurant Name</Text>
              <TextInput
                placeholder="Compadres Tacos"
                value={name}
                onChangeText={text => setName(text)}
                style={[styles.input, { backgroundColor: '#F3F3F3' }]}
              />
            </View>
            <Text style={{ maxWidth: 400, fontSize: 10, margin: 5 }}>
              By continuing, you agree to Feiri’s Terms of Service and acknowledge
              our Privacy Policy. We may send you marketing emails about Feiri's products,
              services and local events. Unsubscribe at any time.
            </Text>

            <View style={styles.buttonContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Text>Already have a Feiri?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={{ color: 'blue' }}> Login</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleSignUp}
                style={[styles.button, styles.buttonOutline, { paddingHorizontal: 50 }]}
              >
                <Text style={styles.buttonOutlineText}>Continue</Text>

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
    borderRadius: 10,
    marginTop: 5,

  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: "#f6ae2d",
    shadowColor: '#171717',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: 20,
    margin: 10,
    padding: 15,
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
    fontFamily: 'Primary'
  },
  buttonOutlineText: {
    color: '#f6ae2d',
    fontWeight:"700",
    fontSize: 16,
    fontFamily: 'Primary'
  },
})


export default SignUp