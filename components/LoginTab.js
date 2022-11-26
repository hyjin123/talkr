import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";

const LoginTab = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("TabNavigator");
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => alert(error.message));
  };

  return (
    <SafeAreaView>
      <View style={tw`w-75`}>
        <TextInput
          style={tw`border-b-2 border-gray-400 text-lg bg-transparent py-2 mt-2`}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={tw`border-b-2 border-gray-400 text-lg bg-transparent py-2 mt-2`}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <View style={tw`justify-center items-center mt-5`}>
        <TouchableOpacity
          onPress={handleLogin}
          style={tw`w-70 bg-[#fff9bb] p-4 m-1 rounded-full`}
        >
          <Text style={tw`text-center font-bold`}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginTab;
