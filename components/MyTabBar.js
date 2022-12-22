import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  HomeIcon,
  Cog6ToothIcon,
  UsersIcon,
} from "react-native-heroicons/outline";
import {
  HomeIcon as HomeIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  UsersIcon as UsersIconSolid,
} from "react-native-heroicons/solid";

const MyTabBar = ({ state, descriptors, navigation, theme }) => {
  const [isFetching, setIsFetching] = useState(true);

  // don't show the tab navigation until all the home screen data is loaded
  useEffect(() => {
    setTimeout(() => {
      setIsFetching(false);
    }, 4000);
  }, []);

  if (isFetching) {
    return <></>;
  }

  return (
    <SafeAreaView
      style={{
        flexDirection: "row",
        backgroundColor: `${theme.primary[0]}`,
        height: 60,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        margin: 15,
        marginBottom: 40,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        // console.log(label);
        // console.log(isFocused);

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ["selected"] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: "center" }}
          >
            {label === "Contacts" && !isFocused && (
              <UsersIcon size={30} color="black" />
            )}
            {label === "Contacts" && isFocused && (
              <UsersIconSolid size={30} color="black" />
            )}
            {label === "Home" && !isFocused && (
              <HomeIcon size={30} color="black" />
            )}
            {label === "Home" && isFocused && (
              <HomeIconSolid size={30} color="black" />
            )}
            {label === "Settings" && !isFocused && (
              <Cog6ToothIcon size={30} color="black" />
            )}
            {label === "Settings" && isFocused && (
              <Cog6ToothIconSolid size={30} color="black" />
            )}
          </TouchableOpacity>
        );
      })}
    </SafeAreaView>
  );
};

export default MyTabBar;
