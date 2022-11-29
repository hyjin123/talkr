import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import tw from "twrnc";
import ContactsSearchBar from "../components/ContactsSearchBar";
import { AlphabetList } from "react-native-section-alphabet-list";
import { auth, db } from "../firebase";
import { getFriendsEmails, getFriendsData } from "../utils/getFriendData";

const ContactsScreen = () => {
  const [data1, setData1] = useState([]);

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
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 items-center bg-white`}>
      {/* Heading */}
      <View style={tw`my-6 items-center bg-white`}>
        <View style={tw`mb-4`}>
          <Text style={tw`font-semibold text-3xl`}>Contacts</Text>
        </View>

        {/* Search Bar */}
        <View>
          <ContactsSearchBar />
        </View>
      </View>

      {/* Body */}
      <View style={tw`flex-1 bg-gray-100`}>
        <AlphabetList
          data={data1}
          indexLetterStyle={{
            color: "blue",
            fontSize: 15,
          }}
          renderCustomItem={(item) => (
            <View>
              <Text>{item.value}</Text>
            </View>
          )}
          renderCustomSectionHeader={(section) => (
            <View>
              <Text style={tw`text-red-500`}>{section.title}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ContactsScreen;
