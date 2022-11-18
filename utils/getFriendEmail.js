const getFriendEmail = (users, loggedInEmail) => {
  const friendEmail = users.filter((user) => user !== loggedInEmail);
  return friendEmail;
};

export default getFriendEmail;
