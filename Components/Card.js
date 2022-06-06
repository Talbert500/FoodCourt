
import { Image, StyleSheet, TextInput, Text, View, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styles } from '../styles'
import { Icon } from 'react-native-elements'
import { useFonts } from '@use-expo/font';
function Card(props) {
    let [fontsLoaded] = useFonts({
        'Primary': require('../assets/fonts/proxima_nova_reg.ttf'),
        'Bold': require('../assets/fonts/proxima_nova_bold.ttf'),
        'Black': require('../assets/fonts/proxima_nova_black.otf')
    });
    const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
    // Filled Star. You can also give the path from local
    //source={require("../assets/guestphoto.jpg")}
    const starImageFilled = require('../assets/review_filled.png');
    // Empty Star. You can also give the path from local
    const starImageCorner = require('../assets/review_outline.png');
    // const [selectedRestaurants, setSelectedRestaurants] = useState("")
    const [defaultRating, setDefaultRating] = useState(props.overall);

    return (
        <TouchableOpacity onPress={props.onPress} style={{ margin: 5, backgroundColor: 'white', flexDirection: 'row', width: "100%", height: "150px", borderBottom: "1px solid #A7A7A7" }}>
            <View style={{marginRight:20}}>
                <Image style={{width:130,height:130,resizeMode:'cover'}}
                    source={{uri: props.imageUrl}}
                    />
            </View>
            <View style={{ flex: 1, maxWidth: "100%", alignContent: 'flex-start' }}>
                <Text>
                    {props.category} | {props.restaurant}
                </Text>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Text style={[styles.subHeaderText, { fontSize: 27,fontFamily:'Bold' }]} >
                        {props.food}
                    </Text>
                    <Text style={{ fontWeight: "bold", marginLeft: "30px" }}>
                        {props.price}
                    </Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}> 
                    <View style={{ justifyContent: 'left', flexDirection: 'row' }}>
                        {maxRating.map((item, key) => {

                            return (
                                <View
                                    activeOpacity={0.7}
                                    key={item}>
                                    <Image
                                        style={{
                                            width: 15, height: 15, resizeMode: 'contain', margin: 1
                                        }}
                                        source={
                                            item <= defaultRating
                                                ? starImageFilled
                                                : starImageCorner
                                        }
                                    />
                                </View>
                            );
                        })}
                    </View>
                    <Text style={{fontFamily:'Primary'}}> {props.ratingCount ? props.ratingCount : "0"} Reviews</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={[styles.subHeaderText, {marginTop:5, fontSize: 14, maxWidth: 400,fontWeight:'400',fontFamily:'Primary' }]} numberOfLines={2}>{props.description}</Text>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginRight: "5px"}}>
                        <Button buttonStyle={{ backgroundColor: '#F6AE2D', borderRadius: "100px", width: "120px", height: "40px", marginRight: "15px" }} buttonTitle={{ fontFamily: 'Bold', fontSize: "20" }} title="Edit" />
                        <Button onPress={() => deleteFood(item.food_id)} buttonStyle={{ backgroundColor: '#F6482D', borderRadius: "100px", width: "40px", height: "40px" }} buttonTitle={{ fontFamily: 'Bold', fontSize: "20" }} title="X" />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )

}



export default Card