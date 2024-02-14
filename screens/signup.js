import { StyleSheet, Image, SafeAreaView, View, Alert } from "react-native";
import React, { useState,useEffect } from "react";
//import firebase from "../firebase"
import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import Button1 from "../components/Button1";
import { useNavigation } from "@react-navigation/native";
import uuid from 'react-native-uuid';
import firestore from '@react-native-firebase/firestore';
import Input from "../components/Input";




function Signup( props) {
    const [Name, setName] = useState(null);
    const [Email, setEmail] = useState(null);
    const [Password, setPassword] = useState(null);
    const [ConfirmPassword, setConfirmPassword] = useState(null);
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
    const registerUser = ()=>{
        const userId= uuid.v4();
        firestore()
        .collection('users')
        .doc(userId)
        .set({
            Name: Name,
            Email: Email,
            Password:Password,
            userId:userId,
        })
        .then(res=>{
            console.log('user created');
            navigation.navigate('signin');
        })
        .catch(error=>{
            console.log(error);
        })
    };
    const validate=()=>{
        let isValid =true;
        if (Name == ""){
            isValid=false;
        }
        if (Email == ""){
            isValid=false;
        }
        if (Password == ""){
            isValid=false;
        }
        if (ConfirmPassword == ""){
            isValid=false;
        }
        if (ConfirmPassword !== Password){
            isValid=false;
        }
        return isValid;
        
    }

    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>

            
                <Image
                source={require("../assets/logo.jpg")}
                style={styles.image}
                />
                <Input placeholder="Name"
                    onChangeText={(t) => setName(t)} />
                <Input placeholder="Email"
                    onChangeText={(t) => setEmail(t)} />
                <Input placeholder="Password"
                    onChangeText={(t) => setPassword(t)} />
                <Input placeholder="Confirm Password"
                    onChangeText={(t) => setConfirmPassword(t)} />


                <Button1 title="Signup"
                    onPress={() =>{
                    if (validate()){
                     registerUser();
                    }
                else{
                    Alert.alert('Please Enter Correct Data');}
                }} />

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