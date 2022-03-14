import React from 'react';
import { Animated, ImageBackground, ActivityIndicator, Dimensions, FlatList, ScrollView, View, TouchableOpacity, Image, StyleSheet, Text, Platform, Linking, Keyboard, BackHandler } from 'react-native';
import { Button, Input } from 'react-native-elements'
import { database } from '../../firebase-config'
import { ref, onValue, orderByValue, equalTo, push, update, set, off } from 'firebase/database'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styles } from '../../styles'
import { setFoodItemId, setSearchedRestaurantImage, setSearchedRestaurant, setUserProps } from '../../redux/action'
import { storage } from '../../firebase-config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { uploadBytes, getDownloadURL, ref as tef } from 'firebase/storage';
import ImagePicker from 'react-native-image-picker';
import { Link } from '@react-navigation/native';
import Card from '../../Components/Card'
import { db, provider, auth } from '../../firebase-config'
import { setDoc, getDoc, doc } from 'firebase/firestore'
import { useLinkTo } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { useFonts } from '@use-expo/font';
import LottieView from 'lottie-react-native';
import Footer from '../../Components/Footer';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Icon } from 'react-native-elements'
import Emoji from 'react-native-emoji';


const MenuWeb = ({ route, navigation }) => {

    let [fontsLoaded] = useFonts({
        'Primary': require('../../assets/fonts/proxima_nova_reg.ttf'),
        'Bold': require('../../assets/fonts/proxima_nova_bold.ttf'),
        'Black': require('../../assets/fonts/proxima_nova_black.otf')
    });


    const [searchedRestaurant, setRestaurantName] = useState([])
    const [restaurantDesc, setRestaurantDesc] = useState([]);
    const [restaurantId, setRestaurantId] = useState([]);
    const [restaurantImage, setRestaurantImage] = useState([]);
    const [restaurantColor, setRestaurantColor] = useState([]);
    const [restaurantPhone, setRestaurantPhone] = useState([]);
    const [restaurant_address, setRestaurantAddress] = useState("");


    const [userSaves, setUserSaves] = useState([]);


    const [loginSession, setLoginSession] = useState('')
    const [accessToken, setAccessToken] = useState('')

    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;

    // const searchedRestaurant = useSelector(state => state.searchedRestaurant)
    // const restaurantDesc = useSelector(state => state.restaurantDesc)
    // const restaurantPhone = useSelector(state => state.restaurantPhone)
    // const restaurantAddress = useSelector(state => state.restaurantAddress)
    // const restaurantId = useSelector(state => state.restaurantId)
    // const restaurantImage = useSelector(state => state.restaurantImage)

    const dispatch = useDispatch();

    const [loggedin, setloggedin] = useState(false);
    const [isRestaurant, setIsRestaurant] = useState(false)
    const [userPhoto, setUserPhoto] = useState('')

    const [userName, setUserName] = useState('')
    const [hoverside, setHoverSide] = useState(false)
    const [hoverside1, setHoverSide1] = useState(false)
    const [hoverside2, setHoverSide2] = useState(false)
    const [hoversid3, setHoverSide3] = useState(false)
    const [regulars, setRegulars] = useState([])
    const [bookmarked, setBookmarked] = useState(false)
    const spring = new Animated.Value(0.3)

    const [loadingbio, setLoadingBio] = useState(true);
    const [loadingPic, setLoadingPic] = useState(true);
    const [restaurantRatings, setRestaurantRatings] = useState([])
    const [newUser, setNewUser] = useState(false);








    useEffect(() => {
        setLoadingBio(true);
        setLoadingPic(true);
        console.log("Mounting")
        onAuthStateChanged(auth, (user) => {
            if (user) {
                if (user.metadata.creationTime === user.metadata.lastSignInTime) {
                    console.log("NEW USER")
                    console.log(user)
                    setNewUser(true);
                } else {
                    console.log("Welcome Back")
                    console.log((new Date().getTime() / 1000) * 1000)
                    setNewUser(false);
                }
                console.log("meta", user.metadata)
                setloggedin(true)
                setLoginSession(user.uid)
                setAccessToken(user.accessToken)
                console.log(user)
                const userRef = ref(database, "user/" + user.uid)
                onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data !== null) {

                        setIsRestaurant(data.hasRestaurant)
                        setUserPhoto(data.userPhoto)
                        setUserName(data.userName)
                    }

                });


            } else {
                setloggedin(false)
            }
        })
    }, [])


    function rateHandler() {
        if (loginSession !== restaurantId) {
            if (loggedin) {
                dispatch(setSearchedRestaurant(searchedRestaurant, restaurantDesc, restaurant_address, restaurantPhone, restaurantId, restaurantColor))
                navigation.navigate("RatingRestaurant", { restaurantId: restaurantId, userId: loginSession })
            } else {
                //googleSignIn();
                navigation.navigate("Login")
            }
        }

        return;

    }

    const [lock, setLock] = useState(false)
    const [canSave, setCanSave] = useState(false);
    function joinSaved(userSaves) {
        setCanSave(false)
        setLock(true)
        console.log("FIREBASE", userSaves)
        update(ref(database, "user/" + loginSession + "/"), {
            userSaves
        });
        update(ref(database, "restaurants/" + restaurantId + "/data"), {
            userSaves
        });


    }
    function newRegularSave() {
        console.log(userSaves.length)
        console.log(restaurantId)
        console.log(lock)
        if (userSaves.length == 0) {
            joinSaved([restaurantId])
        }
        userSaves.map((item, index) => {
            console.log(lock)
            console.log(index)
            if (item == restaurantId) {
                setCanSave(false)
                setLock(true)
                console.log(lock)
                console.log("LOCKEDDDDDDDDD")
                console.log(item)
            }
            if (index == userSaves.length - 1) {
                console.log(lock)
                console.log("end")
                if (lock === true) {
                    console.log(lock)
                    setCanSave(false)
                    setLock(true)
                    console.log("user cannot save")
                }
                if (lock === false) {
                    console.log(lock)
                    console.log(canSave)
                    setCanSave(true)
                    console.log("user can save")
                    joinSaved([...userSaves, restaurantId])
                }
            }
        })
    }

    return (
        <KeyboardAwareScrollView enableOnAndroid extraHeight={120} style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ flex: 1 }}>
                {Platform.OS === 'web' ? (
                    <View style={{ width: '100%', padding: 0, flexDirection: "row", backgroundColor: Platform.OS === "web" ? "white" : "transparent", zIndex: 1 }}>
                        <TouchableOpacity onPress={() => navigation.replace("Home")}>
                            <Image
                                style={{
                                    justifyContent: 'flex-start',
                                    width: 50,
                                    height: 50,
                                    resizeMode: "contain",
                                }}
                                source={require('../../assets/splash.png')} />
                        </TouchableOpacity>

                        {!loggedin ? (

                            // NEED TO BE USER FRIENDLY--- ONLY RESTAURANT FRIENDLY 
                            <View style={{ flexDirection: "row", marginLeft: 'auto' }}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => navigation.navigate("Login")}
                                >
                                    <Text style={[styles.buttonTitle, { paddingHorizontal: 10 }]}>Google Sign In</Text>
                                </TouchableOpacity>
                            </View>

                        ) : (
                            <View style={{ flexDirection: "row", marginLeft: 'auto' }}>

                                {!isRestaurant ?
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate("MenuEdit", {
                                                restId: loginSession

                                            })
                                        }}
                                        style={styles.button}
                                    >
                                        <Text style={[styles.buttonTitle, { paddingHorizontal: 10 }]}>Menu Dashboard</Text>
                                    </TouchableOpacity>
                                    :
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 30 }}>
                                        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                                            <Image
                                                style={{ height: 40, width: 40, borderRadius: 40, marginHorizontal: 10 }}
                                                source={{ uri: userPhoto }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                        )}
                    </View>
                ) : (<></>)
                }
                <View style={{ flexDirection: windowWidth >= 500 ? 'row' : 'column', flexWrap: 'wrap-reverses', margin: 5 }}>
                    {(windowWidth >= 500) ?
                        <View style={{ marginTop: 10, }}>
                            <View style={{ marginBottom: 10, padding: 10, top: (hoverside === true) ? 0 : 3 }}>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <Icon onMouseOver={() => (setHoverSide(true))} onMouseLeave={() => { setHoverSide(false) }}
                                        onPress={() => { navigation.replace("Home") }} type="entypo" name="home" color="#F6AE2D" size={35} />
                                    {hoverside ?
                                        <View style={{ backgroundColor: 'grey', width: "7%", height: "100%", left: 5 }} />
                                        :
                                        <></>
                                    }

                                </View>
                            </View>
                            <View style={{ padding: 10, marginBottom: 10, top: (hoverside1 === true) ? 0 : 3 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon onMouseOver={() => (setHoverSide1(true))} onMouseLeave={() => { setHoverSide1(false) }}
                                        onPress={rateHandler} type="material-community" name="message-draw" color="#F6AE2D" size={35} />
                                    {hoverside1 ?
                                        <View style={{ backgroundColor: 'grey', width: "7%", height: "100%", left: 5 }} /> :
                                        <> </>
                                    }

                                </View>
                            </View>
                            <View style={{ marginBottom: 10, padding: 10, top: (hoverside2 === true) ? 0 : 3 }}>
                                <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                                    {(bookmarked == false) ?
                                        <Icon onPress={newRegularSave} onMouseOver={() => (setHoverSide2(true))} onMouseLeave={() => { setHoverSide2(false) }} type="font-awesome" name="bookmark" color="#F6AE2D" size={35} />
                                        :
                                        <Icon onPress={newRegularSave} onMouseOver={() => (setHoverSide2(true))} onMouseLeave={() => { setHoverSide2(false) }} type="font-awesome" name="bookmark-o" color="#F6AE2D" size={35} />

                                    }
                                    {hoverside2 ?
                                        <View style={{ backgroundColor: 'grey', width: "7%", height: "100%", left: 5 }} /> :
                                        <></>
                                    }

                                </View>
                            </View>
                            <View onMouseOver={() => (setHoverSide3(true))} onMouseLeave={() => { setHoverSide3(false) }} style={{ marginBottom: 10, padding: 10, top: (hoversid3 === true) ? 0 : 3 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon type="fontisto" name="player-settings" color="#F6AE2D" size={35} />
                                    {hoversid3 ?
                                        <View style={{ backgroundColor: 'grey', width: "7%", height: "100%", left: 5 }} /> :
                                        <> </>
                                    }
                                </View>
                            </View>
                        </View>
                        :
                        <View style={{ marginTop: -15, flexDirection: 'row', justifyContent: 'space-around' }}>
                        </View>
                    }
                    <View style={{ flex: 1 }}>
                        {/* <View style={[styles.shadowProp, { backgroundColor: 'white', marginHorizontal: 10, borderRadius: 13, overflow: 'hidden', marginVertical: 10, zIndex: 1, maxWidth: 650 }]}>
                            <Text>Site Guidelines</Text>
                            <Text>These are the official posting guidelines ("Site Guidelines") for www.feiri.app and www.ratemyfood.app website, application or other interactive
                                service ("Site”). The Site is owned, operated and/or provided by Feiri.
                                (“Feiri,""we," "us," or "our") and these Site Guidelines are a part of, and an Additional Terms under, our Terms of Use Agreement.
                                Rate my Food and Feiri is the largest online destination for people to research and rate foods and restaurant in the United States.
                                Our mission is to lead the world to the best virtual interactive menus
                            </Text>
                            <Text>THE SITE/APP</Text>
                            <Text>
                                The Rate my Food website (www.feiri.app and www.ratemyfood.app) and mobile app provide user generated feedback on restaurant's food taste, 
                                execution,and preperation. 
                                 Professor ratings should only be posted by users who have taken a class from the professor or who are currently taking a class with
                                  the professor. For each course a professor teaches, users are limited to posting one (1) comment. Campus ratings should only be posted
                                   by students who have attended or are currently attending the specific course, college or university being rated. Rate My Professors 
                                   is NOT the place to report dangerous, illegal or illicit behaviors. If you believe that you, another professor, or a student is in 
                                   danger, we strongly advise you to report such incidences directly to your campus authorities or local law enforcement.
                                    (For more information and resources, please read here).
                            </Text>
                            <Text>HOW WE WORK</Text>
                            <Text>Rate My Professors has a team of moderators who read every rating submitted. We have defined site guidelines to help 
                                reinforce our mission and most importantly to ensure our decisions around moderation are 100% consistent, regardless of student or 
                                professor. Our moderators are experts on our guidelines and will remove any comment that doesn’t comply.

                                Did we miss something? If you feel an inappropriate comment should be removed from the site, we want to know. You can flag a 
                                comment for re-review and it will immediately be escalated to our moderators. Moderators will determine whether to remove the 
                                rating permanently or restore it to the website. Our moderators will never edit a rating to make it comply or remove a rating 
                                simply because it is a low score or negative review.</Text>
                            <Text>GUIDELINES:</Text>
                            <Text>Student Guidelines:
                                Be honest in your reviews. You want to be able to trust these reviews when evaluating your course options so we ask that to contribute in the same spirit.
                                When you are reviewing a class and/or professor, it’s often helpful to provide both pros and cons. This leads to much more credible and constructive feedback for your peers.
                                Reviews should focus specifically on the course and your learning experience. Do not comment on a Professor’s appearance, dress, age, gender or race.
                                Avoid hearsay. We want you to share your individual experience and what you took away from the course. Don’t speak on behalf of another, encourage others to submit their own reviews.
                                This is not a forum for debate. Reviews that specifically reference another review will be removed. If you do not agree with someone’s individual experience, we encourage you to share your own.
                                We understand that not all teachers are the perfect match for each individual learning style. Tell us how the course or professor wasn’t the best for you in a way that helps others make their own decision.
                                Reviews fueled by anger do not reflect well on the author and can be removed for violations such as profanity. Take a minute to step back and make sure your review will genuinely help others understand your experience.
                                Rate My Professors reserves the right to remove ratings that do not contain substantive comments.
                                We only allow one student to review a professor one time per course. Spamming or dogpiling an account will lead to comment removal and the account being temporarily locked on the site.
                                When reading your fellow students reviews, we encourage you to use your discretion and weigh every review amongst the others. Online reviews should be one of the many resources used when making a decision that affects your academic future.</Text>

                            <Text>
                                Prohibited Content: Comments that contain the following will be removed:
                                Profanity, name-calling, and/or vulgarity, derogatory remarks about religion, ethnicity or race, gender, physical appearance, age, mental and/or physical disabilities;
                                Identifiable information about a professor or student that would allow someone to contact the professor/student outside of their school;
                                References to a professor's or student’s family, personal life and/or sex life, including sexual innuendos;
                                Claims that a professor shows bias for or against a student or specific group of students (For more information and resources, please read here);
                                Claims about a professor's employment status, including previous employment;
                                Claims that a professor or student engages or has engaged in illegal activities;
                                Direct references to other existing comments or comments that have been deleted by our moderators;
                                Accusations that the professor is rating him/herself or his/her colleagues;
                                A language other than English. Comments must be written in English only. French is allowed if you attend a French-Canadian school;
                                Hyperlinks and / or URLs.
                            </Text>
                            <Text>
                                Professor Guidelines:
                                This is an anonymous website where students can share their classroom experiences. We are unable to provide any data or personal information about the submitter of a review.
                                We do not proactively add any professor, course or campus to our website, every profile was submitted by our student community.
                                We are unable to remove a comment simply because it is negative. It will only be removed if it doesn’t comply with our site guidelines.
                                We encourage you to engage with students on the site by creating a Rate My Professors account. With a Professor account, you have the ability to post a reply and get alerted when new ratings are posted on your profile. To create your professor account, get started here.
                                Replies fueled by anger do not reflect well on the author and can be removed for violations such as profanity. Take a minute to step back and make sure your reply will genuinely help others.
                                Rate My Professors' moderation team is unable to prove or disprove details mentioned in a review. We are not arbiters of facts. If you disagree with the details mentioned in a review, see paragraph above regarding managing your profile.
                                If you believe that your profile is being spammed or dogpiled, please tell us. You can contact us here or at support@ratemyprofessors.com. We’re here to help and will happily review the comments in question.
                                While it is against our guidelines for a professor to rate themselves, we recommend for professors to encourage their students to provide ratings each semester. The more reviews you have, the more representative they will be.
                                Professor replies are subject to the same limitations regarding Prohibited Content, as set forth above.

                            </Text>
                            <Text>
                                SOME LEGAL STUFF
                                Rate My Professors occasionally receives removal demands that include threats to sue Rate My Professors. To date, no one has followed through with a lawsuit against us for our reviews.
                                The law protects Rate My Professors from legal responsibility for the content submitted by our users, like the reviews that appear on our site. Specifically, the Communications Decency Act of 1996 (47 U.S.C. Sec. 230) created a federal immunity to any cause of action that would make service providers, like Rate My Professors, liable for information originating with a third-party user of the service.
                                The law is clear on this. Anyone who wishes to sue Rate My Professors for the reviews posted by our members risks penalties imposed by the court. These may include financial sanctions and reimbursement of our attorney's fees for our having to defend against a lawsuit that ignores obvious legal protections for Rate My Professors.
                                If, despite our caution, you feel that legal action is the only recourse for you, our address for service of legal process is:
                                Cheddar, Inc.
                                1 State Street
                                New York, NY 10004
                                If you intend to serve documents on Cheddar, Inc., please make sure that service is properly effected in the US in accordance with all applicable law. We are not obligated to respond if service is not valid.
                                These guidelines are provided for informational purposes only and do not constitute legal advice. While we stand by our guidelines, you are encouraged to seek advice from an attorney who is competent in the relevant field of law.
                            </Text>
                            <Text>
                                RESERVATION OF RIGHTS
                                The Site reserves the right to remove any comments deemed as inappropriate, libelous, defamatory, indecent, vulgar or obscene, pornographic, sexually explicit or sexually suggestive, racially, culturally, or ethnically offensive, harmful, harassing, intimidating, threatening, hateful, objectionable, discriminatory, or abusive, or which may or may not appear to impersonate anyone else or that otherwise violate the Terms of Use Agreement.
                                The Site reserves the right to remove, provide to authorities or otherwise take appropriate action regarding comments that threaten violence or bodily harm to another user or professor including, but not limited to, notifying the authorities of your IP address, where available, and the time you rated and taking any action as described in the Terms of Use Agreement and Privacy Policy.
                            </Text>
                        </View> */}
                    </View>
                </View>
                <View style={{ marginTop: "20%" }}>
                    <Footer />
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default MenuWeb