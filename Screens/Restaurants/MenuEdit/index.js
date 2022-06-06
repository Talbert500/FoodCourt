import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import RestaurantsHeader from './RestaurantsHeader';

import Content from './Content';
import Header from './Header'
import { useDispatch } from 'react-redux';
import { getMyRestaurant, getRestaurantMenus } from '../../../redux/saga';
import { overlay } from 'react-native-paper';

const MenuEdit = (props) => {

    const dispatch = useDispatch()

    useEffect(() => {
        getRestaurantMenus(dispatch)
    }, [])

    return(
        <View style={{display:"flex",overflow:'hidden'}}> 
            <RestaurantsHeader navigation={props.navigation} />
            <Header activeTab={"MenuEdit"} route={props.route} navigation={props.navigation}/>
            {/* <Content 
                route={props.route}
                navigation={props.navigation}
            /> */}
        </View>        
    )
}

export default MenuEdit;
