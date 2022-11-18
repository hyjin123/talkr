import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { auth, db } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import { useCollection } from "react-firebase-hooks/firestore";
import Modal from "react-native-modal";
import * as EmailValidator from "email-validator";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon,
} from "react-native-heroicons/solid";
import FriendAvatar from "../components/FriendAvatar";
import ChatPreview from "../components/ChatPreview";

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addedEmail, setAddedEmail] = useState("");

  const navigation = useNavigation();

  // get the logged in user id through auth
  const loggedInUserEmail = auth.currentUser.email;

  // get the snapshot of the logged in user through firestore database
  // useCollection retrieves and monitors a collection value in Cloud Firestore
  const [userSnapshot] = useCollection(
    db.collection("users").where("email", "==", loggedInUserEmail)
  );

  // get the user info
  const user = userSnapshot?.docs?.[0]?.data();

  // user sign out
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("GetStarted");
      })
      .catch((error) => alert(error.message));
  };

  // user submits add a friend
  // get a chat collection snapchat from firebase
  const [chatsSnapshot] = useCollection(
    db.collection("chats").where("users", "array-contains", loggedInUserEmail)
  );

  // console.log(chatsSnapshot?.docs?.[0]?.data());

  // check to see if the chat collection already exists in the database
  const doesChatExist = (addedEmail) => {
    return !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === addedEmail)?.length > 0
    );
  };

  const creatChat = () => {
    // check to see if email is in correct format
    if (
      EmailValidator.validate(addedEmail) &&
      addedEmail !== loggedInUserEmail &&
      !doesChatExist(addedEmail)
    ) {
      db.collection("chats").add({
        users: [loggedInUserEmail, addedEmail],
      });
    }
    setAddedEmail("");
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      {/* Modal - Add friend */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-white my-80 mx-10`}
        >
          <Text>Add a Friend</Text>
          <TextInput
            placeholder="Enter Email"
            placeholderTextColor="gray"
            value={addedEmail}
            onChangeText={(text) => setAddedEmail(text)}
            style={tw`border-2 border-gray-300 rounded-full py-1 w-50 p-2 mt-3`}
          />
          <TouchableOpacity
            onPress={creatChat}
            style={tw`bg-[#fff9bb] font-bold rounded-full px-15 py-2 mt-6`}
          >
            <Text style={tw`text-black`}>ADD</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Header */}
      <View style={tw`flex-row justify-between m-5`}>
        <View>
          <Text style={tw`text-gray-600 text-base`}>
            Welcome {user?.displayName} 👋
          </Text>
          <Text style={tw`tracking-wider font-bold text-xl`}>talkr</Text>
        </View>
        <View style={tw`flex-row w-30`}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={tw`flex-1 items-center w-25 bg-[#fff9bb] p-2 m-1 rounded-full`}
          >
            <PlusIcon size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignOut}
            style={tw`flex-1 items-center w-15 bg-[#fff9bb] p-2 m-1 rounded-full`}
          >
            <ArrowTopRightOnSquareIcon size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View
        style={tw`bg-white flex-row pl-3 pb-8 border-gray-100 rounded-br-3xl rounded-bl-3xl border-b-4 border-l-2 border-r-2 z-5`}
      >
        <View style={tw`ml-2`}>
          <TouchableOpacity
            style={tw`w-15 h-15 justify-center items-center bg-gray-100 p-2 m-1 rounded-full border-2 border-gray-200`}
          >
            <MagnifyingGlassIcon color="gray" size={26} />
          </TouchableOpacity>
          <View style={tw`w-16 mt-1 justify-center items-center`}>
            <Text style={tw`font-light`}>Search</Text>
          </View>
        </View>
        {/* Loop through each existing chat and display friend's avatar and name beside the search bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {chatsSnapshot?.docs.map((chat) => (
            <FriendAvatar
              key={chat.id}
              id={chat.id}
              users={chat.data().users}
              loggedInUserEmail={loggedInUserEmail}
            />
          ))}
        </ScrollView>
      </View>

      {/* Body - List of chat preview */}
      <ScrollView
        vertical
        showsVerticalScrollIndicator={false}
        style={tw`bg-gray-50 -mt-5 pt-6 h-100`}
      >
        {chatsSnapshot?.docs.map((chat) => (
          <ChatPreview
            key={chat.id}
            id={chat.id}
            users={chat.data().users}
            loggedInUserEmail={loggedInUserEmail}
          />
        ))}
      </ScrollView>

      {/* Tab Navigation */}
    </SafeAreaView>
  );
};

export default HomeScreen;
