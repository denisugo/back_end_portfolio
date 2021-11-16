const { assert } = require("chai");
const { simpleQuery, executeQuery, selectByUsername } = require("../queries");
const db = require("../db");
const { tableNames, roles } = require("../config").constants;
const stringCreator = require("../queries/stringCreator");

const {
  loginVerification,
  userIdVerification,
  isAdminVerification,
} = require("../middlewares/loginMiddlewares");
const { registerMiddleware } = require("../middlewares/registerMiddlewares");

const {
  updateUserData,
  deleteUserData,
} = require("../middlewares/userMiddleware");

describe("Middlewares", () => {
  // mocking functions
  const next = () => {
    nextUsed = true;
  };

  const res = {
    status: (code) => {
      return {
        send: (message) => {
          sendUsed = `${code} ${message}`;
        },
      };
    },
  };

  let nextUsed;
  let sendUsed;

  beforeEach(() => {
    nextUsed = false;
    sendUsed = false;
  });

  describe("loginVerification", () => {
    it("Should call next if user is already logged in", () => {
      // req.user should be an object
      const req = { user: {} };

      loginVerification(req, res, next);

      assert.strictEqual(nextUsed, true);
    });

    it("Should send 401 status code and 'Unauthorized' if user is not logged in", () => {
      const req = {};

      loginVerification(req, res, next);

      assert.strictEqual(nextUsed, false);
      assert.strictEqual(sendUsed, "401 Unauthorized");
    });
  });
  describe("userIdVerification", () => {
    it("Should call next if user id from request and user id from cookie are the same", () => {
      // req.user should be an object
      const req = { user: { id: 1 }, params: { id: "1" } };

      userIdVerification(req, res, next);

      assert.strictEqual(nextUsed, true);
      assert.strictEqual(sendUsed, false);
    });

    it("Should send 401 status code and 'Unauthorized' if user id from request and user id from cookie are not the samen", () => {
      const req = { user: { id: 1 }, params: { id: "2" } };

      userIdVerification(req, res, next);

      assert.strictEqual(nextUsed, false);
      assert.strictEqual(sendUsed, "401 Unauthorized");
    });
  });
  describe("isAdminVerification", () => {
    it("Should call next if user is_admin is true", () => {
      // req.user should be an object
      const req = { user: { is_admin: true } };

      isAdminVerification(req, res, next);

      assert.strictEqual(nextUsed, true);
      assert.strictEqual(sendUsed, false);
    });

    it("Should send 401 status code and 'Unauthorized' if is_admin is false", () => {
      const req = { user: { is_admin: false } };

      isAdminVerification(req, res, next);

      assert.strictEqual(nextUsed, false);
      assert.strictEqual(sendUsed, "401 Unauthorized");
    });
  });

  describe("registerMiddleware", () => {
    const username = "ronnie123_456_222";
    const password = "new-secret-pass";
    const email = "ronnie_adams@yandex.ru";
    const first_name = "Ronnie";
    const last_name = "Adams";
    const tableName = tableNames.USERS;
    const role = roles.ADMIN_ROLE;

    afterEach(async () => {
      const queryCommand =
        "DELETE FROM " +
        tableName +
        " WHERE username = " +
        "'" +
        username +
        "'";
      await executeQuery({ db, role, tableName, queryCommand }, simpleQuery);
    });

    it("Should add a new user to db and", async () => {
      const req = {
        body: {
          username,
          password,
          email,
          first_name,
          last_name,
        },
      };

      registerMiddleware(req, res, next);
      const selected = await executeQuery(
        { db, role, tableName, username },
        selectByUsername
      );

      assert.strictEqual(selected.email, email);
      assert.strictEqual(nextUsed, true);
    });
    it("Should res with status 400 and 'Incomplete' if info is incomplete", async () => {
      const req = {
        body: {
          username,
          password,
          email,

          last_name,
        },
      };

      await registerMiddleware(req, res, next);

      assert.strictEqual(nextUsed, false);
      assert.strictEqual(sendUsed, "400 Incomplete");
    });
    it("Should res with status 400 and 'Duplicity found' if there is a duplicated username", async () => {
      const req = {
        body: {
          username: "jb",
          password,
          email,
          first_name,
          last_name,
        },
      };

      await registerMiddleware(req, res, next);

      assert.strictEqual(nextUsed, false);
      assert.strictEqual(sendUsed, "400 Duplicity found");
    });
  });

  describe("userMiddleware", () => {
    describe("updateUserData", () => {
      const tableName = tableNames.USERS;

      after(async () => {
        // reset user
        const role = roles.ADMIN_ROLE;
        const username = "jb";
        const password = "secret";
        const first_name = "Joe";
        const last_name = "Barbora";
        const email = "joe_barbora@gmail.com";
        const id = 1;

        const queryCommand = `UPDATE ${tableName} SET (username, password, first_name, last_name, email) = ('${username}', '${password}', '${first_name}', '${last_name}', '${email}') WHERE id = ${id};`;

        await executeQuery({ db, tableName, role, queryCommand }, simpleQuery);
      });

      it("Should update email", async () => {
        const newEmail = "jb_star@yahoo.com";
        const req = {
          body: { field: "email", value: newEmail },
          user: { id: 1 },
        };

        await updateUserData(req, res, next);

        assert.strictEqual(nextUsed, false);
        assert.strictEqual(sendUsed, "200 Updated");
      });
      it("Should return '400 Cannot be updated' when no email provided", async () => {
        const req = {
          body: { field: "email", value: null },
          user: { id: 1 },
        };

        await updateUserData(req, res, next);

        assert.strictEqual(nextUsed, false);
        assert.strictEqual(sendUsed, "400 Cannot be updated");
      });

      it("Should update username", async () => {
        const newUsername = "jonny1979";
        const req = {
          body: { field: "username", value: newUsername },
          user: { id: 1 },
        };

        await updateUserData(req, res, next);

        assert.strictEqual(nextUsed, false);
        assert.strictEqual(sendUsed, "200 Updated");
      });
      it("Should not update username when it violates database rules", async () => {
        const newUsername = "davy000";
        const req = {
          body: { field: "username", value: newUsername },
          user: { id: 1 },
        };

        await updateUserData(req, res, next);

        assert.strictEqual(nextUsed, false);
        assert.strictEqual(
          sendUsed,
          "400 This username is probably already in use"
        );
      });

      it("Should update password", async () => {
        const newPassword = "superSecrete";
        const req = {
          body: { field: "password", value: newPassword },
          user: { id: 1 },
        };

        await updateUserData(req, res, next);

        assert.strictEqual(nextUsed, false);
        assert.strictEqual(sendUsed, "200 Updated");
      });

      it("Should update first_name", async () => {
        const newFirstName = "Lloyd";
        const req = {
          body: { field: "first_name", value: newFirstName },
          user: { id: 1 },
        };

        await updateUserData(req, res, next);

        assert.strictEqual(nextUsed, false);
        assert.strictEqual(sendUsed, "200 Updated");
      });

      it("Should update last_name", async () => {
        const newLastName = "Lloyd";
        const req = {
          body: { field: "last_name", value: newLastName },
          user: { id: 1 },
        };

        await updateUserData(req, res, next);

        assert.strictEqual(nextUsed, false);
        assert.strictEqual(sendUsed, "200 Updated");
      });
    });
    describe("deleteUserData", () => {
      const tableName = tableNames.USERS;

      afterEach(async () => {
        // restore user
        const role = roles.ADMIN_ROLE;
        const username = "jb";
        const password = "secret";
        const first_name = "Joe";
        const last_name = "Barbora";
        const email = "joe_barbora@gmail.com";
        const id = 1;
        const is_admin = true;

        const queryCommand = `INSERT INTO ${tableName} VALUES (${id}, '${first_name}', '${last_name}', '${email}', '${username}',${is_admin}, '${password}');`;

        await executeQuery({ db, tableName, role, queryCommand }, simpleQuery);
      });

      it("Should delete user by id", async () => {
        const id = 1;
        const req = { body: { id } };

        await deleteUserData(req, res, next);

        assert.strictEqual(nextUsed, false);
        assert.strictEqual(sendUsed, "204 Successfully deleted");
      });

      it("Should not delete user if id is not provided", async () => {
        const req = { id: undefined };

        await deleteUserData(req, res, next);

        assert.strictEqual(nextUsed, false);
        assert.strictEqual(sendUsed, "400 The operation cannot be done");
      });
    });
  });
});
