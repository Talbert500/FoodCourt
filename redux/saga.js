import { setFiltered, setMenuItem, setFoodItem, deleteFoodItem, setSearchedRestaurant, setRestaurantMenus, setFoodList } from './action';
import { getDownloadURL, ref as tef } from 'firebase/storage';
import { db, auth, database, storage } from '../firebase-config';
import { ref, onValue} from 'firebase/database';
import axios from 'axios';

import { BASE_URL, QRapiKey } from '../config';
import { setLoading, setLoggined } from './action';

export async function getFoodByCategory(dispatch, categoryId) {
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.token}`
    }

    try {
        dispatch(setLoading(true))

        axios.get(BASE_URL + "/food/category/" + categoryId, {headers})
        .then((data) => {
            if(data) {
                dispatch(setLoading(false))
                dispatch(setFoodList(data.data))
            }
        })
    }
    catch(err) {
        console.log(err)
    }
}

export async function getFoodByMenu(dispatch, menuId) {
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.token}`
    }

    try {
        dispatch(setLoading(true))

        await axios.get(BASE_URL + "/food/menu/" + menuId, {headers})
        .then((data) => {
            if(data) {
                dispatch(setLoading(false))
                dispatch(setFoodList(data.data))
            }
        })
    }
    catch(err) {
        console.log(err)
    }
}

export async function createFood(dispatch, foodData) {
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.token}`
    }
    
    try {
        dispatch(setLoading(true))

        await axios.post(BASE_URL + "/food", foodData, {headers})
        .then(() => {
            dispatch(setLoading(false))
        })
    }
    catch(err) {
        console.log(err)
    }
}

export async function createNewRestaurant(dispatch, new_restaurant) {
    try {
        dispatch(setLoading(true))

        return await axios.post(BASE_URL + '/user/restaurant', new_restaurant)
    }
    catch(err) {
        console.log(err)
    }
}

export async function checkEmail(dispatch, email) {
    try {
        dispatch(setLoading(true))

        return await axios.post(BASE_URL + '/user/email', {email})
    }
    catch(err) {
        console.log(err)
    }
}

export async function LogIn(dispatch, email, password) {
    try {
        dispatch(setLoading(true))
        await axios.post(BASE_URL + "/auth/login", {email: email, password: password })
        .then((userCredential) => {
          dispatch(setLoading(true))
    
          localStorage.setItem('isLoggined', true);
          localStorage.setItem('token', userCredential.data.access_token);
  
          dispatch(setLoading(false))
          dispatch(setLoggined(true))
        })
      }
      catch(err) {
        console.log(err)
      }
}

export async function getRestaurantMenus(dispatch) {
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.token}`
    }

    try {
        dispatch(setLoading(true))

        await axios.get(BASE_URL + "/menu", {headers})
        .then((data) => {
            dispatch(setLoading(false))
            dispatch(setRestaurantMenus(data.data))
        })
    }
    catch(err) {
        console.log(err)
    }
}

export async function setMenusData(dispatch, navigation, menus) {
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.token}`
    }

    try {
        dispatch(setLoading(true))
        await axios.post(BASE_URL + "/menu", menus, {headers})
        .then(() => {
            dispatch(setLoading(false))
            navigation.navigate("Home")
        })
    }
    catch(err) {
        console.log(err)
    }
}

export async function getMyRestaurant(dispatch) {
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.token}`
    }

    try {
        dispatch(setLoading(true))

        await axios.get(BASE_URL + "/restaurant/my", {headers})
        .then((data) => {
            if(data.data) {
              dispatch(setSearchedRestaurant({
                searchedRestaurant: data.data.name,
                restaurant_desc: data.data.description,
                restaurant_address: data.data.address,
                restaurant_phone: data.data.phone,
                restaurant_id: data.data.id,
                restaurant_city: data.data.city,
                restaurant_state: data.data.state,
                restaurant_zip: data.data.zip,
                restaurant_website: data.data.website
              }))
            }

            dispatch(setLoading(false))
        })
    }
    catch(err) {
        dispatch(setLoading(false))
        console.log(err)
    }
}

export async function getRestaurantImage( restId, dispatch ) {
    try {
        dispatch(setLoading(true))
        const res = tef(storage, 'imagesRestaurant/' + restId)

        if(res) {
            dispatch(setLoading(false))

            return await getDownloadURL(res)
        }
    }
    catch {
        console.log('error')
        dispatch(setLoading(false))
    }
}

export async function getQRMenuData( id, to, from, dispatch ) {
    console.log("QR DAYA", id)
    console.log("TO", to)
    console.log("FROM", from)

    const data = JSON.stringify({
        "product_id": `${id}`,
        "from": `${from}`,
        "to": `${to}`,
        "product_type": "qr",
        "interval": "1d"
    });

    const config = {
        method: 'post',
        url: 'https://api.beaconstac.com/reporting/2.0/?organization=105513&method=Products.getVisitorDistribution',
        headers: {
            'Authorization': `Token ${QRapiKey}`,
            'Content-Type': 'application/json'
        },
        data: data
    };

    try {
        dispatch(setLoading(true))

        const res = axios.request(config)

        dispatch(setLoading(false))

        return res;
    }
    catch(err) {
        console.log(err)
        dispatch(setLoading(false))
    }
}

export async function getQrId( QRMenuData, restId, dispatch ) {
    try {
        dispatch(setLoading(true))

        const res = ref(database, 'restaurants/' + restId + '/data/');
    
        onValue(res, (snapshot) => {
            const dataqr = snapshot.val();
            if (dataqr !== null) {
                console.log(dataqr.qrid)
                QRMenuData(dataqr.qrid, new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24).valueOf(), new Date().valueOf())
            }
        })

        dispatch(setLoading(false))
    }
    catch(err) {
        console.log(err)
        dispatch(setLoading(false))
    }
}

export async function getFullMenu( restId, dispatch ) {
    try {
        dispatch(setLoading(true))

        const getMenu = ref(database, 'restaurants/' + restId + '/foods/');

        onValue(getMenu, (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                dispatch(deleteFoodItem())
                console.log(data)
                dispatch(setFiltered(""))
                dispatch(setMenuItem(""))
                let foodDataArray = []
                Object.values(data).map((foodData) => {
                    foodDataArray.push(foodData)
                    // setTotalLikes(prevState => prevState + foodData.upvotes)
                })
                dispatch(setFoodItem(foodDataArray))
                dispatch(setMenuItem(foodDataArray))
            }
        })

        dispatch(setLoading(false))
    }
    catch(err) {
        console.log(err)
        dispatch(setLoading(false))
    }
}