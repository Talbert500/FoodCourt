
import React from 'react';
import { Modal, Alert, TextInput, RefreshControl, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, Input } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setNewRestaurant } from '../../redux/action'
import { auth } from '../../firebase-config'
import Icon from 'react-native-vector-icons/Feather'
import { useDispatch } from 'react-redux';
import { Link } from '@react-navigation/native';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


function Welcome({ navigation }) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, seterror] = useState('')

  useEffect(() => {

  }, [])

  const handleSignUp = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userCredential_id = userCredential.user.uid;
        const emails = userCredential.user.email;
        console.log(userCredential_id)
        dispatch(setNewRestaurant(userCredential_id, emails))

        navigation.navigate("AddRestaurant")
      }).catch((error) => {
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

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userCredential_id = userCredential.user.uid;
        const emails = userCredential.user.email;
        console.log(userCredential_id)
        dispatch(setNewRestaurant(userCredential_id, emails))
        navigation.navigate("Restaurant")
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
    <KeyboardAwareScrollView style={{backgroundColor:'white'}}>
      {Platform.OS === 'web' ? 
      <TouchableOpacity
        onPress={()=>{navigation.goBack()}}
        style={[styles.button, { marginRight: "70%" }]}>

        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity> :
        <Icon style={{ paddingTop: 30, margin: 10 }}
          color="black" size={35}
          name="arrow-left"
          onPress={() => { navigation.navigate("Home")}} />}
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image
          style={[styles.shadowProp, {
            alignContent: 'flex-start',
            width: 200,
            height: 200,
            marginTop: Platform.OS === 'web' ? "0%" : "30%",
          }]}
          source={require('../../assets/icon.png')}
        />

        {/* <Text style={{ fontSize: 32, fontWeight: "bold", marginTop: 10, }}>Rate My Food</Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>Menus</Text> */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            style={[styles.input, { marginHorizontal: Platform.OS === 'web' ? '15%' : 0, backgroundColor:'#F3F3F3' }]}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            style={[styles.input, { marginHorizontal: Platform.OS === 'web' ? '15%' : 0,backgroundColor:'#F3F3F3' }]}
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
          <TouchableOpacity
            onPress={handleSignUp}
            style={[styles.button, styles.buttonOutline, { paddingHorizontal: 50 }]}
          >
            <Text style={styles.buttonOutlineText}>Register</Text>
          </TouchableOpacity>
          {Platform.OS === 'web' ? (<Text style={{ color: 'red' }}>{error}</Text>) : (<></>)}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}


const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: 1, height: 1},
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
    marginTop: 40,
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
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#f6ae2d',
    fontWeight: '700',
    fontSize: 16,
  },
})


export default Welcome