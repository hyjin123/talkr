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
import EmojiPicker from "emoji-picker-react";

const ChatScreen = ({ route, navigation }) => {
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef(null);

  const { id, friendAvatar, friendName, friendEmail } = route.params;

  // get user information in order to get user.iud (this will help set the last active status)
  const [user] = useAuthState(auth);

  // get the logged in user email through auth
  const loggedInUserEmail = auth.currentUser.email;

  // get a chat collection snapchat from firebase
  const [chatsSnapshot] = useCollection(
    db.collection("chats").where("users", "array-contains", loggedInUserEmail)
  );

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
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
    });

    // reset input
    setInput("");
    // scrollToBottom();
  };

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center m-5`}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <ArrowLeftIcon size={24} color="black" />
        </TouchableOpacity>
        <View style={tw`flex-row flex-1 items-center ml-4`}>
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

          <View style={tw`pl-3`}>
            {friendName ? (
              <Text style={tw`text-lg font-bold`}>{friendName}</Text>
            ) : (
              <Text style={tw`text-sm font-bold`}>{friendEmail}</Text>
            )}
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
      <ScrollView style={tw`flex-1 bg-gray-100 pt-6`}>
        {showMessages()}
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
  );
};

export default ChatScreen;
