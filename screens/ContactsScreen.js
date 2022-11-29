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

  // get all of the user's friend emails
  const friendEmails = getFriendsEmails(loggedInUserEmail);

  useEffect(() => {
    if (friendEmails) {
      getFriendsData(friendEmails).then((data) => {
        setData1(data);
      });
    }
  }, []);

  console.log("this is data finally..", data1);

  const data = [
    { value: "Lillie-Mai Allen", key: "lCUTs2" },
    { value: "Emmanuel Goldstein", key: "TXdL0c" },
    { value: "Winston Smith", key: "zqsiEw" },
    { value: "William Blazkowicz", key: "psg2PM" },
    { value: "Gordon Comstock", key: "1K6I18" },
    { value: "Philip Ravelston", key: "NVHSkA" },
    { value: "Rosemary Waterlow", key: "SaHqyG" },
    { value: "Julia Comstock", key: "iaT1Ex" },
    { value: "Mihai Maldonado", key: "OvMd5e" },
    { value: "Murtaza Molina", key: "25zqAO" },
    { value: "Peter Petigrew", key: "8cWuu3" },
  ];

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
          data={data}
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
