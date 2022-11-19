import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { ArrowLeftIcon, UserIcon } from "react-native-heroicons/solid";
import {
  PaperAirplaneIcon,
  VideoCameraIcon,
  PhoneIcon,
  FaceSmileIcon,
} from "react-native-heroicons/outline";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";

const ChatScreen = ({ route, navigation }) => {
  const [input, setInput] = useState("");

  const { friendAvatar, friendName, friendEmail } = route.params;

  // get the logged in user email through auth
  const loggedInUserEmail = auth.currentUser.email;

  // get a chat collection snapchat from firebase
  const [chatsSnapshot] = useCollection(
    db.collection("chats").where("users", "array-contains", loggedInUserEmail)
  );

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center m-5`}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <ArrowLeftIcon size={24} color="black" />
        </TouchableOpacity>
        <View style={tw`flex-row flex-1 items-center ml-4`}>
          {friendAvatar ? (
            <View>
              <Image
                source={{ uri: "data:image/jpeg;base64," + friendAvatar }}
                style={tw`w-15 h-15 rounded-full border-2 border-gray-200`}
              />
            </View>
          ) : (
            <View
              style={tw`w-15 h-15 justify-center items-center bg-gray-200 p-2 m-1 rounded-full`}
            >
              <UserIcon color="black" />
            </View>
          )}

          <View style={tw`pl-3`}>
            {friendName ? (
              <Text style={tw`text-lg font-bold`}>{friendName}</Text>
            ) : (
              <Text style={tw`text-sm font-bold`}>{friendEmail}</Text>
            )}
            <Text style={tw`text-gray-500`}>Last Active: ...</Text>
          </View>
        </View>

        <View style={tw`flex-row w-30`}>
          <TouchableOpacity
            style={tw`flex-1 items-center w-25 bg-[#fff9bb] p-2 m-1 rounded-full`}
          >
            <VideoCameraIcon size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-1 items-center w-15 bg-[#fff9bb] p-2 m-1 rounded-full`}
          >
            <PhoneIcon size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      <ScrollView style={tw`flex-1 bg-gray-100`}>
        <View style={tw`bg-white w-50 border-0 px-3 py-2 mx-5 mt-7 rounded-xl`}>
          <Text style={tw`text-base`}>
            This is where messages will go, this is an example message, please
            let me know how this looks
          </Text>
        </View>
        <View style={tw`bg-white w-50 border-0 px-3 py-2 m-5 mt-7 rounded-xl`}>
          <Text style={tw`text-base`}>Hello</Text>
        </View>
      </ScrollView>

      {/* Keyboard Input */}
      <View style={tw`bg-gray-50 flex-row items-center justify-center pb-4`}>
        <View
          style={tw`h-14 border-2 border-r-0 border-gray-400 p-4 rounded-l-3xl`}
        >
          <TouchableOpacity style={tw`flex-1 items-center justify-center`}>
            <FaceSmileIcon size={22} color="black" />
          </TouchableOpacity>
        </View>
        <View style={tw`h-14 border-b-2 border-t-2 border-gray-400`}>
          <TextInput
            placeholder="Type Message..."
            placeholderTextColor="gray"
            style={tw`border-gray-300 w-50 h-13`}
          />
        </View>

        <View
          style={tw`h-14 border-2 border-l-0 items-center justify-center border-gray-400 p-4 rounded-r-3xl`}
        >
          <TouchableOpacity
            style={tw`bg-[#fff9bb] rounded-full items-center justify-center w-10 h-10`}
          >
            <PaperAirplaneIcon size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
