import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TextInput } from 'react-native';
import { connect } from 'react-redux';
import SyncLoader from "react-spinners/SyncLoader";

import Card from '../../../Components/Card';
import AddFoodButton from './AddFoodButton';

const FoodList = (props) => {

    const [currentTab, setCurrentTab] = useState("Menu")

    const underline = { fontSize: "18px", cursor: "pointer", paddingBottom: "8px", borderBottom: "3px solid #F6AE2D" }

    return(
        <View style={{ marginLeft: "10px" }}>
            <View style={{ borderBottom: "1px solid #D3D3D3", width: "100%" }}>
                <View style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "25px",
                        width: "400px",
                        justifyContent: "space-between"
                    }}>
                        <Text style={currentTab === "Menu" ? underline : { fontSize: "18px", paddingBottom: "8px", cursor: "pointer" }} onPress={() => setCurrentTab("Menu")}>Menu</Text>
                        <Text style={currentTab === "Details" ? underline : { fontSize: "18px", cursor: "pointer" }} onPress={() => setCurrentTab("Details")}>Details</Text>
                        <Text style={currentTab === "Coupons" ? underline : { fontSize: "18px", cursor: "pointer" }} onPress={() => setCurrentTab("Coupons")}>Coupons</Text>
                        <Text style={currentTab === "Reviews" ? underline : { fontSize: "18px", cursor: "pointer" }} onPress={() => setCurrentTab("Reviews")}>Reviews</Text>
                </View>
            </View>
            <View style={{ display: "flex", flexDirection: "row", marginTop: "20px", marginLeft: "5px" }}>
                <View style={{
                        borderTop: "1px solid #707070",
                        borderLeft: "1px solid #707070",
                        borderBottom: "1px solid #707070",
                        borderTopLeftRadius: "5px",
                        borderBottomLeftRadius: "5px",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                        paddingLeft: "15px",
                        paddingRight: "15px"
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20.769" height="20.772" viewBox="0 0 20.769 20.772">
                            <path id="Icon_awesome-search" data-name="Icon awesome-search" d="M20.486,17.959l-4.045-4.045a.973.973,0,0,0-.69-.284h-.661a8.434,8.434,0,1,0-1.46,1.46v.661a.973.973,0,0,0,.284.69l4.045,4.045a.97.97,0,0,0,1.375,0l1.148-1.148a.978.978,0,0,0,0-1.379ZM8.438,13.631a5.193,5.193,0,1,1,5.193-5.193A5.19,5.19,0,0,1,8.438,13.631Z" transform="translate(0 0)" fill="#aeaeae"/>
                    </svg>
                </View>
                <TextInput 
                    placeholder={"Chicken tacos..."}
                    style={{
                        borderTop: "1px solid #707070",
                        borderRight: "1px solid #707070",
                        borderBottom: "1px solid #707070",
                        borderTopRightRadius: "5px",
                        borderBottomRightRadius: "5px",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                        width: "350px",
                        outline: "none"
                    }}
                />
            </View>
            {currentTab === "Menu" &&
            <View>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: "25px", fontWeight: "bold", marginTop: "10px" }}>{props.categoryLabel}</Text>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <View style={{ marginRight: "23px", cursor: "pointer" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="20" viewBox="0 0 29 20">
                                <g id="Icon_feather-list" data-name="Icon feather-list" transform="translate(-3.5 -8)">
                                    <path id="Контур_690" data-name="Контур 690" d="M12,9H31.5" fill="none" stroke="#a7a7a7" strokeLinejoin="round" strokeWidth="2"/>
                                    <path id="Контур_691" data-name="Контур 691" d="M12,18H31.5" fill="none" stroke="#a7a7a7" strokeLinejoin="round" strokeWidth="2"/>
                                    <path id="Контур_692" data-name="Контур 692" d="M12,27H31.5" fill="none" stroke="#a7a7a7" strokeLinejoin="round" strokeWidth="2"/>
                                    <path id="Контур_693" data-name="Контур 693" d="M4.5,9h0" fill="none" stroke="#a7a7a7" strokeLinejoin="round" strokeWidth="2"/>
                                    <path id="Контур_694" data-name="Контур 694" d="M4.5,18h0" fill="none" stroke="#a7a7a7" strokeLinejoin="round" strokeWidth="2"/>
                                    <path id="Контур_695" data-name="Контур 695" d="M4.5,27h0" fill="none" stroke="#a7a7a7" strokeLinejoin="round" strokeWidth="2"/>
                                </g>
                            </svg>
                        </View>

                        <View style={{ cursor: "pointer" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <g id="Icon_feather-grid" data-name="Icon feather-grid" transform="translate(-3.5 -3.5)">
                                    <path id="Контур_686" data-name="Контур 686" d="M4.5,4.5h8.556v8.556H4.5Z" fill="none" stroke="#000" strokeLinejoin="round" strokeWidth="2"/>
                                    <path id="Контур_687" data-name="Контур 687" d="M21,4.5h8.556v8.556H21Z" transform="translate(-3.056)" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                                    <path id="Контур_688" data-name="Контур 688" d="M21,21h8.556v8.556H21Z" transform="translate(-3.056 -3.056)" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                                    <path id="Контур_689" data-name="Контур 689" d="M4.5,21h8.556v8.556H4.5Z" transform="translate(0 -3.056)" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                                </g>
                            </svg>
                        </View>
                    </View>
                </View>
                {!props.isLoading ? <FlatList
                    data={props.foodList}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) =>
                        <View>
                            {props.checkedPrice === "any" && 
                            <Card
                                // restaurant={item.restaurant}
                                // ranking={index + item.upvotes}
                                price={item.price}
                                food={item.name}
                                // description={item.description}
                                // percent={item.ratingCount > 0 ? (item.eatagain * 100 / item.ratingCount).toFixed(0) : (item.eatagain)}
                                // upvotes={item.upvotes}
                                // overall={item.overall}
                                // upvoteColor={props.restaurantColor}
                                // category = {item.category}
                                // imageUrl = {item.imageUrl}
                                navigation={props.navigation}
                                // restaurantId={props.restaurantId}
                                item={item}
                                searchedRestaurant={props.searchedRestaurant}
                            />}

                            {props.checkedPrice === "underFive" && item.price < 5 &&
                            <Card
                                // restaurant={item.restaurant}
                                // ranking={index + item.upvotes}
                                price={item.price}
                                food={item.name}
                                // description={item.description}
                                // percent={item.ratingCount > 0 ? (item.eatagain * 100 / item.ratingCount).toFixed(0) : (item.eatagain)}
                                // upvotes={item.upvotes}
                                // overall={item.overall}
                                // upvoteColor={props.restaurantColor}
                                // category = {item.category}
                                // imageUrl = {item.imageUrl}
                                navigation={props.navigation}
                                // restaurantId={props.restaurantId}
                                item={item}
                                searchedRestaurant={props.searchedRestaurant}
                            />}

                            {props.checkedPrice === "fiveToTen" && item.price >= 5 && item.price <= 10 &&
                            <Card
                                // restaurant={item.restaurant}
                                // ranking={index + item.upvotes}
                                price={item.price}
                                food={item.name}
                                // description={item.description}
                                // percent={item.ratingCount > 0 ? (item.eatagain * 100 / item.ratingCount).toFixed(0) : (item.eatagain)}
                                // upvotes={item.upvotes}
                                // overall={item.overall}
                                // upvoteColor={props.restaurantColor}
                                // category = {item.category}
                                // imageUrl = {item.imageUrl}
                                navigation={props.navigation}
                                // restaurantId={props.restaurantId}
                                item={item}
                                searchedRestaurant={props.searchedRestaurant}
                            />}

                            {props.checkedPrice === "twentyAndOver" && item.price >= 20 &&
                            <Card
                                // restaurant={item.restaurant}
                                // ranking={index + item.upvotes}
                                price={item.price}
                                food={item.name}
                                // description={item.description}
                                // percent={item.ratingCount > 0 ? (item.eatagain * 100 / item.ratingCount).toFixed(0) : (item.eatagain)}
                                // upvotes={item.upvotes}
                                // overall={item.overall}
                                // upvoteColor={props.restaurantColor}
                                // category = {item.category}
                                // imageUrl = {item.imageUrl}
                                navigation={props.navigation}
                                // restaurantId={props.restaurantId}
                                item={item}
                                searchedRestaurant={props.searchedRestaurant}
                            />}
                        </View>
                    }
                /> : 
                <View style={{ marginLeft: "100px", marginTop: "60px" }}>
                    <SyncLoader color={"#F6AE2D"} loading={props.isLoading} size={25} />
                </View>}
                <View style={{ borderBottom: "1px solid #A7A7A7", width: "70vw" }}>
                    <AddFoodButton
                        restaurantDesc={props.restaurantDesc}
                        restaurant_address={props.restaurant_address}
                        restaurantPhone={props.restaurantPhone}
                        searchedRestaurant={props.searchedRestaurant}
                        restaurantId={props.restaurantId}
                        restaurantColor={props.restaurantColor}
                        navigation={props.navigation}
                    />
                </View>
            </View>}
        </View>
    );
}

const mapStateToProps = (state) => {
    if(state === undefined)
    return {
        isLoading: true
    }
    
    return({
        filtered: state.filtered,
        searchedRestaurant: state.searchedRestaurant,
        restaurantDesc: state.restaurantDesc,
        restaurantId: state.restaurantId,
        restaurant_address: state.restaurant_address,
        restaurantColor: state.restaurantColor,
        restaurantPhone: state.restaurantPhone,
        selectedCategory: state.selectedCategory,

        foodList: state.foodList,
        isLoading: state.isLoading,
        categoryLabel: state.categoryLabel
    })
}

const FoodListContainer = connect(mapStateToProps, null)(FoodList)

export default FoodListContainer;