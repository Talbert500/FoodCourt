export const SEARCHED_RESTAURANT = 'SEARCHED_RESTAURANT'
export const CLICKED_FOOD_ITEM_ID = 'CLICKED_FOOD_ITEM';
export const SET_FOOD_IMAGE = 'SET_FOOD_IMAGE';
export const SEARCHED_RESTAURANT_IMAGE = 'SEARCHED_RESTAURANT_IMAGE';
export const NEW_RESTAURANT = 'NEW_RESTAURANT';
export const RESTAURANT_INFO = 'RESTAURANT_INFO';
export const SET_USER_PROPS = 'SET_USER_PROPS';
export const SET_FOOD_ITEM = 'SET_FOOD_ITEM';
export const SET_FILTERED = 'SET_FILTERED';
export const SET_MENU_ITEM = 'SET_MENU_ITEM';
export const SET_LOADING = 'SET_LOADING';

const initialState = {
    firstName: '',
    lastName: '',


    searchedRestaurant:'',
    restaurantDesc: '',
    restaurantPhone: '',
    restaurantAddress: '',
    restaurantId: '',
    restaurantImage: '',
    restaurantColor: "",

    restaurant_website: '',


    foodItemId: 0,
    food: "",
    foodPrice: 0,
    foodDesc: "",
    upvotes: 0,
    foodImage: "",
    eatagain: '',
    userCredential_id: "",

    foodItem: null,
    filtered: null,
    menuItem: null,


    adminEmail: "",

    userId:"",
    username: "",
    userPhoto: null,

    isLoading: false,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_PROPS:
            return{
                ...state,
                userId:action.userId,
                username:action.username,
                userPhoto:action.userPhoto

            }
        case NEW_RESTAURANT:
            return {
                adminEmail: action.adminEmail,
                userCredential_id: action.userCredential_id,
                restaurantId: action.userCredential_id,
                firstName: action.firstName,
                lastName: action.lastName,
                searchedRestaurant: action.restaurantName
            }
        case RESTAURANT_INFO:
            return {
                ...state,
                restaurant_website: action.restaurantWebsite
            }
        case SEARCHED_RESTAURANT:
            return {
                ...state,
                searchedRestaurant: action.payload,
                restaurantDesc: action.description,
                restaurantAddress: action.address,
                restaurantPhone: action.phone,
                restaurantId: action.id,
                restaurantColor: action.color

            }

        case CLICKED_FOOD_ITEM_ID:
            return {
                ...state,
                foodItemId: action.payload,
                food: action.foodName,
                foodPrice: action.foodPrice,
                upvotes: action.upvotes,
                foodDesc: action.foodDesc,
                searchedRestaurant: action.searchedRestaurant,
                eatagain: action.eatagain
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
                foodItem: [...state.foodItem, action.payload]
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
    }
}


export default reducer;