import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import tw from "twrnc";
import ContactsSearchBar from "../components/ContactsSearchBar";
import { AlphabetList } from "react-native-section-alphabet-list";
import { auth, db } from "../firebase";
import { getFriendsEmails, getFriendsData } from "../utils/getFriendData";
import TimeAgo from "react-native-timeago";
import { useNavigation } from "@react-navigation/core";
import { StarIcon } from "react-native-heroicons/solid";
import { getFavourites } from "../utils/getFavourites";
import { getBlockedList } from "../utils/getBlockedList";
import { getChatId } from "../utils/getChatId";
import { NoSymbolIcon } from "react-native-heroicons/solid";

const ContactsScreen = ({ theme, favouriteChange, blockChange }) => {
  const [data1, setData1] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [input, setInput] = useState("");
  const [favourites, setFavourites] = useState(null);

  const navigation = useNavigation();

  // get the logged in user email through auth
  const loggedInUserEmail = auth.currentUser.email;
  const userId = auth.currentUser.uid;

  useEffect(() => {
    // get all of the user's friend emails
    getFriendsEmails(loggedInUserEmail).then((friendEmails) => {
      getFriendsData(friendEmails).then(async (data) => {
        const tempArray = await Promise.all(
          data.map(async (item) => {
            let blocked;
            // retrieve the chat Id and get blocked list
            await getChatId(loggedInUserEmail, item.email).then(
              async (data) => {
                // get the blocked list
                await getBlockedList(data).then((data) => {
                  blocked = data;
                });
              }
            );

            return {
              value: item.displayName,
              key: item.displayName,
              email: item.email,
              lastSeen: item.lastSeen,
              photoURL: item.photoURL,
              status: item.status,
              blocked: blocked,
            };
          })
        );
        setData1(tempArray);
      });

      getFavourites(loggedInUserEmail).then((data) => {
        setFavourites(data);
      });
    });

    // once data is in the correct format, filter it based on the search
    // only run this if user searches something
    if (input.length > 0) {
      const filteredData = data1.filter((friend) =>
        friend.value.toLowerCase().includes(input)
      );
      setFilteredData(filteredData);
    }
  }, [input, favouriteChange, blockChange]);

  // when a user clicks on the friend's contact, it will take them to their profile.
  const handleClickContact = (
    friendName,
    friendEmail,
    friendAvatar,
    friendStatus
  ) => {
    navigation.navigate("Friend", {
      id: userId,
      friendAvatar,
      friendName,
      friendEmail,
      friendStatus,
    });
  };

  return (
    <SafeAreaView style={tw`flex-1 items-center bg-white`}>
      {/* Heading */}
      <View
        style={tw`py-6 items-center w-full bg-white border-gray-100 rounded-br-3xl rounded-bl-3xl border-b-4 border-l-2 border-r-2 z-5`}
      >
        <View style={tw`mb-4`}>
          <Text style={tw`font-semibold text-3xl`}>Contacts</Text>
        </View>

        {/* Search Bar */}
        <View>
          <ContactsSearchBar input={input} setInput={setInput} />
        </View>
      </View>

      {/* Body */}
      <View style={tw`flex-1 bg-gray-100 w-full pl-10 pr-5 pt-10 -mt-5`}>
        <AlphabetList
          // if user input is there, show filtered data, if not show all data (regular)
          data={input.length > 0 ? filteredData : data1}
          indexLetterStyle={{
            color: "#787775",
            fontSize: 15,
          }}
          style={tw`flex-1`}
          renderCustomItem={(item) => (
            <TouchableOpacity
              onPress={() =>
                handleClickContact(
                  item.value,
                  item.email,
                  item.photoURL,
                  item.status
                )
              }
              style={tw`flex-row my-3`}
            >
              <View style={tw`mr-3`}>
                <Image
                  source={{ uri: "data:image/jpeg;base64," + item.photoURL }}
                  style={[
                    tw`w-12 h-12 rounded-full border-2`,
                    { borderColor: `${theme.primary[0]}` },
                  ]}
                />
              </View>
              <View style={tw`justify-center w-35`}>
                <Text style={tw`font-semibold text-base`}>{item.value}</Text>
                {item.status ? (
                  <Text style={tw`pb-0.8 pt-0.2`}>"{item.status}"</Text>
                ) : (
                  <></>
                )}
                <Text style={tw`text-gray-500 text-xs`}>
                  Last Active: {""}
                  <TimeAgo time={item.lastSeen.toDate()} />
                </Text>
              </View>

              {/* if this friend is a favourite, display a star */}
              {/* conditionals are done for css reasons, for example, if the contact is both favourite and blocked etc */}
              {favourites?.[item.value] ? (
                <View style={tw`p-1.2 mb-auto mt-auto ml-12`}>
                  <StarIcon size={22} color="#FDDA0D" />
                </View>
              ) : (
                <></>
              )}

              {item.blocked?.[loggedInUserEmail] &&
              !favourites?.[item.value] ? (
                <View style={tw`p-1.2 mb-auto mt-auto ml-12`}>
                  <NoSymbolIcon size={22} color="red" />
                </View>
              ) : (
                <></>
              )}

              {item.blocked?.[loggedInUserEmail] && favourites?.[item.value] ? (
                <View style={tw`p-1.2 mb-auto mt-auto -ml-1`}>
                  <NoSymbolIcon size={22} color="red" />
                </View>
              ) : (
                <></>
              )}
            </TouchableOpacity>
          )}
          renderCustomSectionHeader={(section) => (
            <View>
              <Text
                style={{
                  color: `${theme.message[0]}`,
                  fontWeight: "bold",
                  fontSize: "18",
                }}
              >
                {section.title}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ContactsScreen;
