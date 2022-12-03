import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Modal from "react-native-modal";
import { XMarkIcon } from "react-native-heroicons/solid";
import { LinearGradient } from "expo-linear-gradient";

const ChooseThemeModal = ({
  themeModalVisible,
  setThemeModalVisible,
  theme,
}) => {
  const [theme1, setTheme1] = useState([]);
  const [active, setActive] = useState(null);

  const handleThemeChange = () => {
    // set theme property in users collection
  };

  return (
    <Modal
      isVisible={themeModalVisible}
      onBackdropPress={() => setThemeModalVisible(false)}
    >
      <View style={tw`flex-1 items-center bg-white my-30 mx-3 rounded-xl`}>
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
            onPress={() => setActive("piggyBank")}
            style={tw`mt-2`}
          >
            {/* #ee9ca7, #ffdde1*/}
            <LinearGradient
              colors={["#ee9ca7", "#ffdde1"]}
              start={[0, 1]}
              end={[1, 0]}
              style={tw`bg-white border-0 py-5 mx-5 mt-2 rounded-lg w-60 ml-auto mr-auto bg-[#fff9bb] ${
                active === "piggyBank" && "border-2"
              }`}
            >
              <Text style={tw`text-white text-center`}>Piggy Pink</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActive("citrusPeel")}
            style={tw`mt-2`}
          >
            {/* #3CA55C, #B5AC49*/}
            <LinearGradient
              colors={["#FDC830", "#F37335"]}
              start={[0, 1]}
              end={[1, 0]}
              style={tw`bg-white border-0 py-5 mx-5 mt-2 rounded-lg w-60 ml-auto mr-auto bg-[#fff9bb] ${
                active === "citrusPeel" && "border-2"
              }`}
            >
              <Text style={tw`text-white text-center`}>Citrus Peel</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActive("scooter")}
            style={tw`mt-2`}
          >
            {/* #F2994A, #F2C94C */}
            <LinearGradient
              colors={["#36D1DC", "#5B86E5"]}
              start={[0, 1]}
              end={[1, 0]}
              style={tw`bg-white border-0 py-5 mx-5 mt-2 rounded-lg w-60 ml-auto mr-auto bg-[#fff9bb] ${
                active === "scooter" && "border-2"
              }`}
            >
              <Text style={tw`text-white text-center`}>Scooter</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActive("sulphur")}
            style={tw`mt-2`}
          >
            {/* #F2994A, #F2C94C */}
            <LinearGradient
              colors={["#00b09b", "#96c93d"]}
              start={[0, 1]}
              end={[1, 0]}
              style={tw`bg-white border-0 py-5 mx-5 mt-2 rounded-lg w-60 ml-auto mr-auto bg-[#fff9bb] ${
                active === "sulphur" && "border-2"
              }`}
            >
              <Text style={tw`text-white text-center`}>Sulphur</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActive("atlas")} style={tw`mt-2`}>
            {/* #F2994A, #F2C94C */}
            <LinearGradient
              colors={["#FEAC5E", "#C779D0", "#4BC0C8"]}
              start={[0, 1]}
              end={[1, 0]}
              style={tw`bg-white border-0 py-5 mx-5 mt-2 rounded-lg w-60 ml-auto mr-auto bg-[#fff9bb] ${
                active === "atlas" && "border-2"
              }`}
            >
              <Text style={tw`text-white text-center`}>Atlas</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Submit */}
        <TouchableOpacity
          // onPress={creatChat}
          style={tw`bg-[${theme?.primary[0]}] font-bold rounded-full px-15 py-2 mt-6 mb-8`}
        >
          <Text style={tw`text-black`}>Change</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ChooseThemeModal;
