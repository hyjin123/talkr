import { View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";
import ContactsScreen from "../screens/ContactsScreen";
import MyTabBar from "../components/MyTabBar";
import tw from "twrnc";

const TabNavigator = ({
  theme,
  setThemeChange,
  favouriteChange,
  setFavouriteChange,
}) => {
  const Tab = createBottomTabNavigator();

  return (
    // wrapped it in a view to change the background color of the tab navigator
    <View style={[tw`flex-1`, { backgroundColor: "#f3f4f6" }]}>
      <Tab.Navigator
        tabBar={(props) => <MyTabBar {...props} theme={theme} />}
        labeled="false"
      >
        <Tab.Screen
          name="Home"
          options={{
            headerShown: false,
          }}
        >
          {(props) => <HomeScreen {...props} theme={theme} />}
        </Tab.Screen>

        <Tab.Screen
          name="Contacts"
          options={{
            headerShown: false,
          }}
        >
          {(props) => (
            <ContactsScreen
              {...props}
              theme={theme}
              favouriteChange={favouriteChange}
              setFavouriteChange={setFavouriteChange}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Settings"
          options={{
            headerShown: false,
          }}
        >
          {(props) => (
            <SettingScreen
              {...props}
              theme={theme}
              setThemeChange={setThemeChange}
            />
          )}
        </Tab.Screen>
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
