import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
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
  PencilSquareIcon,
  WrenchScrewdriverIcon,
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon,
  QuestionMarkCircleIcon,
} from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/core";
import AddFriendModal from "../components/AddFriendModal";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import Modal from "react-native-modal";

const SettingScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [signoutModalVisible, setSignoutModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  const navigation = useNavigation();

  // get the logged in user email through auth
  const loggedInUserEmail = auth.currentUser.email;

  // get the logged in user info
  const [userSnapshot] = useCollection(
    db.collection("users").where("email", "==", loggedInUserEmail)
  );

  const user = userSnapshot?.docs?.[0]?.data();
  const userId = userSnapshot?.docs?.[0].id;

  // user picking an image for their avatar
  const pickImage = async () => {
    // User picks an image from their phone gallery
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (result.canceled) {
      return;
    }

    // compresses and resizes the image so that it fits into firebase database
    const manipResult = await manipulateAsync(
      result.assets[0].uri,
      [{ resize: { width: 120, height: 120 } }],
      {
        compress: 0.2,
        base64: true,
        format: SaveFormat.PNG,
      }
    );

    // reset their profile pic when the component re-renders so that it changes on their view
    db.collection("users").doc(userId).set(
      {
        photoURL: manipResult.base64,
      },
      { merge: true }
    );

    Alert.alert("Photo successfully uploaded!");
  };

  // user sign out
  const handleSignOut = () => {
    setSignoutModalVisible(false);

    auth
      .signOut()
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => alert(error.message));
  };

  // help modal

  return (
    <SafeAreaView style={tw`flex-1 items-center bg-gray-100`}>
      {/* Modal - Add friend */}
      <AddFriendModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />

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

      {/* Modal - Help */}
      <Modal
        isVisible={helpModalVisible}
        onBackdropPress={() => setHelpModalVisible(false)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-white my-80 mx-2 px-2`}
        >
          <Text style={tw`font-base text-lg`}>
            Please email seanhoyeonjin@gmail.com if you have any questions.
          </Text>
        </View>
      </Modal>

      {/* Heading */}
      <View style={tw`my-6`}>
        <Text style={tw`font-semibold text-3xl`}>Setting</Text>
      </View>

      {/* Profile Information */}
      <View
        style={tw`border-2 w-80 h-70 items-center mt-12 bg-white border-gray-200 rounded-2xl`}
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
        <TouchableOpacity onPress={pickImage} style={tw`mt-14`}>
          <CameraIcon size={30} color="#c4c4c4" />
        </TouchableOpacity>
        <View style={tw`mt-2 mb-8 items-center`}>
          <Text style={tw`text-2xl font-bold`}>{user?.displayName}</Text>
          <Text>{user?.email}</Text>
        </View>

        <View style={tw`flex-row w-50 justify-between`}>
          <View style={tw`items-center`}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={tw`rounded-full p-3 bg-[#90bef5] mb-1`}
            >
              <ChatBubbleLeftRightIcon size={36} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-gray-500`}>Chat</Text>
          </View>

          <View style={tw`items-center`}>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={tw`rounded-full p-3 bg-[#97f0b9] mb-1`}
            >
              <UserPlusIcon size={36} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-gray-500`}>Add Friend</Text>
          </View>
        </View>
      </View>

      {/* Edit Profile */}
      <ScrollView style={tw`mt-5`}>
        <TouchableOpacity
          style={tw`flex-row items-center justify-between w-80 border-2 mb-3 px-3 py-4 rounded-xl border-gray-200`}
        >
          <View style={tw`rounded-full p-2 bg-[#d4c2ed]`}>
            <PencilSquareIcon size={24} color="white" />
          </View>
          <View style={tw`flex-1 pl-5`}>
            <Text>Edit Status</Text>
          </View>
          <View>
            <ChevronRightIcon size={24} color="#8e8f91" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex-row items-center justify-between w-80 border-2 mb-3 px-3 py-4 rounded-xl border-gray-200`}
        >
          <View style={tw`rounded-full p-2 bg-[#f2ca8d]`}>
            <WrenchScrewdriverIcon size={24} color="white" />
          </View>
          <View style={tw`flex-1 pl-5`}>
            <Text>Edit Theme</Text>
          </View>
          <View>
            <ChevronRightIcon size={24} color="#8e8f91" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setHelpModalVisible(true)}
          style={tw`flex-row items-center justify-between w-80 border-2 mb-3 px-3 py-4 rounded-xl border-gray-200`}
        >
          <View style={tw`rounded-full p-2 bg-[#abdfed]`}>
            <QuestionMarkCircleIcon size={24} color="white" />
          </View>
          <View style={tw`flex-1 pl-5`}>
            <Text>Help</Text>
          </View>
          <View>
            <ChevronRightIcon size={24} color="#8e8f91" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSignoutModalVisible(true)}
          style={tw`flex-row items-center justify-between w-80 border-2 mb-3 px-3 py-4 rounded-xl border-gray-200`}
        >
          <View style={tw`rounded-full p-2 bg-[#f27480]`}>
            <ArrowTopRightOnSquareIcon size={24} color="white" />
          </View>
          <View style={tw`flex-1 pl-5`}>
            <Text>Sign Out</Text>
          </View>
          <View>
            <ChevronRightIcon size={24} color="#8e8f91" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingScreen;
