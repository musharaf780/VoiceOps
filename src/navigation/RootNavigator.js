import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoleSelectScreen from '../screens/onboarding/RoleSelectScreen';
import CreateAccountScreen from '../screens/onboarding/CreateAccountScreen';
import VerifyPhoneScreen from '../screens/onboarding/VerifyPhoneScreen';
import TeamSetupScreen from '../screens/onboarding/TeamSetupScreen';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import SignInScreen from '../screens/onboarding/SignInScreen';
import WorkerTabs from './WorkerTabs';
import ManagerTabs from './ManagerTabs';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="RoleSelect"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="VerifyPhone" component={VerifyPhoneScreen} />
      <Stack.Screen name="TeamSetup" component={TeamSetupScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen
        name="WorkerTabs"
        component={WorkerTabs}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="ManagerTabs"
        component={ManagerTabs}
        options={{ animation: 'fade' }}
      />
    </Stack.Navigator>
  );
}
