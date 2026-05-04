import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme, Text } from 'react-native';

import { initDatabase } from './storage/database';
import { colors } from './theme';

import HomeScreen from './screens/HomeScreen';
import LibraryScreen from './screens/LibraryScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProgressScreen from './screens/ProgressScreen';
import ActiveWorkoutScreen from './screens/ActiveWorkoutScreen';
import EditTemplateScreen from './screens/EditTemplateScreen';
import SessionDetailScreen from './screens/SessionDetailScreen';
import ExerciseProgressScreen from './screens/ExerciseProgressScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
      <Stack.Screen name="EditTemplate" component={EditTemplateScreen} options={{ headerShown: true, title: 'New Template' }} />
    </Stack.Navigator>
  );
}

function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HistoryList" component={HistoryScreen} />
      <Stack.Screen name="SessionDetail" component={SessionDetailScreen} options={{ headerShown: true, title: 'Session' }} />
    </Stack.Navigator>
  );
}

function ProgressStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProgressList" component={ProgressScreen} />
      <Stack.Screen name="ExerciseProgress" component={ExerciseProgressScreen} options={{ headerShown: true, title: 'Progress' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const scheme = useColorScheme();
  const c = colors(scheme);

  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: c.card, borderTopColor: c.border },
          tabBarActiveTintColor: c.accent,
          tabBarInactiveTintColor: c.muted,
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{ title: 'Workouts', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏋️</Text> }}
        />
        <Tab.Screen
          name="LibraryTab"
          component={LibraryScreen}
          options={{ title: 'Library', tabBarIcon: () => <Text style={{ fontSize: 20 }}>📚</Text> }}
        />
        <Tab.Screen
          name="HistoryTab"
          component={HistoryStack}
          options={{ title: 'History', tabBarIcon: () => <Text style={{ fontSize: 20 }}>📅</Text> }}
        />
        <Tab.Screen
          name="ProgressTab"
          component={ProgressStack}
          options={{ title: 'Progress', tabBarIcon: () => <Text style={{ fontSize: 20 }}>📈</Text> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
