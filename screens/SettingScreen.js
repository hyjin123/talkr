import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import tw from "twrnc";

const SettingScreen = () => {
  return (
    <SafeAreaView style={tw`flex-1 items-center`}>
      {/* Heading */}
      <View style={tw`my-5`}>
        <Text style={tw`font-semibold text-3xl`}>Setting</Text>
      </View>

      {/* Search Bar */}

      {/* Body */}
      <View>
        <Text>Names</Text>
      </View>
    </SafeAreaView>
  );
};

export default SettingScreen;
