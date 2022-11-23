import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useRef } from "react";
import tw from "twrnc";
import { ArrowLeftIcon, UserIcon } from "react-native-heroicons/solid";
import {
  PaperAirplaneIcon,
  VideoCameraIcon,
  PhoneIcon,
  FaceSmileIcon,
  MicrophoneIcon,
} from "react-native-heroicons/outline";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";
import Messages from "../components/Messages";
import TimeAgo from "react-native-timeago";

const ChatScreen = ({ route, navigation }) => {
  const [input, setInput] = useState("");
  const scrollViewRef = useRef();

  const { id, friendAvatar, friendName, friendEmail } = route.params;

  // get user information in order to get user.iud (this will help set the last active status)
  const [user] = useAuthState(auth);

  // get the logged in user email through auth
  const loggedInUserEmail = auth.currentUser.email;

  // get a chat collection snapchat from firebase
  const [chatsSnapshot] = useCollection(
    db.collection("chats").where("users", "array-contains", loggedInUserEmail)
  );

  // get all the friend information - need their last active status through this
  const [friendSnapshot] = useCollection(
    db.collection("users").where("email", "==", friendEmail[0])
  );

  const friend = friendSnapshot?.docs?.[0]?.data();

  // getting messages snapshot from the database
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  // showing all the messages
  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Messages
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
          loggedInUserEmail={loggedInUserEmail}
        />
      ));
    }
  };

  // When a user sends a meesage
  const sendMessage = (e) => {
    e.preventDefault();

    // update last active/seen to current time when a user sends a message
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // add the content of the message to messages collection within chats collection
    db.collection("chats").doc(id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
      read: false,
    });

    // reset input
    setInput("");
  };

  return (
    <>
      {/* this SafeAreaView is set so that the top of the screen's background remains white */}
      <SafeAreaView style={tw`flex-0 bg-white`} />
      <SafeAreaView style={tw`bg-gray-100 flex-1`}>
        {/* Header */}
        <View style={tw`flex-row justify-between items-center p-5 bg-white`}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <ArrowLeftIcon size={24} color="black" />
          </TouchableOpacity>
          <View style={tw`flex-row flex-1 items-center ml-2`}>
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

            <View style={tw`pl-2`}>
              {friendName ? (
                <Text style={tw`text-lg font-bold`}>{friendName}</Text>
              ) : (
                <Text style={tw`text-sm font-bold`}>{friendEmail}</Text>
              )}
              {friendSnapshot ? (
                <Text style={tw`text-xs`}>
                  Last Active: {"\n"}
                  {friend?.lastSeen?.toDate() ? (
                    <TimeAgo time={friend?.lastSeen?.toDate()} />
                  ) : (
                    "Unavailable"
                  )}
                </Text>
              ) : (
                <Text>Unavailable</Text>
              )}
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
        <ScrollView
          style={tw`flex-1 bg-gray-100 pt-6 pb-6`}
          ref={scrollViewRef}
          // have it scrolled to the bottom to show the latest messages
          onContentSizeChange={() =>
            scrollViewRef?.current?.scrollToEnd({ animated: true })
          }
        >
          <View style={tw`pb-10`}>{showMessages()}</View>
        </ScrollView>

        {/* Keyboard Input */}
        <View style={tw`bg-gray-100 flex-row items-center justify-center pb-4`}>
          <View
            style={tw`h-14 border-2 border-r-0 items-center justify-center  border-gray-400 p-5 pl-2 rounded-l-3xl`}
          >
            <TouchableOpacity
              style={tw`bg-[#fff9bb] rounded-full items-center justify-center w-10 h-10`}
            >
              <MicrophoneIcon size={22} color="black" />
            </TouchableOpacity>
          </View>
          <View style={tw`h-14 border-b-2 border-t-2 border-gray-400`}>
            <TextInput
              placeholder="Type Message..."
              placeholderTextColor="gray"
              value={input}
              onChangeText={(text) => setInput(text)}
              style={tw`border-gray-300 w-50 h-13`}
            />
          </View>

          <View
            style={tw`h-14 border-2 border-l-0 items-center justify-center border-gray-400 p-4 rounded-r-3xl`}
          >
            {input.length > 0 ? (
              <TouchableOpacity
                onPress={sendMessage}
                style={tw`flex-1 items-center justify-center`}
              >
                <PaperAirplaneIcon size={22} color="black" />
              </TouchableOpacity>
            ) : (
              <View style={tw`flex-1 items-center justify-center`}>
                <PaperAirplaneIcon size={22} color="black" />
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ChatScreen;
