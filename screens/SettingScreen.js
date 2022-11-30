import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  ChatBubbleLeftRightIcon,
  UserPlusIcon,
  UserIcon,
  CameraIcon,
} from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/core";
import AddFriendModal from "../components/AddFriendModal";

const SettingScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  // get the logged in user email through auth
  const loggedInUserEmail = auth.currentUser.email;

  // get the logged in user info
  const [userSnapshot] = useCollection(
    db.collection("users").where("email", "==", loggedInUserEmail)
  );

  const user = userSnapshot?.docs?.[0]?.data();

  console.log(user);

  return (
    <SafeAreaView style={tw`flex-1 items-center bg-gray-100`}>
      {/* Modal - Add friend */}
      <AddFriendModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />

      {/* Heading */}
      <View style={tw`my-6`}>
        <Text style={tw`font-semibold text-3xl`}>Setting</Text>
      </View>

      {/* Profile Information */}
      <View
        style={tw`border-2 w-80 h-70 items-center mt-18 bg-white border-gray-200 rounded-2xl`}
      >
        <View
          style={[
            tw`absolute -top-14 w-25 h-25 justify-center items-center bg-gray-200 p-2 m-1 rounded-full border-2`,
            { borderColor: "#cad4fc" },
          ]}
        >
          {user?.photoURL ? (
            <Image
              source={{ uri: "data:image/jpeg;base64," + user?.photoURL }}
              style={[
                tw`w-25 h-25 rounded-full border-2`,
                { borderColor: "#a8b8ff" },
              ]}
            />
          ) : (
            <UserIcon color="black" size={40} />
          )}
        </View>
        <TouchableOpacity style={tw`mt-14`}>
          <CameraIcon size={30} color="#c4c4c4" />
        </TouchableOpacity>
        <View style={tw`mt-2 mb-8 items-center`}>
          <Text style={tw`text-2xl font-bold`}>{user?.displayName}</Text>
          <Text>{user?.email}</Text>
        </View>

        <View style={tw`flex-row w-50 justify-between`}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={tw`rounded-full p-3 bg-[#90bef5]`}
          >
            <ChatBubbleLeftRightIcon size={36} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={tw`rounded-full p-3 bg-[#97f0b9]`}
          >
            <UserPlusIcon size={36} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingScreen;
