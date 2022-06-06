import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'react-native-elements'
import { Dimensions, FlatList, View, Image, Text, Platform } from 'react-native';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Footer from '../../Components/Footer';
import Header from './../../Screens/Restaurants/MenuEdit/Header';
import RestaurantsHeader from './../../Screens/Restaurants/MenuEdit/RestaurantsHeader';

import { styles } from '../../styles'


const Notifications = ({ route, navigation }) => {


    const [restaurantColor, setRestaurantColor] = useState([]);

    const windowWidth = Dimensions.get("window").width;

    const [ratings, setRatings] = useState([])

    return (
        <View>
            <RestaurantsHeader/>
            <Header activeTab={"Notifications"} route={route} navigation={navigation}/>
            <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }}>
                <View style={{ marginLeft: "130px", marginTop: "35px" }}>
                    <Text style={styles.subHeaderText}>Notifications</Text>
                    <Text style={{ fontFamily: 'Bold', marginVertical: 5, fontSize: "16px", marginTop: "20px" }}>No notifications yet...</Text>
                </View>
                {/* <View style={{ flexDirection: (windowWidth >= 500) ? 'row' : 'column', flexWrap: 'wrap-reverses', margin: 5 }}>
                    <View style={[styles.shadowProp, { backgroundColor: 'white', marginHorizontal: 10, borderRadius: 13, overflow: 'hidden', flex: 3 }]}>
                        <View style={{ maxWidth: 700, alignSelf: Platform.OS === 'web' ? 'center' : '', width: '100%', padding: 10 }}>
                            <FlatList
                                data={ratings}
                                keyExtractor={(item, index) => index}
                                renderItem={({ item, index }) =>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', alignItems: "center", flex: 1 }}>
                                            <Image
                                                style={{ height: 50, width: 50, borderRadius: 40, marginHorizontal: 10 }}
                                                source={{ uri: item.userPhoto }}
                                            />
                                            <View>
                                                <Text style={{ fontFamily: 'Bold', marginTop: 2 }}>{item.raters_name},{<Text style={{ fontFamily: 'Primary' }}> rated your </Text>} {<Text style={{ fontFamily: 'Bold' }}>{item.food_name} : </Text>} </Text>
                                                <Text style={{ fontFamily: 'Primary', marginBottom: 2 }}>{item.rating}</Text>
                                                <Text style={{ fontFamily: 'Primary', marginVertical: 5 }}>{item.rating_date}</Text>
                                            </View>
                                            <View style={{ flex: 1, justifyContent:'flex-end',}}>
                                                <Button title="Message" buttonStyle={[styles.button, { backgroundColor: restaurantColor, maxWidth: 100 , alignSelf:'flex-end',alignContent:"flex-end"}]} titleStyle={styles.buttonTitle} />
                                            </View>
                                        </View>

                                        <Divider style={{ margin: 5 }} />
                                    </View>
                                }
                            />
                        </View>
                    </View>
                </View> */}
                <View style={{ marginTop: "20%" }}>
                    <Footer />
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default Notifications