import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Chats from './screens/chat';
import Welcome from './screens/welcome';
import Signin from './screens/signin';
import Signup from './screens/signup';



const Stack = createNativeStackNavigator();

export default function Mycal() {
  return (
    <NavigationContainer  >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="welcome"
          component={Welcome}
        />
        <Stack.Screen
          name="signup"
          component={Signup}
        />
        <Stack.Screen
          name="signin"
          component={Signin}
        />
        <Stack.Screen screenOptions={{ headerShown: false }}
          name="chat"
          component={Chats}
        />
        

      </Stack.Navigator>
    </NavigationContainer>
  )
}
