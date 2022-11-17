import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import React from "react";
import tw from "twrnc";
import { auth, db } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import { useCollection } from "react-firebase-hooks/firestore";

const HomeScreen = () => {
  const navigation = useNavigation();

  // get the logged in user id through auth
  const loggedInUserEmail = auth.currentUser.email;

  // get the snapshot of the logged in user through firestore database
  // useCollection retrieves and monitors a collection value in Cloud Firestore
  const [userSnapshot] = useCollection(
    db.collection("users").where("email", "==", loggedInUserEmail)
  );

  // get the user info
  const user = userSnapshot?.docs?.[0].data();
  console.log("this is the user", user);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("GetStarted");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <SafeAreaView style={tw`flex-1 justify-center items-center`}>
      {/* Header */}
      {/* Body */}
      {/* Tab Navigation */}
      <View>
        <Text>Email: {auth.currentUser?.email}</Text>
        <Text>Name: {user?.displayName}</Text>
        <TouchableOpacity
          onPress={handleSignOut}
          style={tw`w-40 bg-blue-200 p-4 m-1 rounded-lg`}
        >
          <Text style={tw`text-center`}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
