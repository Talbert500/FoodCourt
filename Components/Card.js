
import { StyleSheet, TextInput, Text, View, SafeAreaView, FlatList, TouchableOpacity, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styles } from '../styles'
import Icon from 'react-native-vector-icons/AntDesign'


function Card(props) {

    return (
        <TouchableOpacity onPress={props.onPress} style={[styles.cards, { justifyContent: 'space-between', margin: 5, padding: 5, backgroundColor: 'white', flexDirection: 'row', borderRadius: 20 }]}>
            <View style={{ maxWidth: 45, justifyContent: 'flex-start' }}>
                {/* <Text style={[styles.subHeaderText,{margin:5,marginHorizontal:5,fontSize:25}]}>
                    {props.ranking}
                </Text> */}
            </View>
            <View style={{ flex: 1, maxWidth: "70%", alignContent: 'flex-start' }}>
                <Text style={[styles.subHeaderText, { fontSize: 35, fontWeight: '100' }]} >
                    {props.food}
                </Text>
                <Text style={[styles.subHeaderText, { fontSize: 14 ,maxWidth:400}]} numberOfLines={2} >{props.description}</Text>
                <Text>{props.price}</Text>

                <Text style={[styles.subHeaderText, { fontSize: 13, alignSelf: 'flex-end' }]}>
                    {props.percent}% would eat again
                </Text>
            </View>

            <View style={{ justifyContent: 'center', right: "10%" }}>
                {/* <TouchableOpacity style={{alignSelf:'center'}} onPress={() => console.log(`upvoted ${props.food} by ${props.restaurant}`)}> */}
                <Icon color={props.upvoteColor} size={30} name="caretup" />
                {/* </TouchableOpacity> */}
                <Text style={[styles.subHeaderText, { fontSize: 20, alignSelf: 'center' }]}>
                    {props.upvotes}
                </Text>
            </View>

        </TouchableOpacity>
    )

}



export default Card