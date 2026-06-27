import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabBar from '../components/BottomTabBar';
import WorkerHomeScreen from '../screens/worker/WorkerHomeScreen';
import WorkerReportsScreen from '../screens/worker/WorkerReportsScreen';
import ReportPreviewScreen from '../screens/worker/ReportPreviewScreen';
import AlertsScreen from '../screens/shared/AlertsScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ReportsStack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="WorkerHome" component={WorkerHomeScreen} />
      <HomeStack.Screen name="ReportPreview" component={ReportPreviewScreen} />
    </HomeStack.Navigator>
  );
}

function ReportsStackNavigator() {
  return (
    <ReportsStack.Navigator screenOptions={{ headerShown: false }}>
      <ReportsStack.Screen name="WorkerReports" component={WorkerReportsScreen} />
      <ReportsStack.Screen name="ReportPreview" component={ReportPreviewScreen} />
    </ReportsStack.Navigator>
  );
}

export default function WorkerTabs() {
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
