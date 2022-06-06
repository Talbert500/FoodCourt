import React from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

const AddFoodButton = ({ restaurantId, navigation }) => {

    return (
        <View onClick={() => {
            navigation.navigate("FoodAdd")
                // dispatch(
                //     setSearchedRestaurant(
                //         searchedRestaurant, 
                //         restaurantDesc, 
                //         restaurant_address, 
                //         restaurantPhone, 
                //         restaurantId, 
                //         restaurantColor)
                //     )
                }} 
            style={{ marginLeft: "32vw", marginTop: "30px", marginBottom: "30px", cursor: "pointer" }}
        >
            <View style={{ marginLeft: "28px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36.559" height="36.559" viewBox="0 0 36.559 36.559">
                    <g id="Icon_ionic-ios-add-circle-outline" data-name="Icon ionic-ios-add-circle-outline" transform="translate(-3.375 -3.375)">
                        <path id="Контур_739" data-name="Контур 739" d="M27.824,18.465H21.277V11.918a1.406,1.406,0,0,0-2.812,0v6.547H11.918a1.347,1.347,0,0,0-1.406,1.406,1.361,1.361,0,0,0,1.406,1.406h6.547v6.547a1.362,1.362,0,0,0,1.406,1.406,1.4,1.4,0,0,0,1.406-1.406V21.277h6.547a1.406,1.406,0,0,0,0-2.812Z" transform="translate(1.783 1.783)" fill="#b3b3b3"/>
                        <path id="Контур_740" data-name="Контур 740" d="M21.654,5.836a15.812,15.812,0,1,1-11.187,4.631A15.714,15.714,0,0,1,21.654,5.836m0-2.461A18.279,18.279,0,1,0,39.934,21.654,18.277,18.277,0,0,0,21.654,3.375Z" transform="translate(0 0)" fill="#b3b3b3"/>
                    </g>
                </svg>
            </View>
            <Text 
                style={{ 
                    fontSize: "20px", 
                    color: "#B3B3B3", 
                    fontWeight: "bold", 
                    marginTop: "10px"
                }}
            >
                Add Food
            </Text>
        </View>
    );
}

export default AddFoodButton;