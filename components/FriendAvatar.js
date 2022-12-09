import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { UserIcon } from "react-native-heroicons/solid";
import tw from "twrnc";
import getFriendEmail from "../utils/getFriendEmail";
import { useCollection } from "react-firebase-hooks/firestore";
import { useNavigation } from "@react-navigation/core";

const FriendAvatar = ({ id, users, loggedInUserEmail, input, theme }) => {
  const navigation = useNavigation();

  // use the function that filters out your email and leaves only your friend's email
  const friendEmail = getFriendEmail(users, loggedInUserEmail)[0];

  // get the avatar of the friend
  const [friendSnapshot] = useCollection(
    db.collection("users").where("email", "==", friendEmail)
  );

  const friendAvatar = friendSnapshot?.docs?.[0]?.data().photoURL;
  const friendName = friendSnapshot?.docs?.[0]?.data().displayName;

  // getting messages snapshot from the database
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
  // when a user clicks on their friend, navigate to chat screen
  const handleOpenChat = () => {
    // set the messages "read" property to true since opening the chat means they have read all the messages sent by the friend
    messagesSnapshot?.docs?.forEach((doc) => {
      // update each message 1 by 1 and set read to true
      db.collection("chats").doc(id).collection("messages").doc(doc.id).set(
        {
          read: true,
        },
        { merge: true }
      );
    });

    navigation.navigate("Chat", {
      id,
      friendAvatar,
      friendName,
      friendEmail,
    });
  };

  return (
    <>
      {/* if the name of the friend matches/includes the search input, display the avatar, if not, don't display it */}
      {friendName?.toLowerCase().includes(input) ? (
        <View style={tw`ml-2`}>
          <TouchableOpacity
            onPress={handleOpenChat}
            style={tw`w-15 h-15 justify-center items-center bg-gray-200 p-2 m-1 rounded-full`}
          >
            {friendAvatar ? (
              <Image
                source={{ uri: "data:image/jpeg;base64," + friendAvatar }}
                style={[
                  tw`w-15 h-15 rounded-full border-2`,
                  { borderColor: `${theme?.primary[0]}` },
                ]}
              />
            ) : (
              <UserIcon color="black" />
            )}
          </TouchableOpacity>
          <View style={tw`w-16 mt-1 justify-center items-center`}>
            {friendName ? (
              <Text style={tw`font-normal`}>{friendName}</Text>
            ) : (
              <Text style={tw`font-normal`}>{friendEmail}</Text>
            )}
          </View>
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

export default FriendAvatar;
