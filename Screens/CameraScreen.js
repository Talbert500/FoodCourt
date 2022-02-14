import React, { useState, useEffect,useRef } from 'react';
import { Image,StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { useSelector, useDispatch } from 'react-redux';
import { setFoodItemImage } from '../redux/action'
import Icon from 'react-native-vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker';


export default function CameraScreen({navigation}) {
  const dispatch = useDispatch();
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const cam = useRef();
const mediaLibrary = async()=>{
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1
})

if (!result.cancelled) {
  console.log("picture source from media mediaLibrary", result.uri);
  dispatch(setFoodItemImage(result.uri))
  navigation.goBack()

}
}
  const takePicture = async()=> {
      if(cam.current){
    const option = {quality: 0.3, base64: true, skipProcessing: true};
    const photo = await cam.current.takePictureAsync(option);
    const source = photo.uri;   
    if (source) {
        console.log("picture source", source);
        dispatch(setFoodItemImage(source))
        navigation.goBack()
    }

  }
}

  useEffect(() => {
    
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
              <Icon
              style= {{marginTop:50, margin:10}}
                color="white" size={35} name="arrow-left" onPress={() => {navigation.goBack()}}
              />
      <Camera ref ={cam} style={styles.camera} type={type}>
        <View style ={{ flex: 1, alignItems: 'center' }}>

        </View>
        <View style={styles.buttonContainer}>
        <TouchableOpacity
            style={styles.button}
            onPress={mediaLibrary}>
            <Text style={styles.text}> Media </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={takePicture}>
            <Text style={styles.text}> Take Photo </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
          <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
        
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'black'
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'black',
    flexDirection: 'row',
    maxHeight:"20%",
    borderTopEndRadius:10,
    borderTopStartRadius:10
  },
  button: {
    flex:1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginVertical:50
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});