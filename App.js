import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator";
import { KeyboardAvoidingView } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function App() {
  return (
    <NavigationContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? -10 : 0}
      >
        <StackNavigator />
      </KeyboardAvoidingView>
    </NavigationContainer>
  );
}
