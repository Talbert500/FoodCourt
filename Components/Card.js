
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
        <TouchableOpacity onPress={props.onPress} style={[styles.shadowProp, { justifyContent: 'space-between', margin: 5, padding: 10, backgroundColor: 'white', flexDirection: 'row', width: "70vw", height: "150px" }]}>
            <View style={{marginRight:20}}>
                <Image style={{width:130,height:130,resizeMode:'cover'}}
                    source={{uri: props.imageUrl}}
                    />
            </View>
            <View style={{ flex: 1, maxWidth: "80%", alignContent: 'flex-start' }}>
                <Text style={[styles.subHeaderText, { fontSize: 27,fontFamily:'Bold' }]} >
                    {props.food}
                </Text>
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
                    <Text style={{fontFamily:'Primary'}}> {props.ratingCount} Reviews</Text>
                </View>
                <Text>${props.price} | {props.category}</Text>

                <Text style={[styles.subHeaderText, {marginTop:5, fontSize: 14, maxWidth: 400,fontWeight:'400',fontFamily:'Primary' }]} numberOfLines={2}>{props.description}</Text>
                
                <Text style={[styles.subHeaderText, {fontFamily:'Primary', fontSize: 13, alignSelf: 'flex-end' }]}>
                    click for more
                </Text>
            </View>

            <View style={{ marginLeft: "auto" }}>
                <View style={[styles.shadowProp,{backgroundColor:'white',borderRadius:50,padding:7}]}>
                {/* <TouchableOpacity style={{alignSelf:'center'}} onPress={() => console.log(`upvoted ${props.food} by ${props.restaurant}`)}> */}
                <Icon style={{ alignSelf: 'center',justifyContent:'center' }} size={25} type="ant-design" color={props.upvoteColor} name="hearto" />
                {/* </TouchableOpacity> */}
                </View>
                <Text style={[styles.subHeaderText, { fontSize: 10, alignSelf: 'center',marginTop:5 }]}>
                    {props.upvotes}
                </Text>
            </View>

            <Button onPress={() => deleteFood(item.food_id)} buttonStyle={{ backgroundColor: '#8A3333' }} buttonTitle={{ fontFamily: 'Bold', fontSize: "20" }} title="Delete" />
            <Button onPress={() => props.navigation.navigate("FoodEdit", { restId: props.restaurantId, foodId: props.item.food_id, restName: props.searchedRestaurant })} buttonStyle={{ backgroundColor: 'orange' }} buttonTitle={{ fontFamily: 'Bold', fontSize: "20" }} title="Edit" />

        </TouchableOpacity>
    )

}



export default Card