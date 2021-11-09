const stringCreator = {
  users: (userObject) => {
    return {
      columns: "first_name, last_name, email, username, is_admin",
      values: [
        userObject.first_name,
        userObject.last_name,
        userObject.email,
        userObject.username,
        userObject.is_admin,
      ],
      queryPrepared: "$1, $2, $3, $4, $5",
    };
  },
};

module.exports = stringCreator;
