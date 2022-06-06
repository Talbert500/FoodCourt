import React from 'react'
import { View, Image, TextInput, Text, TouchableOpacity, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { styles } from '../../../styles';
import splash from './../../../assets/logo.png'


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const RestaurantsHeader = (props) => {

    const menu_items = [
        "Mexican",
        "Burgers",
        "Chinese",
        "Italian"
    ]

    const menu = menu_items.map((m) => (
        <Text
            key={m}
            style={{
                marginRight: "47px",
                fontSize: "12",
                fontWeight: "bold",
                color: "#525252",
                cursor: "pointer"
            }}
        >
            {m}
        </Text>))

    return ( 
        <View style={{backgroundColor:'white',height: "100", zIndex: "99", boxShadow: "0px 1px 5px #DDDDDD",paddingHorizontal:windowWidth >= 450 ? windowWidth/6 : windowWidth/8,alignItems:'center'}}>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10,flex:1,marginHorizontal:20}}>
                <Image style={{ height: "80px", width: "150px", cursor: "pointer" }}
                    source={splash}
                    resizeMode="contain"
                />
                <View style={{
                    shadowColor: '#171717',
                    shadowOffset: { width: 1, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 9,
                    flexDirection: "row",
                    borderRadius:5,
                    flex:3,

        
                }}>

                    <View style={{
                        backgroundColor: "white",
                        height: "35px",
                        padding:10,
                        borderTopLeftRadius: "5px",
                        borderBottomLeftRadius: "5px",

                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20.769" height="20.772" viewBox="0 0 20.769 20.772">
                            <path id="Icon_awesome-search" data-name="Icon awesome-search" d="M20.486,17.959l-4.045-4.045a.973.973,0,0,0-.69-.284h-.661a8.434,8.434,0,1,0-1.46,1.46v.661a.973.973,0,0,0,.284.69l4.045,4.045a.97.97,0,0,0,1.375,0l1.148-1.148a.978.978,0,0,0,0-1.379ZM8.438,13.631a5.193,5.193,0,1,1,5.193-5.193A5.19,5.19,0,0,1,8.438,13.631Z" transform="translate(0 0)" fill="#aeaeae" />
                        </svg>
                    </View>

                    <TextInput
                        style={{
                            backgroundColor: "white",
                            height: "35px",
                            outline: "none",
                            maxWidth:500,
                            width:'100%'

                        }}
                        placeholder="Search for foods"
                    />

                    <View style={{
                        backgroundColor: "white",
                        borderTopRightRadius: "5px",
                        borderBottomRightRadius: "5px",
                        flexDirection: "row",
                        alignItems: "center",
                        marginRight:10
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15.577" height="22.5" viewBox="0 0 15.577 22.5">
                            <path id="Icon_ionic-ios-pin" data-name="Icon ionic-ios-pin" d="M15.663,3.375a7.528,7.528,0,0,0-7.788,7.231c0,5.625,7.788,15.269,7.788,15.269s7.788-9.644,7.788-15.269A7.528,7.528,0,0,0,15.663,3.375Zm0,10.325A2.537,2.537,0,1,1,18.2,11.163,2.537,2.537,0,0,1,15.663,13.7Z" transform="translate(-7.875 -3.375)" />
                        </svg>
                        <Text style={{ fontSize: "15px", fontWeight: "Primary", marginLeft: "10px" }}>{props.restaurant_city + ", " + props.restaurant_state}</Text>
                    </View>

                </View>

                <TouchableOpacity
                    // onPress={() => { props.navigation.navigate("Home") }}
                    style={[styles.button, { alignItems: 'center', minWidth: 50, maxWidth: 200, justifyContent: 'center',flex:1}]}
                >
                    <Text style={{ textAlign: 'center', fontWeight: "Bold", color: 'white' }}>Menu Dashboard</Text>
                </TouchableOpacity> 

            </View>
            <View
                style={{
                    flexDirection: "row",
                    paddingVertical: 5,
                    alignSelf:'center',

                }}>
                {menu}
            </View>
        </View>
    )
}

const mapStateToProps = (state) => {
    if (state === undefined)
        return {
            isLoading: true
        }

    return ({
        // restaurant_city: state.restaurant_city,
        // restaurant_state: state.restaurant_state
        restaurant_city: "Phoenix",
        restaurant_state: "Arizona"
    })
}

const RestaurantsHeaderContainer = connect(mapStateToProps, null)(RestaurantsHeader)

export default RestaurantsHeaderContainer;