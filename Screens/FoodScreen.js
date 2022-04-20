
import { ImageBackground, Alert, RefreshControl, ScrollView, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, ActivityIndicator, Text, View, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, Input } from 'react-native-elements'
import { database } from '../firebase-config'
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, update, onValue, get, push } from 'firebase/database'
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
import { useFonts } from "@use-expo/font";


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function FoodScreen({ route, navigation }) {
  const { restId, foodId, restName } = route.params;
  let [fontsLoaded] = useFonts({
    'Primary': require('../assets/fonts/proxima_nova_reg.ttf'),
    'Bold': require('../assets/fonts/proxima_nova_bold.ttf'),
    'Black': require('../assets/fonts/proxima_nova_black.otf')
  });
  const dispatch = useDispatch();
  const linkTo = useLinkTo();
  const [image, setImage] = useState()
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
  const [category, setCategory] = useState([]);
  const [price, setPrice] = useState([]);
  const [description, setDescription] = useState([]);
  const [upvotes, setUpvotes] = useState([]);
  const [newUpvotes, setNewUpvotes] = useState([]);

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

  const [appearance, setAppearance] = useState(0);
  const [taste, setTaste] = useState(0);
  const [execution, setExecution] = useState(0);

  const [imageReviews, setImageReviews] = useState(false)
  const [reviewId, setReviewId] = useState()
  const [rateMyFood, setRateMyFood] = useState(false)

  const [restaurantLiked, setRestaurantLiked] = useState(false)

  const [defaultRating, setDefaultRating] = useState(3);
  // To set the max number of Stars
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  // Filled Star. You can also give the path from local
  //source={require("../assets/guestphoto.jpg")}
  const starImageFilled = require('../assets/review_filled.png');
  // Empty Star. You can also give the path from local
  const starImageCorner = require('../assets/review_outline.png');
  // const [selectedRestaurants, setSelectedRestaurants] = useState("")



  const CustomRatingBar = () => {
    const overallRating = (Math.floor(appearance * 0.15 + execution * 0.35 + taste * 0.5) / rating.length);
    console.log(overallRating)
    if (overallRating >= 0) {
      update(ref(database, "restaurants/" + restId + "/foods" + "/" + foodId), {
        overall: overallRating
      });
    }

    return (
      <View style={{ justifyContent: 'left', flexDirection: 'row' }}>
        {maxRating.map((item, key) => {
          return (
            <View
              activeOpacity={0.7}
              key={item}>
              <Image
                style={{
                  width: 30, height: 30, resizeMode: 'contain', margin: 1
                }}
                source={
                  item <= (Math.floor(appearance * 0.15 + execution * 0.35 + taste * 0.5) / rating.length)
                    ? starImageFilled
                    : starImageCorner
                }
              />
            </View>
          );
        })}
      </View>
    );
  };

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

      update(ref(database, "restaurants/" + restId + "/foods/" + foodId), {
        imageUrl:url,
      })
      setLoading(false);
    })


  }


  const getRating = async () => {
    setRefreshing(false);
    const getRatings = ref(database, "restaurants/" + restId + "/ratings/" + foodId);
    get(getRatings).then((snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        console.log(data)
        setRating("")
        Object.values(data).map((ratingData) => {
          setRating((rate) => [...rate, ratingData]);
          setRatingHistory((rate) => [...rate, ratingData.reviewResponse]);
          setRefreshing(false);
          setAppearance(prevState => prevState + ratingData.appearance)
          setExecution(prevState => prevState + ratingData.execution)
          setTaste(prevState => prevState + ratingData.taste)
          console.log(appearance)
          // setDefaultRating(appearance)
          console.log("Appearance:", ratingData.appearance)
          console.log("Execution:", ratingData.execution)
          console.log("Taste:", ratingData.taste)
        })
      }
    }).then(() => {
      addOverall();
      console.log("Complete")
    })
  }

  const addOverall = () => {
  }
  const getFood = async () => {


    const food = ref(database, 'restaurants/' + restId + '/foods/' + foodId);
    onValue(food, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        console.log(data)
        setFood(data.food)
        setCategory(data.category)
        setPrice(data.price)
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
    // setUpvoteSet(true);

    // if (loggedIn == false) {
    //   update(ref(database, "restaurants/" + restId + "/foods" + "/" + foodId), {
    //     upvotes
    //   });
    //   signInWithPopup(auth, provider)
    //     .then((result) => {
    //       const credential = GoogleAuthProvider.credentialFromResult(result);
    //       const token = credential.accessToken;
    //       const user = result.user;
    //       console.log(user)
    //       setloggedin(true);
    //       setUserId(user.uid)
    //       setUserPhoto(user.photoURL)
    //       dispatch(setUserProps(user.email, user.displayName, user.photoURL))
    //       //Storing user data

    //       setDoc(doc(db, "users", user.email), {
    //         userEmail: user.email,
    //         userName: user.displayName,
    //         userId: user.uid,
    //         user_date_add: user.metadata.creationTime,
    //         last_seen: user.metadata.lastSignInTime,
    //         userPhone: user.phoneNumber,
    //       }).catch((error) => {
    //         const errorCode = error.code;
    //         console.log("ERROR", errorCode)
    //       })
    //       //Also storing but tracked user data in realtime
    //       set(ref(database, "user/" + user.uid), {
    //         userEmail: user.email,
    //         userName: user.displayName,
    //         userId: user.uid,
    //         user_date_add: user.metadata.creationTime,
    //         last_seen: user.metadata.lastSignInTime,
    //         userPhone: user.phoneNumber,
    //         hasRestaurant: "false",
    //         userPhoto: user.photoURL
    //       });

    //     }).catch((error) => {
    //       const errorCode = error.code;
    //       const email = error.email;
    //       const credential = GoogleAuthProvider.credentialFromResult(error);
    //       console.log(credential, errorCode)
    //     })
    // }
    // if (loggedIn == true) {
    //   if (restaurantLiked == false) {
    //     setNewUpvotes([...upvotes, userId ])
    //     console.log("added", upvotes)
    //     update(ref(database, "restaurants/" + restId + "/foods" + "/" + foodId ), {
    //       upvotes:upvotes
    //     });

    //     getUpVotesUpdate();
    //   } else {
    //     setNewUpvotes([...upvotes, userId ])
    //     update(ref(database, "restaurants/" + restId + "/foods" + "/" + foodId), {
    //       upvotes:upvotes
    //     });
    //     getUpVotesUpdate();

    //     setRestaurantLiked(false);
    //   }


    // }
  }
  const getUpVotesUpdate = async () => {
    const getUpvotes = ref(database, "restaurants/" + restId + "/foods" + "/" + foodId);
    onValue(getUpvotes, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        console.log("firebase upvotes", data.upvotes)
        setUpvotes(data.upvotes)
        //console.log(upvotes.length)
        //setVoting(data.upvotes.length)
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



  const renderReviews = ({ item, index }) => {

    return (
      <TouchableOpacity>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 5, marginBottom: 10 }}>
            {item.userPhoto == null ?
              <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={require("../assets/guestphoto.jpg")} />
              :
              <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={{ uri: item.userPhoto }} />
            }
            <Text style={{ fontWeight: "bold", fontSize: 15, marginVertical: 10, marginRight: 'auto', marginHorizontal: 10 }}> {item.raters_name} </Text>
            <Text style={{ marginLeft: "auto", marginVertical: 10 }}>{item.rating_date}</Text>
          </View>
          <View style={{ margin: 10 }}>
            <Text style={{ fontWeight: "400" }}>Would you eat again: {personaleatagainhandler({ item })} </Text>
            <Text style={{ marginVertical: 10 }}>{item.rating}</Text>
            <View style={{ margin: 10, justifyContent: 'flex-end' }}>
              {imageReviews && index == reviewId ?
                <Image style={{ height: item.imageUrl == null ? 0 : 200, width: item.imageUrl == null ? 0 : 200 }} source={{ uri: item.imageUrl }} />
                :
                <Image style={{ height: item.imageUrl == null ? 0 : 100, width: item.imageUrl == null ? 0 : 100 }} source={{ uri: item.imageUrl }} />
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
        <Divider style={{ marginVertical: 10 }} />
      </TouchableOpacity>
    )
  }

  const renderReviewImages = ({ item, index }) => {

    if (item.imageUrl != null) {
      return (
        <View>
          <ImageBackground style={{ overflow: 'hidden', width: (windowWidth >= 500) ? 200 : 300, height: Platform.OS === "web" ? (windowWidth >= 500) ? 200 : 400 : 400, margin: 5 }} resizeMode="cover" source={{ uri: item.imageUrl }} >

            <View style={{ justifyContent: 'flex-end', marginTop: "auto" }}>
            </View>

          </ImageBackground>
          <View style={{ margin: 5 }}>
            {/* <Divider style={{ marginTop: 10, width: "40%" }} /> */}
            <Text style={{ marginVertical: 10 }}>{item.rating}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 5, marginBottom: 10 }}>
            {item.userPhoto == null ?
              <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={require("../assets/guestphoto.jpg")} />
              :
              <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={{ uri: item.userPhoto }} />
            }
            <Text style={{ fontWeight: "bold", fontSize: 15, marginVertical: 0, marginRight: 'auto', marginHorizontal: 2 }}> {item.raters_name} </Text>
            {/* <Text style={{ marginLeft: "auto", marginVertical: 10 }}>{item.rating_date}</Text> */}
          </View>
        </View>
      )
    }

  }

  return (

    <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={getRating} />
    }>
      {Platform.OS === 'web' ? (
        <View>
          <View style={[styles.shadowProp, { flexDirection: "row", backgroundColor: "white", zIndex: 1, padding: 10, alignContent: 'center', alignItems: 'center', }]}>
            <TouchableOpacity onPress={() => { navigation.replace("RestaurantWeb", { restId: restId }) }}>
              <Icon color="black" size={35} type="material" name="arrow-back" />
            </TouchableOpacity>
            <Text style={{ fontFamily: 'Primary', alignItems: 'center', alignContent: 'center', fontWeight: '500' }}> View Main Menu</Text>
          </View>
        </View>
      ) :
        <Icon style={{ padding: 10 }}
          color="black" size={35} type="feather" name="arrow-left" onPress={() => navigation.goBack()}
        />
      }
      <View style={{ flexDirection: 'row', flexWrap: 'wrap-reverse', maxWidth: 800, alignSelf: Platform.OS === 'web' ? 'center' : '', width: '100%', padding: 10 }}>
        {/* <View>
          <Text>Nutrition Facts</Text>
        </View> */}
        <View style={{ flex: 2 }}>
          <View style={[styles.shadowProp, { paddingTop:  windowWidth >= 800 ? 10: 20, margin: 5, flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', backgroundColor: 'white', maxWidth: 850 }]}>
            <View style={{overflow: 'hidden', margin: 10,borderRadius:2 }}>
              {!loading ?
                (
                  <View>
                    {image != null ?
                      <Image resizeMode='cover' defaultSource={{ uri: restaurantImage }} source={{ uri: image }} style={{width: windowWidth >= 800 ? 350 : (windowWidth - 35), height: windowWidth >= 800 ? 350 : (windowWidth - 35),overflow:"hidden"}} />
                      :
                      <>
                      </>
                    }
                  </View>
                ) : (
                  <ActivityIndicator size="large" style={{ height: 300 }} color="#F6AE2D" />
                )
              }
            </View>
            <View style={{ margin: 10, flex: 1, maxWidth: 600, minWidth: 300 }}>

              <View style={{ flexDirection: 'row' }}>
                <View>
                  <Text style={[styles.headerText, { fontFamily: 'Primary', fontSize: 35, maxWidth: 600 }]}>{food}</Text>
                  <Text style={[styles.headerText, { fontFamily: 'Primary', fontSize: 22, maxWidth: 600 }]}>{category}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CustomRatingBar />
                    <Text style={{ fontFamily: 'Bold' }}>{rating.length} Reviews</Text>
                  </View>
                </View>
                <View style={{ justifyContent: 'center', alignSelf: 'flex-end', right: 5, marginLeft: 'auto' }}>
                  {/* {Platform.OS === 'web' ?
                    <View style={{ flex: 1, marginHorizontal: 10 }}>
                      {(loggedIn) ?
                        <View>
                          {(restId === userId) ?
                            <TouchableOpacity style={{ alignSelf: 'center', }} onPress={() => { console.log("you cannot vote for your own restaurant") }}>
                              <Icon color={restaurantColor} size={35} type="ant-design" name={restaurantLiked == false ? "hearto" : "heart"} />
                              <Text>{upvotes}</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={{ alignSelf: 'center', }} onPress={() => {
                              setFoodProps(), setRestaurantLiked(true), upvote(upvotes)
                            }}>
                              <Icon color={restaurantColor} size={35} type="ant-design" name={restaurantLiked == false ? "hearto" : "heart"} />
                              <Text>{upvotes}</Text>
                            </TouchableOpacity>

                          }
                        </View>
                        :
                        <View>
                          {(restId === userId) ?
                            <TouchableOpacity onPress={() => { navigation.navigate("Login") }} style={{ alignSelf: 'center', }}>
                              <Icon color={restaurantColor} size={35} type="ant-design" name="heart" />
                              <Text>{upvotes}</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity onPress={() => { navigation.navigate("Login") }} style={{ alignSelf: 'center', }}>
                              <Icon color={restaurantColor} size={35} type="ant-design" name="heart" />
                              <Text>{upvotes}</Text>
                            </TouchableOpacity>
                          }
                        </View>
                      }
                    </View>
                    :
                    <TouchableOpacity style={{ alignSelf: 'center', }} onPress={{ setFoodProps, leaveAPositiveReview }}>
                      <Icon color={restaurantColor} size={35} name="heart" />
                      <Text>{upvotes}</Text>
                    </TouchableOpacity>
                  } */}

                  {/* <Text style={[styles.subHeaderText, { fontSize: 20, alignSelf: 'center' }]}>{voting}</Text> */}

                </View>
              </View>
              <Text style={{ fontFamily: 'Primary', fontSize: 20, fontWeight: "600" }}>Price: ${price}</Text>
              <Text>{description}</Text>
              <View>
                <Text style={{ fontFamily: 'Primary', marginVertical: 10, fontSize: 18 }}>{eatagain} % would eat again</Text>
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
            </View>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <View style={[styles.shadowProp, { padding: 20, margin: 5, flex: 1, backgroundColor: 'white', minWidth: 300, maxWidth: 500 }]}>
              <Text style={{ fontFamily: 'Bold', fontSize: 20 }}>
                Rating and reviews
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Bold' }}>
                  {/*To show the rating selected*/}
                  {((appearance * 0.15 + execution * 0.35 + taste * 0.5) / rating.length).toFixed(1)} / {Math.max.apply(null, maxRating)}
                </Text>
                <CustomRatingBar />
                <Text style={{ fontFamily: 'Bold' }}>{rating.length} Reviews</Text>
              </View>
              <Text>Based on world class judging criteria by the people for the people. </Text>
              <View style={{ marginVertical: 10 }}>
                <Text>#1 in your area</Text>
                <Text style={{ marginBottom: 10 }}>Details</Text>
                <Text style={{ marginBottom: 10 }}>Cuisine</Text>
                <Text style={{ marginBottom: 10 }}>Tags</Text>
              </View>
            </View>

            <View style={[styles.shadowProp, { padding: 20, margin: 5, backgroundColor: 'white', flex: 1, minWidth: 300, maxWidth: 700 }]}>
              <Text style={{ fontFamily: 'Bold', fontSize: 20 }}>
                Reviews with Images
              </Text>
              <FlatList
                horizontal
                data={rating}
                keyExtractor={(item, index) => index}
                renderItem={renderReviewImages}
              />
            </View>

          </View>
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.subHeaderText}>Food Reviews:</Text>
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
            <Divider style={{ marginVertical: 10 }} />
            {/* <Button onPress{} =title="debug"/> */}
            <FlatList
              data={rating}
              keyExtractor={(item, index) => index}
              renderItem={renderReviews}
            />
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>

  );
}



export default FoodScreen