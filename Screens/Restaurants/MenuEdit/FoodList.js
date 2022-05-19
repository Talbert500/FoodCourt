import React from 'react';
import { View, FlatList } from 'react-native';

import Card from '../../../Components/Card';
import AddFoodButton from './AddFoodButton';

const FoodList = ({ filtered, checkedPrice, restaurantColor, navigation, restaurantId, searchedRestaurant,
                    restaurantDesc, restaurant_address, restaurantPhone }) => 
{

    console.log(filtered, 'filtered')

    return(
        <View style={{ marginLeft: "10px" }}>
            <FlatList
                data={filtered}
                keyExtractor={(item, index) => index}
                renderItem={({ item, index }) =>
                    <View>
                        {checkedPrice === "any" && 
                        <Card
                            restaurant={item.restaurant}
                            ranking={index + item.upvotes}
                            price={item.price}
                            food={item.food}
                            description={item.description}
                            percent={item.ratingCount > 0 ? (item.eatagain * 100 / item.ratingCount).toFixed(0) : (item.eatagain)}
                            upvotes={item.upvotes}
                            overall={item.overall}
                            upvoteColor={restaurantColor}
                            category = {item.category}
                            imageUrl = {item.imageUrl}
                            navigation={navigation}
                            restaurantId={restaurantId}
                            item={item}
                            searchedRestaurant={searchedRestaurant}
                        />}

                        {checkedPrice === "underFive" && item.price < 5 &&
                        <Card
                            restaurant={item.restaurant}
                            ranking={index + item.upvotes}
                            price={item.price}
                            food={item.food}
                            description={item.description}
                            percent={item.ratingCount > 0 ? (item.eatagain * 100 / item.ratingCount).toFixed(0) : (item.eatagain)}
                            upvotes={item.upvotes}
                            overall={item.overall}
                            upvoteColor={restaurantColor}
                            category = {item.category}
                            imageUrl = {item.imageUrl}
                            navigation={navigation}
                            restaurantId={restaurantId}
                            item={item}
                            searchedRestaurant={searchedRestaurant}
                        />}

                        {checkedPrice === "fiveToTen" && item.price >= 5 && item.price <= 10 &&
                        <Card
                            restaurant={item.restaurant}
                            ranking={index + item.upvotes}
                            price={item.price}
                            food={item.food}
                            description={item.description}
                            percent={item.ratingCount > 0 ? (item.eatagain * 100 / item.ratingCount).toFixed(0) : (item.eatagain)}
                            upvotes={item.upvotes}
                            overall={item.overall}
                            upvoteColor={restaurantColor}
                            category = {item.category}
                            imageUrl = {item.imageUrl}
                            navigation={navigation}
                            restaurantId={restaurantId}
                            item={item}
                            searchedRestaurant={searchedRestaurant}
                        />}

                        {checkedPrice === "twentyAndOver" && item.price >= 20 &&
                        <Card
                            restaurant={item.restaurant}
                            ranking={index + item.upvotes}
                            price={item.price}
                            food={item.food}
                            description={item.description}
                            percent={item.ratingCount > 0 ? (item.eatagain * 100 / item.ratingCount).toFixed(0) : (item.eatagain)}
                            upvotes={item.upvotes}
                            overall={item.overall}
                            upvoteColor={restaurantColor}
                            category = {item.category}
                            imageUrl = {item.imageUrl}
                            navigation={navigation}
                            restaurantId={restaurantId}
                            item={item}
                            searchedRestaurant={searchedRestaurant}
                        />}
                    </View>
                }
            />
            <AddFoodButton
                restaurantDesc={restaurantDesc}
                restaurant_address={restaurant_address}
                restaurantPhone={restaurantPhone}
                searchedRestaurant={searchedRestaurant}
                restaurantId={restaurantId}
                restaurantColor={restaurantColor}
                navigation={navigation}
            />
        </View>
    );
}

export default FoodList;