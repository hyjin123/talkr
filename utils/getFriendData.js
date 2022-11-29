import getFriendEmail from "./getFriendEmail";
import { db } from "../firebase";

export const getFriendsEmails = async (loggedInUserEmail) => {
  let chatsSnapshot = [];
  // get a chat collection snapchat from firebase
  await db
    .collection("chats")
    .where("users", "array-contains", loggedInUserEmail)
    .get()
    .then((data) => {
      chatsSnapshot = data;
    });

  // prop the data for alphabet list
  // get all the friend's email first
  const friendEmails = chatsSnapshot?.docs.map((chat) => {
    const users = chat.data().users;
    return getFriendEmail(users, loggedInUserEmail)[0];
  });

  return friendEmails;
};

export const getFriendsData = async (friendEmails) => {
  let data1 = [];

  // go through the friend's emails and get all the relevant info for them
  for (const email of friendEmails) {
    // console.log(email);
    await db
      .collection("users")
      .where("email", "==", email)
      .get()
      .then((data) => {
        let finalData = data.docs[0].data();
        data1.push(finalData);
        // console.log("this is when data is pushed", data1);
      });
  }

  return data1;
};
