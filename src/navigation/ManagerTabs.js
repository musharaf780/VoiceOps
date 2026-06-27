import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabBar from '../components/BottomTabBar';
import ManagerFeedScreen from '../screens/manager/ManagerFeedScreen';
import ManagerDetailScreen from '../screens/manager/ManagerDetailScreen';
import AlertsScreen from '../screens/shared/AlertsScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ReportsStack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="ManagerFeed" component={ManagerFeedScreen} />
      <HomeStack.Screen name="ManagerDetail" component={ManagerDetailScreen} />
    </HomeStack.Navigator>
  );
}

function ReportsStackNavigator() {
  return (
    <ReportsStack.Navigator screenOptions={{ headerShown: false }}>
      <ReportsStack.Screen name="ManagerFeed" component={ManagerFeedScreen} />
      <ReportsStack.Screen name="ManagerDetail" component={ManagerDetailScreen} />
    </ReportsStack.Navigator>
  );
}

export default function ManagerTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Reports" component={ReportsStackNavigator} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
