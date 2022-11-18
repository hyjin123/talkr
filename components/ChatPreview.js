import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { db } from "../firebase";
import React from "react";
import tw from "twrnc";
import { useCollection } from "react-firebase-hooks/firestore";
import { UserIcon } from "react-native-heroicons/solid";
import getFriendEmail from "../utils/getFriendEmail";

const ChatPreview = ({ users, loggedInUserEmail }) => {
  // use the function that filters out your email and leaves only your friend's email
  const friendEmail = getFriendEmail(users, loggedInUserEmail);

  // get the avatar of the friend
  const [friendSnapshot] = useCollection(
    db.collection("users").where("email", "==", friendEmail[0])
  );

  const friendAvatar = friendSnapshot?.docs?.[0]?.data().photoURL;
  const friendName = friendSnapshot?.docs?.[0]?.data().displayName;

  return (
    <TouchableOpacity style={tw`border-b-2 border-gray-100`}>
      <View style={tw`flex-row justify-between items-center p-4`}>
        <View
          style={tw`w-15 h-15 justify-center items-center bg-gray-200 p-2 m-1 rounded-full`}
        >
          {friendAvatar ? (
            <Image
              source={{ uri: friendAvatar }}
              style={tw`w-15 h-15 rounded-full border-2 border-gray-200`}
            />
          ) : (
            <UserIcon color="black" />
          )}
        </View>
        <View style={tw`flex-1 ml-4`}>
          {friendName ? (
            <Text style={tw`text-lg font-bold pb-1`}>{friendName}</Text>
          ) : (
            <Text style={tw`text-lg font-bold pb-1`}>{friendEmail}</Text>
          )}
          <Text style={tw`font-light text-xs`}>
            Hello, how are you doing?...
          </Text>
        </View>
        <View>
          <Text>00:21</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatPreview;