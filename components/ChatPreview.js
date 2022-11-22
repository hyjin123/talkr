import { View, Text, Image, TouchableOpacity } from "react-native";
import { db } from "../firebase";
import React from "react";
import tw from "twrnc";
import { useCollection } from "react-firebase-hooks/firestore";
import { UserIcon } from "react-native-heroicons/solid";
import getFriendEmail from "../utils/getFriendEmail";
import { useNavigation } from "@react-navigation/core";
import moment from "moment";

const ChatPreview = ({ id, users, loggedInUserEmail }) => {
  const navigation = useNavigation();

  // use the function that filters out your email and leaves only your friend's email
  const friendEmail = getFriendEmail(users, loggedInUserEmail);

  // get the avatar of the friend
  const [friendSnapshot] = useCollection(
    db.collection("users").where("email", "==", friendEmail[0])
  );

  const friendAvatar = friendSnapshot?.docs?.[0]?.data().photoURL;
  const friendName = friendSnapshot?.docs?.[0]?.data().displayName;

  // when a user clicks on their friend, navigate to chat screen
  const handleOpenChat = () => {
    navigation.navigate("Chat", {
      id,
      friendAvatar,
      friendName,
      friendEmail,
    });
  };

  // getting messages snapshot from the database
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  // get the information about the latest message from either yourself or your friend so that it displays on preview
  const messagesSnapshotLength = messagesSnapshot?.docs.length;
  const latestMessage =
    messagesSnapshot?.docs[messagesSnapshotLength - 1]?.data();

  return (
    <>
      {/* if there are any messages, show the preview, if not, nothing */}
      {messagesSnapshotLength > 0 ? (
        <TouchableOpacity
          onPress={handleOpenChat}
          style={tw`border-b-2 border-gray-200`}
        >
          <View style={tw`flex-row justify-between items-center p-4`}>
            <View
              style={tw`w-15 h-15 justify-center items-center bg-gray-200 p-2 m-1 rounded-full`}
            >
              {friendAvatar ? (
                <Image
                  source={{ uri: "data:image/jpeg;base64," + friendAvatar }}
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
              {latestMessage?.message ? (
                <Text style={tw`font-light text-xs`}>
                  {latestMessage?.message}
                </Text>
              ) : (
                <Text style={tw`font-light text-xs`}>No messages</Text>
              )}
            </View>
            <View style={tw`mr-4`}>
              <Text style={tw`font-light text-xs`}>
                {latestMessage?.timestamp
                  ? moment(latestMessage?.timestamp.toDate().getTime()).format(
                      "LT"
                    )
                  : "..."}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </>
  );
};

export default ChatPreview;
