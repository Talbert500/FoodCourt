
import { ImageBackground, Alert, RefreshControl, ScrollView, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, ActivityIndicator, Text, View, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, Input } from 'react-native-elements'
import { database } from '../firebase-config'
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-config';
import { ref, update, onValue, increment } from 'firebase/database'
import { db } from '../firebase-config'
import { collection, getDoc, doc } from 'firebase/firestore'
import { styles } from '../styles'
import { ref as tef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase-config';
import Icon from 'react-native-vector-icons/Feather'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Link } from '@react-navigation/native';
import { setSearchedRestaurant, setFoodItemId, setUserProps } from '../redux/action'
import { useLinkTo } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Divider } from 'react-native-elements/dist/divider/Divider';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function FoodScreen({ route, navigation }) {
  const { restId, foodId, restName } = route.params;

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

  const [food, setFood] = useState([]);
  const [price, setPrice] = useState([]);
  const [description, setDescription] = useState([]);
  const [upvotes, setUpvotes] = useState([]);

  //const eatagain = useSelector(state =>state.eatagain)


  const [rating, setRating] = useState([]);
  const [voting, setVoting] = useState();
  const [eatagain, setEatagain] = useState();
  const [upvoteset, setUpvoteSet] = useState(false);


  const [userPhoto, setUserPhoto] = useState('')
  const [loggedIn, setloggedin] = useState(false)
  const [isRestaurant, setIsRestaurant] = useState('')
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')


  // const [selectedRestaurants, setSelectedRestaurants] = useState("")
  const setFoodProps = () => {
    console.log("USER VOTING", userId)
    dispatch(setUserProps(userId, userName, userPhoto))

  }
  const getImage = async () => {
    const imageRestRef = tef(storage, 'imagesRestaurant/' + restId);
    await getDownloadURL(imageRestRef).then((url) => {
      setRestaurantImage(url)
    })

    const imageRef = tef(storage, 'foodImages/' + restName + "/" + foodId);
    await getDownloadURL(imageRef).then((url) => {
      setImage(url)
      setLoading(false);
    })
    const imageRatingRaf = tef(storage, 'foodRatingImage/' + foodId);
    if (imageRatingRaf !== null) {
      await getDownloadURL(imageRatingRaf).then((rateurl) => {
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
  const getFood = async () => {
    const food = ref(database, 'restaurants/' + restId + '/menus/' + foodId);
    onValue(food, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        console.log(data)
        setFood(data.food)
        setPrice(data.price)
        setUpvotes(data.upvotes)
        setDescription(data.description)
        dispatch(setSearchedRestaurant(searchedRestaurant, restaurantDesc, restaurantAddress, restaurantPhone, restaurantId, restaurantColor))

        dispatch(setFoodItemId(foodId, data.food, data.price, data.description, data.upvotes, data.restaurant, data.eatagain))
      }
    })
  }

  useEffect(() => {

    setLoading(true);
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
      } else {
        console.log("No souch document!")
      }
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("confirm", user)
        setloggedin(true)
        const userRef = ref(database, "user/" + user.uid)
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            console.log(data)
            setIsRestaurant(data.hasRestaurant)
            setUserId(data.userId)
            setUserName(data.userName)
            setUserPhoto(data.userPhoto);
            console.log(data.userName)
          }
        });
      } else {
        setloggedin(false);
      }
    })
    getRestaurant();
    getImage();
    getRating();
    getUpVotesUpdate();
    getFood();



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
          onPress: () => {
            upvote(upvotes), navigation.navigate("RatingFood", {
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
  const personaleatagainhandler = ({ item }) => {
    if (item.personaleatagain === 1) {
      return (
        <Text style={{ fontWeight: '500' }}> Yes</Text>
      )
    } else {
      return (
        <Text style={{ fontWeight: '500' }}> No</Text>
      )
    }

  }

  return (
    <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={getRating} />
    }>
      {Platform.OS === 'web' ? (
        <View>
          <View style={[styles.shadowProp, { flexDirection: "row", backgroundColor: "white", zIndex: 1 }]}>
            <TouchableOpacity onPress={() => { navigation.navigate("Home") }}>
              <Image
                style={{
                  justifyContent: 'flex-start',
                  width: 125,
                  height: 70,
                  resizeMode: "contain",
                }}
                source={require('../assets/logo_name_simple.png')} />
            </TouchableOpacity>
            <View style={[styles.shadowProp, { maxWidth: 700, alignSelf: Platform.OS === 'web' ? 'center' : '', width: '100%' }]}>
              <Input
                inputContainerStyle={{ borderBottomWidth: 0, marginBottom: Platform.OS === 'web' ? -15 : -20 }}
                // onChangeText={(text) => searchFilter(text)}
                // value={}
                placeholder="Chicken Tacos..."
                leftIcon={{ type: 'material-community', name: "taco" }}
              />
            </View>

            <View style={{ flexDirection: "row", marginLeft: 'auto' }}>
              <TouchableOpacity
                style={styles.button}
              >
                <Text style={[styles.buttonText, { paddingHorizontal: 10 }]}>Food Search</Text>
              </TouchableOpacity>

            </View>
          </View>
          <ImageBackground style={{ justifyContent: 'center', height: Platform.OS === "web" ? 200 : 100 }} resizeMode="cover" source={{ uri: restaurantImage }}>
            <LinearGradient
              colors={['#00000000', '#000000']}
              style={{ height: '100%', width: '100%', }}>
              <View style={{ width: "100%", maxWidth: 700, flex: 1, alignSelf: 'center' }}>
                <View style={{
                  margin: 10,
                  alignSelf: Platform.OS === "web" ? 'center' : '',
                  flex: 1,
                  justifyContent: "flex-end",
                  marginRight: 'auto',

                }}>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground >
        </View>
      ) : <Icon style={{ padding: 10 }}
        color="black" size={35} name="arrow-left" onPress={() => navigation.goBack()}
      />}

      <View style={{ paddingTop: 20, margin: 10, flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
        <View style={{ borderRadius: 10, overflow: 'hidden', margin: 10, }}>{!loading ?
          (<Image source={{ uri: image }} style={{ width: 400, height: 400, borderRadius: 10, }} />) : (
            <ActivityIndicator size="large" style={{ height: 300 }} color="#F6AE2D" />
          )
        }
        </View>
        <View style={{ margin: 10, flex: 1, maxWidth: 600, minWidth: 300, }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.headerText, { fontSize: 35, maxWidth: 600 }]}>{food}</Text>
            <View style={{ justifyContent: 'center', alignSelf: 'flex-end', right: 10, marginLeft: 'auto' }}>
              {Platform.OS === 'web' ?
                <TouchableOpacity style={{ alignSelf: 'center', }} onPress={() => {
                  setFoodProps(), upvote(upvotes), navigation.navigate("RatingFood", {
                    restId: restId,
                    foodId: foodId,
                    restName: restName
                  })
                }}>
                  <Icon color={restaurantColor} size={35} name="triangle" />
                </TouchableOpacity>
                :
                <TouchableOpacity style={{ alignSelf: 'center', }} onPress={setFoodProps(), leaveAPositiveReview}>
                  <Icon color={restaurantColor} size={35} name="triangle" />
                </TouchableOpacity>
              }

              <Text style={[styles.subHeaderText, { fontSize: 20, alignSelf: 'center' }]}>{voting}</Text>

            </View>
          </View>
          <Text style={{ fontSize: 19, fontWeight: '600' }}>Price: ${price}</Text>
          <Text>{description}</Text>


          <View style={{}}>
            <Text style={{}}>{eatagain} %: would eat again</Text>
            <Button onPress={() => { navigation.navigate("RatingFood", { restId: restId, foodId: foodId, restName: restName }) }} buttonStyle={[styles.button, { backgroundColor: restaurantColor, maxWidth: 300 }]} titleStyle={styles.buttonTitle} title="Rate my Food" />
          </View>
          <Text style={styles.subHeaderText}>Food Ratings: </Text>
          <FlatList
            data={rating}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: '#F2F2F2', borderRadius: 5, padding: 10, margin: 5, shadowRadius: 2, shadowOpacity: 0.4, shadowOffset: { width: 0, height: 1 }, elevation: 2, }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' , margin: 5,marginBottom:10}}>
                  <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={{ uri: item.userPhoto }} />
                  <Text style={{ fontWeight: 'bold', fontSize: 15, marginVertical: 10, marginRight: 'auto', marginHorizontal:10 }}> {item.raters_name} </Text>
                  <Text style={{marginLeft:"auto", marginVertical: 10 }}>{item.rating_date}</Text>
                </View>
                <View style={{margin:10}}>
                <Text style={{ fontWeight: '400' }}>Would you eat again:{personaleatagainhandler({ item })} </Text>
                <Divider style={{ marginTop:10, width:"40%"}}/>
                <Text style={{ marginVertical: 10 }}>{item.rating}</Text>
                <Text style={{ marginTop: 10, fontWeight: "400" }}>{item.restaurant}</Text>
                </View>
              </View>

            )}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}



export default FoodScreen