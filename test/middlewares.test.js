const { assert } = require("chai");
const { simpleQuery, executeQuery, selectByUsername } = require("../queries");
const db = require("../db");
const { tableNames, roles } = require("../config").constants;
const stringCreator = require("../queries/stringCreator");

const {
  loginVerification,
  userIdVerification,
} = require("../middlewares/loginMiddlewares");
const { registerMiddleware } = require("../middlewares/registerMiddlewares");

describe("Middlewares", () => {
  describe("loginVerification", () => {
    const res = {
      status: (code) => {
        return {
          send: (message) => {
            sendUsed = `${code} ${message}`;
          },
        };
      },
    };
    const next = () => {
      nextUsed = true;
    };

    let nextUsed;
    let sendUsed;

    beforeEach(() => {
      nextUsed = false;
      sendUsed = false;
    });

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
      assert.strictEqual(sendUsed, "401 Unathorized");
    });
  });
  describe("userIdVerification", () => {
    const res = {
      status: (code) => {
        return {
          send: (message) => {
            sendUsed = `${code} ${message}`;
          },
        };
      },
    };
    const next = () => {
      nextUsed = true;
    };

    let nextUsed;
    let sendUsed;

    beforeEach(() => {
      nextUsed = false;
      sendUsed = false;
    });

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
      assert.strictEqual(sendUsed, "401 Unathorized");
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
});
