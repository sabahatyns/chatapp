import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Qrscanner from './screens/qrscan';
import CountriesData from './screens/countries';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { getToken, notificationListenr, requestUserPermission } from './src/utils/pushnotifications';
import Reels from './screens/reels';
import Bugatti from './screens/Bugatti';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import First from './screens/home';
import Chats from './screens/chat';




const Stack = createNativeStackNavigator();

export default function Mycal() {
  const theme = {
    colors: {
      background: "transparent",
    },
  };
  
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);


  //notifications
  useEffect(() => {
    requestUserPermission();
    notificationListenr();
    getToken();
  }, []);
  return (
    <NavigationContainer  >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Bugatti5"
          component={Bugatti5}
        />

      </Stack.Navigator>
    </NavigationContainer>
  )
}
