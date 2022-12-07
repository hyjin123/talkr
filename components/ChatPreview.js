import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import { db } from "../firebase";
import React, { useRef, useState } from "react";
import tw from "twrnc";
import { useCollection } from "react-firebase-hooks/firestore";
import { UserIcon, TrashIcon } from "react-native-heroicons/solid";
import getFriendEmail from "../utils/getFriendEmail";
import { useNavigation } from "@react-navigation/core";
import moment from "moment";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";

const ChatPreview = ({ id, users, loggedInUserEmail, theme }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const swipeClose = useRef(null);

  const navigation = useNavigation();

  // use the function that filters out your email and leaves only your friend's email
  const friendEmail = getFriendEmail(users, loggedInUserEmail);

  // get the avatar of the friend
  const [friendSnapshot] = useCollection(
    db.collection("users").where("email", "==", friendEmail[0])
  );

  const friendAvatar = friendSnapshot?.docs?.[0]?.data().photoURL;
  const friendName = friendSnapshot?.docs?.[0]?.data().displayName;
  const friendStatus = friendSnapshot?.docs?.[0]?.data().status;

  // getting messages snapshot from the database
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  // getting chat snapshot from the database so we can see if the chat has been deleted or not
  const [chatSnapshot] = useCollection(db.collection("chats").doc(id));
  const chatDeletedStatus =
    chatSnapshot?.data()?.status[loggedInUserEmail]?.delete;

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

    // navigate to the chat screen
    navigation.navigate("Chat", {
      id,
      friendAvatar,
      friendName,
      friendEmail,
      friendStatus,
    });
  };

  // handle when a user clicks on the delete button
  const handleDelete = () => {
    // update the chat collection with the correct information, set the delete property to true for the logged in user
    db.collection("chats")
      .doc(id)
      .set(
        {
          status: { [loggedInUserEmail]: { delete: true } },
        },
        { merge: true }
      );
    setModalVisible(false);
    // close the swipeable after you delete the chat
    swipeClose.current.close();
  };

  // get the information about the latest message from either yourself or your friend so that it displays on preview
  const messagesSnapshotLength = messagesSnapshot?.docs.length;
  const latestMessage =
    messagesSnapshot?.docs[messagesSnapshotLength - 1]?.data();

  // Loop through the messages to see how many messages are unread and display it
  let unreadMessagesCount = 0;
  for (let i = 0; i < messagesSnapshotLength; i++) {
    // if the message is your friend's incoming message
    if (messagesSnapshot.docs[i].data().user === friendEmail[0]) {
      // if the message is your friend's message AND read is false, add to the unreadMessageCount
      if (messagesSnapshot.docs[i].data().read === false) {
        unreadMessagesCount += 1;
      }
    }
  }

  // when a user swipes right on the chat preview, this component will appear
  const rightAction = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={tw`bg-red-500 justify-center`}
      >
        <Animated.View
          style={[
            {
              transform: [{ translateX: scale }],
            },
          ]}
          style={tw`w-20 flex-1 justify-center items-center`}
        >
          <TrashIcon size={30} color="white" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/* Modal - Delete chat */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-white my-80 mx-5 px-6`}
        >
          <Text style={tw`font-medium text-lg`}>
            Are you sure you want to delete this chat?
          </Text>
          <TouchableOpacity
            onPress={handleDelete}
            style={tw`bg-[#fff9bb] font-bold rounded-full px-15 py-2 mt-6`}
          >
            <Text style={tw`text-black`}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Swipeable
        ref={swipeClose}
        renderRightActions={rightAction}
        friction={0.2}
      >
        <GestureHandlerRootView>
          {/* if there are any messages, show the preview, if not, nothing */}
          {messagesSnapshotLength > 0 && !chatDeletedStatus ? (
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
                      style={[
                        tw`w-15 h-15 rounded-full border-2`,
                        { borderColor: `${theme.primary[0]}` },
                      ]}
                    />
                  ) : (
                    <UserIcon color="black" />
                  )}
                </View>
                <View style={tw`flex-1 ml-4`}>
                  {friendName ? (
                    <Text style={tw`text-lg font-bold pb-1`}>{friendName}</Text>
                  ) : (
                    <Text style={tw`text-lg font-bold pb-1`}>
                      {friendEmail}
                    </Text>
                  )}
                  {latestMessage?.message ? (
                    <Text style={tw`font-light text-xs`}>
                      {latestMessage?.message}
                    </Text>
                  ) : (
                    <Text style={tw`font-light text-xs`}>No messages</Text>
                  )}
                </View>
                <View style={tw`mr-4 justify-center items-center`}>
                  <View>
                    <Text style={tw`font-light text-xs`}>
                      {latestMessage?.timestamp
                        ? moment(
                            latestMessage?.timestamp.toDate().getTime()
                          ).format("LT")
                        : "..."}
                    </Text>
                  </View>
                  {unreadMessagesCount > 0 ? (
                    <LinearGradient
                      colors={theme.message}
                      style={tw`p-2 px-4 mt-2 rounded-full bg-[#fff9bb]`}
                    >
                      <Text style={tw`text-center font-bold text-white`}>
                        {unreadMessagesCount}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <></>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </GestureHandlerRootView>
      </Swipeable>
    </>
  );
};

export default ChatPreview;
