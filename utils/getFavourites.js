import { db } from "../firebase";

export const getFavourites = async (loggedInUserEmail) => {
  let favourites = {};
  // get a chat collection snapchat from firebase
  await db
    .collection("users")
    .where("email", "==", loggedInUserEmail)
    .get()
    .then((data) => {
      favourites = data.docs[0].data().favourites;
    });

  return favourites;
};
