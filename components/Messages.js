import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";

const Messages = ({ user, message, loggedInUserEmail }) => {
  // determine whether the message is from YOU or YOUR FRIEND
  const messageType = user === loggedInUserEmail ? "sender" : "friend";

  return (
    <View>
      {messageType === "sender" ? (
        <LinearGradient
          colors={["#a8b8ff", "#bfbbf2", "#9ad8fc"]}
          start={[0, 1]}
          end={[1, 0]}
          style={tw`bg-white border-0 px-3 py-2 mx-5 mt-2 rounded-xl rounded-br-none w-50 ml-auto bg-[#fff9bb]`}
        >
          <Text style={tw`text-base`}>{message.message}</Text>
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={["#fcfcfc", "#ebe9e6"]}
          start={[0, 1]}
          end={[1, 0]}
          style={tw`bg-white border-0 px-3 py-2 mx-5 mt-2 rounded-xl rounded-bl-none w-50 mr-auto`}
        >
          <Text style={tw`text-base`}>{message.message}</Text>
        </LinearGradient>
      )}

      <View
        style={tw`${
          messageType === "sender" ? "ml-auto mr-7 mt-1" : "mr-auto ml-7 mt-1"
        }`}
      >
        <Text style={tw`text-xs font-light text-gray-600`}>
          {/* display message timestamp in local time format */}
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </Text>
      </View>
    </View>
  );
};

export default Messages;
