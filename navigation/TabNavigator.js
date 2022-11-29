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
    // wrapped it in a view to change the background color of the tab navigator
    <View style={[tw`flex-1`, { backgroundColor: "#f3f4f6" }]}>
      <Tab.Navigator
        tabBar={(props) => <MyTabBar {...props} />}
        labeled="false"
      >
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
    </View>
  );
};

export default TabNavigator;

const customTabBarStyle = {
  activeTintColor: "#0091EA",
  inactiveTintColor: "gray",
  style: { backgroundColor: "red" },
};
