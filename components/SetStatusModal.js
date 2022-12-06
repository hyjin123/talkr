import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { auth, db } from "../firebase";
import Modal from "react-native-modal";

const SetStatusModal = ({
  statusModalVisible,
  setStatusModalVisible,
  theme,
}) => {
  const [status, setStatus] = useState("");
  // status has a character limit of 40
  const [count, setCount] = useState(40);

  // get the logged in user id through auth
  const userid = auth.currentUser.uid;

  // when user submits the status
  const handleStatusChange = () => {
    db.collection("users").doc(userid).set(
      {
        status,
      },
      { merge: true }
    );

    setStatusModalVisible(false);
    setStatus("");
    setCount(40);
  };

  return (
    <Modal
      isVisible={statusModalVisible}
      onBackdropPress={() => {
        setStatusModalVisible(false);
        setStatus("");
        setCount(40);
      }}
    >
      <View style={tw`flex-1 items-center bg-white my-72 mx-2 rounded-xl`}>
        <View style={tw`mt-8 mb-2`}>
          <Text>Set your status</Text>
        </View>
        <View>
          <TextInput
            placeholder="What are you up to?"
            placeholderTextColor="gray"
            value={status}
            onChangeText={(text) => {
              setStatus(text);
              setCount(40 - text.length);
            }}
            style={tw`border-2 border-gray-300 rounded-lg py-1 w-65 p-2 mt-3`}
          />
        </View>

        {/* Character limit */}
        <View style={tw`flex-row self-start ml-11 mt-2`}>
          <Text style={tw`${count > -1 ? "text-blue-500" : "text-red-500"}`}>
            {count}{" "}
          </Text>
          <Text style={tw`text-gray-400`}>(characters remaining)</Text>
        </View>

        <TouchableOpacity
          onPress={handleStatusChange}
          disabled={count < 0 ? true : false}
          style={tw`bg-[${
            theme?.primary[0]
          }] font-bold rounded-full px-15 py-2 mt-6 ${
            count < 0 ? "bg-gray-300" : ""
          }`}
        >
          <Text style={tw`text-black`}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SetStatusModal;
