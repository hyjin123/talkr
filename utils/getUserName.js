import { db } from "../firebase";

export const getUserName = async (loggedInUserEmail, friendEmail) => {
  let chatId = "";
  // get a chat collection snapchat from firebase
  await db
    .collection("chats")
    .where("users", "array-contains", loggedInUserEmail)
    .get()
    .then((data) => {
      for (const item of data.docs) {
        if (item.data().users.includes(friendEmail)) {
          chatId = item.id;
        }
      }
    });

  return chatId;
};
