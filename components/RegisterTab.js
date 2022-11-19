import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { auth, db } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

const RegisterTab = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [image64, setImage64] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);

  const navigation = useNavigation();

  // user picking an image for their avatar
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImage64(result.assets[0].base64);
    }
  };

  const compress = async () => {
    const manipResult = await manipulateAsync(
      image,
      [{ resize: { width: 120, height: 120 } }],
      {
        compress: 0.2,
        base64: true,
        format: SaveFormat.PNG,
      }
    );
    setCompressedImage(manipResult);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home");
      }
    });

    return unsubscribe;
  }, []);

  const handleSignUp = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // set the display name and the picture of the user that registers into the firestore database
        db.collection("users")
          .doc(user.uid)
          .set(
            {
              displayName: `${firstName} ${lastName}`,
              email: email,
              lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
              photoURL: compressedImage?.base64,
            },
            { merge: true }
          );
      })
      .catch((error) => alert(error.message));
  };

  return (
    <SafeAreaView>
      <View style={tw`w-75`}>
        <TextInput
          style={tw`border-b-2 border-gray-400 text-lg bg-transparent py-2 mt-2`}
          placeholder="First Name"
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
        />
        <TextInput
          style={tw`border-b-2 border-gray-400 text-lg bg-transparent py-2 mt-2`}
          placeholder="Last Name"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
        />
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
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        <Button title="Pick an image from camera roll" onPress={compress} />
        {image64 && (
          <Image
            source={{ uri: "data:image/jpeg;base64," + image64 }}
            style={{ width: 50, height: 50 }}
          />
        )}
        {image64 && (
          <Image
            source={{ uri: "data:image/png;base64," + compressedImage?.base64 }}
            style={{ width: 50, height: 50 }}
          />
        )}
      </View>
      <View style={tw`justify-center items-center mt-5`}>
        <TouchableOpacity
          onPress={handleSignUp}
          style={tw`w-70 bg-[#fff9bb] p-4 m-1 rounded-full`}
        >
          <Text style={tw`text-center font-bold`}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RegisterTab;
