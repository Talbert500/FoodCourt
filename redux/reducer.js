export const SEARCHED_RESTAURANT = 'SEARCHED_RESTAURANT'
export const SET_FOOD_IMAGE = 'SET_FOOD_IMAGE';
export const SEARCHED_RESTAURANT_IMAGE = 'SEARCHED_RESTAURANT_IMAGE';
export const RESTAURANT_INFO = 'RESTAURANT_INFO';
export const SET_USER_PROPS = 'SET_USER_PROPS';
export const SET_FOOD_ITEM = 'SET_FOOD_ITEM';
export const SET_FILTERED = 'SET_FILTERED';
export const SET_MENU_ITEM = 'SET_MENU_ITEM';
export const SET_LOADING = 'SET_LOADING';
export const SET_SELECTED_MENUS = 'SET_SELECTED_MENUS';
export const DELETE_FOOD_ITEM = 'DELETE_FOOD_ITEM';
export const SET_ACTIVE_PAGE_TAB = 'SET_ACTIVE_PAGE_TAB';
export const SET_CATEGORIES = 'SET_CATEGORIES';
export const SET_SELECTED_CATEGORY = 'SET_SELECTED_CATEGORY';
export const SET_USER_ID = 'SET_USER_ID';
export const SET_MENU_INDEX = 'SET_MENU_INDEX';
export const SET_RESTAURANT_DATA = 'SET_RESTAURANT_DATA';
export const SET_RESTAURANT_ADDRESS_DATA = 'SET_RESTAURANT_ADDRESS_DATA';
export const SET_LOGGINED = 'SET_LOGGINED';
export const SET_PROFILE_DATA = 'SET_PROFILE_DATA';
export const SET_RESTAURANT_MENUS = 'SET_RESTAURANT_MENUS';
export const SET_FOOD_LIST = 'SET_FOOD_LIST';
export const SET_CATEGORY_LABEL = 'SET_CATEGORY_LABEL';

const initialState = {
    firstName: '',
    lastName: '',

    isLoggined: false,

    searchedRestaurant: '',
    restaurantDesc: '',
    restaurantPhone: '',
    restaurantAddress: '',
    restaurantId: '',
    restaurantImage: '',
    restaurantColor: '',
    restaurant_city: '',
    restaurant_state: '',
    restaurant_zip: '',
    restaurant_website: '',
    restaurant_country: 'United States',

    restaurantMenus: [],

    foodList: [],

    categoryLabel: "",

    foodItemId: 0,
    food: "",
    foodPrice: 0,
    foodDesc: "",
    upvotes: 0,
    foodImage: "",
    eatagain: '',
    userCredential_id: "",

    foodItem: [],
    filtered: null,
    menuItem: null,
    menuIndex: null,

    selectedMenus: [],


    adminEmail: "",
    adminPassword: "",

    userId:"",
    username: "",
    userPhoto: null,
    userIdString: null,

    isLoading: false,
    activePageTab: "MenuEdit",
    selectedCategory: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CATEGORY_LABEL:
            return {
                ...state,
                categoryLabel: action.payload
            }
        case SET_FOOD_LIST:
            return {
                ...state,
                foodList: action.payload
            }
        case SET_RESTAURANT_MENUS:
            return {
                ...state,
                restaurantMenus: action.payload
            }
        case SET_LOGGINED:
            return {
                ...state,
                isLoggined: action.payload
            }
        case SET_USER_PROPS:
            return{
                ...state,
                userId:action.userId,
                username:action.username,
                userPhoto:action.userPhoto

            }
        case RESTAURANT_INFO:
            return {
                ...state,
                restaurant_website: action.restaurantWebsite
            }
        case SET_PROFILE_DATA:
            return {
                ...state,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                adminEmail: action.payload.adminEmail,
                adminPassword: action.payload.adminPassword,
                searchedRestaurant: action.payload.searchedRestaurant
            }
        case SEARCHED_RESTAURANT:
            return {
                ...state,
                searchedRestaurant: action.payload.searchedRestaurant,
                restaurantDesc: action.payload.restaurant_desc,
                restaurantAddress: action.payload.restaurant_address,
                restaurantPhone: action.payload.restaurant_phone,
                restaurantId: action.payload.restaurant_id,
                restaurant_city: action.payload.restaurant_city,
                restaurant_state: action.payload.restaurant_state,
                restaurant_zip: action.payload.restaurant_zip,
                restaurant_website: action.payload.restaurant_website

            }

        case SET_FOOD_IMAGE:
            return {
                ...state,
                foodImage: action.payload
            }
        case SEARCHED_RESTAURANT_IMAGE:
            return {
                ...state,
                restaurantImage: action.image

            }
        case SET_FOOD_ITEM:
            return {
                ...state,
                foodItem: action.payload
            }
        case DELETE_FOOD_ITEM:
            return {
                ...state,
                foodItem: []
            }
        case SET_FILTERED:
            return {
                ...state,
                filtered: action.payload
            }
        case SET_MENU_ITEM:
            return {
                ...state,
                menuItem: action.payload
            }
        case SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }
        case SET_SELECTED_MENUS:
            return {
                ...state,
                selectedMenus: action.payload
            }
        case SET_ACTIVE_PAGE_TAB:
            return {
                ...state,
                activePageTab: action.payload
            }
        case SET_CATEGORIES:
            return {
                ...state,
                categories: action.payload
            }
        case SET_SELECTED_CATEGORY:
            return {
                ...state,
                selectedCategory: action.payload
            }
        case SET_USER_ID:
            return {
                ...state,
                userIdString: action.payload
            }
        case SET_MENU_INDEX:
            return {
                ...state,
                menuIndex: action.payload
            }
        case SET_RESTAURANT_DATA:
            return {
                ...state,
                restaurantPhone: action.payload.restaurantPhone,
                restaurant_website: action.payload.restaurant_website,
                restaurantDesc: action.payload.restaurantDesc
            }
        case SET_RESTAURANT_ADDRESS_DATA:
            return {
                ...state,
                restaurantAddress: action.payload.restaurantAddress,
                restaurant_city: action.payload.restaurant_city,
                restaurant_state: action.payload.restaurant_state,
                restaurant_zip: action.payload.restaurant_zip
            }
    }
}


export default reducer;