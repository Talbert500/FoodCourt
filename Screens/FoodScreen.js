
import { Alert, RefreshControl, ScrollView, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, ActivityIndicator, Text, View, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, Input } from 'react-native-elements'
import { database } from '../firebase-config'
import { useDispatch, useSelector } from 'react-redux';
import { ref, update, onValue, increment } from 'firebase/database'
import { db } from '../firebase-config'
import { collection, getDoc, doc  } from 'firebase/firestore'
import { styles } from '../styles'
import { ref as tef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase-config';
import Icon from 'react-native-vector-icons/Feather'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Link } from '@react-navigation/native';
import {setSearchedRestaurant} from '../redux/action'
import { useLinkTo } from '@react-navigation/native';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function FoodScreen({ route, navigation }) {
  const {restId, foodId,restName} = route.params;

  const dispatch = useDispatch();
  const linkTo = useLinkTo();
  const [image, setImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentvote, setCurrentVote] = useState()
  const [refreshing, setRefreshing] = useState()
  const [searchedRestaurant, setRestaurantName] = useState([])
  const [restaurantDesc, setRestaurantDesc] = useState([]);
  const [restaurantId, setRestaurantId] = useState([]);
  const [restaurantImage, setRestaurantImage] = useState([]);
  const [restaurantColor, setRestaurantColor] = useState([]);
  const [restaurantAddress, setRestaurantAddress] = useState([]);
  const [restaurantPhone, setRestaurantPhone] = useState([]);

  //const foodItemId = useSelector(state => state.foodItemId)
  
  // const food = useSelector(state => state.food)
  // const price = useSelector(state => state.foodPrice)
  // const description = useSelector(state => state.foodDesc)
  // const upvotes = useSelector(state => state.upvotes)
  const [food, setFood] = useState([]);
  const [price, setPrice] = useState([]);
  const [description, setDescription] = useState([]);
  const [upvotes, setUpvotes] = useState([]);

  //const eatagain = useSelector(state =>state.eatagain)


  const [rating, setRating] = useState([]);
  const [voting, setVoting] = useState();
  const [eatagain, setEatagain] = useState();
  const [upvoteset, setUpvoteSet] = useState(false);

  // const [selectedRestaurants, setSelectedRestaurants] = useState("")
  const getImage = async () => {
    const imageRef = tef(storage, 'foodImages/' + restName +"/"+ foodId);
    await getDownloadURL(imageRef).then((url) => {
      setImage(url)
      setLoading(false);
    })
    const imageRatingRaf = tef(storage, 'foodRatingImage/' + foodId);
    if (imageRatingRaf !== null) {
      await getDownloadURL(imageRef).then((rateurl) => {
        console.log("Rating imaged:", rateurl)

      })
    }
  }


  const getRating = async () => {
    setRefreshing(false);
    const getRatings = ref(database, "restaurants/" + restId + "/ratings/" + foodId);
    onValue(getRatings, (snapshot) => {
      const data = snapshot.val();

      if (data !== null) {
        setRating("")
        Object.values(data).map((ratingData) => {
          setRating((food) => [...food, ratingData]);
          setRefreshing(false);
        })
      }
    })
  }
  const getFood = async () =>{
    const food = ref(database, 'restaurants/' + restId + '/menus/'+ foodId);
    onValue(food, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
            console.log(data)
            setFood(data.food)
            setPrice(data.price)
            setUpvotes(data.price)
            setDescription(data.description)

        } 
    })
  }

  useEffect(() => {
    setLoading(true);
    getImage();
    getRating();
    getUpVotesUpdate();
    getFood();
    const getRestaurant = async () => {
      const docRef = doc(db, "restaurants", restId);
      const snapshot = await getDoc(docRef)
      if (snapshot.exists()) {
        setRestaurantId(snapshot.data().restaurant_id)
        setRestaurantPhone(snapshot.data().restaurant_phone)
        setRestaurantAddress(snapshot.data().restaurant_address)
        setRestaurantDesc(snapshot.data().restaurant_desc)
        setRestaurantName(snapshot.data().restaurant_name)
        setRestaurantColor(snapshot.data().restaurant_color)
        dispatch(setSearchedRestaurant(searchedRestaurant, restaurantDesc, restaurantAddress, restaurantPhone, restaurantId, restaurantColor))
      } else {
        console.log("No souch document!")
      }
    }
    getRestaurant();

  }, [])

  const upvote = async () => {
    // int currentUpVotes;
    update(ref(database, "restaurants/" + restId + "/menus" + "/" + foodId), {
      upvotes: increment(1),
    });
    getUpVotesUpdate();
    setUpvoteSet(true);
  }

  const getUpVotesUpdate = async () => {
    const getUpvotes = ref(database, "restaurants/" + restId + "/menus" + "/" + foodId);
    onValue(getUpvotes, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setVoting(data.upvotes)
        if (data.ratingCount > 0) {

          setEatagain((data.eatagain * 100 / data.ratingCount).toFixed(0))
        } else {
          setEatagain(0)
        }
      }

    })

  }

  const leaveAPositiveReview = () => {
    Alert.alert(
      "Would You Like to Leave a Review?",
      "If No, your vote will still count!",
      [
        {
          text: "Yes",
          onPress: () => { upvote(upvotes), navigation.navigate("RatingFood",{
            restId: restId,
            foodId: foodId,
            restName: restName
           })  
          }
        },
        {
          text: "No",
          style: "cancel",
          onPress: () => { upvote(upvotes) }
        },
      ]
    )
  }

  return (
    <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={getRating} />
    }>
      <View style={{ flex: 1, paddingTop: 20, margin: 10 }}>

        <Icon
          color="black" size={35} name="arrow-left" onPress={()=>navigation.navigate("RestaurantMenu",{restId: restId,}) }
        />
        <View style={{ borderRadius: 10, overflow: 'hidden', margin: 10 }}>{!loading ?
          (<Image source={{ uri: image }} style={{ height: 300, borderRadius: 10, }} />) : (
            <ActivityIndicator size="large" style={{ height: 300 }} color="#F6AE2D" />
          )
        }
        </View>
        <View style={{ margin: 10, flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[styles.headerText, { fontSize: 35, maxWidth: "85%" }]}>{food}</Text>
            <View style={{ justifyContent: 'center', alignSelf: 'flex-end', right: 10 }}>
              {Platform.OS === 'web' ?
                <TouchableOpacity style={{ alignSelf: 'center', }} onPress={()=> {upvote(upvotes),navigation.navigate("RatingFood",{
                  restId: restId,
                  foodId: foodId,
                  restName: restName
                 }) }}>
                  <Icon color={restaurantColor} size={35} name="triangle" />
                </TouchableOpacity>
                :
                <TouchableOpacity style={{ alignSelf: 'center', }} onPress={leaveAPositiveReview}>
                  <Icon color={restaurantColor} size={35} name="triangle" />
                </TouchableOpacity>
              }

              <Text style={[styles.subHeaderText, { fontSize: 20, alignSelf: 'center' }]}>{voting}</Text>

            </View>
          </View>
          <Text style={{ fontSize: 19, fontWeight: '600' }}>Price: ${price}</Text>
          <Text>{description}</Text>


          <View style={{ margin: 20, justifyContent: 'center', }}>
            <Text style={{ alignSelf: 'center' }}>{eatagain}%: would eat again</Text>
            <Button onPress={() => { navigation.navigate("RatingFood",{ restId: restId, foodId: foodId, restName: restName})}} buttonStyle={[styles.button, { backgroundColor: restaurantColor, marginHorizontal: 40 }]} titleStyle={styles.buttonTitle} title="Rate my Food" />
          </View>
          <Text style={styles.subHeaderText}>Food Ratings: </Text>
          <FlatList
            data={rating}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: '#F2F2F2', borderRadius: 20, padding: 10, margin: 5, shadowRadius: 2, shadowOpacity: 0.4, shadowOffset: { width: 0, height: 1 }, elevation: 2, }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 15, marginVertical: 10 }}>{item.raters_name}</Text>
                  <Text style={{ alignSelf: 'flex-end', marginVertical: 10 }}>{item.rating_date}</Text>
                </View>
                <Text>{item.rating}</Text>
                <Text style={{ marginTop: 10, fontWeight: "400" }}>{item.restaurant}</Text>
              </View>

            )}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}



export default FoodScreen