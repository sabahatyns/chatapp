import { View, Text, StyleSheet, TextInput } from "react-native";
import React from 'react';

const Input = ({ placeholder, onChangeText }) => {
    return (
        <View style={style.container}>
            <TextInput 
                placeholder={placeholder}
                style={style.textSearch}
                onChangeText={(t) => onChangeText(t)}>

            </TextInput>

        </View>
    )
}
const style = StyleSheet.create({

    container: {
        width: '80%',
        backgroundColor: 'white',
        //flexDirection: 'row',
        //paddingVertical: 12,
        borderRadius: 30,
       // paddingHorizontal: 10,
        //marginVertical: 12,
        //marginTop: 1,
        alignSelf:'center',
        margin:5
    },
    textSearch: {
        fontSize: 18,
        paddingLeft: 12,
    //    color:'#A223DE',
    //    backgroundColor:'#A223DE',


    }
})
export default Input