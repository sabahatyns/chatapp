import { StyleSheet, Image, Text,SafeAreaView,Alert, View } from "react-native";
import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// import { useNavigation } from '@react-navigation/native';
import Button1 from "../components/Button1";
import Input from "../components/Input";
import Loader from "../components/loader";

// import { Icon } from "react-native-vector-icons/icon";





function Signin({route, navigation, ...props})  {
    const [Email, setEmail] = useState(null);
    const [Password, setPassword] = useState(null);
    const [visible, setvisible] = useState(null);
    const auth = getAuth();
    const onSigninpressed = () => {
        setvisible(true);
        signInWithEmailAndPassword(auth, Email, Password)
            .then((userCredential) => {
                setvisible(false);

                // Signed up 
                const user = userCredential.user;
                alert('user logged in');
                // ...
                navigation.navigate('main')
            })
            .catch((error) => {
                setvisible(false);
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);

                // ..
            });



    }
    const loginUser =()=>{
        firestore()
  .collection('Users')
  // Filter results
  .where('Email', '==', Email)
  .get()
  .then(res => {
   console.log(JSON.stringify(res.docs))
   navigation.navigate('main')

//     if (res.docs != []){
//         console.log(JSON.stringify(res.docs[0].data()))
//     }
//     else{
//         Alert.alert('User Not Found')
//     }
 }
)
  .catch(error =>{
    console.log(error)
   //Alert.alert('User Not Found')


  })
    }
   
    // const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>

            
                <Image
                source={require("../assets/logo.jpg")}
                style={styles.image}
                />
                <Input placeholder="Email"
                    onChangeText={(t) => setEmail(t)} />
                <Input placeholder="Password"
                    onChangeText={(t) => setPassword(t)} />


                <Button1 title="Sign in"
                    onPress={() => loginUser()} />
                  <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate('signup')}>
              New Here ? Register
            </Text>
<Loader visible={visible}/>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',

    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 25,

    },
    registerTextStyle: {
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'center',
        padding: 10,
      },


});
export default Signin;