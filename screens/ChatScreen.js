import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import tw from "twrnc";
import {
  PlusIcon,
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  VideoCameraIcon,
  PhoneIcon,
} from "react-native-heroicons/solid";

const ChatScreen = ({ route, navigation }) => {
  const { url } = route.params;

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center m-5`}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <ArrowLeftIcon size={24} color="black" />
        </TouchableOpacity>
        <View style={tw`flex-row flex-1 items-center ml-4`}>
          <View>
            {url ? (
              <Image
                source={{ uri: url }}
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
      <ScrollView></ScrollView>

      {/* Keyboard Input */}
      <View></View>
    </SafeAreaView>
  );
};

export default ChatScreen;
