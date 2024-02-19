import { View, Image, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
//import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS } from 'react-native-permissions';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import InChatViewFile from '../components/inchatview';
import InChatFileTransfer from '../components/filetransfer';
import { launchCamera, } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import _pickDocument from '../components/documentpicker';
import Location from './location';

const audioRecorderPlayer = new AudioRecorderPlayer();
const Chats = (props) => {
  const [isAttachImage, setIsAttachImage] = useState(false);
  const [isAttachFile, setIsAttachFile] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const [filePath, setFilePath] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioPath, setaudioPath] = useState(false);
  const [duration, setDuration] = useState(0);
  const [ispalying, setisplaiyng] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLocationSelection, setShowLocationSelection] = useState(false);
  const navigation = useNavigation();

  //location permission
useEffect(() => {
  requestLocationPermission();
}, []);

const requestLocationPermission = async () => {
  try {
    const granted = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (granted === 'granted') {
      console.log('Location permission granted');
    } else {
      console.log('Location permission denied');
    }
  } catch (error) {
    console.error('Error requesting location permission:', error);
  }
};

  //locatiuon

  const sendLocationMessage = (location) => {
    setSelectedLocation(location);
    setShowLocationSelection(false);
    const newMessage = {
      _id: Math.random().toString(),
      text: `Location: ${location.latitude}, ${location.longitude}`,
      createdAt: new Date(),
      user: {
        _id: 1,
      },
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    };
    handleSend([newMessage]);
  };

  //duration
  useEffect(() => {
    let recordingTimer;
    if (isRecording) {
      recordingTimer = setInterval(() => {
        setDuration(prevDuration => prevDuration + 1);
      }, 1000);
    } else {
      clearInterval(recordingTimer);
      setDuration(0);
    }

    return () => clearInterval(recordingTimer);
  }, [isRecording]);
  //start recording
  const startRecording = async () => {

    const audioPath = await audioRecorderPlayer.startRecorder();
    console.log('Recording started at', audioPath);
    audioRecorderPlayer.addRecordBackListener((e) => {
      setIsRecording(true);
      return;
    });
    console.log(audioPath);
  };

  //stop recording
  const stopRecording = async () => {

    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setIsRecording({
      recordSecs: 0,
    });
    console.log(result);
    //setDuration(0);
    setIsRecording(false);
    uploadAudioToFirebase(result);
    return result;
  };
  //play recording
  const playRecording = async () => {
    const result = await audioRecorderPlayer.startPlayer();
    console.log('Playing recorded audio:', result);
    setisplaiyng(true);
    return;
  };

  //pause
  const onPausePlay = async () => {
    const result = await audioRecorderPlayer.pausePlayer();
    console.log('Playing paused:', result);
    setisplaiyng(false);
  };



  //add audio to firebase
  const uploadAudioToFirebase = async (audioPath) => {

    const reference = storage().ref(`audio/${Date.now()}.mp3`);
    await reference.putFile(audioPath);
    console.log('Audio uploaded to Firebase storage');
    const url = await storage()
      .ref(`audio/${Date.now()}.mp3`)
    //.getDownloadURL();
    console.log('url', url);
    setaudioPath(url);
  };

  // send recorded voice

  const handleSend = async (newMessages) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    const { audioPath, metadata } = newMessages[0];
    setaudioPath(null); // Reset recorded audio URI after sending
  };
  const handleSendRecordedAudio = () => {
    handleSend([
      {
        _id: Math.random().toString(),
        audio: {
          uri: audioPath,
        },
        createdAt: new Date(),
        user: {
          _id: 1,
        },
      },
    ]);
  };

  // chat footer
  const renderChatFooter = useCallback(() => {

    if (audioPath) {
      return (
        <View style={styles.chatFooter}>

          <TouchableOpacity
            onPress={handleSendRecordedAudio}
          ><View style={{ flexDirection: "row", marginLeft: 25 }}>
              <Text>audio recorded</Text>
              <Text style={{ fontSize: 15, marginLeft: 195 }}>Send </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
//when image selected
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
    // when file selected
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
  }, [filePath, imagePath, audioPath]);
//get audio
  const AudioMessage = ({ audioPath }) => {
    const audioRecorderPlayer = new AudioRecorderPlayer();
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {ispalying ?
          <TouchableOpacity onPress={onPausePlay} style={{ flexDirection: "row" }}>
            <Icon name="pause" style={{ padding: 10, }} />
          </TouchableOpacity> :
          <TouchableOpacity onPress={playRecording}>
            <Text style={{ padding: 10, }}>▶️ Play</Text>
          </TouchableOpacity>}
        {/* Add visual representation of audio waveform here */}
        <Text style={{ marginLeft: 10 }}>{audioPath}</Text>
      </View>
    );
  };
//location message in chat
  const renderLocationMessage = (location) => {
    return (
      <View style={{ width: 250, height: 150 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
        </MapView>
      </View>
    );
  };


  // Modify renderBuble()
  const audioMessages = [
    { id: 1, audioPath: 'audio1.mp3' },
    // Add more audio messages here
  ];
  const [fileVisible, setFileVisible] = useState(false);
  const renderBubble = (props) => {
    const { currentMessage } = props;
    //when current msg is location
    if (currentMessage.location) {
      return renderLocationMessage(currentMessage.location);
    }
    //when current msg is audio

    if (currentMessage.audio) {
      return (
        <View>
          {audioMessages.map((message) => (
            <AudioMessage key={message.id} audioPath={message.audioPath} />
          ))}
        </View>
      );
    }
    //when current msg is file

    else if (currentMessage.file && currentMessage.file.url) {
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


  //scrollbottom icon
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
    // .getDownloadURL();
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
          // location:'',
          audio: {
            uri: '',
          },
          image: imagePath,
          file: {
            url: ''
          },

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
          audio: {
            uri: '',
          },
          //location:'',
          image: '',
          file: {
            url: filePath
          },

        }
      } else if (audioPath !== '') {
        const msg = messages[0];
        Mymsg = {
          ...msg,
          sendBy: route.params.id,
          sendTo: route.params.data.userId,
          createdAt: new Date(),
          //createdAt: Date.parse(msg.createdAt),
          audio: {
            uri: audioPath,
          },
          image: '',
          //location:'',
          file: {
            url: ''
          },
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

      firestore()
        .collection('chats')
        .doc('' + route.params.data.userId + route.params.id)
        .collection('messages')
        .add(Mymsg);
      setImagePath('');
      setIsAttachImage(false);
      setFilePath('');
      setIsAttachFile(false);
      setaudioPath('');
      setIsRecording(false);

    },
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
        user={{
          _id: props.route.params.id,


        }}


        alwaysShowSend
        renderSend={props => {
          return (
            <View>
              {isRecording && <Text>Recording...{duration}s</Text>}

              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 5 }}>

                <TouchableOpacity onPress={() => navigation.navigate('location')}
                  style={{ paddingLeft: 11 }}>
                  <EvilIcons name="location" size={20} color={'#2196F3'} />
                </TouchableOpacity>
                {showLocationSelection && (

                  <Location onLocationSelected={sendLocationMessage} />
                )}
                {isRecording ? <TouchableOpacity style={{ paddingLeft: 11 }}
                  onPress={stopRecording}
                >
                  <Icon name="stop"
                    size={20} color={'#2196F3'} />
                </TouchableOpacity> :

                  <TouchableOpacity style={{ paddingLeft: 11 }}
                    onPress={startRecording}
                  >
                    <Icon name={"microphone"}
                      size={20} color={'#2196F3'} />
                  </TouchableOpacity>}
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
    backgroundColor: 'white',
    marginBottom: 10
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
    fontSize: 10,
    fontWeight: 'bold',
    color: 'gray',
  },


})
export default Chats;
