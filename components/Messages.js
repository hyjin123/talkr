import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";

const Messages = ({ user, message }) => {
  return (
    <View style={tw`bg-white w-50 border-0 px-3 py-2 mx-5 mt-7 rounded-xl`}>
      <Text style={tw`text-base`}>{message.message}</Text>
    </View>
  );
};

export default Messages;
