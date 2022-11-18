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

const RegisterTab = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageURL, setImageURL] = useState("");

  const navigation = useNavigation();

  // user picking an image for their avatar
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // if (!result.canceled) {
    //   setImage(result.assets[0].uri);
    // }

    const source = { uri: result.assets[0].uri };
    setImage(source);
  };

  // users upload an image, and can confirm. After confirmation, it uploads it to firestore storage
  const uploadImage = async () => {
    setUploading(true);
    const response = await fetch(image.uri);
    const blob = await response.blob();
    const filename = image.uri.substring(image.uri.lastIndexOf("/") + 1);
    setImageURL(filename);
    let ref = firebase.storage().ref().child(filename).put(blob);

    try {
      await ref;
    } catch (e) {
      console.log(e);
    }
    setUploading(false);
    Alert.alert("Photo successfully uploaded!");
    setImage(null);
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
              photoURL: imageURL,
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
        {image && (
          <Image
            source={{ uri: image.uri }}
            style={{ width: 50, height: 50 }}
          />
        )}
        <Button title="choose the image" onPress={uploadImage} />
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
