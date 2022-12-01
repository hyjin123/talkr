import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import LoginTab from "../components/LoginTab";
import RegisterTab from "../components/RegisterTab";

const LoginScreen = () => {
  const [selectedTab, setSelectedTab] = useState("register");

  return (
    <SafeAreaView style={tw`flex-1 justify-evenly items-center`}>
      <View>
        <Text style={tw`text-6xl tracking-widest font-light`}>talkr</Text>
      </View>
      <View>
        <View style={tw`flex-row justify-evenly items-center mb-5`}>
          <TouchableOpacity
            style={tw`${
              selectedTab === "login" ? "border-b-2 border-gray-600" : ""
            } p-3`}
            onPress={() => setSelectedTab("login")}
          >
            <Text>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`${
              selectedTab === "register" && "border-b-2 border-gray-600"
            } p-3`}
            onPress={() => setSelectedTab("register")}
          >
            <Text>REGISTER</Text>
          </TouchableOpacity>
        </View>
        {selectedTab === "register" ? <RegisterTab /> : <LoginTab />}
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
