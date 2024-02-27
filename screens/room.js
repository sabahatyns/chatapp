// import React, {useCallback, useRef} from 'react';

// import {JitsiMeeting} from '@jitsi/react-native-sdk/index';

// import {useNavigation} from '@react-navigation/native';


// // interface MeetingProps {
// //   route: any;
// // }

// const Room = ({route}) => {
//   const jitsiMeeting = useRef(null);
//   const navigation = useNavigation();

//   const { room } = route.params;

//   const onReadyToClose = useCallback(() => {
//     // @ts-ignore
//     navigation.navigate('meet');
//     // @ts-ignore
//     jitsiMeeting.current.close();
//   }, [navigation]);

//   const eventListeners = {
//     onReadyToClose
//   };

//   return (
//       // @ts-ignore
//       <JitsiMeeting
//           eventListeners={eventListeners}
//           ref={jitsiMeeting}
//           style={{flex: 1}}
//           room={room}
//           serverURL={'https://meet.jit.si/'} />
//   );
// };

// export default Room;