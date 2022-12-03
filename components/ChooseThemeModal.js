import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { auth, db } from "../firebase";
import Modal from "react-native-modal";
import { XMarkIcon } from "react-native-heroicons/solid";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthState } from "react-firebase-hooks/auth";

const ChooseThemeModal = ({
  themeModalVisible,
  setThemeModalVisible,
  theme,
  setThemeChange,
}) => {
  const [active, setActive] = useState(null);

  // get user information in order to get user.iud (this will help set the last active status)
  const [user] = useAuthState(auth);

  const themeColors = {
    default: {
      primary: ["#cad4fc"],
      message: ["#a8b8ff", "#bfbbf2", "#9ad8fc"],
    },
    piggyBank: { primary: ["#e8cfd2"], message: ["#ee9ca7", "#ffdde1"] },
    citrusPeel: { primary: ["#fcd974"], message: ["#FDC830", "#F37335"] },
    scooter: { primary: ["#9becf2"], message: ["#36D1DC", "#5B86E5"] },
    sulphur: { primary: ["#c4eb81"], message: ["#00b09b", "#96c93d"] },
    atlas: { primary: ["#fcdbbb"], message: ["#FEAC5E", "#C779D0", "#4BC0C8"] },
  };

  const handleThemeChange = () => {
    // find out what the user selected
    const setTheme = themeColors[active];

    // set theme property in users collection
    db.collection("users").doc(user.uid).set(
      {
        theme: setTheme,
      },
      { merge: true }
    );

    setThemeChange(setTheme);
    setThemeModalVisible(false);
  };

  return (
    <Modal
      isVisible={themeModalVisible}
      onBackdropPress={() => setThemeModalVisible(false)}
    >
      <View style={tw`flex-1 items-center bg-white my-22 mx-3 rounded-xl`}>
        <TouchableOpacity
          onPress={() => setThemeModalVisible(false)}
          style={tw`absolute top-4 right-4`}
        >
          <XMarkIcon size={30} color="gray" />
        </TouchableOpacity>
        {/* Header */}
        <View style={tw`mt-8`}>
          <Text style={tw`font-semibold text-xl`}>Choose a Theme</Text>
        </View>

        {/* Body */}
        <View style={tw`flex-1 mt-8`}>
          <TouchableOpacity
            onPress={() => setActive("default")}
            style={tw`mt-2`}
          >
            <LinearGradient
              colors={["#a8b8ff", "#bfbbf2", "#9ad8fc"]}
              start={[0, 1]}
              end={[1, 0]}
              style={tw`bg-white border-0 py-5 mx-5 mt-2 rounded-lg w-60 ml-auto mr-auto bg-[#fff9bb] ${
                active === "default" ? "border-2" : ""
              }`}
            >
              <Text style={tw`text-white text-center`}>Default</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActive("piggyBank")}
            style={tw`mt-2`}
          >
            <LinearGradient
              colors={["#ee9ca7", "#ffdde1"]}
              start={[0, 1]}
              end={[1, 0]}
              style={tw`bg-white border-0 py-5 mx-5 mt-2 rounded-lg w-60 ml-auto mr-auto bg-[#fff9bb] ${
                active === "piggyBank" ? "border-2" : ""
              }`}
            >
              <Text style={tw`text-white text-center`}>Piggy Pink</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActive("citrusPeel")}
            style={tw`mt-2`}
          >
            <LinearGradient
              colors={["#FDC830", "#F37335"]}
              start={[0, 1]}
              end={[1, 0]}
              style={tw`bg-white border-0 py-5 mx-5 mt-2 rounded-lg w-60 ml-auto mr-auto bg-[#fff9bb] ${
                active === "citrusPeel" ? "border-2" : ""
              }`}
            >
              <Text style={tw`text-white text-center`}>Citrus Peel</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActive("scooter")}
            style={tw`mt-2`}
          >
            <LinearGradient
              colors={["#36D1DC", "#5B86E5"]}
              start={[0, 1]}
              end={[1, 0]}
              style={tw`bg-white border-0 py-5 mx-5 mt-2 rounded-lg w-60 ml-auto mr-auto bg-[#fff9bb] ${
                active === "scooter" ? "border-2" : ""
              }`}
            >
              <Text style={tw`text-white text-center`}>Scooter</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActive("sulphur")}
            style={tw`mt-2`}
          >
            <LinearGradient
              colors={["#00b09b", "#96c93d"]}
              start={[0, 1]}
              end={[1, 0]}
              style={tw`bg-white border-0 py-5 mx-5 mt-2 rounded-lg w-60 ml-auto mr-auto bg-[#fff9bb] ${
                active === "sulphur" ? "border-2" : ""
              }`}
            >
              <Text style={tw`text-white text-center`}>Sulphur</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActive("atlas")} style={tw`mt-2`}>
            <LinearGradient
              colors={["#FEAC5E", "#C779D0", "#4BC0C8"]}
              start={[0, 1]}
              end={[1, 0]}
              style={tw`bg-white border-0 py-5 mx-5 mt-2 rounded-lg w-60 ml-auto mr-auto bg-[#fff9bb] ${
                active === "atlas" ? "border-2" : ""
              }`}
            >
              <Text style={tw`text-white text-center`}>Atlas</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Submit */}
        <TouchableOpacity
          onPress={handleThemeChange}
          style={tw`bg-[${theme?.primary[0]}] font-bold rounded-full px-15 py-2 mt-6 mb-8`}
        >
          <Text style={tw`text-black`}>Change</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ChooseThemeModal;
