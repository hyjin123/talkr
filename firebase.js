// Import the functions you need from the SDKs you need
import * as firebase from "firebase";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAH9K-2IdNWxE1HWq359_ZvjNqIDxNisW0",
  authDomain: "talkr-ab854.firebaseapp.com",
  projectId: "talkr-ab854",
  storageBucket: "talkr-ab854.appspot.com",
  messagingSenderId: "832775033354",
  appId: "1:832775033354:web:7f58af6d9f629ea78545f3",
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();

export { auth };
