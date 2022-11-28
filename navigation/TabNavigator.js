import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";
import ContactsScreen from "../screens/ContactsScreen";
import MyTabBar from "../components/MyTabBar";
import tw from "twrnc";

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />} labeled="false">
      <Tab.Screen
        name="Home"
        options={{
          headerShown: false,
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="Contacts"
        options={{
          headerShown: false,
        }}
        component={ContactsScreen}
      />
      <Tab.Screen
        name="Settings"
        options={{
          headerShown: false,
        }}
        component={SettingScreen}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const customTabBarStyle = {
  activeTintColor: "#0091EA",
  inactiveTintColor: "gray",
  style: { backgroundColor: "red" },
};
