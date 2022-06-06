import { StyleSheet, TextInput, Text, View, SafeAreaView, FlatList, TouchableOpacity, Button } from 'react-native';
import { styles } from '../styles'
import Icon from 'react-native-vector-icons/Feather'
import { useFonts } from '@use-expo/font';

function Footer() {

    let [fontsLoaded] = useFonts({
        'Primary': require('../assets/fonts/proxima_nova_reg.ttf'),
        'Bold': require('../assets/fonts/proxima_nova_bold.ttf'),
        'Black': require('../assets/fonts/proxima_nova_black.otf')
    });

    return (
        <View style={{ backgroundColor: "#f6ae2d", maxHeight: 300, flex: 1, height: 200, padding: 20,justifyContent:'center' }}>
            <View style={{maxWidth:800,width:800, alignSelf:'center', alignItems:"center"}}>
                <Text style={[styles.footerText, { fontWeight: "700", marginVertical: 20, marginRight:'auto', fontFamily:"Primary"}]}>
                    2022 FoodCourt All rights reserved.
                </Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ margin: 10, marginHorizontal:10  }}>
                        <Text style={[styles.footerText, { fontWeight: "700", marginVertical: 5 , fontFamily:"Primary"}]}>Get to know us</Text>
                        <Text style={styles.footerText}>About FoodCourt</Text>
                        <Text style={styles.footerText}>Investor relations</Text>
                    </View>

                    <View style={{ margin: 10,marginHorizontal:10 }}>
                        <Text style={[styles.footerText, { fontWeight: "700", marginVertical: 5, fontFamily:"Primary" }]}>Connect with us</Text>
                        <Text style={styles.footerText}>Instagram</Text>
                        <Text style={styles.footerText}>Youtube</Text>
                        <Text style={styles.footerText}>Facebook</Text>
                        <Text style={styles.footerText}>Tiktok</Text>
                    </View>
                    <View style={{ margin: 10,marginHorizontal:10}}>
                        <Text style={[styles.footerText, { fontWeight: "700", marginVertical: 5, fontFamily:"Primary" }]}>Partner with us</Text>
                        <Text style={styles.footerText}>Get Sponsored</Text>
                        <Text style={styles.footerText}>Verified Food Critics</Text>
                        <Text style={styles.footerText}>Local Food Bank</Text>
                    </View>
                </View>
                <View style={{ margin: 10, flexDirection: 'row' }}>
                    <Text style={[styles.footerText, { textDecorationLine: 'underline' }]}> Terms of Use </Text>
                    <Text style={styles.footerText}> Privacy Policy </Text>
                    <Text style={styles.footerText}> Do Not Sell My Infomation </Text>
                </View>
            </View>
        </View>
    )
}

export default Footer