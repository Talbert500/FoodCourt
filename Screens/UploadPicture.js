
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, Button, Image, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from 'firebase/app';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase-config';
import { Camera } from 'expo-camera';
import {useSelector} from 'react-redux'
import { Link } from '@react-navigation/native';


function UploadPicture() {
    const [hasPermissions, setHasPermissions] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const tookPicture = useSelector(state => state.foodImage)
    const [image, setImage] = useState(tookPicture)
    const [uploading, setUploading] = useState(false);


    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry we need camera roll permissions to make thi work!')
                }
            }
        })
            (async () => {
                const { status } = await Camera.requestCameraPermissionsAsync();
                setHasPermissions(status === 'granted');
            })

    }, [])

    if (hasPermissions === false) {
        return <Text>No access to camera</Text>
    }
    if (hasPermissions === true) {
        return <View />
    }

    const metadata = {
        contentType: 'brant'
    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })

        if (!result.cancelled) {
            const getImage = ref(storage, 'image'); //how the image will be addressed inside the storage
            console.log(result)
            //convert image to array of bytes
            const img = await fetch(result.uri);
            const bytes = await img.blob();

            await uploadBytes(getImage, bytes, metadata);

        }
    };

    const getImage = async () => {
        const imageRef = ref(storage, 'image/');
        await getDownloadURL(imageRef).then((url) => {
            console.log(url)
            setImage(url)
        })
    }

    return (
        <View style ={styles.container}>
            <Camera style={styles.camera} type={type}>
                <View style={styles.buttonContainer}>
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

            <Button title="Choose Image" onPress={pickImage} />
            <Button title="Get Image" onPress={getImage} />
            <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
            <Text>Test</Text> 

        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
});

export default UploadPicture;