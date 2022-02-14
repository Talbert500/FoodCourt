import { Modal, Alert, TextInput, RefreshControl, Dimensions, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { styles } from '../../styles'
import { Button, Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Feather'
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;



function SignUp({navigation}){

return(
    <View style={{flex:1,backgroundColor:'#F7931E', borderRadius:30 , margin: Platform.OS ==="web"? 10 : 0 }}>
      {Platform.OS === 'web' ? 
      <TouchableOpacity
        onPress={()=>{navigation.goBack()}}
        style={[styles.button, { marginRight: "70%" }]}>

        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity> :
        <Icon style={{ paddingTop: 30, margin: 10 }}
          color="black" size={35}
          name="arrow-left"
          onPress={() => { navigation.goBack() }} />}
          <View style= {{justifyContent:'flex-end', flex:1}}>
    <Text style = {{padding:12,color:'white', fontSize:20, textAlign:'center',fontWeight:'600'}}>Give confidence to your customers who buy your food.</Text>
    <TouchableOpacity
            onPress={()=>navigation.navigate("WelcomeScreen")}
            style={[styles.button,{marginHorizontal:"20%", margin:20}]}
          >
            <Text style={[styles.buttonText, { textAlign:'center', color:"white"}]}>Continue</Text>
          </TouchableOpacity>
    <Image
      style={{
        width:windowWidth,
        marginTop: Platform.OS === 'web' ? "0%" : "30%",
        justifyContent:'center',
        alignSelf:"center",
        marginBottom:5
      }}
      source={require('../../assets/welcome.png')}
    />
    </View>
    </View>
)
}


export default SignUp