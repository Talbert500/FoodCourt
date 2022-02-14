export const SEARCHED_RESTAURANT = 'SEARCHED_RESTAURANT'
export const CLICKED_FOOD_ITEM_ID = 'CLICKED_FOOD_ITEM';
export const SET_FOOD_IMAGE = 'SET_FOOD_IMAGE';
export const SEARCHED_RESTAURANT_IMAGE = 'SEARCHED_RESTAURANT_IMAGE';
export const NEW_RESTAURANT = 'NEW_RESTAURANT';

const initialState = {
    searchedRestaurant:'',
    restaurantDesc:'',
    restaurantPhone:'',
    restaurantAddress:'',
    restaurantId:'',
    restaurantImage:'',
    restaurantColor:"",


    foodItemId: 0,
    food: "",
    foodPrice: 0,
    foodDesc: "",
    upvotes:0,
    foodImage:"",
    eatagain: '',
    userCredential_id:"",


    adminEmail:"",


}

const reducer =(state= initialState, action) => {
    switch(action.type) {
        case NEW_RESTAURANT:
            return{
                adminEmail:action.adminEmail,
                userCredential_id: action.userCredential_id,
                restaurantId: action.userCredential_id
            }
        case SEARCHED_RESTAURANT:
            return{
                ...state,
                searchedRestaurant: action.payload,
                restaurantDesc:action.description,
                restaurantAddress: action.address,
                restaurantPhone: action.phone,
                restaurantId: action.id,
                restaurantColor:action.color

            }

        case CLICKED_FOOD_ITEM_ID: 
            return{
                ...state,
                foodItemId: action.payload,
                food: action.foodName,
                foodPrice: action.foodPrice,
                upvotes: action.upvotes,
                foodDesc:action.foodDesc,
                searchedRestaurant: action.searchedRestaurant,
                eatagain:action.eatagain
            }
            case SET_FOOD_IMAGE:
                return{
                    ...state,
                    foodImage:action.payload
                }
        case SEARCHED_RESTAURANT_IMAGE:
            return{
                ...state,
                restaurantImage:action.image

            }
    }
}


export default (reducer)