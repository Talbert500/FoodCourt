import { setFiltered, setMenuItem, setFoodItem } from './action';
import { getDownloadURL, ref as tef } from 'firebase/storage';
import { db, auth, database, storage } from '../firebase-config';
import { ref, onValue} from 'firebase/database';
import axios from 'axios';

import { QRapiKey } from '../config';
import { setLoading } from './action';

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
                console.log(data)
                dispatch(setFiltered(""))
                dispatch(setMenuItem(""))
                Object.values(data).map((foodData) => {
                    dispatch(setFoodItem(foodData))
                    dispatch(setMenuItem(foodData))
                    // setTotalLikes(prevState => prevState + foodData.upvotes)
                })
            }
        })

        dispatch(setLoading(false))
    }
    catch(err) {
        console.log(err)
        dispatch(setLoading(false))
    }
}