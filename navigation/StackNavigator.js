import React, { useState, useEffect } from "react";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import GetStarted from "../screens/GetStarted";
import ChatScreen from "../screens/ChatScreen";
import FriendScreen from "../screens/FriendScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import { db, auth } from "../firebase";

const StackNavigator = () => {
  const [theme, setTheme] = useState({
    primary: ["#cad4fc"],
    message: ["#a8b8ff", "#bfbbf2", "#9ad8fc"],
  });
  const [loggedInUserEmail, setLoggedInUserEmail] = useState();

  auth.onAuthStateChanged((user) => {
    if (user) {
      setLoggedInUserEmail(user.email);
    }
  });

  // this state is used to trigger the useeffect again when a user changes the theme
  const [themeChange, setThemeChange] = useState([]);
  const [favouriteChange, setFavouriteChange] = useState(false);

  const Stack = createNativeStackNavigator();

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

      <Stack.Screen name="Login" options={{ headerShown: false }}>
        {(props) => (
          <LoginScreen {...props} setLoggedInUserEmail={setLoggedInUserEmail} />
        )}
      </Stack.Screen>

      <Stack.Screen name="TabNavigator" options={{ headerShown: false }}>
        {(props) => (
          <TabNavigator
            {...props}
            theme={theme}
            setThemeChange={setThemeChange}
            favouriteChange={favouriteChange}
            setFavouriteChang={setFavouriteChange}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Chat" options={{ headerShown: false }}>
        {(props) => <ChatScreen {...props} theme={theme} />}
      </Stack.Screen>

      <Stack.Screen name="Friend" options={{ headerShown: false }}>
        {(props) => (
          <FriendScreen
            {...props}
            theme={theme}
            favouriteChange={favouriteChange}
            setFavouriteChange={setFavouriteChange}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default StackNavigator;
