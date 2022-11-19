import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import moment from "moment";

const Messages = ({ user, message, loggedInUserEmail }) => {
  // determine whether the message is from YOU or YOUR FRIEND
  const messageType = user === loggedInUserEmail ? "sender" : "friend";

  return (
    <View>
      <View
        style={tw`bg-white border-0 px-3 py-2 mx-5 mt-2 rounded-xl w-50 ${
          messageType === "sender" ? "ml-auto bg-[#fff9bb]" : "mr-auto"
        }`}
      >
        <Text style={tw`text-base`}>{message.message}</Text>
      </View>
      <View style={tw`ml-auto mr-6 mt-1`}>
        <Text style={tw`text-xs font-light text-gray-600`}>
          {/* display message timestamp in local time format */}
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </Text>
      </View>
    </View>
  );
};

export default Messages;
