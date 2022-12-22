import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import moment from "moment";

const Day = ({ message }) => {
  return (
    <View style={tw`flex-row justify-center items-center w-full my-4`}>
      <View
        style={[tw`w-32 border-2 border-gray-200`, { borderWidth: "1px" }]}
      />
      <Text style={tw`text-xs font-light text-gray-600 mx-2`}>
        {message.timestamp
          ? moment(message.timestamp).format("MMM d, YYYY")
          : "..."}
      </Text>
      <View
        style={[tw`w-32 border-2 border-gray-200`, { borderWidth: "1px" }]}
      />
    </View>
  );
};

export default Day;
