import { StyleSheet, Image, SafeAreaView, View } from "react-native";
import React, { useState,useEffect } from "react";
//import firebase from "../firebase"
import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import Button1 from "../components/Button1";
import { useNavigation } from "@react-navigation/native";

import Input from "../components/Input";




function Signup( props) {
    const [Email, setEmail] = useState(null);
    const [Password, setPassword] = useState(null);
    const auth = getAuth();
    const onSignuppressed = () => {
        createUserWithEmailAndPassword(auth, Email, Password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                alert('user created');
                // ...
                props.navigation.navigate('signin')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
                props.navigation.navigate('signin')

                // ..
            });



    }
    const navigation = useNavigation();

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


                <Button1 title="Signup"
                    onPress={() => onSignuppressed()} />

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

    linearGradient: {
        flex: 1,
        width: '100%',
        height: '100%',
        opacity: 0.95,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 25,
    },


});
export default Signup;