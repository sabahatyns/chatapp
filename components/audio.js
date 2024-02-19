import React,{useState} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import  AudioRecorderPlayer  from 'react-native-audio-recorder-player';
import { Icon } from 'react-native-vector-icons/FontAwesome';


const AudioMessage = ({ audioPath }) => {
  const audioRecorderPlayer = new AudioRecorderPlayer();
  const [ispalying, setisplaiyng] = useState(false);
  const [isRecording, setIsRecording] = useState(false);



  const playAudio = async () => {
    console.log('onStartPlay');
  const msg = await audioRecorderPlayer.startPlayer(audioPath);
  console.log(msg);
  audioRecorderPlayer.addPlayBackListener((e) => {
  setIsRecording({
      currentPositionSec: e.currentPosition,
      currentDurationSec: e.duration,
      playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
      duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
    });
    return;
  });
};
  const onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer(audioPath);
  };
  

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {ispalying ?
      <TouchableOpacity onPress={onPausePlay}>
        <Icon name="stop"/>
         <Text style={{ padding: 10, backgroundColor: '#e6e6e6' }}>stop</Text> 
        {/* <Icon  name="play" size={22}/> */}
      </TouchableOpacity>:
      <TouchableOpacity onPress={playAudio}>
         <Text style={{ padding: 10, backgroundColor: '#e6e6e6' }}>▶️ Play</Text> 
        {/* <Icon  name="play" size={22}/> */}
      </TouchableOpacity>}
      {/* Add visual representation of audio waveform here */}
      <Text style={{ marginLeft: 10 }}>{audioPath}</Text>
    </View>
  );
};

export default AudioMessage;
