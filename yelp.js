//API KEY: z5CRpxl3PxxpPMZ6H-PBZae3O1qHINzOmL3W7qBNy5QFy7fzD5h7cpUuTQ0Bbb2CwAnFa2UakVjPGaiLFHGl-sqmiTLBUyYipCqF7AQx_OfNTKbEA0zGlDGobxQcYnYx
//CLIENT ID: XMT-a_sjj9KTfY3ZpWDuxA

import React from 'react';
import { Button, TextInput, RefreshControl, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';

import axios from 'axios'


function yelp() {
    const [yelpData, setYelpData] = useState([])


    var config = {
        method: 'get',
        url: 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=deli&latitude=37.786882&longitude=-122.399972&limit=10',
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Authorization': 'Bearer z5CRpxl3PxxpPMZ6H-PBZae3O1qHINzOmL3W7qBNy5QFy7fzD5h7cpUuTQ0Bbb2CwAnFa2UakVjPGaiLFHGl-sqmiTLBUyYipCqF7AQx_OfNTKbEA0zGlDGobxQcYnYx'
        }
    };

    const getyelp = () => {
        axios(config)
            .then(function (response) {
                setYelpData(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    useEffect(() => {

        getyelp();

    }, [])



    const getData = () => {
        console.log(yelpData)

    }

    return (
        <View style={{ margin: 30 }}>
            <Text>
                Website is under maintaince!
            </Text>
            <Button onPress={getData} title="Get Restaurants" />
        </View>
    )

}

export default yelp