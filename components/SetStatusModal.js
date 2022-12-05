import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Modal from "react-native-modal";
import * as EmailValidator from "email-validator";

const SetStatusModal = ({
  statusModalVisible,
  setStatusModalVisible,
  theme,
}) => {
  const [status, setStatus] = useState("");

  // get the logged in user id through auth
  const loggedInUserEmail = auth.currentUser.email;

  return (
    <Modal
      isVisible={statusModalVisible}
      onBackdropPress={() => setStatusModalVisible(false)}
    >
      <View
        style={tw`flex-1 justify-center items-center bg-white my-80 mx-2 rounded-xl`}
      >
        <Text>Set your status</Text>
        <TextInput
          placeholder="What are you up to?"
          placeholderTextColor="gray"
          value={status}
          onChangeText={(text) => setStatus(text)}
          style={tw`border-2 border-gray-300 rounded-lg py-1 w-65 p-2 mt-3`}
        />
        <TouchableOpacity
          style={tw`bg-[${theme?.primary[0]}] font-bold rounded-full px-15 py-2 mt-6`}
        >
          <Text style={tw`text-black`}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SetStatusModal;
