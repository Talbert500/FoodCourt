import React from 'react';
import { ActivityIndicator, ImageBackground, KeyboardAvoidingView, Dimensions, FlatList, ScrollView, View, TouchableOpacity, Image, StyleSheet, Text, Platform, Linking, Keyboard, BackHandler } from 'react-native';
import testImage from './../../../assets/guestphoto.jpg'
import reviewOutline from './../../../assets/review_outline.png'

const Header = () => {

    const rating = [0,1,2,3,4]

    const riview = rating.map(r => (
        <Image style={{ 
                height: "20px", 
                width: "20px",
                marginRight: "5px",
                cursor: "pointer"
             }} 
             source={reviewOutline}
        />
    ))

    return(
        <View style={{
            paddingTop: "35px", 
            paddingBottom: "47px", 
            paddingLeft: "136px",
            borderBottom: "1px solid #D3D3D3"
        }}>
            <View style={{ 
                    display: "flex", 
                    flexDirection: "row"
             }}>
                <Image
                    style={{
                        justifyContent: 'flex-start',
                        width: 200,
                        height: 200,
                        borderRadius: 15,
                        marginRight: "32.5px",
                        resizeMode: "contain",
                    }}
                    source={testImage} 
                />
                <View>
                    <Text style={{ 
                        fontSize: "40px",
                        fontWeight: "bold"
                    }}>
                        La Korita Taqueria
                    </Text>

                    <View style={{ 
                            display: "flex", 
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                        {riview}
                        <Text style={{ fontSize: "11px" }}>1337 reviews</Text>
                    </View>

                    <Text style={{ marginTop: "19px" }}>Authentic Mexican Foods</Text>

                    <View style={{ 
                            display: "flex", 
                            flexDirection: "row",
                            marginTop: "27px" }}>
                        <View style={{
                                paddingTop: "11.8px",
                                paddingBottom: "11.8px",
                                paddingLeft: "30.7px",
                                paddingRight: "30.7px",
                                borderRadius: "30px",
                                backgroundColor: "#F6AE2D",
                                width: "188.16px",
                                alignItems: "center",
                                marginRight: "28.8px",
                                cursor: "pointer"
                        }}>
                            <Text>Viewing as</Text>
                        </View>
                        <View style={{
                                paddingTop: "11.8px",
                                paddingBottom: "11.8px",
                                paddingLeft: "30.7px",
                                paddingRight: "30.7px",
                                borderRadius: "30px",
                                border: "1px solid black",
                                width: "188.16px",
                                alignItems: "center",
                                cursor: "pointer"
                        }}>
                            <Text>Share</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "47px",
                width: "645px",
                justifyContent: "space-between"
            }}>
                <Text style={{ fontSize: "18px", cursor: "pointer" }}>Home</Text>
                <Text style={{ fontSize: "18px", cursor: "pointer" }}>Snapshot</Text>
                <Text style={{ fontSize: "18px", cursor: "pointer" }}>QRMenu</Text>
                <Text style={{ fontSize: "18px", cursor: "pointer" }}>Notifications</Text>
                <Text style={{ fontSize: "18px", cursor: "pointer" }}>Settings</Text>
            </View>
        </View>
    )
}

export default Header