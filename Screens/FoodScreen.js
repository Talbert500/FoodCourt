
import { ImageBackground, Alert, RefreshControl, ScrollView, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, ActivityIndicator, Text, View, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, Input } from 'react-native-elements'
import { database } from '../firebase-config'
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, update, onValue, increment, push } from 'firebase/database'
import { styles } from '../styles'
import { ref as tef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, provider, db, auth } from '../firebase-config';
//import Icon from 'react-native-vector-icons/Feather'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Link } from '@react-navigation/native';
import { setSearchedRestaurant, setFoodItemId, setUserProps } from '../redux/action'
import { useLinkTo } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { Icon } from 'react-native-elements'
import { setDoc, getDoc, doc } from 'firebase/firestore'
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

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
  const [userName, setName] = useState('')
  const [userId, setUserId] = useState("")
  const [reviewResponse, setReviewResponse] = useState([])

  const [like, setLiked] = useState(false);
  const [dislike, setDisliked] = useState(false)
  const [current, setCurrent] = useState("");
  const [ratingid, setRatingId] = useState('')
  const [ratingHistory, setRatingHistory] = useState([])

  const [imageReviews, setImageReviews] = useState(false)
  const [reviewId, setReviewId] = useState()
  const [rateMyFood, setRateMyFood] = useState(false)

  const [restaurantLiked, setRestaurantLiked] = useState(false)


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

  }


  const getRating = async () => {
    setRefreshing(false);
    const getRatings = ref(database, "restaurants/" + restId + "/ratings/" + foodId);
    onValue(getRatings, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        console.log(data)
        setRating("")
        Object.values(data).map((ratingData) => {
          setRating((rate) => [...rate, ratingData]);
          setRatingHistory((rate) => [...rate, ratingData.reviewResponse]);
          setRefreshing(false);
        })
      }
    })
  }
  const getFood = async () => {
    const food = ref(database, 'restaurants/' + restId + '/foods/' + foodId);
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
      console.log(user)
      if (user) {
        setloggedin(true)
        setName(user.displayName)
        setUserId(user.uid)
        setUserPhoto(user.photoURL)

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
    getUpVotesUpdate();
    setUpvoteSet(true);
    if (loggedIn == false) {
      update(ref(database, "restaurants/" + restId + "/foods" + "/" + foodId), {
        upvotes: increment(1),
      });
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
          console.log(user)
          setloggedin(true);
          setUserId(user.uid)
          setUserPhoto(user.photoURL)
          dispatch(setUserProps(user.email, user.displayName, user.photoURL))
          //Storing user data

          setDoc(doc(db, "users", user.email), {
            userEmail: user.email,
            userName: user.displayName,
            userId: user.uid,
            user_date_add: user.metadata.creationTime,
            last_seen: user.metadata.lastSignInTime,
            userPhone: user.phoneNumber,
          }).catch((error) => {
            const errorCode = error.code;
            console.log("ERROR", errorCode)
          })
          //Also storing but tracked user data in realtime
          set(ref(database, "user/" + user.uid), {
            userEmail: user.email,
            userName: user.displayName,
            userId: user.uid,
            user_date_add: user.metadata.creationTime,
            last_seen: user.metadata.lastSignInTime,
            userPhone: user.phoneNumber,
            hasRestaurant: "false",
            userPhoto: user.photoURL
          });

        }).catch((error) => {
          const errorCode = error.code;
          const email = error.email;
          const credential = GoogleAuthProvider.credentialFromResult(error);
          console.log(credential, errorCode)
        })
    }
    if (loggedIn == true) {
      if (restaurantLiked == false ) {
        update(ref(database, "restaurants/" + restId + "/foods" + "/" + foodId), {
          upvotes: increment(1),
        });
      }else{
        update(ref(database, "restaurants/" + restId + "/foods" + "/" + foodId), {
          upvotes: increment(-1),
        });
        setRestaurantLiked(false);
      }


    }
  }
  const getUpVotesUpdate = async () => {
    const getUpvotes = ref(database, "restaurants/" + restId + "/foods" + "/" + foodId);
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
        <Text style={{ fontWeight: "500" }}> Yes</Text>
      )
    } else {
      return (
        <Text style={{ fontWeight: "500" }}> No</Text>
      )
    }

  }

  const googleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user)
        setloggedin(true);
        setUserId(user.uid)
        setUserPhoto(user.photoURL)
        dispatch(setUserProps(user.email, user.displayName, user.photoURL))
        //Storing user data
        setDoc(doc(db, "users", user.email), {
          userEmail: user.email,
          userName: user.displayName,
          userId: user.uid,
          user_date_add: user.metadata.creationTime,
          last_seen: user.metadata.lastSignInTime,
          userPhone: user.phoneNumber,
        }).catch((error) => {
          const errorCode = error.code;
          console.log("ERROR", errorCode)
        })
        //Also storing but tracked user data in realtime
        set(ref(database, "user/" + user.uid), {
          userEmail: user.email,
          userName: user.displayName,
          userId: user.uid,
          user_date_add: user.metadata.creationTime,
          last_seen: user.metadata.lastSignInTime,
          userPhone: user.phoneNumber,
          hasRestaurant: "false",
          userPhoto: user.photoURL
        });


      }).catch((error) => {
        const errorCode = error.code;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromResult(error);
        console.log(credential, errorCode)
      })

  }


  const renderReviews = ({ item, index }) => {

    return (
      <TouchableOpacity onPress={() => { setImageReviews((e) => !e), setReviewId(index) }}>
        <View style={{ backgroundColor: '#F2F2F2', borderRadius: 5, padding: 10, margin: 5, shadowRadius: 2, shadowOpacity: 0.4, shadowOffset: { width: 0, height: 1 }, elevation: 2, }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 5, marginBottom: 10 }}>
            {item.userPhoto === "" ?
              <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={require("../assets/guestphoto.jpg")} />
              :
              <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={{ uri: item.userPhoto }} />
            }
            <Text style={{ fontWeight: "bold", fontSize: 15, marginVertical: 10, marginRight: 'auto', marginHorizontal: 10 }}> {item.raters_name} </Text>
            <Text style={{ marginLeft: "auto", marginVertical: 10 }}>{item.rating_date}</Text>
          </View>
          <View style={{ margin: 10 }}>
            <Text style={{ fontWeight: "400" }}>Would you eat again: {personaleatagainhandler({ item })} </Text>
            <Divider style={{ marginTop: 10, width: "40%" }} />
            <Text style={{ marginVertical: 10 }}>{item.rating}</Text>
            <View style={{ margin: 10, justifyContent: 'flex-end' }}>
              {imageReviews && index == reviewId ?
                <Image style={{ height: item.imageUrl == null ? 0 : 200, width: item.imageUrl == null ? 0 : 200 }} source={{ uri: item.imageUrl }} />
                :
                <Image style={{ height: item.imageUrl == null ? 0 : 100, width: item.imageUrl == null ? 0 : 100 }} source={{ uri: item.imageUrl }} />
              }
              {item.imagueUrl == null ? <></>
                :
                <Text>Click To Expand</Text>
              }
            </View>
            {/* <View style={{ flexDirection: 'row' }}>
              <Text>{item.likes}</Text>
              <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => (setRatingId(item.review_id), console.log(index), liked(item))}>
                <Icon color="black" size={15} type="ant-design" name={ratingid == item.review_id && like ? "like1" : "like2"} />
              </TouchableOpacity>

              <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => (disliked(item), setRatingId(item.review_id))}>
                <Icon color="black" size={15} type="ant-design" name={ratingid == item.review_id && dislike ? "dislike1" : "dislike2"} />
              </TouchableOpacity>
            </View> */}
            <Text style={{ marginTop: 10, fontWeight: "400" }}>{item.restaurant}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }


  return (
    <View>
      <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={getRating} />
      }>
        {Platform.OS === 'web' ? (
          <View>
            <View style={[styles.shadowProp, { flexDirection: "row", backgroundColor: "white", zIndex: 1, padding: 10, alignContent: 'center', alignItems: 'center', }]}>
              <TouchableOpacity onPress={() => { navigation.navigate("RestaurantWeb", { restId: restId }) }}>
                <Icon color="black" size={35} type="material" name="arrow-back" />
              </TouchableOpacity>
              <Text style={{ alignItems: 'center', alignContent: 'center', fontWeight: '500' }}> View Main Menu</Text>
            </View>
            <ImageBackground style={{ position: 'absolute', justifyContent: 'center', height: Platform.OS === "web" ? 300 : 100, width: '100%' }} resizeMode="cover" source={{ uri: restaurantImage }}>
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
        ) :
          <Icon style={{ padding: 10 }}
            color="black" size={35} type="feather" name="arrow-left" onPress={() => navigation.goBack()}
          />
        }

        <View style={[styles.shadowProp, { paddingTop: 20, margin: 10, flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', backgroundColor: "rgba(255, 255, 255, 0.8)", maxWidth: 850, alignSelf: 'center', borderRadius: 10 }]}>
          <View style={{ borderRadius: 5, overflow: 'hidden', margin: 10, }}>
            {!loading ?
              (
                <View style={styles.shadowProp}>
                  <Image resizeMode='cover' defaultSource={{ uri: restaurantImage }} source={{ uri: image }} style={{ width: windowWidth >= 800 ? 375 : 350, height: windowWidth >= 800 ? 375 : 350, borderRadius: 5, }} />
                </View>
              ) : (
                <ActivityIndicator size="large" style={{ height: 300 }} color="#F6AE2D" />
              )
            }
          </View>
          <View style={{ margin: 10, flex: 1, maxWidth: 600, minWidth: 300 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.headerText, { fontSize: 35, maxWidth: 600 }]}>{food}</Text>
              <View style={{ justifyContent: 'center', alignSelf: 'flex-end', right: 5, marginLeft: 'auto' }}>
                {Platform.OS === 'web' ?
                  <View style={{ flex: 1, marginHorizontal: 10 }}>
                    {(loggedIn) ?
                      <View>
                        {(restId === userId) ?
                          <TouchableOpacity style={{ alignSelf: 'center', }} onPress={() => { console.log("you cannot vote for your own restaurant") }}>
                            <Icon color={restaurantColor} size={35} type="ant-design" name={restaurantLiked == false ? "hearto" : "heart"} />
                          </TouchableOpacity>
                          :
                          <TouchableOpacity style={{ alignSelf: 'center', }} onPress={() => {
                            setFoodProps(), setRestaurantLiked(true), upvote(upvotes)
                          }}>
                            <Icon color={restaurantColor} size={35} type="ant-design" name={restaurantLiked == false ? "hearto" : "heart"} />
                          </TouchableOpacity>

                        }
                      </View>
                      :
                      <View>
                        {(restId === userId) ?
                          <TouchableOpacity onPress={() => { navigation.navigate("Login") }} style={{ alignSelf: 'center', }}>
                            <Icon color={restaurantColor} size={35} type="ant-design" name="heart" />
                          </TouchableOpacity> :
                          <TouchableOpacity onPress={() => { navigation.navigate("Login") }} style={{ alignSelf: 'center', }}>
                            <Icon color={restaurantColor} size={35} type="ant-design" name="heart" />
                          </TouchableOpacity>
                        }
                      </View>
                    }
                  </View>
                  :
                  <TouchableOpacity style={{ alignSelf: 'center', }} onPress={{ setFoodProps, leaveAPositiveReview }}>
                    <Icon color={restaurantColor} size={35} name="heart" />
                  </TouchableOpacity>
                }

                <Text style={[styles.subHeaderText, { fontSize: 20, alignSelf: 'center' }]}>{voting}</Text>

              </View>
            </View>
            <Text style={{ fontSize: 20, fontWeight: "600" }}>Price: ${price}</Text>
            <Text>{description}</Text>
            <View>
              <Text style={{ marginVertical: 10, fontSize: 18 }}>{eatagain} % would eat again</Text>
              {(loggedIn) ?
                <View>
                  {(restId !== userId) ?
                    <Button onPress={() => { navigation.navigate("RatingFood", { restId: restId, foodId: foodId, restName: restName }) }} buttonStyle={[styles.button, { backgroundColor: restaurantColor, maxWidth: 300 }]} titleStyle={styles.buttonTitle} title="Rate my Food" />
                    :
                    <Button buttonStyle={[styles.button, { backgroundColor: restaurantColor, maxWidth: 300, opacity: 0.5 }]} titleStyle={styles.buttonTitle} title="Rate my Food" />
                  }
                </View>
                :
                <View>
                  {(restId !== userId) ?
                    <Button onPress={() => navigation.navigate("Login")} buttonStyle={[styles.button, { backgroundColor: restaurantColor, maxWidth: 300 }]} titleStyle={styles.buttonTitle} title="Rate my Food" />
                    :
                    <Button onPress={() => navigation.navigate("Login")} buttonStyle={[styles.button, { backgroundColor: restaurantColor, maxWidth: 300 }]} titleStyle={styles.buttonTitle} title="Rate my Food" />
                  }
                </View>
              }
            </View>

            <Text style={styles.subHeaderText}>Food Ratings:</Text>
            {/* <Button onPress{} =title="debug"/> */}
            <FlatList
              data={rating}
              keyExtractor={(item, index) => index}
              renderItem={renderReviews}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}



export default FoodScreen