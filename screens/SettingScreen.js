import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import tw from "twrnc";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";

const SettingScreen = () => {
  // get the logged in user email through auth
  const loggedInUserEmail = auth.currentUser.email;

  // get the logged in user info
  const [userSnapshot] = useCollection(
    db.collection("users").where("email", "==", loggedInUserEmail)
  );

  const user = userSnapshot?.docs?.[0]?.data();

  console.log(user);

  return (
    <SafeAreaView style={tw`flex-1 items-center bg-gray-100`}>
      {/* Heading */}
      <View style={tw`my-6`}>
        <Text style={tw`font-semibold text-3xl`}>Setting</Text>
      </View>

      {/* Body */}
      <View>
        <Text>Names</Text>
      </View>
    </SafeAreaView>
  );
};

export default SettingScreen;
