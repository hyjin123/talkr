import {
  View,
  Text,
  SafeAreaView,
  Button,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/core";
import * as Animatable from "react-native-animatable";
import tw from "twrnc";

const GetStarted = () => {
  const navigation = useNavigation();

  const handleClick = () => {
    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={tw`bg-white flex-1 justify-start items-center`}>
      <View>
        <Animatable.Image
          source={require("../assets/livechat-animation.gif")}
          animation="slideInUp"
          iterationCount={1}
          style={tw`h-110 w-110`}
        />
      </View>

      <View style={tw`w-70 self-start ml-4`}>
        <Animatable.Text
          animation="slideInUp"
          iterationCount={1}
          style={tw`text-4xl my-2 text-black font-semibold text-left`}
        >
          It's so easy talking to your friends with Talkr
        </Animatable.Text>
        <Animatable.Text
          animation="slideInUp"
          iterationCount={1}
          style={tw`text-gray-100 my-2 mb-20 text-black text-left`}
        >
          Sign up for free and start chatting with your friends and family!
        </Animatable.Text>
      </View>
      <TouchableOpacity
        onPress={handleClick}
        style={tw`bg-blue-500 text-white font-bold py-2 px-30 py-3 rounded-full`}
      >
        <Text style={tw`text-white text-xl`}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default GetStarted;
