import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { MagnifyingGlassIcon, XMarkIcon } from "react-native-heroicons/solid";

const ContactsSearchBar = ({ input, setInput }) => {
  // when a user clicks on the search icon, expand it to the right and bring the avatar to the bottom
  const handleSearch = () => {
    // reset the search input
    setInput("");
  };

  return (
    <View style={tw`ml-3 mb-3`}>
      <TouchableOpacity
        onPress={handleSearch}
        style={tw`w-80 h-15 flex-row items-center bg-gray-100 p-2 m-1 rounded-lg border-2 border-gray-200`}
      >
        <View style={tw`h-10 items-center justify-center`}>
          <MagnifyingGlassIcon color="gray" />
        </View>
        <View style={tw`h-10 w-60 ml-2`}>
          <TextInput
            placeholder="Search"
            placeholderTextColor="gray"
            value={input}
            onChangeText={(text) => setInput(text)}
            style={tw`flex-1`}
          />
        </View>
        <TouchableOpacity
          onPress={handleSearch}
          style={tw`h-10 items-center justify-center`}
        >
          <XMarkIcon color="gray" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default ContactsSearchBar;
