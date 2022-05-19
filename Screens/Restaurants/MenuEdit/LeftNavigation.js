import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import RadioForm from 'react-native-simple-radio-button';

const LeftNavigation = ({ selectedMenus, setSelectedCategory, setFiltered, 
                          setMenuItem, selectedCategory, 
                          foodItem, menuData, setMenuIndex,
                          setCheckedPrice }) => 
{

    const [setMenu, setSetMenu] = useState('');
    const [menusDesc, setmenusDesc] = useState('')
    const [setCate, setSetCate] = useState('');

    const options = [
        { label: 'Any', value: 'any' },
        { label: 'Under $5', value: 'underFive' },
        { label: '$5 to $10', value: 'fiveToTen' },
        { label: '20$ and over', value: 'twentyAndOver' },
      ];

    function onMenuClick(index, clicked, description) {
        setmenusDesc(description)
        if (setMenu != clicked) {

            setSelectedCategory(selectedMenus[index].categories)

            setSetMenu(clicked)
            const newData = foodItem.filter((item) => {
                const cateDate = item.menus ?
                    item.menus.toUpperCase() : ''.toUpperCase()
                const cate = clicked.toUpperCase();

                return cateDate.indexOf(cate) > -1;
            });
            setFiltered(newData);
        } else {
            setSetMenu("")
            setMenuItem(foodItem)
            setmenusDesc("")
            setFiltered(null)
            setSelectedCategory(null)
            setmenusDesc("")
        }
    }

    function onCategoryClick(clicked) {
        if (setCate != clicked) {

            setSetCate(clicked)
            const newData = menuData.filter((item) => {
                const cateDate = item.category ?
                    item.category.toUpperCase() : ''.toUpperCase()
                const cate = clicked.toUpperCase();

                return cateDate.indexOf(cate) > -1;
            });
            setFiltered(newData);

        } else {
            setSetCate("")
            setFiltered(menuData)
        }
    }

    const renderMenus = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => (setMenuItem(foodItem), setFiltered(menuData), onMenuClick(index, item.desc, item.time), setMenuIndex(index))}>
                <View>
                    <Text style={{ marginBottom: "5px", fontWeight: 600, color: (item.desc === setMenu) ? "#F6AE2D" : "black" }}>{item.desc} </Text>
                </View>
            </TouchableOpacity >

        )
    }

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => (setFiltered(menuData), onCategoryClick(item))}>
                <View>
                    <Text style={{ marginBottom: "5px", fontWeight: 600, color: (item === setCate) ? "#F6AE2D" : "black" }}>{item} </Text>
                </View>

            </TouchableOpacity>
        )
    }

    return(
        <View style={{ marginTop: "75px" }}>
            <View style={{ marginLeft: "136px", marginRight: "20px", borderBottom: "1px solid #A7A7A7", width: "200px", paddingBottom: "10px" }}>
                <Text style={{ fontSize: "25px", fontWeight: "bold", marginTop: "10px", marginBottom: "10px" }}>Menus</Text>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    vertical
                    data={selectedMenus}
                    renderItem={renderMenus}
                    initialNumToRender={10}
                />
            </View>
            <View style={{ marginLeft: "136px", marginRight: "20px", borderBottom: "1px solid #A7A7A7", width: "200px", paddingBottom: "10px" }}>
                <Text style={{ fontSize: "25px", fontWeight: "bold", marginTop: "10px", marginBottom: "10px" }}>Categories</Text>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    vertical
                    data={selectedCategory}
                    renderItem={renderItem}
                    initialNumToRender={10}
                />
            </View>
            <View style={{ marginLeft: "136px", marginRight: "20px", borderBottom: "1px solid #A7A7A7", width: "200px", paddingBottom: "10px" }}>
                <Text style={{ fontSize: "25px", fontWeight: "bold", marginTop: "10px", marginBottom: "10px" }}>Price range</Text>
                <View>
                    <RadioForm
                        radio_props={options}
                        initial={0}
                        onPress={(checkedPrice) => {
                            setCheckedPrice(checkedPrice);
                        }} 
                    />
                </View>
            </View>
        </View>
    );
}

export default LeftNavigation;