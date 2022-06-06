import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import { connect, useDispatch } from 'react-redux';
import { getFoodByCategory, getFoodByMenu } from '../../../redux/saga';

import { setFiltered, setMenuItem, setCategories, setSelectedCategory, setMenuIndex, setCategoryLabel } from './../../../redux/action';

const LeftNavigation = (props) => {

    const dispatch = useDispatch()

    const [categories, setCategories] = useState([])
    const [clickedMenu, setClickedMenu] = useState("")
    const [clickedCategory, setClickedCategory] = useState("")

    const [setMenu, setSetMenu] = useState('');
    const [menusDesc, setmenusDesc] = useState('')

    const options = [
        { label: 'Any', value: 'any' },
        { label: 'Under $5', value: 'underFive' },
        { label: '$5 to $10', value: 'fiveToTen' },
        { label: '20$ and over', value: 'twentyAndOver' },
    ];

    useEffect(() => {
        if(props.restaurantMenus && props.restaurantMenus[0]) {
            getFoodByMenu(dispatch, props.restaurantMenus[0].id)
            setClickedMenu(props.restaurantMenus[0].id)
            setCategories(props.restaurantMenus[0].categories)
            dispatch(setCategoryLabel("All categories"))
        }
    }, [props.restaurantMenus])

    function onMenuClick(item) {
        setCategories(item.categories)
        setClickedMenu(item.id)
        setClickedCategory("")
        getFoodByMenu(dispatch, item.id)
        dispatch(setCategoryLabel("All categories"))
    }

    function onCategoryClick(item) {
        setClickedCategory(item.id)
        props.setSelectedCategory(item.name)
        getFoodByCategory(dispatch, item.id)
        dispatch(setCategoryLabel(item.name))
    }

    const renderMenus = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => onMenuClick(item)}>
                <View>
                    <Text style={{ marginBottom: "5px", fontWeight: 600, color: (item.id === clickedMenu) ? "#F6AE2D" : "black" }}>{item.name} </Text>
                </View>
            </TouchableOpacity >

        )
    }

    const renderCategories = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => onCategoryClick(item)}>
                <View>
                    <Text style={{ marginBottom: "5px", fontWeight: 600, color: (item.id === clickedCategory) ? "#F6AE2D" : "black" }}>{item.name} </Text>
                </View>

            </TouchableOpacity>
        )
    }

    return(
        <View style={{ marginTop: "75px" }}>
            <View style={{ marginLeft: "136px", marginRight: "20px", borderBottom: "1px solid #A7A7A7", width: "220px", paddingBottom: "10px" }}>
                <Text style={{ fontSize: "25px", fontWeight: "bold", marginTop: "10px", marginBottom: "10px" }}>Menus</Text>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    vertical
                    data={props.restaurantMenus}
                    renderItem={renderMenus}
                    initialNumToRender={10}
                />
            </View>
            <View style={{ marginLeft: "136px", marginRight: "20px", borderBottom: "1px solid #A7A7A7", width: "220px", paddingBottom: "10px" }}>
                <Text style={{ fontSize: "25px", fontWeight: "bold", marginTop: "10px", marginBottom: "10px" }}>Categories</Text>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    vertical
                    data={categories}
                    renderItem={renderCategories}
                    initialNumToRender={10}
                />
            </View>
            <View style={{ marginLeft: "136px", marginRight: "20px", borderBottom: "1px solid #A7A7A7", width: "220px", paddingBottom: "10px" }}>
                <Text style={{ fontSize: "25px", fontWeight: "bold", marginTop: "10px", marginBottom: "10px" }}>Price range</Text>
                <View>
                    <RadioForm
                        radio_props={options}
                        initial={0}
                        onPress={(checkedPrice) => {
                            props.setCheckedPrice(checkedPrice);
                        }} 
                    />
                </View>
            </View>
        </View>
    );
}

const mapStateToProps = (state) => {
    if(state === undefined)
    return {
        isLoading: true
    }

    return({
        selectedMenus: state.selectedMenus,
        menuItem: state.menuItem,
        foodItem: state.foodItem,
        categories: state.categories,
        selectedCategory: state.selectedCategory,

        restaurantMenus: state.restaurantMenus
    })
}

const LeftNavigationContainer = connect(mapStateToProps, { setFiltered, setMenuItem, setCategories, setSelectedCategory, setMenuIndex })(LeftNavigation)

export default LeftNavigationContainer;