import { View, Buttons, Image, FlatList, Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as DocumentPicker from 'react-native-document-picker';
import InChatViewFile from '../components/inchatview';
import InChatFileTransfer from '../components/filetransfer';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const Chats = (props) => {
  const [isAttachImage, setIsAttachImage] = useState(false);
  const [isAttachFile, setIsAttachFile] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const [filePath, setFilePath] = useState('');

  // add a function attach file using DocumentPicker.pick

  const _pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'documentDirectory',
        mode: 'import',
        allowMultiSelection: true,
      });
      const fileUri = result[0].fileCopyUri;
      if (!fileUri) {
        console.log('File URI is undefined or null');
        return;
      }
      if (fileUri.indexOf('.png') !== -1 || fileUri.indexOf('.jpg') !== -1) {
        setImagePath(fileUri);
        setIsAttachImage(true);
      } else {
        setFilePath(fileUri);
        setIsAttachFile(true);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.log('DocumentPicker err => ', err);
        throw err;
      }
    }
  };

  // chat footer
  const renderChatFooter = useCallback(() => {
    if (imagePath) {
      return (
        <View style={styles.chatFooter}>
          <Image source={{ uri: imagePath }} style={{ height: 75, width: 75 }} />
          <TouchableOpacity
            onPress={() => setImagePath('')}
            style={styles.buttonFooterChatImg}
          >
            <Text style={styles.textFooterChat}>X</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (filePath) {
      return (
        <View style={styles.chatFooter}>

          <InChatFileTransfer
            filePath={filePath}
          />
          <TouchableOpacity
            onPress={() => setFilePath('')}
            style={styles.buttonFooterChat}
          >
            <Text style={styles.textFooterChat}>X</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }, [filePath, imagePath]);
 

  // Modify renderBuble()

  const [fileVisible, setFileVisible] = useState(false);
  const renderBubble = (props) => {
    const { currentMessage } = props;
    if (currentMessage.file && currentMessage.file.url) {
      return (
        <TouchableOpacity
          style={{
            ...styles.fileContainer,
            backgroundColor: props.currentMessage.user._id === 2 ? '#2e64e5' : '#efefef',
            borderBottomLeftRadius: props.currentMessage.user._id === 2 ? 15 : 5,
            borderBottomRightRadius: props.currentMessage.user._id === 2 ? 5 : 15,
          }}
          onPress={() => setFileVisible(true)}
        >
          <InChatFileTransfer
            style={{ marginTop: -10 }}
            filePath={currentMessage.file.url}
          />
          <InChatViewFile
            props={props}
            visible={fileVisible}
            onClose={() => setFileVisible(false)}
          />
          <View style={{ flexDirection: 'column' }}>
            <Text style={{
              ...styles.fileText,
              color: currentMessage.user._id === 2 ? 'white' : 'black',
            }} >
              {currentMessage.text}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2e64e5',
          },
        }}
        textStyle={{
          right: {
            color: '#efefef',
          },
        }}
      />
    );
  };


  //scrollbottom
  const scrollToBottomComponent = () => {
    return <Icon name="angle-double-down" size={22} color="#333" />;
  };

  // Note
  const route = useRoute();
  const [messages, setMessages] = useState([])
  const { item } = props.route.params;

  useEffect(() => {
    const subscriber = firestore()
      .collection('chats')
      .doc(route.params.id + route.params.data.userId)
      .collection('messages')
      .orderBy('createdAt', 'desc');
    subscriber.onSnapshot(querysnapshot => {
      const allmessages = querysnapshot.docs.map(item => {
        return { ...item._data, createdAt: Date.parse(new Date()) }
      });
      setMessages(allmessages);
    });
    // return()=> subscriber();
  },
    []);


  //camera btn
  const openCamera = async () => {
    const result = await launchCamera({ mediaType: 'photo' });
    console.log(result);
    if (result.didCancel && result.didCancel == true) {
    } else {
      setIsAttachImage(result);
      uplaodImage(result);
    }
  };
  //upload img on firebase
  const uplaodImage = async imagePath => {
    const reference = storage().ref(imagePath.assets[0].fileName);
    const pathToFile = imagePath.assets[0].uri;
    await reference.putFile(pathToFile);
    const url = await storage()
      .ref(imagePath.assets[0].fileName)
      .getDownloadURL();
    console.log('url', url);
    setImagePath(url);
    // setFilePath(url);
  };


  //onsend function

  const onSend =
    useCallback(async (messages = []) => {
      let Mymsg = null;
      if (imagePath !== '') {
        const msg = messages[0];
        Mymsg = {
          ...msg,
          sendBy: route.params.id,
          sendTo: route.params.data.userId,
          createdAt: new Date(),
          //createdAt: Date.parse(msg.createdAt),
          image: imagePath,
          file: {
            url: ''
          },
          sent: true,
          // Mark the message as received, using two tick
          received: true,
          // Mark the message as pending with a clock loader
          pending: true,
        }
      }
      else if (filePath !== '') {
        const msg = messages[0];
        Mymsg = {
          ...msg,
          sendBy: route.params.id,
          sendTo: route.params.data.userId,
          createdAt: new Date(),
          //createdAt: Date.parse(msg.createdAt),
          image: '',
          file: {
            url: filePath
          },
          sent: true,
          // Mark the message as received, using two tick
          received: true,
          // Mark the message as pending with a clock loader
          pending: true,
        }
      }
      else {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, Mymsg),
        );

      }

      ///firestore

      firestore()
        .collection('chats')
        .doc('' + route.params.id + route.params.data.userId)
        .collection('messages')
        .add(Mymsg);
      // setImagePath('');
      // setIsAttachImage(false);
      // setFilePath('');
      // setIsAttachFile(false);
      firestore()
        .collection('chats')
        .doc('' + route.params.data.userId + route.params.id)
        .collection('messages')
        .add(Mymsg);
      setImagePath('');
      setIsAttachImage(false);
      setFilePath('');
      setIsAttachFile(false);
    },
      //[filePath, imagePath, isAttachFile, isAttachImage],
    )
  return (
    <View style={styles.chat}>
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
        }}>{props.route.params.data.Name}</Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        // alwaysShowSend={true}
        user={{
          _id: props.route.params.id,


        }}
        alwaysShowSend
        renderSend={props => {
          return (
            <View>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 5 }}>

                <TouchableOpacity style={{ paddingLeft: 11 }}>
                  <Icon name="microphone" size={20} color={'#2196F3'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={_pickDocument}
                  style={{ paddingLeft: 11 }}>
                  <MaterialIcons name="attach-file" size={20} color={'#2196F3'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={openCamera}
                  style={{
                    paddingLeft: 11
                  }}>
                  <Icon name="camera" size={20} color={'#2196F3'} />
                </TouchableOpacity>
                <Send {...props}>

                  <Icon name='send' size={20}
                    color={'#2196F3'} style={{
                      paddingBottom: 11,
                      //alignSelf:"center",
                      // justifyContent:"center",
                      paddingRight: 16,
                      paddingLeft: 11
                    }}
                  />
                </Send>
              </View>

            </View>
          )
        }}
        renderChatFooter={renderChatFooter}
        renderBubble={renderBubble}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
      />
    </View>
  )
}
const styles = StyleSheet.create({

  chat: {
    flex: 1,
    // width:'100%'
  },
  chatFooter: {
    shadowColor: '#1F2687',
    shadowOpacity: 0.37,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    flexDirection: 'row',
    padding: 5,
    backgroundColor: 'white'
  },
  fileContainer: {
    flex: 1,
    maxWidth: 300,
    marginVertical: 2,
    borderRadius: 15,
  },
  fileText: {
    marginVertical: 5,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 10,
    marginRight: 5,
  },
  textTime: {
    fontSize: 10,
    color: 'gray',
    marginLeft: 2,
  },
  buttonFooterChat: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: 'black',
    right: 3,
    top: -2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  buttonFooterChatImg: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: 'black',
    left: 66,
    top: -4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },

  textFooterChat: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
  },


})
export default Chats;
