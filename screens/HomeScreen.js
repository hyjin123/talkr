import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import React from "react";
import tw from "twrnc";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";

const HomeScreen = () => {
  const navigation = useNavigation();

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
      <View>
        <Text>Email: {auth.currentUser?.email}</Text>
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
