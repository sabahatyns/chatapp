import { StyleSheet, Image, Text,SafeAreaView, View } from "react-native";
import React, { useState, useEffect } from "react";
//import firebase from "../firebase"
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
// import { useNavigation } from '@react-navigation/native';
import Button1 from "../components/Button1";
import Input from "../components/Input";
// import { Icon } from "react-native-vector-icons/icon";





function Signin({route, navigation, ...props})  {
    const [Email, setEmail] = useState(null);
    const [Password, setPassword] = useState(null);
    const auth = getAuth();
    const onSigninpressed = () => {
        signInWithEmailAndPassword(auth, Email, Password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                alert('user logged in');
                // ...
                navigation.navigate('chat')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);

                // ..
            });



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
                    onPress={() => onSigninpressed()} />
                  <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate('signup')}>
              New Here ? Register
            </Text>

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