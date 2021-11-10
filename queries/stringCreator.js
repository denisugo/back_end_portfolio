const stringCreator = {
  users: (userObject) => {
    return {
      columns: "first_name, last_name, email, username, password",
      values: [
        userObject.first_name,
        userObject.last_name,
        userObject.email,
        userObject.username,
        userObject.password,
      ],
      queryPrepared: "$1, $2, $3, $4, $5",
    };
  },
};

module.exports = stringCreator;
