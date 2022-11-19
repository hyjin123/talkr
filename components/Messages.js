import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";

const Messages = ({ user, message, loggedInUserEmail }) => {
  // determine whether the message is from YOU or YOUR FRIEND
  const messageType = user === loggedInUserEmail ? "sender" : "friend";

  return (
    <View
      style={tw`bg-white border-0 px-3 py-2 mx-5 mt-7 rounded-xl w-50 ${
        messageType === "sender" ? "ml-auto bg-[#fff9bb]" : "mr-auto"
      }`}
    >
      <Text style={tw`text-base`}>{message.message}</Text>
    </View>
  );
};

export default Messages;
