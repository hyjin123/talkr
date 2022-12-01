import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator";
import { KeyboardAvoidingView } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox } from "react-native";

export default function App() {
  LogBox.ignoreAllLogs();

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
