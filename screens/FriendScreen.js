import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import tw from "twrnc";
import {
  ChatBubbleLeftRightIcon,
  UserPlusIcon,
  StarIcon,
} from "react-native-heroicons/solid";

const FriendScreen = ({ route, navigation, theme }) => {
  // destrucutre the params sent through navigation
  const { id, friendAvatar, friendName, friendEmail, friendStatus } =
    route.params;

  return (
    <SafeAreaView style={tw`flex-1 items-center justify-center bg-gray-100`}>
      {/* Profile Information */}
      <View
        style={tw`border-2 w-80 h-75 items-center bg-white border-gray-200 rounded-2xl`}
      >
        <View
          style={[
            tw`absolute -top-14 w-25 h-25 justify-center items-center bg-gray-200 p-2 m-1 rounded-full border-2`,
            { borderColor: `${theme.primary[0]}` },
          ]}
        >
          <Image
            source={{ uri: "data:image/jpeg;base64," + friendAvatar }}
            style={[
              tw`w-25 h-25 rounded-full border-2`,
              { borderColor: `${theme.primary[0]}` },
            ]}
          />
        </View>
        <View style={tw`mt-14 mb-6 items-center`}>
          <Text style={tw`text-2xl font-bold mb-1`}>{friendName}</Text>
          <Text>{friendEmail}</Text>
        </View>

        {friendStatus ? (
          <View style={tw`mt-3 mb-10`}>
            <Text>"{friendStatus}"</Text>
          </View>
        ) : (
          <View style={tw`mt-3 mb-10`}>
            <Text>No Status</Text>
          </View>
        )}

        <View style={tw`flex-row w-50 justify-between`}>
          <View style={tw`items-center`}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={tw`rounded-full p-3 bg-[#90bef5] mb-1`}
            >
              <ChatBubbleLeftRightIcon size={36} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-gray-500`}>Chat</Text>
          </View>

          <View style={tw`items-center`}>
            <TouchableOpacity style={tw`rounded-full p-3 bg-[#FBEC5D] mb-1`}>
              <StarIcon size={36} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-gray-500`}>Favourite</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FriendScreen;
