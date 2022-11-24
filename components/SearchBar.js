import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import FriendAvatar from "./FriendAvatar";
import { MagnifyingGlassIcon, XMarkIcon } from "react-native-heroicons/solid";

const SearchBar = ({ chatsSnapshot, loggedInUserEmail }) => {
  const [search, setSearch] = useState(false);
  const [input, setInput] = useState("");

  // when a user clicks on the search icon, expand it to the right and bring the avatar to the bottom
  const handleSearch = () => {
    // toggle the search UI
    setSearch(!search);
    // reset the search input
    setInput("");
  };

  return (
    <View
      style={tw`bg-white pl-3 pb-8 border-gray-100 rounded-br-3xl rounded-bl-3xl border-b-4 border-l-2 border-r-2 z-5 
      ${search ? "" : "flex-row"}`}
    >
      {search ? (
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
                autoFocus={true}
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
      ) : (
        <View style={tw`ml-2`}>
          <TouchableOpacity
            onPress={handleSearch}
            style={tw`w-15 h-15 justify-center items-center bg-gray-100 p-2 m-1 rounded-full border-2 border-gray-200`}
          >
            <MagnifyingGlassIcon color="gray" size={26} />
          </TouchableOpacity>
          <View style={tw`w-16 mt-1 justify-center items-center`}>
            <Text style={tw`font-light`}>Search</Text>
          </View>
        </View>
      )}

      {/* Loop through each existing chat and display friend's avatar and name beside the search bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {chatsSnapshot?.docs.map((chat) => (
          <FriendAvatar
            key={chat.id}
            id={chat.id}
            users={chat.data().users}
            loggedInUserEmail={loggedInUserEmail}
            input={input}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default SearchBar;
