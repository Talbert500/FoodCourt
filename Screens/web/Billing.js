import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Footer from '../../Components/Footer';
import Header from './../../Screens/Restaurants/MenuEdit/Header';
import RestaurantsHeader from './../../Screens/Restaurants/MenuEdit/RestaurantsHeader';

import { styles } from '../../styles';


const Billing = ({ route, navigation }) => {

    return (
        <View>
            <RestaurantsHeader/>
            <Header activeTab={"Billing"} route={route} navigation={navigation}/>
            <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ backgroundColor: "white", paddingTop: "20px" }}>
                <View style={{ display: "flex", flexDirection: 'row', margin: 5 }}>
                    <View style={{ alignSelf: Platform.OS === 'web' ? 'center' : '', width: '100%', padding: 10 }}>
                        <View style={{ flexDirection: 'row', marginLeft: "110px" }}>
                            <View>
                                <Text style={[styles.subHeaderText, { marginLeft: "10px" }]}>Snapshot</Text>
                                <View style={[styles.shadowProp, { backgroundColor: 'white', minWidth: 350, maxWidth: 350, margin: 10, padding: 10, borderRadius: 13, height: "auto" }]}>
                                    <View style={{ marginTop: 10, marginLeft: 5 }}>
                                        <Text style={{ fontFamily: 'Bold', marginVertical: 5, fontSize: "16px" }}>No activity...</Text>
                                    </View>
                                </View>
                                <View style={[styles.shadowProp, { backgroundColor: 'white', minWidth: 350, maxWidth: 350, margin: 10, padding: 10, borderRadius: 13, height: "auto" }]}>
                                    <View style={{ marginTop: 10, marginLeft: 5 }}>
                                        <Text style={{ fontFamily: 'Bold', marginVertical: 5, fontSize: "16px" }}>Statistics</Text>
                                        <Text style={{ fontFamily: 'Bold', marginVertical: 5, fontSize: "16px" }}>0 Total Likes</Text>
                                        <Text style={{ fontFamily: 'Bold', marginVertical: 5, fontSize: "16px" }}>0 Total Scans</Text>
                                        <Text style={{ fontFamily: 'Bold', marginVertical: 5, fontSize: "16px" }}>0 Total Reviews</Text>
                                    </View>
                                </View>
                                <View style={[styles.shadowProp, { backgroundColor: 'white', minWidth: 350, maxWidth: 350, margin: 10, padding: "25px", borderRadius: 13, height: "auto" }]}>
                                    <View style={{ marginTop: 10, marginLeft: 5 }}>
                                        <Text style={{ fontFamily: 'Bold', marginVertical: 5, fontSize: "16px" }}>Top Ranking</Text>
                                        <Text style={{ fontFamily: 'Bold', marginVertical: 5, fontSize: "16px" }}>No ranking yet...</Text>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <View style={[styles.shadowProp, { backgroundColor: 'white', minWidth: 350, maxWidth: 350, margin: 10, padding: "36px", borderRadius: 13 }]}>
                                    <View style={{ justifyContent: "center", marginLeft: 5 }}>
                                        <Text style={styles.headerText}>Premium</Text>
                                        <Text style={{ fontFamily: 'Bold', marginVertical: 5, fontSize: "16px" }}>The interactive menu and foodcourt dashboard</Text>
                                    </View>
                                    <View>
                                        <View style={{ marginTop: 10, marginLeft: 5 }}>
                                            <Text style={{ fontFamily: 'Bold', marginVertical: 5, fontSize: "16px" }}>Customizable QRMenus</Text>
                                            <Text style={{ fontFamily: 'Bold', marginVertical: 5, fontSize: "16px" }}>Integrations</Text>
                                            <Text style={{ fontFamily: 'Bold', marginVertical: 5, fontSize: "16px" }}>Data Metrics on Scans</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.button, { maxWidth: 200, marginRight: "37px" }]} >
                                            <Text style={[styles.buttonTitle, { paddingHorizontal: 5, textAlign: 'center', color: "white" }]}>Switch to Premium</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: "20%" }}>
                    <Footer />
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default Billing