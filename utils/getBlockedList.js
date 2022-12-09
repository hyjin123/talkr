import { db } from "../firebase";

export const getBlockedList = async (chatId) => {
  let blockedList = "";
  await db
    .collection("chats")
    .doc(chatId)
    .get()
    .then((data) => {
      blockedList = data.data().blocked;
    });

  return blockedList;
};
