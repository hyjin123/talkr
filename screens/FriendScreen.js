import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import tw from "twrnc";
import {
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  StarIcon,
  TrashIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  NoSymbolIcon,
} from "react-native-heroicons/solid";
import Modal from "react-native-modal";
import { StarIcon as StarIconOutline } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/core";
import { getFavourites } from "../utils/getFavourites";
import { getBlocked } from "../utils/getBlocked";

const FriendScreen = ({
  route,
  theme,
  favouriteChange,
  setFavouriteChange,
}) => {
  // to force a re-render of the friends page after favourite has been changed
  const [favourites, setFavourites] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [chatId, setChatId] = useState("");

  // destrucutre the params sent through navigation
  const { id, friendAvatar, friendName, friendEmail, friendStatus } =
    route.params;

  const navigation = useNavigation();
  const loggedInUserEmail = auth.currentUser.email;

  // handle when a user adds a friend to their favourite list, add their name to the favourites field in the users collection
  const handleFavourite = () => {
    // if removing from favourite list
    if (favourites?.[friendName]) {
      db.collection("users")
        .doc(id)
        .set(
          {
            favourites: {
              [friendName]: false,
            },
          },
          {
            merge: true,
          }
        );
    } else {
      // if adding to the favourite list
      db.collection("users")
        .doc(id)
        .set(
          {
            favourites: {
              [friendName]: true,
            },
          },
          {
            merge: true,
          }
        );
    }

    // this will trigger the useEffect in the contacts page so it can re-render with new info
    setFavouriteChange(!favouriteChange);
  };

  useEffect(() => {
    // this is needed, every time there is a favourite change, you need to get the new favourites list and re-render the component
    getFavourites(loggedInUserEmail).then((data) => {
      setFavourites(data);
    });

    // retrieve the chat Id
    getChatId(loggedInUserEmail, friendEmail).then((data) => setChatId(data));
  }, [favouriteChange]);

  const handleContactDelete = () => {
    // modify the firebase database to handle this action
    db.collection("chats")
      .doc(chatId)
      .set(
        {
          blocked: { [loggedInUserEmail]: true },
        },
        {
          merge: true,
        }
      );

    setModalVisible(false);
  };

  return (
    <SafeAreaView style={tw`flex-1 items-center bg-gray-100`}>
      {/* Modal - Block Contact */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-white my-75 mx-2 rounded-xl px-4`}
        >
          <Text style={tw`font-medium text-base text-center`}>
            Are you sure you want to block this contact? You won't be able to
            send or receive messages from this contact.
          </Text>
          <TouchableOpacity
            onPress={handleContactDelete}
            style={tw`bg-[${theme?.primary[0]}] font-bold rounded-full px-15 py-2 mt-6`}
          >
            <Text style={tw`text-black`}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Go back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={tw`absolute top-22 left-10`}
      >
        <ArrowLeftIcon size={30} color="black" />
      </TouchableOpacity>

      {/* Profile Information */}
      <View
        style={tw`border-2 w-80 h-75 items-center mt-22 bg-white border-gray-200 rounded-2xl`}
      >
        <View
          style={[
            tw`absolute -top-14 w-25 h-25 justify-center items-center bg-gray-200 p-2 m-1 rounded-full border-2`,
            { borderColor: `${theme.primary[0]}` },
          ]}
        >
          <Image
            source={{ uri: "data:image/jpeg;base64," + friendAvatar }}
            style={[
              tw`w-25 h-25 rounded-full border-2`,
              { borderColor: `${theme.primary[0]}` },
            ]}
          />
        </View>
        <View style={tw`mt-14 mb-1 items-center`}>
          <Text style={tw`text-2xl font-bold mb-1`}>{friendName}</Text>
          <Text>{friendEmail}</Text>
        </View>

        {favourites?.[friendName] ? (
          <View style={tw`mt-1 mb-2`}>
            <StarIcon size={22} color="#FDDA0D" />
          </View>
        ) : (
          <View style={tw`mt-1 mb-2`}>
            <StarIconOutline size={22} color="black" />
          </View>
        )}

        {friendStatus ? (
          <View style={tw`mt-3 mb-7`}>
            <Text>"{friendStatus}"</Text>
          </View>
        ) : (
          <View style={tw`mt-3 mb-7`}>
            <Text>No Status</Text>
          </View>
        )}

        <View style={tw`flex-row w-50 justify-between`}>
          <View style={tw`items-center`}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Chat", {
                  id,
                  friendAvatar,
                  friendName,
                  friendEmail,
                  friendStatus,
                })
              }
              style={tw`rounded-full p-3 bg-[#90bef5] mb-1`}
            >
              <ChatBubbleLeftRightIcon size={36} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-gray-500`}>Chat</Text>
          </View>

          <View style={tw`items-center`}>
            <TouchableOpacity style={tw`rounded-full p-3 bg-[#97f0b9] mb-1`}>
              <VideoCameraIcon size={36} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-gray-500`}>Video Call</Text>
          </View>
        </View>
      </View>
      <View style={tw`mt-5`}>
        <TouchableOpacity
          onPress={handleFavourite}
          style={tw`flex-row items-center justify-between w-80 border-2 mb-3 px-3 py-3 rounded-xl border-gray-200`}
        >
          <View style={tw`rounded-full p-2 bg-[#FDDA0D]`}>
            <StarIcon size={24} color="white" />
          </View>
          {favourites?.[friendName] ? (
            <View style={tw`flex-1 pl-5`}>
              <Text>Remove from Favourites</Text>
            </View>
          ) : (
            <View style={tw`flex-1 pl-5`}>
              <Text>Add to Favourites</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={tw`flex-row items-center justify-between w-80 border-2 mb-3 px-3 py-3 rounded-xl border-gray-200`}
        >
          <View style={tw`rounded-full p-2 bg-[#f27480]`}>
            <NoSymbolIcon size={24} color="white" />
          </View>
          <View style={tw`flex-1 pl-5`}>
            <Text>Block Contact</Text>
          </View>
          <View>
            <ChevronRightIcon size={24} color="#8e8f91" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FriendScreen;
