import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { db } from "../firebase";
import { UserIcon } from "react-native-heroicons/solid";
import tw from "twrnc";
import getFriendEmail from "../utils/getFriendEmail";
import { useCollection } from "react-firebase-hooks/firestore";

const FriendAvatar = ({ users, loggedInUserEmail }) => {
  // use the function that filters out your email and leaves only your friend's email
  const friendEmail = getFriendEmail(users, loggedInUserEmail);

  // get the avatar of the friend
  const [friendSnapshot] = useCollection(
    db.collection("users").where("email", "==", friendEmail[0])
  );

  const friendAvatar = friendSnapshot?.docs?.[0]?.data().photoURL;

  return (
    <>
      <View style={tw`ml-2`}>
        <TouchableOpacity
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
        </TouchableOpacity>
        <View style={tw`w-16 mt-1 justify-center items-center`}>
          <Text style={tw`text-xs`}>{friendEmail[0]}</Text>
        </View>
      </View>
    </>
  );
};

export default FriendAvatar;
