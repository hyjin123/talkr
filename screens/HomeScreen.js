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
  ArrowTopRightOnSquareIcon,
} from "react-native-heroicons/solid";
import ChatPreview from "../components/ChatPreview";
import SearchBar from "../components/SearchBar";

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addedEmail, setAddedEmail] = useState("");
  const [signoutModalVisible, setSignoutModalVisible] = useState(false);

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
        navigation.replace("Login");
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
    <>
      {/* this SafeAreaView is set so that the top of the screen's background remains white */}
      <SafeAreaView style={tw`flex-0 bg-white`} />
      <SafeAreaView style={tw`bg-gray-100 flex-1`}>
        {/* Modal - Add friend */}
        <Modal
          isVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
        >
          <View
            style={tw`flex-1 justify-center items-center bg-white my-80 mx-5`}
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

        {/* Modal - Signout */}
        <Modal
          isVisible={signoutModalVisible}
          onBackdropPress={() => setSignoutModalVisible(false)}
        >
          <View
            style={tw`flex-1 justify-center items-center bg-white my-80 mx-5`}
          >
            <Text style={tw`font-medium text-lg`}>
              Are you sure you want to sign out?
            </Text>
            <TouchableOpacity
              onPress={handleSignOut}
              style={tw`bg-[#fff9bb] font-bold rounded-full px-15 py-2 mt-6`}
            >
              <Text style={tw`text-black`}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Header */}
        <View style={tw`flex-row justify-between p-5 bg-white`}>
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
              onPress={() => setSignoutModalVisible(true)}
              style={tw`flex-1 items-center w-15 bg-[#fff9bb] p-2 m-1 rounded-full`}
            >
              <ArrowTopRightOnSquareIcon size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <SearchBar
          chatsSnapshot={chatsSnapshot}
          loggedInUserEmail={loggedInUserEmail}
        />

        {/* Body - List of chat preview */}
        <ScrollView
          vertical
          showsVerticalScrollIndicator={false}
          style={tw`bg-gray-100 -mt-5 pt-6 h-100`}
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
    </>
  );
};

export default HomeScreen;
