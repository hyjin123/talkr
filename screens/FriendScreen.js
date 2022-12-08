import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { auth, db } from "../firebase";
import tw from "twrnc";
import {
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  StarIcon,
  TrashIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
} from "react-native-heroicons/solid";
import { StarIcon as StarIconOutline } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/core";

const FriendScreen = ({ route, theme }) => {
  // destrucutre the params sent through navigation
  const { id, friendAvatar, friendName, friendEmail, friendStatus, favourite } =
    route.params;

  const navigation = useNavigation();

  // handle when a user adds a friend to their favourite list, add their name to the favourites field in the users collection
  const handleFavourite = () => {
    db.collection("users")
      .doc(id)
      .set(
        {
          favourites: {
            [friendName]: true,
          },
        },
        {
          merge: true,
        }
      );
  };

  return (
    <SafeAreaView style={tw`flex-1 items-center bg-gray-100`}>
      {/* Go back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={tw`absolute top-22 left-10`}
      >
        <ArrowLeftIcon size={30} color="black" />
      </TouchableOpacity>

      {/* Profile Information */}
      <View
        style={tw`border-2 w-80 h-75 items-center mt-22 bg-white border-gray-200 rounded-2xl`}
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
        <View style={tw`mt-14 mb-1 items-center`}>
          <Text style={tw`text-2xl font-bold mb-1`}>{friendName}</Text>
          <Text>{friendEmail}</Text>
        </View>

        {favourite ? (
          <View style={tw`mt-1 mb-2`}>
            <StarIcon size={22} color="#FDDA0D" />
          </View>
        ) : (
          <View style={tw`mt-1 mb-2`}>
            <StarIconOutline size={22} color="black" />
          </View>
        )}

        {friendStatus ? (
          <View style={tw`mt-3 mb-7`}>
            <Text>"{friendStatus}"</Text>
          </View>
        ) : (
          <View style={tw`mt-3 mb-7`}>
            <Text>No Status</Text>
          </View>
        )}

        <View style={tw`flex-row w-50 justify-between`}>
          <View style={tw`items-center`}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Chat", {
                  id,
                  friendAvatar,
                  friendName,
                  friendEmail,
                  friendStatus,
                })
              }
              style={tw`rounded-full p-3 bg-[#90bef5] mb-1`}
            >
              <ChatBubbleLeftRightIcon size={36} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-gray-500`}>Chat</Text>
          </View>

          <View style={tw`items-center`}>
            <TouchableOpacity style={tw`rounded-full p-3 bg-[#97f0b9] mb-1`}>
              <VideoCameraIcon size={36} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-gray-500`}>Video Call</Text>
          </View>
        </View>
      </View>
      <View style={tw`mt-5`}>
        <TouchableOpacity
          onPress={handleFavourite}
          style={tw`flex-row items-center justify-between w-80 border-2 mb-3 px-3 py-3 rounded-xl border-gray-200`}
        >
          <View style={tw`rounded-full p-2 bg-[#FDDA0D]`}>
            <StarIcon size={24} color="white" />
          </View>
          {favourite ? (
            <View style={tw`flex-1 pl-5`}>
              <Text>Remove from Favourites</Text>
            </View>
          ) : (
            <View style={tw`flex-1 pl-5`}>
              <Text>Add to Favourites</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-row items-center justify-between w-80 border-2 mb-3 px-3 py-3 rounded-xl border-gray-200`}
        >
          <View style={tw`rounded-full p-2 bg-[#f27480]`}>
            <TrashIcon size={24} color="white" />
          </View>
          <View style={tw`flex-1 pl-5`}>
            <Text>Delete Contact</Text>
          </View>
          <View>
            <ChevronRightIcon size={24} color="#8e8f91" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FriendScreen;
