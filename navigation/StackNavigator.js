import React, { useState, useEffect } from "react";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import GetStarted from "../screens/GetStarted";
import ChatScreen from "../screens/ChatScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import { db, auth } from "../firebase";

const StackNavigator = () => {
  const [theme, setTheme] = useState({
    primary: ["#cad4fc"],
    message: ["#a8b8ff", "#bfbbf2", "#9ad8fc"],
  });

  // this state is used to trigger the useeffect again when a user changes the theme
  const [themeChange, setThemeChange] = useState([]);

  const Stack = createNativeStackNavigator();

  // get the logged in user id through auth
  const loggedInUserEmail = auth?.currentUser?.email;

  // set a theme
  // extract the message color theme from firebase database
  useEffect(() => {
    if (loggedInUserEmail) {
      db.collection("users")
        .where("email", "==", loggedInUserEmail)
        .get()
        .then((data) => {
          const userTheme = data.docs[0].data().theme;
          setTheme(userTheme);
        });
    }
  }, [loggedInUserEmail, themeChange]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GetStarted"
        component={GetStarted}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="TabNavigator" options={{ headerShown: false }}>
        {(props) => (
          <TabNavigator
            {...props}
            theme={theme}
            setThemeChange={setThemeChange}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Chat" options={{ headerShown: false }}>
        {(props) => <ChatScreen {...props} theme={theme} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default StackNavigator;
