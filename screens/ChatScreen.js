import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React from "react";
import tw from "twrnc";
import {
  PlusIcon,
  ArrowLeftIcon,
  VideoCameraIcon,
  PhoneIcon,
  FaceSmileIcon,
  MicrophoneIcon,
  UserIcon,
} from "react-native-heroicons/solid";

const ChatScreen = ({ route, navigation }) => {
  const { friendAvatar } = route.params;

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center m-5`}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <ArrowLeftIcon size={24} color="black" />
        </TouchableOpacity>
        <View style={tw`flex-row flex-1 items-center ml-4`}>
          <View>
            {friendAvatar ? (
              <Image
                source={{ uri: "data:image/jpeg;base64," + friendAvatar }}
                style={tw`w-15 h-15 rounded-full border-2 border-gray-200`}
              />
            ) : (
              <UserIcon color="black" />
            )}
          </View>
          <View style={tw`pl-3`}>
            <Text style={tw`text-lg font-bold`}>Sean Jin</Text>
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
      <ScrollView style={tw`flex-1 bg-gray-50`}>
        <Text>This is where messages will go</Text>
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
            <MicrophoneIcon size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
