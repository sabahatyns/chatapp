import { View, Button, FlatList, StyleSheet, Text } from 'react-native';
import React, { useState , useCallback,useEffect} from 'react';
import { GiftedChat } from 'react-native-gifted-chat'
import { getAuth } from '@react-native-firebase/auth';

//import {addDoc,  collection , getFirestore} from 'firebase/firstore';
//import app from '@react-native-firebase';
import Input from "../components/Input";


const Chats = () => {
    const [messages, setMessages] = useState([])

    useEffect(() => {
      setMessages([
        {
          _id: 1,
          text: 'Hello',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ])
    }, [])
  
    const onSend = useCallback((messages = []) => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      )
    }, [])
    // let currentUser ="Faizan"
    // const user = [
    //     {
    //     message: 'Hi',
    //     messageFrom: 'Faizan'

    // },
    // {
    //     message: 'Hello',
    //     messageFrom: 'Ahmed'

    // },
    // {
    //     message: "How're you",
    //     messageFrom: 'Dani'

    // },

    // ]
    // const [message, setmessage] = useState(null)
    // const onSendpressed  = async ()=>{
    //     await addDoc(collection(db,'Chats'),{
    //         messageFrom:email,
    //         message,
    //         time:ServerTimestamp()    
    // })
    // setmessage
    // }
    return (
        <View style={styles.container}>
             <View style={{
                justifyContent:'center',
                alignItems:"center",
                backgroundColor:"#d3d3d3", 
                height:55,
                top:0,}}>
                        <Text style={{
                            fontSize: 30, 
                            fontWeight: 'bold', 
                            color: 'black', }}> Chat</Text>
                    </View>
             {/* <FlatList
                data={user}
                renderItem={({ item }) => {
                    return (
                        <View style={item.messageFrom==currentUser ?{...styles.card,
                            backgroundColor:"#d3d3d3",
                            alignSelf:"flex-end",
                            marginTop:15
                            
                        }: styles.card}>
                            <Text style={{fontWeight:"bold"}} >{item.messageFrom}</Text>
                            <Text>{item.message}</Text>
                        </View>
                    )
                }
                }
                keyExtractor={item => item.messageFrom}
            />  */}
             <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
            {/* <View style={styles.row}>
                <Input
                    placeholder={'write your message...'}
                    onChangeText={(t) => setmessage(t)} />
                <Text style={{
                    color: '#2196F3',
                    fontSize:20,
                    fontWeight:"900",
                   // paddingLeft:5,
                }}
                    //color="red"
                    onPress={() => alert('sent')}>send</Text>
                

            </View> */}

        </View>
    )
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        //paddingTop:25
    },
    row: {
        flexDirection: "row",
        justifyContent:"center",
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
