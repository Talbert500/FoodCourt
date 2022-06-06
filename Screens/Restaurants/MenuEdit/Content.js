import React, { useState } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';

import LeftNavigation from './LeftNavigation'
import FoodList from './FoodList'

const Content = (props) => {

    const [checkedPrice, setCheckedPrice] = useState("any")

    return(
        <View style={{ backgroundColor: "white", height: "100%", paddingLeft: "80px" }}>
            {props.activePageTab === "MenuEdit" && (
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <LeftNavigation
                        setCheckedPrice={setCheckedPrice}
                    />
                    <FoodList
                        checkedPrice={checkedPrice}
                        navigation={props.navigation}
                    />
                </View>
            )}
        </View>
    )
}

const mapStateToProps = (state) => {
    if(state === undefined)
        return {
            isLoading: true
        }

    return {
        isLoading: false,
        menuItem: state.menuItem,
        foodItem: state.foodItem,
        filtered: state.filtered,
        selectedMenus: state.selectedMenus,
        activePageTab: state.activePageTab
    }
}

const ContentContainer = connect(mapStateToProps, null)(Content)

export default ContentContainer