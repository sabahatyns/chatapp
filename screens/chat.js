import { View, Button, FlatList, StyleSheet, Text } from 'react-native';
import React, { useState } from 'react';
import Input from "../components/Input";


const Chats = () => {
    let currentUser ="Faizan"
    const user = [{
        message: 'Hi',
        messageFrom: 'Faizan'

    },
    {
        message: 'Hello',
        messageFrom: 'Ahmed'

    },
    {
        message: "How're you",
        messageFrom: 'Dani'

    },

    ]
    const [message, setmessage] = useState(null)
    return (
        <View style={styles.container}>
             <FlatList
                data={user}
                renderItem={({ item }) => {
                    return (
                        <View style={item.messageFrom==currentUser ?{...styles.card,
                            backgroundColor:"#d3d3d3",
                            alignSelf:"flex-end"
                            
                        }: styles.card}>
                            <Text style={{fontWeight:"bold"}} >{item.messageFrom}</Text>
                            <Text>{item.message}</Text>
                        </View>
                    )
                }
                }
                keyExtractor={item => item.messageFrom}
            /> 
            <View style={styles.row}>
                <Input
                    placeholder={'write your message...'}
                    onChangeText={(t) => setmessage(t)} />
                <Button title="send"
                    //color="red"
                    onPress={() => alert('pressed')}
                />

            </View>

        </View>
    )
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        bottom: 0,

    },
    btn: {
        paddingLeft: 55
    },
    card:{
        backgroundColor: '#2196F3',
        width: "50%",
        borderRadius: 10,
        padding:10,
        margin:5,
    }

})
export default Chats;
