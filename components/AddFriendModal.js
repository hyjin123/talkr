import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Modal from "react-native-modal";
import * as EmailValidator from "email-validator";

const AddFriendModal = ({ modalVisible, setModalVisible }) => {
  const [addedEmail, setAddedEmail] = useState("");

  // get the logged in user id through auth
  const loggedInUserEmail = auth.currentUser.email;

  // user submits add a friend
  // get a chat collection snapchat from firebase
  const [chatsSnapshot] = useCollection(
    db.collection("chats").where("users", "array-contains", loggedInUserEmail)
  );

  const [usersSnapshot] = useCollection(
    db.collection("users").where("email", "==", addedEmail)
  );

  // console.log("this is the users snapshot", usersSnapshot?.docs?.length);

  // check to see if the chat collection already exists in the database
  const doesChatExist = (addedEmail) => {
    return !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === addedEmail)?.length > 0
    );
  };

  // check to see if the user exists in the database, cannot add if they are not registered
  const doesUserExist = (addedEmail) => {
    return usersSnapshot.docs.length;
  };

  const creatChat = () => {
    // check to see if email is in correct format
    if (
      EmailValidator.validate(addedEmail) &&
      addedEmail !== loggedInUserEmail &&
      !doesChatExist(addedEmail) &&
      doesUserExist(addedEmail)
    ) {
      db.collection("chats").add({
        users: [loggedInUserEmail, addedEmail],
        status: {
          [loggedInUserEmail]: { delete: false },
          [addedEmail]: { delete: false },
        },
      });
    } else {
      Alert.alert("User is already added or User does not exist");
    }

    setAddedEmail("");
    setModalVisible(false);
  };

  return (
    <Modal
      isVisible={modalVisible}
      onBackdropPress={() => setModalVisible(false)}
    >
      <View style={tw`flex-1 justify-center items-center bg-white my-80 mx-5`}>
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
  );
};

export default AddFriendModal;
