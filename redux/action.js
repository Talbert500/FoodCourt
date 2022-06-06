import { SEARCHED_RESTAURANT } from "./reducer";
import { CLICKED_FOOD_ITEM_ID } from './reducer';
import { SEARCHED_RESTAURANT_IMAGE } from './reducer';
import { SET_FOOD_IMAGE } from './reducer';
import { NEW_RESTAURANT } from './reducer';
import { RESTAURANT_INFO } from './reducer';
import {SET_USER_PROPS} from './reducer';
import {SET_FOOD_ITEM} from './reducer';
import {SET_FILTERED} from './reducer';
import {SET_MENU_ITEM} from './reducer';
import {SET_LOADING} from './reducer';
import {SET_CATEGORIES} from './reducer';
import {SET_SELECTED_MENUS} from './reducer';
import {DELETE_FOOD_ITEM} from './reducer';
import {SET_ACTIVE_PAGE_TAB} from './reducer';
import {SET_SELECTED_CATEGORY} from './reducer';
import {SET_USER_ID} from './reducer';
import {SET_MENU_INDEX} from './reducer';
import {SET_PROFILE_DATA} from './reducer';
import {SET_RESTAURANT_DATA} from './reducer';
import {SET_RESTAURANT_ADDRESS_DATA} from './reducer';
import {SET_LOGGINED} from './reducer';
import {SET_RESTAURANT_MENUS} from './reducer';
import {SET_FOOD_LIST} from './reducer';
import {SET_CATEGORY_LABEL} from './reducer'


export const setCategoryLabel = (value) => {
    return {
        type: SET_CATEGORY_LABEL,
        payload: value
    }
}

export const setFoodList = (value) => {
    return {
        type:  SET_FOOD_LIST,
        payload: value
    }
}

export const setRestaurantMenus = (value) => {
    return {
        type: SET_RESTAURANT_MENUS,
        payload: value
    }
}

export const setLoggined = (value) => {
    return {
        type: SET_LOGGINED,
        payload: value
    }
}

export const setRestaurantAddressData = (value) => {
    return {
        type: SET_RESTAURANT_ADDRESS_DATA,
        payload: value
    }
}

export const setRestaurantData = (value) => {
    return {
        type: SET_RESTAURANT_DATA,
        payload: value
    }
}

export const setProfileData = (value) => {
    return {
        type: SET_PROFILE_DATA,
        payload: value
    }
}

export const setMenuIndex = (value) => {
    return {
        type: SET_MENU_INDEX,
        payload: value
    }
}

export const setUserId = (value) => {
    return {
        type: SET_USER_ID,
        payload: value
    }
}

export const setCategories = (value) => {
    return {
        type: SET_CATEGORIES,
        payload: value
    }
}

export const setSelectedCategory = (value) => {
    return {
        type: SET_SELECTED_CATEGORY,
        payload: value
    }
}

export const setActivePageTab = (value) => {
    return {
        type: SET_ACTIVE_PAGE_TAB,
        payload: value
    }
}

export const setSelectedMenus = (value) => {
    return {
        type: SET_SELECTED_MENUS,
        payload: value
    }
}

export const setLoading = (value) => {
    return {
        type: SET_LOADING,
        payload: value
    }
}

export const setMenuItem = (value) => {
    return {
        type: SET_MENU_ITEM,
        payload: value
    }
}

export const setFiltered = (value) => {
    return {
        type: SET_FILTERED,
        payload: value
    }
}

export const setFoodItem = (value) => {
    return {
        type: SET_FOOD_ITEM,
        payload: value
    }
}

export const deleteFoodItem = () => {
    return {
        type: DELETE_FOOD_ITEM
    }
}

export const setUserProps = (user_Id, userName,user_Photo) => {
    return{
        type: SET_USER_PROPS,
        userId: user_Id,
        username:userName,
        userPhoto:user_Photo,

    }

}

export const setRestaurantInfo = (restaurant_website) => {
    return {
        type: RESTAURANT_INFO,
        restaurantWebsite: restaurant_website

    }
}

export const setSearchedRestaurant = (value) => {
    return {
        type: SEARCHED_RESTAURANT,
        payload: value
    }
}

export const setSearchedRestaurantDesc = restaurantDesc => {
    return {
        type: SEARCHED_RESTAURANT_DESCRIPTION,
        payload: restaurantDesc
    }
}
export const setSearchedRestaurantImage = restaurantImage => {
    return {
        type: SEARCHED_RESTAURANT_IMAGE,
        image: restaurantImage
    }
}

export const setFoodItemImage = foodImage => {
    return {
        type: SET_FOOD_IMAGE,
        payload: foodImage,
    }
}