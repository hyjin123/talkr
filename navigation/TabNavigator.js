import { View, Text } from "react-native";
import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";
import { HomeIcon, Cog6ToothIcon } from "react-native-heroicons/outline";
import {
  HomeIcon as HomeIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from "react-native-heroicons/solid";
import tw from "twrnc";

const TabNavigator = () => {
  const Tab = createMaterialBottomTabNavigator();

  return (
    <Tab.Navigator
      barStyle={{
        paddingBottom: 48,
        borderRadius: 10,
        height: 100,
        marginRight: 10,
        marginLeft: 10,
      }}
      labeled="false"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Home") {
            if (focused) {
              return <HomeIcon size={30} color="blue" />;
            } else {
              return <HomeIcon size={30} color="black" />;
            }
          } else if (route.name === "Settings") {
            if (focused) {
              return <Cog6ToothIcon size={30} color="blue" />;
            } else {
              return <Cog6ToothIcon size={30} color="black" />;
            }
          }
        },
      })}
    >
      <Tab.Screen
        name="Home"
        options={{
          headerShown: false,
          tabBarLabel: false,
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="Settings"
        options={{
          headerShown: false,
          tabBarLabel: false,
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
