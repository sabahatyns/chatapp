import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Chats from './screens/chat';
import Welcome from './screens/welcome';
import Signin from './screens/signin';
import Signup from './screens/signup';
import Main from './screens/main';
import LocationSelectionScreen from './screens/location';
import Location from './screens/location';
import Menu from './screens/menu';
import Meet from './screens/meet';
import Room from './screens/room';





const Stack = createNativeStackNavigator();

export default function Mycal() {
  return (
    <NavigationContainer  >
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen
          name="welcome"
          component={Welcome}
          Options={{ headerShown: false }}
        />
        <Stack.Screen
          name="signup"
          component={Signup}
          Options={{ headerShown: false }}
        />
        <Stack.Screen
          name="signin"
          component={Signin}
          Options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Menu"
          component={Menu}
          Options={{ headerShown: false }}
        />
        <Stack.Screen
          name="main"
          component={Main}
          Options={{ headerShown: false }}
        />
        <Stack.Screen
          name="meet"
          component={Meet}
          Options={{ headerShown: false }}
        />
        <Stack.Screen
          name="room"
          component={Room}
          Options={{ headerShown: false }}
        />
        <Stack.Screen
         Options={{ headerShown: true }}
          name="chat"
          component={Chats}
        />
        <Stack.Screen
         Options={{ headerShown: true }}
          name="location"
          component={Location}
        />
        

      </Stack.Navigator>
    </NavigationContainer>
  )
}
