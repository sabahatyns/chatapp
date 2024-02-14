import { useEffect, useState } from "react";
import React from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
let id = '';
const Main = (props) => {
    const navigation = { useNavigation }
    const [Users, setUsers] = useState([])
    useEffect(() => {
        getUsers();
    })
    const getUsers = async () => {
        id = await AsyncStorage.getItem('id')
        let tempData = [];
        firestore()
            .collection('users')
            .get()
            .then(res => {
                if (res.docs != []) {
                    res.docs.map(item => {
                        tempData.push(item.data());
                    });
                }
                setUsers(tempData);
            })
    }
    return (
        <View>
            {/* header */}
            <View style={{
                justifyContent: 'center',
                alignItems: "center",
                backgroundColor: "#d3d3d3",
                height: 55,
                top: 0,
            }}>
                <Text style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    color: 'black',
                }}> Users</Text>
            </View>

            {/* list of users */}
            <FlatList data={Users} renderItem={({ item, index }) => {
                return (
                    <TouchableOpacity style={styles.user}
                        onPress={() => {
                            props.navigation.navigate('chat', { data: item, id: id, item: item.Name })
                        }}>
                        <Icon name="user" size={25} style={{
                            padding: 15,
                        }} />
                        <Text style={{ color: 'black', fontWeight: "bold", fontSize: 20 }}
                        >{item.Name}</Text>
                        <Icon name='forward' size={20} style={{ position: "absolute", right: 5 }} />

                    </TouchableOpacity>
                )
            }} />
        </View>
    )
}
export default Main;
const styles = StyleSheet.create({
    user: {
        width: Dimensions.get('window').width - 20,
        alignItems: "center",
        alignSelf: "center",
        marginTop: 20,
        flexDirection: "row",
        height: 60,
        borderWidth: 0.5,
        borderRadius: 10,
    }
})
