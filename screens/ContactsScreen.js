import { View, Text, SafeAreaView, Image } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import tw from "twrnc";
import ContactsSearchBar from "../components/ContactsSearchBar";
import { AlphabetList } from "react-native-section-alphabet-list";
import { auth, db } from "../firebase";
import { getFriendsEmails, getFriendsData } from "../utils/getFriendData";
import TimeAgo from "react-native-timeago";

const ContactsScreen = () => {
  const [data1, setData1] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [input, setInput] = useState("");

  // get the logged in user email through auth
  const loggedInUserEmail = auth.currentUser.email;

  useEffect(() => {
    // get all of the user's friend emails
    getFriendsEmails(loggedInUserEmail).then((friendEmails) => {
      getFriendsData(friendEmails).then((data) => {
        let tempArray = data.map((item) => {
          return {
            value: item.displayName,
            key: item.displayName,
            email: item.email,
            lastSeen: item.lastSeen,
            photoURL: item.photoURL,
          };
        });
        setData1(tempArray);
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
  }, [input]);

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
            <View style={tw`flex-row my-3`}>
              <View style={tw`mr-3`}>
                <Image
                  source={{ uri: "data:image/jpeg;base64," + item.photoURL }}
                  style={[
                    tw`w-12 h-12 rounded-full border-2`,
                    { borderColor: "#cad4fc" },
                  ]}
                />
              </View>
              <View style={tw`justify-center`}>
                <Text style={tw`font-semibold text-base`}>{item.value}</Text>
                <Text style={tw`text-gray-800 text-xs`}>{item.email}</Text>
                <Text style={tw`text-gray-500 text-xs`}>
                  Last Active: {""}
                  <TimeAgo time={item.lastSeen.toDate()} />
                </Text>
              </View>
            </View>
          )}
          renderCustomSectionHeader={(section) => (
            <View>
              <Text
                style={{ color: "#a8b8ff", fontWeight: "bold", fontSize: "18" }}
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
